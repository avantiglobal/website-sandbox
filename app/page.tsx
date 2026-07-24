import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/content";
import { BlockRenderer } from "@/components/blocks";

// SSG: content is read from disk at build. No runtime fetching (spec 0.1/0.2).
// Readers throw on missing content (spec 0.3); the page body is composed from
// tier-2 blocks (spec 0.4). The page_hero block owns the single <h1>.
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("");
  return { title: page.title, description: page.description };
}

export default async function HomePage() {
  const page = await getPageBySlug("");
  return (
    <main>
      <BlockRenderer blocks={page.blocks} source={page._sourcePath} />
    </main>
  );
}
