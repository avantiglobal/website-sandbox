import type { Metadata } from "next";
import {
  getAllCollectionRoutes,
  getAllPageSlugs,
  getCollectionItem,
  getPageBySlug,
} from "@/lib/content";
import type { CollectionItem, Page } from "@/lib/content";
import { findCollectionByBasePath } from "@/lib/cms/collections";
import { BlockRenderer } from "@/components/blocks";

/**
 * Catch-all route (spec 0.6) — serves every page except home, plus every
 * collection item.
 *
 * SSG: routes come from generateStaticParams, so resolution never faces an
 * unknown slug at build. Readers throw on a miss (spec 0.3) rather than 404,
 * which surfaces a renamed/broken content file as a failed build.
 *
 * Home is NOT here: it lives at app/page.tsx on the root slug "".
 */

interface RouteParams {
  slug: string[];
}

type Resolved =
  | { kind: "page"; content: Page }
  | { kind: "item"; content: CollectionItem };

/**
 * Two segments whose first matches a registered basePath is a collection item;
 * anything else is a page. Pages therefore cannot shadow an item route, and a
 * collection's listing page (one segment, e.g. /services) stays a normal page.
 */
async function resolve(segments: string[]): Promise<Resolved> {
  if (segments.length === 2) {
    const def = findCollectionByBasePath(segments[0]);
    if (def) {
      return { kind: "item", content: await getCollectionItem(def.name, segments[1]) };
    }
  }
  return { kind: "page", content: await getPageBySlug(segments.join("/")) };
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const [pageSlugs, itemRoutes] = await Promise.all([
    getAllPageSlugs(),
    getAllCollectionRoutes(),
  ]);
  return [
    // "" is home, owned by app/page.tsx — a catch-all needs >= 1 segment.
    ...pageSlugs.filter((s) => s !== "").map((s) => ({ slug: s.split("/") })),
    ...itemRoutes.map((r) => ({ slug: r.split("/") })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { content } = await resolve(slug);
  return { title: content.title, description: content.description };
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const { content } = await resolve(slug);
  return (
    <main>
      <BlockRenderer blocks={content.blocks} source={content._sourcePath} />
    </main>
  );
}
