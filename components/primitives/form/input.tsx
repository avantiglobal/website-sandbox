"use client";
/**
 * Input — single-line text-entry control (spec 0.3, tier 1).
 * Inherits id + aria wiring from an enclosing <Field>; works standalone too.
 */
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { controlBox } from "./styles";
import { useFieldControlProps } from "./field";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = "text", ...rest }: InputProps) {
  const fieldProps = useFieldControlProps();
  return (
    <input
      type={type}
      className={cn(controlBox, className)}
      {...fieldProps}
      {...rest}
    />
  );
}
