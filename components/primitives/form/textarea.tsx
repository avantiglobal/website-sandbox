"use client";
/**
 * Textarea — multi-line text-entry control (spec 0.3, tier 1).
 * Inherits id + aria wiring from an enclosing <Field>; works standalone too.
 */
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { controlBox } from "./styles";
import { useFieldControlProps } from "./field";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, rows = 4, ...rest }: TextareaProps) {
  const fieldProps = useFieldControlProps();
  return (
    <textarea
      rows={rows}
      className={cn(controlBox, "resize-y", className)}
      {...fieldProps}
      {...rest}
    />
  );
}
