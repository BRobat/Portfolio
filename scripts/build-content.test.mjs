import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  splitFrontmatter,
  parseFolderName,
  convertObsidianEmbeds,
  isRelativeUrl,
  renderMarkdown,
  sortProjects,
  truncate,
  toArray,
} from './build-content.mjs';

test('splitFrontmatter reads YAML and leaves body', () => {
  const { data, body } = splitFrontmatter('---\nproject: [sols]\npinned: true\n---\n# Hi\n');
  assert.deepEqual(data, { project: ['sols'], pinned: true });
  assert.equal(body, '# Hi\n');
});

test('splitFrontmatter without frontmatter', () => {
  assert.deepEqual(splitFrontmatter('# Hi'), { data: {}, body: '# Hi' });
});

test('parseFolderName extracts date prefix', () => {
  assert.deepEqual(parseFolderName('2026-11-19-Voron Build'), { date: '2026-11-19', slug: 'voron-build' });
  assert.deepEqual(parseFolderName('galaxy-sim'), { date: null, slug: 'galaxy-sim' });
});

test('convertObsidianEmbeds', () => {
  assert.equal(convertObsidianEmbeds('a ![[my pic.png|300]] b'), 'a ![](my%20pic.png) b');
});

test('isRelativeUrl', () => {
  assert.ok(isRelativeUrl('pic.png'));
  assert.ok(isRelativeUrl('./img/pic.png'));
  assert.ok(!isRelativeUrl('/abs.png'));
  assert.ok(!isRelativeUrl('https://x.y/a.png'));
  assert.ok(!isRelativeUrl('#anchor'));
});

test('renderMarkdown: first heading of any level is the title and is removed', () => {
  const r = renderMarkdown('Intro *text*.\n\n### My **Post**\n\nMore.', '/m');
  assert.equal(r.title, 'My Post');
  assert.ok(!r.html.includes('My <strong>Post</strong>'));
  assert.equal(r.summary, 'Intro text.');
});

test('renderMarkdown: summary skips image-only paragraphs, cover is first image, media rewritten', () => {
  const r = renderMarkdown('# T\n\n![](a.gif)\n\nHello world.\n\n![x](https://cdn/b.png)', '/content/news/t');
  assert.equal(r.summary, 'Hello world.');
  assert.equal(r.firstImage, '/content/news/t/a.gif');
  assert.ok(r.html.includes('src="/content/news/t/a.gif"'));
  assert.ok(r.html.includes('src="https://cdn/b.png"'));
  assert.ok(r.html.includes('loading="lazy"'));
});

test('renderMarkdown: no heading means no title', () => {
  assert.equal(renderMarkdown('just text', '/m').title, null);
});

test('truncate on word boundary', () => {
  assert.equal(truncate('aaa bbb ccc', 6), 'aaa…');
  assert.equal(truncate('short', 10), 'short');
});

test('toArray', () => {
  assert.deepEqual(toArray(undefined), []);
  assert.deepEqual(toArray('sols'), ['sols']);
  assert.deepEqual(toArray(['a', 'b']), ['a', 'b']);
});

test('sortProjects: pinned first, then order, then date desc', () => {
  const p = (slug, extra) => ({ slug, title: slug, pinned: false, order: null, date: null, ...extra });
  const sorted = sortProjects([
    p('old', { date: '2020-01-01' }),
    p('new', { date: '2025-01-01' }),
    p('pin2', { pinned: true, order: 2 }),
    p('pin1', { pinned: true, order: 1 }),
  ]);
  assert.deepEqual(sorted.map(x => x.slug), ['pin1', 'pin2', 'new', 'old']);
});
