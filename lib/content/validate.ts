/**
 * Content validation — fail loud at build time (spec 0.3).
 *
 * A content reader MUST throw when a required entry is missing or a slug fails
 * to resolve. We never fall back to a placeholder: under `output: 'export'` a
 * throw fails `next build`, surfacing the broken content file instead of
 * shipping a quietly-wrong page. See NOTES.md → "Content readers: fail loud".
 */

/** Thrown by content readers when required data is missing or malformed. */
export class ContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentError";
  }
}

/** Assert a value is a non-empty string, else throw naming the source + field. */
export function requireString(
  value: unknown,
  field: string,
  source: string,
): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ContentError(
      `Missing required string "${field}" in ${source} (got ${describe(value)}).`,
    );
  }
  return value;
}

/** Assert a value is a non-empty array, else throw naming the source + field. */
export function requireArray<T>(
  value: unknown,
  field: string,
  source: string,
): T[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ContentError(
      `Missing required array "${field}" in ${source} (got ${describe(value)}).`,
    );
  }
  return value as T[];
}

function describe(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (Array.isArray(value)) return `array(length ${value.length})`;
  return typeof value;
}
