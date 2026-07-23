/**
 * Section — vertical rhythm primitive (spec 0.3, tier 1).
 *
 * A semantic <section> that owns the vertical spacing between page bands and,
 * optionally, a tokenised surface colour. Pair with <Container> for the
 * horizontal measure. Every value references a token (--spacing-*, --color-*).
 */
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionSpacing = "none" | "sm" | "md" | "lg" | "xl";
type SectionSurface = "none" | "bg" | "surface" | "raised";

const paddingY: Record<SectionSpacing, string> = {
  none: "py-0",
  sm: "py-[var(--spacing-lg)]",
  md: "py-[var(--spacing-xl)]",
  lg: "py-[var(--spacing-2xl)]",
  xl: "py-[var(--spacing-3xl)]",
};

const surfaceBg: Record<SectionSurface, string> = {
  none: "",
  bg: "bg-[var(--color-bg)] text-[var(--color-fg)]",
  surface: "bg-[var(--color-surface)] text-[var(--color-fg)]",
  raised: "bg-[var(--color-surface-raised)] text-[var(--color-fg)]",
};

export interface SectionProps {
  /** Vertical padding step. Defaults to "md". */
  spacing?: SectionSpacing;
  /** Background surface token. Defaults to "none" (transparent). */
  surface?: SectionSurface;
  /** Element to render. Defaults to <section>. */
  as?: ElementType;
  className?: string;
  children?: ReactNode;
}

export function Section({
  spacing = "md",
  surface = "none",
  as: Tag = "section",
  className,
  children,
}: SectionProps) {
  return (
    <Tag className={cn(paddingY[spacing], surfaceBg[surface], className)}>
      {children}
    </Tag>
  );
}
