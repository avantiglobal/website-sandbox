/**
 * Shared, tokenised class strings for form primitives (spec 0.3).
 *
 * Kept in a plain module (no "use client") so both server and client form
 * pieces can import them. Every value references a token — no literals.
 * Invalid styling keys off `aria-invalid="true"`, which the Field wires onto
 * the control, so the visual error state and the a11y state can't diverge.
 */

/** Text-entry / select box shell: input, textarea, select. */
export const controlBox =
  "u-focus-ring block w-full rounded-[var(--radius-md)] " +
  "border border-[var(--color-border-strong)] " +
  "bg-[var(--color-bg)] text-[var(--color-fg)] text-base " +
  "px-[var(--spacing-sm)] py-[var(--spacing-xs)] " +
  "placeholder:text-[var(--color-fg-subtle)] " +
  "transition-[color,border-color,box-shadow] " +
  "duration-[var(--duration-fast)] ease-[var(--ease-standard)] " +
  "aria-[invalid=true]:border-[var(--color-danger)] " +
  "aria-[invalid=true]:bg-[var(--color-danger-surface)] " +
  "disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed";

/** Checkbox / radio square-or-circle box. Native control, tokenised accent. */
export const choiceBox =
  "u-focus-ring mt-[var(--border-width-thick)] shrink-0 " +
  "h-[var(--spacing-sm)] w-[var(--spacing-sm)] " +
  "accent-[var(--color-primary)] cursor-pointer " +
  "disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed";

export const labelClass =
  "block text-sm font-[var(--font-weight-medium)] text-[var(--color-fg)]";

export const descriptionClass = "text-sm text-[var(--color-fg-muted)]";

export const errorClass =
  "text-sm font-[var(--font-weight-medium)] text-[var(--color-danger)]";

/** Vertical field stack. */
export const fieldStack = "flex flex-col gap-[var(--spacing-2xs)]";
