/**
 * Tier 2 blocks barrel (spec 0.4). Pages import the renderer from here.
 *
 * NOTE: each block's schema.ts is intentionally NOT re-exported — it's pure
 * data imported directly by the Node config assembler, and must stay free of
 * this tsx barrel's React imports.
 */
export { BlockRenderer } from "./registry";
export type { BlockProps } from "./registry";
export { PageHero } from "./page-hero";
export { RichTextSection } from "./rich-text-section";
