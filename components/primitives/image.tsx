/**
 * Image — optimised media primitive (spec 0.3, tier 1).
 *
 * Wraps next/image, which under `output: 'export'` (route (a)) routes every
 * src through the custom Netlify Image CDN loader (lib/image-loader.ts →
 * /.netlify/images). See next.config.ts.
 *
 * WHAT IS VERIFIABLE LOCALLY: the emitted markup, aspect-ratio box, rounding,
 * lazy-loading, required `alt`, and that srcset URLs point at /.netlify/images.
 * WHAT NEEDS A DEPLOY: the actual resize/re-encode. /.netlify/images does not
 * exist on `next dev` or in the local `out/` preview, so the bytes 404 until
 * the site is on Netlify. Nothing here can prove the transform locally.
 *
 * Every value references a token (--aspect-*, --radius-*).
 */
import NextImage from "next/image";
import { cn } from "@/lib/cn";

type Aspect = "square" | "video" | "wide" | "portrait" | "photo";
type Rounded = "none" | "sm" | "md" | "lg" | "full";

const aspectRatio: Record<Aspect, string> = {
  square: "aspect-[var(--aspect-square)]",
  video: "aspect-[var(--aspect-video)]",
  wide: "aspect-[var(--aspect-wide)]",
  portrait: "aspect-[var(--aspect-portrait)]",
  photo: "aspect-[var(--aspect-photo)]",
};

const rounding: Record<Rounded, string> = {
  none: "rounded-[var(--radius-none)]",
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  full: "rounded-[var(--radius-full)]",
};

interface CommonProps {
  src: string;
  /** Required — a primitive must never emit an unlabelled image. */
  alt: string;
  rounded?: Rounded;
  /** `sizes` hint for responsive selection. Sensible full-width default. */
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** className for the wrapper (aspect mode only). */
  wrapperClassName?: string;
}

/** Aspect mode: fills a tokenised aspect-ratio box (art direction / cards). */
interface AspectProps extends CommonProps {
  aspect: Aspect;
  /** object-fit inside the box. Default "cover". */
  fit?: "cover" | "contain";
  width?: never;
  height?: never;
}

/** Intrinsic mode: explicit dimensions, no wrapper. */
interface IntrinsicProps extends CommonProps {
  aspect?: never;
  width: number;
  height: number;
  fit?: never;
}

export type ImageProps = AspectProps | IntrinsicProps;

const DEFAULT_SIZES = "100vw";

export function Image(props: ImageProps) {
  const {
    src,
    alt,
    rounded = "none",
    sizes = DEFAULT_SIZES,
    priority,
    className,
  } = props;

  if ("aspect" in props && props.aspect) {
    const fitClass =
      props.fit === "contain" ? "object-contain" : "object-cover";
    return (
      <span
        className={cn(
          "relative block overflow-hidden",
          aspectRatio[props.aspect],
          rounding[rounded],
          props.wrapperClassName,
        )}
      >
        <NextImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(fitClass, className)}
        />
      </span>
    );
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      width={props.width}
      height={props.height}
      sizes={sizes}
      priority={priority}
      className={cn("h-auto max-w-full", rounding[rounded], className)}
    />
  );
}
