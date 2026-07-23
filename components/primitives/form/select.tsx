"use client";
/**
 * Select — native single-select control (spec 0.3, tier 1).
 * Inherits id + aria wiring from an enclosing <Field>; works standalone too.
 * Options are passed as <option> children so the caller owns the value set.
 */
import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { controlBox } from "./styles";
import { useFieldControlProps } from "./field";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...rest }: SelectProps) {
  const fieldProps = useFieldControlProps();
  return (
    <select
      className={cn(controlBox, "cursor-pointer pr-[var(--spacing-lg)]", className)}
      {...fieldProps}
      {...rest}
    >
      {children}
    </select>
  );
}
