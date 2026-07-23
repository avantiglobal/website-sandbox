/**
 * Netlify Image CDN URL helpers (route (a), spec 0.3).
 *
 * Single source of truth for building /.netlify/images URLs. Used by:
 *  - lib/image-loader.ts — the next/image custom loader (Image primitive).
 *  - components/primitives/rich-text.tsx — the markdown <img> override.
 *
 * Pure string building only — NO Node APIs — so it is safe in the client
 * bundle that next/image's loader is compiled into.
 *
 * Docs: https://docs.netlify.com/build/image-cdn/overview/
 */

export const NETLIFY_IMAGE_ENDPOINT = "/.netlify/images";
export const DEFAULT_QUALITY = 75;

/** Build a single transformed-image URL for a source + target width. */
export function netlifyImageUrl(
  src: string,
  width: number,
  quality: number = DEFAULT_QUALITY,
): string {
  const params = new URLSearchParams();
  params.set("url", src);
  params.set("w", String(width));
  params.set("q", String(quality));
  return `${NETLIFY_IMAGE_ENDPOINT}?${params.toString()}`;
}

/**
 * Default width ladder for full-measure body images. Chosen to cover 1x/2x on
 * common breakpoints without over-fetching.
 */
export const BODY_IMAGE_WIDTHS = [640, 960, 1280, 1920] as const;

/** Build a `srcset` string across a width ladder. */
export function netlifyImageSrcSet(
  src: string,
  widths: readonly number[] = BODY_IMAGE_WIDTHS,
  quality: number = DEFAULT_QUALITY,
): string {
  return widths
    .map((w) => `${netlifyImageUrl(src, w, quality)} ${w}w`)
    .join(", ");
}
