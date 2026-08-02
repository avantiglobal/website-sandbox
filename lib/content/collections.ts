/**
 * Collection reader (spec 0.6) — the generic half of the listing/detail pair.
 *
 * One reader serves every registered collection, unlike pages.ts which serves
 * exactly one folder. Adding a collection must not mean writing another reader:
 * the registry in lib/cms/collections.ts is the only thing that changes.
 *
 * Fails loud (spec 0.3): an unknown collection name, an item missing its title,
 * or a slug that does not resolve all throw at build. Build routes come from
 * generateStaticParams, so a non-resolving slug is a bug, never a visitor 404.
 */
import type { BlockInstance, CollectionItem } from "./types";
import { listFiles, readMarkdown } from "./fs";
import { ContentError, requireString } from "./validate";
import {
  COLLECTIONS,
  findCollection,
  type CollectionDef,
} from "../cms/collections";

interface ItemFrontmatter extends Record<string, unknown> {
  title: string;
  description?: string;
  excerpt?: string;
  image?: string;
  order?: number;
  featured?: boolean;
  blocks?: BlockInstance[];
}

/** Resolve a registry entry or throw naming the known collections. */
export function requireCollection(name: string): CollectionDef {
  const def = findCollection(name);
  if (!def) {
    const known = COLLECTIONS.map((c) => `"${c.name}"`).join(", ") || "(none)";
    throw new ContentError(
      `Unknown collection "${name}". Registered collections: ${known}. ` +
        `Add it to lib/cms/collections.ts.`,
    );
  }
  return def;
}

/**
 * Every item in a collection, ordered for listing: explicit `order` first
 * (ascending), then the rest alphabetically by title. Items an editor has not
 * ordered still render in a stable, predictable sequence.
 */
export async function getCollectionItems(
  name: string,
): Promise<CollectionItem[]> {
  const def = requireCollection(name);
  const files = await listFiles(def.name, ".md");
  const items = await Promise.all(
    files.map(async (file) => {
      const { data, sourcePath } = await readMarkdown<ItemFrontmatter>(
        def.name,
        file,
      );
      requireString(data.title, "title", sourcePath);
      return {
        collection: def.name,
        slug: file.replace(/\.md$/, ""),
        title: data.title,
        description: data.description,
        excerpt: data.excerpt,
        image: data.image,
        order: typeof data.order === "number" ? data.order : undefined,
        featured: data.featured === true,
        blocks: data.blocks ?? [],
        _sourcePath: sourcePath,
      } satisfies CollectionItem;
    }),
  );

  return items.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return a.title.localeCompare(b.title);
  });
}

/** Resolve one item. Throws when the slug does not resolve (see module note). */
export async function getCollectionItem(
  name: string,
  slug: string,
): Promise<CollectionItem> {
  const items = await getCollectionItems(name);
  const item = items.find((i) => i.slug === slug);
  if (!item) {
    const known = items.map((i) => `"${i.slug}"`).join(", ") || "(none)";
    throw new ContentError(
      `No item in collection "${name}" resolves to slug "${slug}". ` +
        `Known slugs: ${known}.`,
    );
  }
  return item;
}

/** The public route for an item, e.g. "services/onboarding". */
export function collectionItemRoute(item: CollectionItem): string {
  return `${requireCollection(item.collection).basePath}/${item.slug}`;
}

/** For generateStaticParams — every item route across every collection. */
export async function getAllCollectionRoutes(): Promise<string[]> {
  const perCollection = await Promise.all(
    COLLECTIONS.map(async (def) => {
      const items = await getCollectionItems(def.name);
      return items.map((i) => `${def.basePath}/${i.slug}`);
    }),
  );
  return perCollection.flat();
}
