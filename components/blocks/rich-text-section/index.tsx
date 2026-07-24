/**
 * rich_text_section — renderer (spec 0.4, tier 2).
 *
 * A prose band: RichText body at the prose/narrow measure. Fails loud on a
 * missing body. Body headings are h2–h4 by editor policy (see schema.ts), so
 * this never introduces a second page <h1>.
 */
import { Container, RichText, Section } from "@/components/primitives";
import type { BlockInstance } from "@/lib/content";
import { requireString } from "@/lib/content";

export function RichTextSection({
  block,
  source,
}: {
  block: BlockInstance;
  source: string;
}) {
  const body = requireString(block.body, "body", source);

  return (
    <Section>
      <Container size="narrow">
        <RichText>{body}</RichText>
      </Container>
    </Section>
  );
}
