/**
 * Collection registry (spec 0.6) — the single source of truth for folder
 * collections: listing/detail content types like services, areas or projects.
 *
 * Pure data: NO React/tsx imports, so both the Node-based config assembler
 * (scripts/build-cms-config.mts, type-stripping) and the runtime content
 * readers can import it. One registry drives three things that must never
 * disagree — the CMS folder collection, the static routes, and the options a
 * collection_list block offers.
 *
 * A collection item is a Page with extra card metadata: same block vocabulary,
 * same renderer, just stored in its own folder and routed under `basePath`.
 *
 * Adding a collection = one entry here + a content/<name>/ folder. Nothing else.
 */

export interface CollectionDef {
  /** Folder under /content AND the CMS collection name. Lowercase, no spaces. */
  name: string;
  /** Plural label shown in the CMS sidebar. */
  label: string;
  /** Singular label — the CMS uses it for the "add new" button. */
  singularLabel: string;
  /**
   * Route prefix: items resolve at /<basePath>/<slug>. Usually equal to `name`,
   * but kept separate so a folder can keep an English name while the URL is
   * localised (e.g. name "services" → basePath "servicios").
   */
  basePath: string;
}

/**
 * Cleared per project (clone step 3). "services" ships as a worked example so
 * the listing/detail pair is exercised by the demo content.
 */
export const COLLECTIONS: CollectionDef[] = [
  {
    name: "services",
    label: "Services",
    singularLabel: "Service",
    basePath: "services",
  },
];

/** Lookup by registry name. Returns undefined for unknown names — callers decide how loud to fail. */
export function findCollection(name: string): CollectionDef | undefined {
  return COLLECTIONS.find((c) => c.name === name);
}

/** Lookup by route prefix, for resolving an incoming URL's first segment. */
export function findCollectionByBasePath(
  basePath: string,
): CollectionDef | undefined {
  return COLLECTIONS.find((c) => c.basePath === basePath);
}
