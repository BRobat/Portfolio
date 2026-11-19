#!/usr/bin/env node
/**
 * Turns Markdown exports in /content into:
 *  - src/app/content/generated/  TypeScript modules (metadata index + one lazy module per entry)
 *  - src/generated/public/       media files, sitemap.xml, robots.txt (served from site root)
 *
 * Usage: node scripts/build-content.mjs [--drafts] [--watch] [--serve [-- ng serve args]]
 *   --drafts  include entries with `draft: true`
 *   --watch   rebuild whenever something in /content changes
 *   --serve   start `ng serve` after the first build (stops together with this script)
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';
import { parse as parseYaml } from 'yaml';

export const SITE_URL = 'https://bartrobat.com';
export const NEWS_PAGE_SIZE = 20;
const MAX_MEDIA_BYTES = 5 * 1024 * 1024;
const SUMMARY_LENGTH = 200;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const TS_OUT = path.join(ROOT, 'src/app/content/generated');
const PUBLIC_OUT = path.join(ROOT, 'src/generated/public');

// ---------- pure helpers (unit tested) ----------

/** Splits a leading `---` YAML block from the body. */
export function splitFrontmatter(source) {
  const text = source.replace(/^﻿/, '');
  const match = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(text);
  if (!match) return { data: {}, body: text };
  return { data: parseYaml(match[1]) ?? {}, body: text.slice(match[0].length) };
}

/** `2026-11-19-voron-build` -> { date: '2026-11-19', slug: 'voron-build' } */
export function parseFolderName(name) {
  const match = /^(\d{4}-\d{2}-\d{2})-(.+)$/.exec(name);
  return match ? { date: match[1], slug: slugify(match[2]) } : { date: null, slug: slugify(name) };
}

export function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Obsidian `![[file.png]]` / `![[file.png|300]]` -> standard Markdown image. */
export function convertObsidianEmbeds(markdown) {
  return markdown.replace(/!\[\[([^\]|]+?)(?:\|[^\]]*)?\]\]/g, (_, file) => `![](${encodeURI(file.trim())})`);
}

export function isRelativeUrl(url) {
  return !!url && !/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(url);
}

export function toArray(value) {
  if (value === undefined || value === null || value === '') return [];
  return (Array.isArray(value) ? value : [value]).map(String);
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncate(text, length = SUMMARY_LENGTH) {
  if (text.length <= length) return text;
  const cut = text.slice(0, length);
  return cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : length).replace(/[\s,.;:]+$/, '') + '…';
}

/**
 * Renders an entry body. Returns the title (first heading, removed from the body),
 * summary (first text paragraph), first image, and HTML with relative media URLs
 * rewritten to `mediaBase`.
 */
export function renderMarkdown(markdown, mediaBase, resolveImage = href => ({ src: href })) {
  const marked = new Marked({ gfm: true });
  const source = convertObsidianEmbeds(markdown);
  const tokens = marked.lexer(source);

  let title = null;
  const headingIndex = tokens.findIndex(t => t.type === 'heading');
  if (headingIndex !== -1) {
    title = stripHtml(marked.parseInline(tokens[headingIndex].text));
    tokens.splice(headingIndex, 1);
  }

  const images = [];
  marked.walkTokens(tokens, token => {
    if ((token.type === 'image' || token.type === 'link') && isRelativeUrl(token.href)) {
      token.href = `${mediaBase}/${token.href.replace(/^\.\//, '')}`;
    }
    if (token.type === 'image') images.push(token.href);
  });

  let summary = '';
  for (const token of tokens) {
    if (token.type !== 'paragraph') continue;
    const text = stripHtml(marked.parser([token]));
    if (text) {
      summary = truncate(text);
      break;
    }
  }

  marked.use({
    renderer: {
      image({ href, title: imgTitle, text }) {
        const t = imgTitle ? ` title="${escapeAttr(imgTitle)}"` : '';
        const { src, width, height } = resolveImage(href);
        const size = width && height ? ` width="${width}" height="${height}"` : '';
        return `<img src="${escapeAttr(src)}" alt="${escapeAttr(text)}"${t}${size} loading="lazy" decoding="async">`;
      },
    },
  });
  const html = marked.parser(tokens);

  return { title, summary, firstImage: images[0] ?? null, html };
}

