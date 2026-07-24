/**
 * page_hero — renderer (spec 0.4, tier 2).
 *
 * Owns the page's single <h1> (see NOTES.md → heading policy). Composed purely
 * from tier-1 primitives; every value references a token. Fails loud on a
 * missing heading or a malformed cta.
 */
import { Container, Link, Section } from "@/components/primitives";
import type { BlockInstance } from "@/lib/content";
import { ContentError, requireString } from "@/lib/content";

interface Cta {
  label: string;
  href: string;
}

function parseCta(raw: unknown, source: string): Cta | undefined {
  if (raw == null) return undefined;
  if (typeof raw !== "object") {
    throw new ContentError(`"cta" must be an object in ${source}.`);
  }
  const o = raw as Record<string, unknown>;
  return {
    label: requireString(o.label, "cta.label", source),
    href: requireString(o.href, "cta.href", source),
  };
}

export function PageHero({
  block,
  source,
}: {
  block: BlockInstance;
  source: string;
}) {
  const heading = requireString(block.heading, "heading", source);
  const subheading =
    typeof block.subheading === "string" ? block.subheading : undefined;
  const cta = parseCta(block.cta, source);

  return (
    <Section spacing="lg">
      <Container>
        <h1 className="text-4xl font-[var(--font-weight-bold)] tracking-[var(--tracking-tight)] text-[var(--color-fg)] sm:text-5xl">
          {heading}
        </h1>
        {subheading && (
          <p className="mt-[var(--spacing-sm)] max-w-[var(--container-prose)] text-xl text-[var(--color-fg-muted)]">
            {subheading}
          </p>
        )}
        {cta && (
          <p className="mt-[var(--spacing-md)]">
            <Link href={cta.href} variant="primary">
              {cta.label}
            </Link>
          </p>
        )}
      </Container>
    </Section>
  );
}
