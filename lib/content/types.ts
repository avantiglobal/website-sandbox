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

/**
 * An item in a folder collection (spec 0.6) — a Page plus the metadata a
 * listing card needs. Same block vocabulary and same renderer as a page; it
 * only differs in where it is stored and how it is routed.
 */
export interface CollectionItem extends Page {
  /** Registry name of the owning collection. */
  collection: string;
  /** Short summary for listing cards. Falls back to `description`. */
  excerpt?: string;
  /** Card image. Listings render without one when absent. */
  image?: string;
  /** Manual sort position; unordered items sort alphabetically after these. */
  order?: number;
  /** Editor-set highlight, so a page can list a curated subset. */
  featured?: boolean;
}

/** A leaf navigation entry — always points somewhere. */
export interface NavLink {
  label: string;
  href: string;
}

/**
 * A top-level navigation entry. `href` is optional when the item exists only to
 * group `children` (a dropdown label). Nesting stops here on purpose: one level
 * covers marketing-site navigation, and deeper menus are hostile on touch.
 * See NOTES.md → "Navigation".
 */
export interface NavItem extends Partial<NavLink> {
  label: string;
  children?: NavLink[];
}

/** Global site settings read from a single YAML file. */
export interface SiteSettings {
  name: string;
  tagline?: string;
  nav: NavItem[];
  footer?: {
    text?: string;
    /** Same shape as the header: a flat link, or a labelled group of links. */
    links?: NavItem[];
  };
}
