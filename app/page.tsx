import { getSiteSettings, getPageBySlug } from "@/lib/content";
import { Container, Link, Section } from "@/components/primitives";

// SSG: content is read from disk at build. No runtime fetching (spec 0.1/0.2).
// Readers throw on missing content (spec 0.3), so page/site are always present —
// no `?.` or `?? "Untitled"` fallbacks.
export default async function HomePage() {
  const [site, page] = await Promise.all([
    getSiteSettings(),
    getPageBySlug(""),
  ]);

  return (
    <main>
      <Section spacing="lg">
        <Container>
          <p className="text-sm text-[var(--color-fg-muted)]">{site.name}</p>
          <h1 className="mt-[var(--spacing-2xs)] text-4xl font-[var(--font-weight-bold)] tracking-[var(--tracking-tight)]">
            {page.title}
          </h1>
          {page.description && (
            <p className="mt-[var(--spacing-sm)] text-lg text-[var(--color-fg-muted)]">
              {page.description}
            </p>
          )}

          <p className="mt-[var(--spacing-md)]">
            <Link href="/reference/" variant="primary">
              View the primitive reference →
            </Link>
          </p>

          {/* Blocks are declared in CMS frontmatter; renderers land in 0.4/0.5.
              Until then we surface the parsed block list to prove the reader works. */}
          <ul className="mt-[var(--spacing-lg)] flex flex-col gap-[var(--spacing-2xs)] text-[var(--color-fg-muted)]">
            {page.blocks.map((b, i) => (
              <li key={i} className="text-sm">
                block:{" "}
                <code className="font-[family-name:var(--font-mono)]">
                  {b.type}
                </code>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </main>
  );
}
