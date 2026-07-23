"use client";
/**
 * Checkbox — self-contained boolean control with label + description + error
 * slots (spec 0.3, tier 1).
 *
 * Different label geometry from text inputs (control-then-label), so it owns
 * its own id wiring rather than using <Field>. Description/error are linked via
 * aria-describedby and indented to align under the label.
 */
import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { choiceBox, descriptionClass, errorClass, fieldStack } from "./styles";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
  error?: string;
}

/** Aligns helper text under the label: past the box width + the row gap. */
const indent = "pl-[calc(var(--spacing-sm)+var(--spacing-2xs))]";

export function Checkbox({
  label,
  description,
  error,
  required,
  className,
  ...rest
}: CheckboxProps) {
  const uid = useId();
  const id = `${uid}-checkbox`;
  const descriptionId = description ? `${uid}-desc` : undefined;
  const errorId = error ? `${uid}-err` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn(fieldStack, className)}>
      <div className="flex gap-[var(--spacing-2xs)]">
        <input
          type="checkbox"
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={choiceBox}
          {...rest}
        />
        <label
          htmlFor={id}
          className="cursor-pointer select-none text-base text-[var(--color-fg)]"
        >
          {label}
          {required && (
            <span aria-hidden="true" className="text-[var(--color-danger)]">
              {" *"}
            </span>
          )}
        </label>
      </div>
      {description && (
        <p id={descriptionId} className={cn(descriptionClass, indent)}>
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className={cn(errorClass, indent)}>
          {error}
        </p>
      )}
    </div>
  );
}
