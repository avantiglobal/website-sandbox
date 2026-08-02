/**
 * Site settings reader (spec 0.2): global config from a single YAML file.
 * Reads /content/site.yml.
 *
 * Fails loud (spec 0.3): a missing name or nav throws at build rather than
 * rendering a chrome-less site. See NOTES.md → "Content readers: fail loud".
 *
 * Navigation is validated in depth: an entry with neither a link nor a submenu
 * would render as dead text in the header, so it throws instead.
 */
import type { NavItem, NavLink, SiteSettings } from "./types";
import { readYaml } from "./fs";
import { ContentError, requireArray, requireString } from "./validate";

function parseNavLink(raw: unknown, path: string, source: string): NavLink {
  if (typeof raw !== "object" || raw === null) {
    throw new ContentError(`"${path}" must be an object in ${source}.`);
  }
  const o = raw as Record<string, unknown>;
  return {
    label: requireString(o.label, `${path}.label`, source),
    href: requireString(o.href, `${path}.href`, source),
  };
}

function parseNavItem(raw: unknown, path: string, source: string): NavItem {
  if (typeof raw !== "object" || raw === null) {
    throw new ContentError(`"${path}" must be an object in ${source}.`);
  }
  const o = raw as Record<string, unknown>;
  const label = requireString(o.label, `${path}.label`, source);

  const children = Array.isArray(o.children)
    ? o.children.map((c, i) => parseNavLink(c, `${path}.children[${i}]`, source))
    : undefined;

  const href = typeof o.href === "string" && o.href.trim() !== "" ? o.href : undefined;

  // A label with no destination and no submenu is unclickable dead text.
  if (!href && (!children || children.length === 0)) {
    throw new ContentError(
      `"${path}" in ${source} needs a "href", a non-empty "children" list, or both.`,
    );
  }

  return { label, href, children: children?.length ? children : undefined };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const source = "site.yml";
  const raw = await readYaml<Record<string, unknown>>(source);

  const name = requireString(raw?.name, "name", source);
  const navRaw = requireArray<unknown>(raw?.nav, "nav", source);
  const nav = navRaw.map((item, i) => parseNavItem(item, `nav[${i}]`, source));

  const footerRaw = raw?.footer as Record<string, unknown> | undefined;
  const footerLinks = Array.isArray(footerRaw?.links)
    ? footerRaw.links.map((item, i) =>
        parseNavItem(item, `footer.links[${i}]`, source),
      )
    : undefined;

  return {
    name,
    tagline: typeof raw?.tagline === "string" ? raw.tagline : undefined,
    nav,
    footer: footerRaw
      ? {
          text: typeof footerRaw.text === "string" ? footerRaw.text : undefined,
          links: footerLinks,
        }
      : undefined,
  };
}
