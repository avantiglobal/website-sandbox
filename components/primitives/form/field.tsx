"use client";
/**
 * Field — labelled form-control wrapper with description + error slots
 * (spec 0.3, tier 1). For text-entry controls (Input, Textarea, Select).
 *
 * Owns the id wiring so a11y and visuals can't drift:
 *  - generates a stable id (useId) and links <label for> ↔ control id
 *  - links description + error via aria-describedby
 *  - flags the control invalid (aria-invalid) whenever `error` is set, which
 *    both styles it and announces it.
 *
 * Controls read this via useFieldControlProps(); used outside a Field they
 * simply render as an unwired native control.
 *
 * Checkbox/Radio have a different label geometry (control-then-label) and are
 * self-contained — they do NOT use this wrapper.
 */
import {
  createContext,
  useContext,
  useId,
  type AriaAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import {
  descriptionClass,
  errorClass,
  fieldStack,
  labelClass,
} from "./styles";

interface FieldContextValue {
  id: string;
  descriptionId?: string;
  errorId?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export interface FieldProps {
  label: string;
  /** Optional helper text, rendered under the control and linked via aria. */
  description?: string;
  /** When set, the control is marked invalid and this message is announced. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  /** The control element (Input / Textarea / Select). */
  children: ReactNode;
}

export function Field({
  label,
  description,
  error,
  required = false,
  disabled = false,
  className,
  children,
}: FieldProps) {
  const uid = useId();
  const id = `${uid}-control`;
  const descriptionId = description ? `${uid}-desc` : undefined;
  const errorId = error ? `${uid}-err` : undefined;
  const invalid = Boolean(error);

  return (
    <FieldContext.Provider
      value={{ id, descriptionId, errorId, invalid, required, disabled }}
    >
      <div className={cn(fieldStack, className)}>
        <label htmlFor={id} className={labelClass}>
          {label}
          {required && (
            <span aria-hidden="true" className="text-[var(--color-danger)]">
              {" *"}
            </span>
          )}
        </label>
        {children}
        {description && (
          <p id={descriptionId} className={descriptionClass}>
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} className={errorClass}>
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}

/**
 * Props a control spreads to inherit the Field's wiring. Returns {} when the
 * control is used standalone (no Field ancestor).
 */
export function useFieldControlProps(): AriaAttributes & {
  id?: string;
  required?: boolean;
  disabled?: boolean;
} {
  const ctx = useContext(FieldContext);
  if (!ctx) return {};
  const describedBy =
    [ctx.descriptionId, ctx.errorId].filter(Boolean).join(" ") || undefined;
  return {
    id: ctx.id,
    required: ctx.required || undefined,
    disabled: ctx.disabled || undefined,
    "aria-invalid": ctx.invalid || undefined,
    "aria-describedby": describedBy,
    "aria-required": ctx.required || undefined,
  };
}
