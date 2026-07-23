/**
 * Custom next/image loader → Netlify Image CDN.
 *
 * Under `output: 'export'` Next disables its built-in optimiser, so we hand
 * image URLs to Netlify's on-the-fly transformer at /.netlify/images. Netlify
 * resizes/re-encodes at request time and caches the result at the edge.
 *
 * The URL construction lives in lib/netlify-image.ts so the Image primitive and
 * the RichText markdown <img> override build identical URLs.
 *
 * Docs: https://docs.netlify.com/build/image-cdn/overview/
 */
import { netlifyImageUrl } from "./netlify-image";

type ImageLoaderParams = {
  src: string;
  width: number;
  quality?: number;
};

export default function netlifyImageLoader({
  src,
  width,
  quality,
}: ImageLoaderParams): string {
  return netlifyImageUrl(src, width, quality);
}
