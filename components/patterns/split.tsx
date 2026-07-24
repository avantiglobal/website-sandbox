/**
 * Split — two-column structural pattern (spec 0.5, tier 3).
 *
 * Content beside media on desktop; stacks to a single column (content first) on
 * mobile. Zero content knowledge and zero visual identity — just arrangement.
 * Tokenised gap; grid/order utilities are structural, not design values.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SplitProps {
  /** The media column (e.g. an <Image>). */
  media: ReactNode;
  /** The content column. */
  children: ReactNode;
  /** Place media before content on desktop (still content-first on mobile). */
  reverse?: boolean;
  className?: string;
}

export function Split({
  media,
  children,
  reverse = false,
  className,
}: SplitProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-[var(--spacing-lg)] md:grid-cols-2",
        className,
      )}
    >
      <div className={reverse ? "md:order-2" : undefined}>{children}</div>
      <div className={reverse ? "md:order-1" : undefined}>{media}</div>
    </div>
  );
}