/** Max width of generated .webp images. */
export const WEBP_MAX_WIDTH = 1200;
const WEBP_SOURCE = /\.(png|jpe?g)$/i;

/** Reads intrinsic size from PNG / JPEG / GIF / WebP headers (sync, no dependencies). */
export function imageSize(buf) {
  if (buf.length >= 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf.length >= 10 && buf.toString('ascii', 0, 3) === 'GIF') {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }
  if (buf.length >= 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
  }
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

/** Size an image will have once converted (capped at WEBP_MAX_WIDTH, aspect kept). */
export function fittedSize({ width, height }) {
  if (width <= WEBP_MAX_WIDTH) return { width, height };
  return { width: WEBP_MAX_WIDTH, height: Math.round((height * WEBP_MAX_WIDTH) / width) };
}

export function toWebpPath(file) {
  return file.replace(WEBP_SOURCE, '.webp');
}

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export function sortNews(news) {
  return [...news].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export function sortProjects(projects) {
  return [...projects].sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) ||
      (a.order ?? Infinity) - (b.order ?? Infinity) ||
      (b.date ?? '').localeCompare(a.date ?? '') ||
      a.title.localeCompare(b.title),
  );
}

// ---------- filesystem ----------

function listEntryDirs(type) {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'))
    .map(d => path.join(dir, d.name));
}

function walkFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    if (d.name.startsWith('.')) return [];
    const full = path.join(dir, d.name);
    return d.isDirectory() ? walkFiles(full) : [full];
  });
}

/** Files written during the current build; anything else in the output dirs is stale. */
let written = new Set();
/** { src, target } pairs to convert to WebP after the (sync) build. */
let pendingWebp = [];

/** Writes only when content differs, so the dev server doesn't reload for unchanged files. */
function writeIfChanged(file, content) {
  written.add(file);
  const data = typeof content === 'string' ? Buffer.from(content) : content;
  if (fs.existsSync(file) && fs.readFileSync(file).equals(data)) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
}

function removeStale(dir) {
  if (!fs.existsSync(dir)) return;
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) {
      removeStale(full);
      if (fs.readdirSync(full).length === 0) fs.rmdirSync(full);
    } else if (!written.has(full)) {
      fs.rmSync(full);
    }
  }
}

