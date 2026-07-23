/**
 * Minimal className joiner. Filters falsy values and joins with spaces.
 *
 * Intentionally not clsx/tailwind-merge: the primitives never emit conflicting
 * utilities for the same CSS property, so last-writer-wins deduping isn't
 * needed, and we avoid a runtime dependency in a static template.
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
