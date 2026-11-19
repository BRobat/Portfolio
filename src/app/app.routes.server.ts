import { RenderMode, ServerRoute } from '@angular/ssr';
import { NEWS, NEWS_PAGE_SIZE, PROJECTS } from './content/generated';

const projectParams = async () => PROJECTS.map(p => ({ slug: p.slug }));

export const serverRoutes: ServerRoute[] = [
  { path: 'projects/:slug', renderMode: RenderMode.Prerender, getPrerenderParams: projectParams },
  {
    path: 'projects/:slug/play',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROJECTS.filter(p => p.iframe).map(p => ({ slug: p.slug })),
  },
  {
    path: 'news/page/:page',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const pages = Math.ceil(NEWS.length / NEWS_PAGE_SIZE);
      return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ page: String(i + 2) }));
    },
  },
  {
    path: 'news/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => NEWS.map(n => ({ slug: n.slug })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
