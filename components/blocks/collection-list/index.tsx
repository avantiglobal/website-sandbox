/**
 * collection_list — renderer (spec 0.6).
 *
 * The listing half of the listing/detail pair: enumerates a folder collection
 * and links each card to the item's own page. An async server component — it
 * reads content at build, like the routes do. No runtime fetching.
 *
 * Never emits an <h1> (the page hero owns it — see NOTES.md → heading policy);
 * the optional block heading is an <h2> and card titles are <h3>.
 *
 * Fails loud (spec 0.3) on an unregistered collection or a malformed limit.
 * An EMPTY collection is not a failure: an editor who has not added items yet
 * gets a quiet, valid page rather than a broken build.
 */
import { Container, Grid, Image, Link, Section } from "@/components/primitives";
import type { BlockInstance, CollectionItem } from "@/lib/content";
import {
  ContentError,
  collectionItemRoute,
  getCollectionItems,
  requireCollection,
  requireString,
} from "@/lib/content";

const COLUMNS = ["2", "3", "4"] as const;
type ColumnChoice = (typeof COLUMNS)[number];

function parseColumns(raw: unknown, source: string): 2 | 3 | 4 {
  const value = raw == null ? "3" : String(raw);
  if (!COLUMNS.includes(value as ColumnChoice)) {
    throw new ContentError(
      `Unknown collection_list columns "${value}" in ${source}. ` +
        `Known: ${COLUMNS.join(", ")}.`,
    );
  }
  return Number(value) as 2 | 3 | 4;
}

function parseLimit(raw: unknown, source: string): number | undefined {
  if (raw == null || raw === "") return undefined;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) {
    throw new ContentError(
      `"limit" must be a positive whole number in ${source} (got ${String(raw)}).`,
    );
  }
  return n;
}

export async function CollectionList({
  block,
  source,
}: {
  block: BlockInstance;
  source: string;
}) {
  const name = requireString(block.collection, "collection", source);
  requireCollection(name); // fail loud before touching the filesystem
  const columns = parseColumns(block.columns, source);
  const limit = parseLimit(block.limit, source);

  const heading =
    typeof block.heading === "string" ? block.heading : undefined;
  const intro = typeof block.intro === "string" ? block.intro : undefined;

  const featuredOnly = block.featuredOnly === true;
  const all = await getCollectionItems(name);
  // Filter before limiting: "3 featured" must mean three featured items, not
  // "the first three items, of which some happen to be featured".
  const selected = featuredOnly ? all.filter((i) => i.featured) : all;
  const items = limit ? selected.slice(0, limit) : selected;

  return (
    <Section spacing="lg">
      <Container>
        {heading && (
          <h2 className="text-3xl font-[var(--font-weight-bold)] tracking-[var(--tracking-tight)] text-[var(--color-fg)]">
            {heading}
          </h2>
        )}
        {intro && (
          <p className="mt-[var(--spacing-sm)] max-w-[var(--container-prose)] text-lg text-[var(--color-fg-muted)]">
            {intro}
          </p>
        )}
        {items.length > 0 && (
          <Grid
            cols={columns}
            gap="md"
            className={heading || intro ? "mt-[var(--spacing-lg)]" : undefined}
          >
            {items.map((item) => (
              <Card key={item.slug} item={item} />
            ))}
          </Grid>
        )}
      </Container>
    </Section>
  );
}

function Card({ item }: { item: CollectionItem }) {
  const blurb = item.excerpt ?? item.description;
  return (
    <article>
      {item.image && (
        <Image
          src={item.image}
          alt=""
          aspect="photo"
          rounded="lg"
          wrapperClassName="bg-[var(--color-surface)]"
          sizes="(min-width: 48rem) 33vw, 100vw"
        />
      )}
      <h3
        className={
          "text-xl font-[var(--font-weight-bold)] text-[var(--color-fg)]" +
          (item.image ? " mt-[var(--spacing-sm)]" : "")
        }
      >
        {/* The whole card title is the link target — one clear affordance per card. */}
        <Link href={`/${collectionItemRoute(item)}/`}>{item.title}</Link>
      </h3>
      {blurb && (
        <p className="mt-[var(--spacing-xs)] text-[var(--color-fg-muted)]">
          {blurb}
        </p>
      )}
    </article>
  );
}
