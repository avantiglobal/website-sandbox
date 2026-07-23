/**
 * CMS schema-fragment types (spec 0.2 / 0.4).
 *
 * Each tier-2 block ships a schema.ts exporting a `BlockSchema`. The config
 * assembler composes these into the `pages` collection's block list widget, so
 * schema and component live in the same folder and cannot drift apart.
 *
 * Field shapes follow the Sveltia/Decap widget model (config is compatible
 * between the two — spec 0.2).
 */

export interface CmsField {
  name: string;
  label?: string;
  widget: string;
  required?: boolean;
  default?: unknown;
  hint?: string;
  /** For object/list widgets. */
  fields?: CmsField[];
  /** For select/relation widgets. */
  options?: Array<string | { label: string; value: string }>;
  /** widget: "list" of typed variants. */
  types?: CmsField[];
  /** Passthrough for widget-specific keys (e.g. media_library, min, max). */
  [key: string]: unknown;
}

/**
 * A block's contribution to config.yml. `name` is the block discriminator and
 * MUST match the folder name / the `type` written into page frontmatter.
 */
export interface BlockSchema {
  /** Discriminator, e.g. "page_hero". */
  name: string;
  /** Human label shown in the CMS. */
  label: string;
  /** The block's editable fields. */
  fields: CmsField[];
  /** Optional summary template for the CMS list view. */
  summary?: string;
}
