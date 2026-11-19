/** Optimised (WebP) variant of an image, with intrinsic size when known. */
export interface ImageRef {
  src: string;
  width?: number;
  height?: number;
}

export interface NewsMeta {
  slug: string;
  title: string;
  summary: string;
  /** YYYY-MM-DD */
  date: string;
  /** Original cover URL (used for og:image). */
  cover: string | null;
  /** Cover to display on the page. */
  coverImage: ImageRef | null;
  draft: boolean;
  /** slugs of related projects */
  projects: string[];
}

export interface ProjectMeta {
  slug: string;
  title: string;
  summary: string;
  date: string | null;
  /** Original cover URL (used for og:image). */
  cover: string | null;
  /** Cover to display on the page. */
  coverImage: ImageRef | null;
  draft: boolean;
  pinned: boolean;
  order: number | null;
  iframe: string | null;
}

export type ContentLoader = () => Promise<{ html: string }>;
