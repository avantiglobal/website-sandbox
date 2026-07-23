/**
 * Grid — responsive column primitive (spec 0.3, tier 1).
 *
 * Tokenised gaps; column counts ramp up at tokenised breakpoints so a grid is
 * single-column on small screens by default. Class strings are fully static
 * (no interpolated utility names) so Tailwind's scanner always emits them.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type GridCols = 1 | 2 | 3 | 4;
type GridGap = "sm" | "md" | "lg";

/**
 * Responsive ramp: mobile is always 1 column; the target count is reached at
 * md, with an intermediate step at sm for 3/4-column grids.
 */
const columns: Record<GridCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
};

const gaps: Record<GridGap, string> = {
  sm: "gap-[var(--spacing-sm)]",
  md: "gap-[var(--spacing-md)]",
  lg: "gap-[var(--spacing-lg)]",
};

export interface GridProps {
  /** Target column count at the widest breakpoint. Defaults to 2. */
  cols?: GridCols;
  /** Gap between cells. Defaults to "md". */
  gap?: GridGap;
  className?: string;
  children?: ReactNode;
}

export function Grid({ cols = 2, gap = "md", className, children }: GridProps) {
  return (
    <div className={cn("grid", columns[cols], gaps[gap], className)}>
      {children}
    </div>
  );
}
