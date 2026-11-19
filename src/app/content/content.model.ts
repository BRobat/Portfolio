export interface NewsMeta {
  slug: string;
  title: string;
  summary: string;
  /** YYYY-MM-DD */
  date: string;
  cover: string | null;
  draft: boolean;
  /** slugs of related projects */
  projects: string[];
}

export interface ProjectMeta {
  slug: string;
  title: string;
  summary: string;
  date: string | null;
  cover: string | null;
  draft: boolean;
  pinned: boolean;
  order: number | null;
  iframe: string | null;
}

export type ContentLoader = () => Promise<{ html: string }>;
