/**
 * page_hero — renderer (spec 0.4 block, 0.5 structural variants).
 *
 * Owns the page's single <h1> (see NOTES.md → heading policy). The `variant`
 * field selects a tier-3 pattern for arrangement; the content contract is the
 * same across variants. Composed purely from tier-1 primitives + tier-3
 * patterns. Fails loud on a missing heading, a malformed cta, an unknown
 * variant, or a "split" with no media.
 */
import { Container, Image, Link, Section } from "@/components/primitives";
import { Center, Split } from "@/components/patterns";
import type { BlockInstance } from "@/lib/content";
import { ContentError, requireString } from "@/lib/content";

const VARIANTS = ["stacked", "centered", "split"] as const;
type HeroVariant = (typeof VARIANTS)[number];

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

function parseVariant(raw: unknown, source: string): HeroVariant {
  const value = raw == null ? "stacked" : raw;
  if (!VARIANTS.includes(value as HeroVariant)) {
    throw new ContentError(
      `Unknown page_hero variant "${String(value)}" in ${source}. ` +
        `Known: ${VARIANTS.join(", ")}.`,
    );
  }
  return value as HeroVariant;
}

export function PageHero({
  block,
  source,
}: {
  block: BlockInstance;
  source: string;
}) {
  const variant = parseVariant(block.variant, source);
  const heading = requireString(block.heading, "heading", source);
  const subheading =
    typeof block.subheading === "string" ? block.subheading : undefined;
  const cta = parseCta(block.cta, source);

  const content = (
    <>
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
    </>
  );

  return (
    <Section spacing="lg">
      <Container>{renderVariant(variant, content, block, source)}</Container>
    </Section>
  );
}

function renderVariant(
  variant: HeroVariant,
  content: React.ReactNode,
  block: BlockInstance,
  source: string,
) {
  if (variant === "centered") {
    return <Center>{content}</Center>;
  }
  if (variant === "split") {
    // Split requires media — fail loud rather than render a lopsided hero.
    const image = requireString(block.image, "image", source);
    return (
      <Split
        media={
          <Image
            src={image}
            alt=""
            aspect="photo"
            rounded="lg"
            wrapperClassName="bg-[var(--color-surface)]"
            sizes="(min-width: 48rem) 50vw, 100vw"
          />
        }
      >
        {content}
      </Split>
    );
  }
  // "stacked" (default): left-aligned flow, no pattern wrapper.
  return content;
}
