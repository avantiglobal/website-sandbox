/**
 * Build-time intrinsic image dimensions (spec 0.3 follow-up).
 *
 * RichText emits CDN <img>s for markdown images; without width/height the
 * browser can't reserve space and body images cause layout shift (CLS). We read
 * the real pixel size of in-repo images at build so the <img> can carry
 * width/height (the browser derives the aspect ratio from them and reserves the
 * box before the bytes arrive).
 *
 * Only root-relative, in-repo (`public/…`) images are resolvable. Remote or
 * unreadable srcs return null — inline media is NOT a "required entry" under the
 * fail-loud rule, so a missing/odd inline image must never break the build.
 *
 * image-size is a zero-dependency, build-time-only devDependency; it never ships
 * to the static output.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { imageSize } from "image-size";

const PUBLIC_DIR = join(process.cwd(), "public");

export interface Dimensions {
  width: number;
  height: number;
}

export async function getImageDimensions(
  src: string,
): Promise<Dimensions | null> {
  // Only local, root-relative images live in the repo at build time.
  if (!src.startsWith("/")) return null;
  const relPath = src.replace(/[?#].*$/, "");

  try {
    const buf = await readFile(join(PUBLIC_DIR, relPath));
    const { width, height, orientation } = imageSize(new Uint8Array(buf));
    if (typeof width !== "number" || typeof height !== "number") return null;

    // EXIF orientations 5–8 rotate the image 90°, swapping displayed
    // dimensions — emit what the browser will actually render.
    const rotated =
      orientation !== undefined && orientation >= 5 && orientation <= 8;
    return rotated
      ? { width: height, height: width }
      : { width, height };
  } catch {
    // Missing / unreadable / undecodable inline image — skip dimensions.
    return null;
  }
}