function readEntry(dir, type, { drafts, warn }) {
  const files = walkFiles(dir);
  const mdFiles = files.filter(f => f.endsWith('.md'));
  if (mdFiles.length !== 1) {
    throw new Error(`${path.relative(ROOT, dir)}: expected exactly one .md file, found ${mdFiles.length}`);
  }
  const { data, body } = splitFrontmatter(fs.readFileSync(mdFiles[0], 'utf8'));
  if (data.draft && !drafts) return null;

  const folder = parseFolderName(path.basename(dir));
  const slug = data.slug ? slugify(data.slug) : folder.slug;
  const mediaBase = `/content/${type}/${slug}`;
  const outDir = path.join(PUBLIC_OUT, 'content', type, slug);

  // Optimised variants: url of the original -> { src (webp), width, height }.
  const images = new Map();
  for (const file of files) {
    if (!WEBP_SOURCE.test(file) && !/\.(gif|webp)$/i.test(file)) continue;
    const size = imageSize(fs.readFileSync(file));
    if (!size) continue;
    const rel = path.relative(dir, file).split(path.sep).join('/');
    const url = `${mediaBase}/${rel}`;
    if (WEBP_SOURCE.test(file)) {
      const target = toWebpPath(path.join(outDir, rel));
      written.add(target);
      pendingWebp.push({ src: file, target });
      images.set(url, { src: toWebpPath(url), ...fittedSize(size) });
    } else {
      images.set(url, { src: url, ...size });
    }
  }
  const resolveImage = href => images.get(decodeURI(href)) ?? images.get(href) ?? { src: href };
  const rendered = renderMarkdown(body, mediaBase, resolveImage);

  const date = data.date ? toIsoDate(data.date) : folder.date;
  if (type === 'news' && !date) {
    throw new Error(`${path.relative(ROOT, dir)}: news needs a YYYY-MM-DD- folder prefix or a date property`);
  }

  const cover = data.cover
    ? isRelativeUrl(String(data.cover)) ? `${mediaBase}/${data.cover}` : String(data.cover)
    : rendered.firstImage;

  // copy media
  for (const file of files) {
    if (file.endsWith('.md')) continue;
    const size = fs.statSync(file).size;
    if (size > MAX_MEDIA_BYTES) {
      warn(`${path.relative(ROOT, file)} is ${(size / 1024 / 1024).toFixed(1)} MB — consider compressing it`);
    }
    const target = path.join(outDir, path.relative(dir, file));
    writeIfChanged(target, fs.readFileSync(file));
  }

  const meta = {
    slug,
    title: data.title ? String(data.title) : rendered.title ?? slug,
    summary: data.summary ? String(data.summary) : rendered.summary,
    date: date ?? null,
    cover: cover ?? null,
    coverImage: cover && images.has(cover) ? images.get(cover) : cover ? { src: cover } : null,
    draft: !!data.draft,
  };
  if (type === 'news') {
    meta.projects = toArray(data.project).map(slugify);
  } else {
    meta.pinned = !!data.pinned;
    meta.order = typeof data.order === 'number' ? data.order : null;
    meta.iframe = data.iframe ? String(data.iframe) : null;
  }
  return { meta, html: rendered.html };
}

function toIsoDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const match = /^\d{4}-\d{2}-\d{2}/.exec(String(value));
  if (!match) throw new Error(`Invalid date "${value}" (use YYYY-MM-DD)`);
  return match[0];
}

function collect(type, options) {
  const entries = listEntryDirs(type)
    .map(dir => readEntry(dir, type, options))
    .filter(Boolean);
  const seen = new Set();
  for (const { meta } of entries) {
    if (seen.has(meta.slug)) throw new Error(`Duplicate ${type} slug "${meta.slug}"`);
    seen.add(meta.slug);
  }
  return entries;
}

function writeTsModule(file, html) {
  writeIfChanged(file, `// Generated by scripts/build-content.mjs — do not edit.\nexport const html = ${JSON.stringify(html)};\n`);
}

function loaderMap(type, entries) {
  const lines = entries.map(({ meta }) => `  ${JSON.stringify(meta.slug)}: () => import('./${type}/${meta.slug}'),`);
  return `{\n${lines.join('\n')}\n}`;
}

