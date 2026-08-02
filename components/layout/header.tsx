/**
 * Site header (spec 0.7) — renders the editable navigation from site.yml.
 *
 * No client JavaScript. The desktop submenu opens on hover AND focus-within, so
 * it is keyboard-reachable; the mobile menu is a native <details> disclosure,
 * which ships its own expanded/collapsed semantics for screen readers. A menu
 * that needs hydration to open is a menu that fails before hydration.
 *
 * Nesting is one level by design (see NOTES.md → "Navigation").
 */
import { Container, Link } from "@/components/primitives";
import type { NavItem, SiteSettings } from "@/lib/content";

export function Header({ site }: { site: SiteSettings }) {
  return (
    <header className="border-b border-[var(--color-border)]">
      <Container>
        <div className="flex items-center justify-between gap-[var(--spacing-md)] py-[var(--spacing-sm)]">
          <Link
            href="/"
            className="font-[var(--font-weight-bold)] tracking-[var(--tracking-tight)] no-underline"
          >
            {site.name}
          </Link>

          {/* Desktop */}
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-[var(--spacing-md)]">
              {site.nav.map((item, i) => (
                <DesktopItem key={i} item={item} />
              ))}
            </ul>
          </nav>

          {/* Mobile — native disclosure, no JS */}
          <details className="md:hidden [&[open]>summary]:text-[var(--color-primary)]">
            <summary className="u-focus-ring cursor-pointer list-none rounded-[var(--radius-sm)] px-[var(--spacing-2xs)] py-[var(--spacing-3xs)] font-[var(--font-weight-semibold)]">
              Menu
            </summary>
            <nav
              aria-label="Main"
              className="absolute inset-x-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-bg)] px-[var(--spacing-md)] py-[var(--spacing-sm)] shadow-sm"
            >
              <ul className="flex flex-col gap-[var(--spacing-xs)]">
                {site.nav.map((item, i) => (
                  <MobileItem key={i} item={item} />
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}

function DesktopItem({ item }: { item: NavItem }) {
  if (!item.children) {
    return (
      <li>
        <Link href={item.href!}>{item.label}</Link>
      </li>
    );
  }
  return (
    <li className="group relative">
      {/* A grouping label with no href stays a <span>: not focusable, not a fake link. */}
      {item.href ? (
        <Link href={item.href}>{item.label}</Link>
      ) : (
        <span className="text-[var(--color-fg)]">{item.label}</span>
      )}
      <ul
        className={
          "invisible absolute left-0 top-full z-10 min-w-48 opacity-0 " +
          "border border-[var(--color-border)] bg-[var(--color-bg)] " +
          "rounded-[var(--radius-md)] p-[var(--spacing-xs)] shadow-sm " +
          "transition-[opacity,visibility] duration-[var(--duration-fast)] ease-[var(--ease-standard)] " +
          "group-hover:visible group-hover:opacity-100 " +
          "group-focus-within:visible group-focus-within:opacity-100"
        }
      >
        {item.children.map((child, i) => (
          <li key={i} className="py-[var(--spacing-3xs)]">
            <Link href={child.href}>{child.label}</Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

function MobileItem({ item }: { item: NavItem }) {
  return (
    <li>
      {item.href ? (
        <Link href={item.href}>{item.label}</Link>
      ) : (
        <span className="font-[var(--font-weight-semibold)] text-[var(--color-fg)]">
          {item.label}
        </span>
      )}
      {item.children && (
        <ul className="mt-[var(--spacing-3xs)] flex flex-col gap-[var(--spacing-3xs)] border-l border-[var(--color-border)] pl-[var(--spacing-sm)]">
          {item.children.map((child, i) => (
            <li key={i}>
              <Link href={child.href}>{child.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
