/**
 * Site settings reader (spec 0.2): global config from a single YAML file.
 * Reads /content/site.yml.
 *
 * Fails loud (spec 0.3): a missing name or nav throws at build rather than
 * rendering a chrome-less site. See NOTES.md → "Content readers: fail loud".
 */
import type { SiteSettings } from "./types";
import { readYaml } from "./fs";
import { requireArray, requireString } from "./validate";

export async function getSiteSettings(): Promise<SiteSettings> {
  const source = "site.yml";
  const raw = await readYaml<Partial<SiteSettings>>(source);

  requireString(raw?.name, "name", source);
  requireArray(raw?.nav, "nav", source);

  return raw as SiteSettings;
}
