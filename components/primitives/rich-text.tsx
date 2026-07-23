/**
 * RichText — renders CMS markdown to styled HTML (spec 0.3, tier 1).
 *
 * The default `Markdown` export of react-markdown is synchronous and hook-free,
 * so this stays a server component (no client JS shipped). remark-gfm adds the
 * GitHub-flavoured constructs a CMS editor emits: tables, strikethrough, task
 * lists, autolinks.
 *
 * Styling for every emittable element lives in the `.richtext` block in
 * app/globals.css — token-driven, contrast-checked. This component owns the
 * safe-parsing, the wrapper, and the <img> override. Raw HTML is NOT enabled
 * (no rehype-raw), so editor markdown can't inject arbitrary tags/scripts.
 *
 * Images: markdown `![]()` is rewritten to a native <img> whose src/srcset
 * point at the Netlify Image CDN (route (a)) — NOT next/image, which can't run
 * inside markdown. Intrinsic width/height are NOT emitted yet (see NOTES.md →
 * "RichText images"), so these can shift layout until dimensions land.
 */
import Markdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";
import { netlifyImageSrcSet, netlifyImageUrl } from "@/lib/netlify-image";

/** Base width used for the non-srcset `src` fallback of body images. */
const IMG_FALLBACK_WIDTH = 1280;

/** Body images render at the prose measure, full-width below it. */
const IMG_SIZES = "(min-width: 42rem) 42rem, 100vw";

const components: Components = {
  img(props) {
    const { src, alt, node: _node, ...rest } = props;
    if (typeof src !== "string" || src === "") return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element -- next/image cannot
      // run inside markdown; we route through the Netlify Image CDN by hand.
      <img
        src={netlifyImageUrl(src, IMG_FALLBACK_WIDTH)}
        srcSet={netlifyImageSrcSet(src)}
        sizes={IMG_SIZES}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        {...rest}
      />
    );
  },
};

export interface RichTextProps {
  /** Markdown source (typically a page/block body from the content layer). */
  children: string;
  className?: string;
}

export function RichText({ children, className }: RichTextProps) {
  return (
    <div className={cn("richtext", className)}>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </Markdown>
    </div>
  );
}
