/**
 * Container — horizontal layout primitive (spec 0.3, tier 1).
 *
 * Centres content and caps its measure at a tokenised width, with tokenised
 * gutters. Zero visual identity: no background, border, or colour of its own.
 * Every value references a token (--container-*, --spacing-*).
 */
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerSize = "prose" | "narrow" | "base" | "wide" | "full";

const maxWidth: Record<ContainerSize, string> = {
  prose: "max-w-[var(--container-prose)]",
  narrow: "max-w-[var(--container-narrow)]",
  base: "max-w-[var(--container-base)]",
  wide: "max-w-[var(--container-wide)]",
  full: "max-w-none",
};

export interface ContainerProps {
  /** Max measure. Defaults to "base". "full" removes the cap. */
  size?: ContainerSize;
  /** Element to render. Defaults to a neutral <div>. */
  as?: ElementType;
  /** Horizontal gutters. Set false when a parent already pads. Default true. */
  gutter?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Container({
  size = "base",
  as: Tag = "div",
  gutter = true,
  className,
  children,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full",
        maxWidth[size],
        gutter && "px-[var(--spacing-md)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
