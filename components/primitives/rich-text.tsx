/**
 * RichText — renders CMS markdown to styled HTML (spec 0.3, tier 1).
 *
 * The default `Markdown` export of react-markdown is synchronous and hook-free.
 * This component is an async server component only so it can resolve image
 * dimensions at build (below) — it still ships no client JS. remark-gfm adds the
 * GitHub-flavoured constructs a CMS editor emits: tables, strikethrough, task
 * lists, autolinks.
 *
 * Styling for every emittable element lives in the `.richtext` block in
 * app/globals.css — token-driven, contrast-checked. Raw HTML is NOT enabled (no
 * rehype-raw), so editor markdown can't inject arbitrary tags/scripts.
 *
 * Images: markdown `![]()` is rewritten to a native <img> whose src/srcset point
 * at the Netlify Image CDN (route (a)) — NOT next/image, which can't run inside
 * markdown. For in-repo images we read intrinsic width/height at build so the
 * box is reserved and body images don't shift layout (CLS). Remote images just
 * omit the dimensions.
 */
import Markdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";
import { netlifyImageSrcSet, netlifyImageUrl } from "@/lib/netlify-image";
import {
  getImageDimensions,
  type Dimensions,
} from "@/lib/content/image-dimensions";

/** Base width used for the non-srcset `src` fallback of body images. */
const IMG_FALLBACK_WIDTH = 1280;

/** Body images render at the prose measure, full-width below it. */
const IMG_SIZES = "(min-width: 42rem) 42rem, 100vw";

/** Pull image srcs out of markdown so dimensions resolve before render. */
function extractImageSrcs(markdown: string): string[] {
  const srcs = new Set<string>();
  const re = /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown)) !== null) srcs.add(match[1]);
  return [...srcs];
}

function makeComponents(dimensions: Map<string, Dimensions>): Components {
  return {
    img(props) {
      const { src, alt, node: _node, ...rest } = props;
      if (typeof src !== "string" || src === "") return null;
      const dim = dimensions.get(src);
      return (
        // eslint-disable-next-line @next/next/no-img-element -- next/image cannot
        // run inside markdown; we route through the Netlify Image CDN by hand.
        <img
          src={netlifyImageUrl(src, IMG_FALLBACK_WIDTH)}
          srcSet={netlifyImageSrcSet(src)}
          sizes={IMG_SIZES}
          alt={alt ?? ""}
          width={dim?.width}
          height={dim?.height}
          loading="lazy"
          decoding="async"
          {...rest}
        />
      );
    },
  };
}

export interface RichTextProps {
  /** Markdown source (typically a page/block body from the content layer). */
  children: string;
  className?: string;
}

export async function RichText({ children, className }: RichTextProps) {
  const dimensions = new Map<string, Dimensions>();
  await Promise.all(
    extractImageSrcs(children).map(async (src) => {
      const dim = await getImageDimensions(src);
      if (dim) dimensions.set(src, dim);
    }),
  );

  return (
    <div className={cn("richtext", className)}>
      <Markdown remarkPlugins={[remarkGfm]} components={makeComponents(dimensions)}>
        {children}
      </Markdown>
    </div>
  );
}
