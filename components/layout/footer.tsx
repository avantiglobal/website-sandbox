/**
 * Site footer (spec 0.7) — renders footer text and links from site.yml.
 *
 * Footer links use the same NavItem shape as the header, so an editor can give
 * a footer entry `children` and get a labelled column instead of a flat link.
 * One shape, two layouts — nothing new to learn in the CMS.
 */
import { Container, Link } from "@/components/primitives";
import type { NavItem, SiteSettings } from "@/lib/content";

export function Footer({ site }: { site: SiteSettings }) {
  const { text, links } = site.footer ?? {};
  if (!text && (!links || links.length === 0)) return null;

  return (
    <footer className="mt-[var(--spacing-lg)] border-t border-[var(--color-border)]">
      <Container>
        <div className="flex flex-col gap-[var(--spacing-md)] py-[var(--spacing-lg)]">
          {links && links.length > 0 && (
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-md)]">
                {links.map((item, i) => (
                  <FooterItem key={i} item={item} />
                ))}
              </ul>
            </nav>
          )}
          {text && (
            <p className="text-sm text-[var(--color-fg-muted)]">{text}</p>
          )}
        </div>
      </Container>
    </footer>
  );
}

function FooterItem({ item }: { item: NavItem }) {
  // No children: a plain inline link, sitting in the same row as the columns.
  if (!item.children) {
    return (
      <li>
        <Link href={item.href!}>{item.label}</Link>
      </li>
    );
  }
  return (
    <li>
      <p className="font-[var(--font-weight-semibold)] text-[var(--color-fg)]">
        {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
      </p>
      <ul className="mt-[var(--spacing-2xs)] flex flex-col gap-[var(--spacing-3xs)]">
        {item.children.map((child, i) => (
          <li key={i}>
            <Link href={child.href}>{child.label}</Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
