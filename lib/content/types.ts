/**
 * Shared content types (spec 0.2).
 *
 * These describe the shape of parsed content after frontmatter/YAML parsing.
 * Pages compose from these typed readers — never from hardcoded props.
 */

/** A tier-2 block instance as stored in page frontmatter. */
export interface BlockInstance {
  /** Discriminator matching a block folder under components/blocks. */
  type: string;
  /** Block-specific fields; validated/narrowed by each block at render time. */
  [key: string]: unknown;
}

/** A content page assembled from an ordered list of blocks. */
export interface Page {
  /** URL path segment(s), e.g. "" for home, "about" for /about. */
  slug: string;
  title: string;
  description?: string;
  /** Ordered blocks that make up the page body. */
  blocks: BlockInstance[];
  /** Raw source path, useful for debugging/build logs. */
  _sourcePath: string;
}

/** Global site settings read from a single YAML file. */
export interface SiteSettings {
  name: string;
  tagline?: string;
  nav: Array<{ label: string; href: string }>;
  footer?: {
    text?: string;
    links?: Array<{ label: string; href: string }>;
  };
}
