/**
 * BlockRenderer — maps page.blocks[].type → its tier-2 renderer (spec 0.4).
 *
 * The registry key MUST match the block's schema `name` and the `type` written
 * into page frontmatter. Fails loud (spec 0.3 rule): an unknown block type
 * throws at build with the page source, rather than silently dropping content.
 * Each block validates its own required fields.
 */
import type { ComponentType } from "react";
import type { BlockInstance } from "@/lib/content";
import { ContentError } from "@/lib/content";
import { PageHero } from "./page-hero";
import { RichTextSection } from "./rich-text-section";

export interface BlockProps {
  block: BlockInstance;
  /** Human-readable location for fail-loud messages. */
  source: string;
}

const registry: Record<string, ComponentType<BlockProps>> = {
  page_hero: PageHero,
  rich_text_section: RichTextSection,
};

export function BlockRenderer({
  blocks,
  source,
}: {
  blocks: BlockInstance[];
  /** The page's source path, e.g. "pages/home.md". */
  source: string;
}) {
  return (
    <>
      {blocks.map((block, i) => {
        const Component = registry[block.type];
        if (!Component) {
          const known = Object.keys(registry).join(", ") || "(none)";
          throw new ContentError(
            `Unknown block type "${block.type}" in ${source} (block ${i}). ` +
              `Known types: ${known}.`,
          );
        }
        return (
          <Component
            key={i}
            block={block}
            source={`${source} › block[${i}] "${block.type}"`}
          />
        );
      })}
    </>
  );
}
