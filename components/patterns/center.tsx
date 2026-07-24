/**
 * Center — centered-stack structural pattern (spec 0.5, tier 3).
 *
 * Stacks children in a centred column with centred text. The reading measure is
 * owned by whatever the caller puts inside (e.g. a max-w on the subheading) plus
 * the enclosing <Container>. Structure only — no colour, no spacing identity.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface CenterProps {
  children: ReactNode;
  className?: string;
}

export function Center({ children, className }: CenterProps) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      {children}
    </div>
  );
}
