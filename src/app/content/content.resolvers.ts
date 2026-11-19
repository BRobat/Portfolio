import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { ContentLoader, NewsMeta, ProjectMeta } from './content.model';
import { NEWS, NEWS_LOADERS, PROJECT_LOADERS, PROJECTS } from './generated';

export interface ContentEntry<M> {
  meta: M;
  html: string;
}

function entryResolver<M extends { slug: string }>(
  list: M[],
  loaders: Record<string, ContentLoader>,
): ResolveFn<ContentEntry<M>> {
  return async route => {
    const router = inject(Router);
    const slug = route.paramMap.get('slug') ?? '';
    const meta = list.find(m => m.slug === slug);
    const loader = loaders[slug];
    if (!meta || !loader) {
      return new RedirectCommand(router.parseUrl('/404'), { skipLocationChange: true });
    }
    const { html } = await loader();
    return { meta, html };
  };
}

export const newsResolver = entryResolver<NewsMeta>(NEWS, NEWS_LOADERS);
export const projectResolver = entryResolver<ProjectMeta>(PROJECTS, PROJECT_LOADERS);

/** Project metadata for the fullscreen player; projects without an iframe go back to their page. */
export const playableProjectResolver: ResolveFn<ProjectMeta> = route => {
  const router = inject(Router);
  const slug = route.paramMap.get('slug') ?? '';
  const project = PROJECTS.find(p => p.slug === slug);
  if (!project) return new RedirectCommand(router.parseUrl('/404'), { skipLocationChange: true });
  if (!project.iframe) return new RedirectCommand(router.parseUrl(`/projects/${slug}`));
  return project;
};

export function relatedNews(projectSlug: string, limit = 5): NewsMeta[] {
  return NEWS.filter(n => n.projects.includes(projectSlug)).slice(0, limit);
}

export function projectsBySlugs(slugs: string[]): ProjectMeta[] {
  return slugs.map(s => PROJECTS.find(p => p.slug === s)).filter((p): p is ProjectMeta => !!p);
}
