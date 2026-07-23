/**
 * Button + Link bases — interactive primitives (spec 0.3, tier 1).
 *
 * `Button` renders a real <button>; `Link` renders a real <a>. Both share the
 * same tokenised look via `controlClasses`, so a link can be dressed as a
 * button (variant) or left as inline prose ("link" appearance).
 *
 * A11y floor: semantic elements, visible token focus ring (`u-focus-ring`),
 * disabled state that also removes the control from the tab/hit flow. Every
 * value references a token — no literals.
 */
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ControlSize = "sm" | "md" | "lg";

const base =
  "u-focus-ring inline-flex items-center justify-center gap-[var(--spacing-2xs)] " +
  "font-[var(--font-weight-medium)] text-center whitespace-nowrap " +
  "rounded-[var(--radius-md)] border border-transparent " +
  "transition-[color,background-color,border-color,box-shadow] " +
  "duration-[var(--duration-fast)] ease-[var(--ease-standard)] " +
  "cursor-pointer select-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-primary-fg)] " +
    "hover:bg-[var(--color-primary-hover)]",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-fg)] " +
    "border-[var(--color-border-strong)] hover:bg-[var(--color-surface-raised)]",
  ghost:
    "bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-surface)]",
  danger:
    "bg-[var(--color-danger)] text-[var(--color-danger-fg)] " +
    "hover:opacity-[var(--opacity-hover)]",
};

const sizes: Record<ControlSize, string> = {
  sm: "text-sm px-[var(--spacing-xs)] py-[var(--spacing-2xs)]",
  md: "text-base px-[var(--spacing-sm)] py-[var(--spacing-xs)]",
  lg: "text-lg px-[var(--spacing-md)] py-[var(--spacing-sm)]",
};

const disabledClasses =
  "disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed " +
  "disabled:pointer-events-none";

/** Shared class string for anything that should look like a button. */
export function controlClasses(
  variant: ButtonVariant,
  size: ControlSize,
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ControlSize;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(controlClasses(variant, size), disabledClasses, className)}
      {...rest}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */

/** Inline text-link look (default Link appearance). */
const inlineLink =
  "u-focus-ring rounded-[var(--radius-sm)] " +
  "text-[var(--color-primary)] underline underline-offset-[var(--focus-ring-offset)] " +
  "hover:text-[var(--color-primary-hover)] " +
  "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]";

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * "link" (default) is inline prose styling; a ButtonVariant dresses the
   * anchor as a button (e.g. a CTA that navigates).
   */
  variant?: "link" | ButtonVariant;
  size?: ControlSize;
  /** Anchors have no `disabled` attribute; we emulate it accessibly. */
  disabled?: boolean;
  children?: ReactNode;
}

export function Link({
  variant = "link",
  size = "md",
  disabled = false,
  className,
  children,
  href,
  ...rest
}: LinkProps) {
  const classes =
    variant === "link"
      ? cn(inlineLink, className)
      : controlClasses(variant, size, className);

  const disabledClass = disabled
    ? "opacity-[var(--opacity-disabled)] cursor-not-allowed pointer-events-none"
    : undefined;

  return (
    <a
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={cn(classes, disabledClass)}
      {...rest}
    >
      {children}
    </a>
  );
}
