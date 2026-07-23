/**
 * Pages reader (spec 0.2): one reader per collection type.
 *
 * Reads /content/pages/*.md. Frontmatter carries title/description and the
 * ordered block list; the markdown body is available for a default rich-text
 * block if a page wants prose without declaring blocks explicitly.
 *
 * Fails loud (spec 0.3): a page missing its `title`, or a slug that does not
 * resolve, throws at build rather than rendering "Untitled". Build slugs come
 * from generateStaticParams, so a non-resolving slug is a bug, never a 404.
 * See NOTES.md → "Content readers: fail loud".
 */
import type { BlockInstance, Page } from "./types";
import { listFiles, readMarkdown } from "./fs";
import { ContentError, requireString } from "./validate";

interface PageFrontmatter extends Record<string, unknown> {
  title: string;
  description?: string;
  slug?: string;
  blocks?: BlockInstance[];
}

const SUBDIR = "pages";

/**
 * Home lives at the root slug "". Both the filename `home.md` and an explicit
 * frontmatter `slug: home` (what the CMS hint tells editors to use) normalise
 * to "" so the two can never disagree.
 */
function normaliseSlug(raw: string): string {
  const base = raw.replace(/\.md$/, "");
  return base === "home" ? "" : base;
}

export async function getAllPages(): Promise<Page[]> {
  const files = await listFiles(SUBDIR, ".md");
  const pages = await Promise.all(
    files.map(async (file) => {
      const { data, sourcePath } = await readMarkdown<PageFrontmatter>(
        SUBDIR,
        file,
      );
      // A page without a title cannot render a heading or a <title>; fail loud.
      requireString(data.title, "title", sourcePath);
      return {
        slug: normaliseSlug(data.slug ?? file),
        title: data.title,
        description: data.description,
        blocks: data.blocks ?? [],
        _sourcePath: sourcePath,
      } satisfies Page;
    }),
  );
  return pages;
}

/**
 * Resolve a page by slug. Throws when the slug does not resolve — callers pass
 * slugs that come from the content set itself (generateStaticParams), so a miss
 * is a broken/renamed file, not a visitor 404.
 */
export async function getPageBySlug(slug: string): Promise<Page> {
  const pages = await getAllPages();
  const page = pages.find((p) => p.slug === slug);
  if (!page) {
    const known = pages.map((p) => `"${p.slug}"`).join(", ") || "(none)";
    throw new ContentError(
      `No page resolves to slug "${slug}". Known slugs: ${known}.`,
    );
  }
  return page;
}

/** For generateStaticParams — every page slug as a route param array. */
export async function getAllPageSlugs(): Promise<string[]> {
  const pages = await getAllPages();
  return pages.map((p) => p.slug);
}