function buildSitemap(news, projects) {
  const pages = Math.max(1, Math.ceil(news.length / NEWS_PAGE_SIZE));
  const urls = [
    { loc: '/projects' },
    ...projects.map(p => ({ loc: `/projects/${p.slug}`, lastmod: p.date })),
    { loc: '/news', lastmod: news[0]?.date },
    ...Array.from({ length: pages - 1 }, (_, i) => ({ loc: `/news/page/${i + 2}` })),
    ...news.map(n => ({ loc: `/news/${n.slug}`, lastmod: n.date })),
    { loc: '/about' },
    { loc: '/contact' },
  ];
  const body = urls
    .map(u => `  <url><loc>${SITE_URL}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function build({ drafts = false } = {}) {
  const warnings = [];
  const warn = msg => warnings.push(msg);

  written = new Set();
  pendingWebp = [];

  const newsEntries = collect('news', { drafts, warn });
  const projectEntries = collect('projects', { drafts, warn });

  const projectSlugs = new Set(projectEntries.map(e => e.meta.slug));
  for (const { meta } of newsEntries) {
    for (const p of meta.projects) {
      if (!projectSlugs.has(p)) warn(`news "${meta.slug}" references unknown project "${p}"`);
    }
  }

  const news = sortNews(newsEntries.map(e => e.meta));
  const projects = sortProjects(projectEntries.map(e => e.meta));

  for (const { meta, html } of newsEntries) writeTsModule(path.join(TS_OUT, 'news', `${meta.slug}.ts`), html);
  for (const { meta, html } of projectEntries) writeTsModule(path.join(TS_OUT, 'projects', `${meta.slug}.ts`), html);

  writeIfChanged(
    path.join(TS_OUT, 'index.ts'),
    `// Generated by scripts/build-content.mjs — do not edit.
import type { ContentLoader, NewsMeta, ProjectMeta } from '../content.model';

export const NEWS_PAGE_SIZE = ${NEWS_PAGE_SIZE};

export const NEWS: NewsMeta[] = ${JSON.stringify(news, null, 2)};

export const PROJECTS: ProjectMeta[] = ${JSON.stringify(projects, null, 2)};

export const NEWS_LOADERS: Record<string, ContentLoader> = ${loaderMap('news', newsEntries)};

export const PROJECT_LOADERS: Record<string, ContentLoader> = ${loaderMap('projects', projectEntries)};
`,
  );

  // Drafts are only visible locally; keep them out of the sitemap.
  writeIfChanged(
    path.join(PUBLIC_OUT, 'sitemap.xml'),
    buildSitemap(news.filter(n => !n.draft), projects.filter(p => !p.draft)),
  );
  writeIfChanged(path.join(PUBLIC_OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

  removeStale(TS_OUT);
  removeStale(PUBLIC_OUT);

  return { news, projects, warnings, images: pendingWebp };
}

/** Converts images to WebP; skips targets that are already newer than their source. */
export async function convertImages(images) {
  if (!images.length) return 0;
  const { default: sharp } = await import('sharp');
  let converted = 0;
  for (const { src, target } of images) {
    if (fs.existsSync(target) && fs.statSync(target).mtimeMs >= fs.statSync(src).mtimeMs) continue;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    await sharp(src)
      .resize({ width: WEBP_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 75, effort: 5 })
      .toFile(target);
    converted++;
  }
  return converted;
}

async function runBuild(drafts) {
  const { news, projects, warnings, images } = build({ drafts });
  for (const w of warnings) console.warn(`⚠ ${w}`);
  const converted = await convertImages(images);
  console.log(
    `content: ${news.length} news, ${projects.length} projects${drafts ? ' (drafts included)' : ''}` +
      (converted ? `, ${converted} image(s) converted to webp` : ''),
  );
}

function watchContent(drafts) {
  let timer = null;
  const watcher = fs.watch(CONTENT_DIR, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      // Keep watching: a half-saved file or a frontmatter typo shouldn't stop the dev server.
      runBuild(drafts).catch(err => console.error(`content build failed: ${err.message}`));
    }, 200);
  });
  console.log('content: watching content/ for changes');
  return watcher;
}

function serve(args, onExit) {
  const child = spawn('npx', ['ng', 'serve', ...args], { stdio: 'inherit' });
  const stop = signal => child.kill(signal);
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  child.on('exit', code => onExit(code ?? 0));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const sep = argv.indexOf('--');
  const flags = sep === -1 ? argv : argv.slice(0, sep);
  const serveArgs = sep === -1 ? [] : argv.slice(sep + 1);
  const drafts = flags.includes('--drafts');

  try {
    await runBuild(drafts);
  } catch (err) {
    console.error(`content build failed: ${err.message}`);
    process.exit(1);
  }

  const watcher = flags.includes('--watch') ? watchContent(drafts) : null;
  if (flags.includes('--serve')) {
    serve(serveArgs, code => {
      watcher?.close();
      process.exit(code);
    });
  }
}
