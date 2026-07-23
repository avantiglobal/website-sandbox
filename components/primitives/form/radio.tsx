"use client";
/**
 * Radio + RadioGroup — single-choice controls (spec 0.3, tier 1).
 *
 * `Radio` is one control-with-label row (mirrors Checkbox). `RadioGroup` is the
 * accessible grouping: a <fieldset>/<legend> that names the set, a shared
 * `name` across options, and group-level description + error slots. Radios must
 * be grouped for keyboard/AT semantics, so prefer RadioGroup over loose Radios.
 */
import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { choiceBox, descriptionClass, errorClass, fieldStack } from "./styles";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

const indent = "pl-[calc(var(--spacing-sm)+var(--spacing-2xs))]";

export function Radio({
  label,
  description,
  id: providedId,
  className,
  ...rest
}: RadioProps) {
  const uid = useId();
  const id = providedId ?? `${uid}-radio`;
  const descriptionId = description ? `${uid}-desc` : undefined;

  return (
    <div className={cn(fieldStack, className)}>
      <div className="flex gap-[var(--spacing-2xs)]">
        <input
          type="radio"
          id={id}
          aria-describedby={descriptionId}
          className={choiceBox}
          {...rest}
        />
        <label
          htmlFor={id}
          className="cursor-pointer select-none text-base text-[var(--color-fg)]"
        >
          {label}
        </label>
      </div>
      {description && (
        <p id={descriptionId} className={cn(descriptionClass, indent)}>
          {description}
        </p>
      )}
    </div>
  );
}

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Shared control name — required to make the options mutually exclusive. */
  name: string;
  /** Group label, rendered as the <legend>. */
  legend: string;
  options: RadioOption[];
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  className?: string;
}

export function RadioGroup({
  name,
  legend,
  options,
  description,
  error,
  required = false,
  disabled = false,
  defaultValue,
  className,
}: RadioGroupProps) {
  const uid = useId();
  const descriptionId = description ? `${uid}-desc` : undefined;
  const errorId = error ? `${uid}-err` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset
      className={cn(fieldStack, className)}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
      disabled={disabled}
    >
      <legend className="text-sm font-[var(--font-weight-medium)] text-[var(--color-fg)]">
        {legend}
        {required && (
          <span aria-hidden="true" className="text-[var(--color-danger)]">
            {" *"}
          </span>
        )}
      </legend>
      {description && (
        <p id={descriptionId} className={descriptionClass}>
          {description}
        </p>
      )}
      <div className="mt-[var(--spacing-2xs)] flex flex-col gap-[var(--spacing-2xs)]">
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name={name}
            value={opt.value}
            label={opt.label}
            description={opt.description}
            disabled={opt.disabled}
            required={required}
            defaultChecked={defaultValue === opt.value}
          />
        ))}
      </div>
      {error && (
        <p id={errorId} className={errorClass}>
          {error}
        </p>
      )}
    </fieldset>
  );
}
