/**
 * rich_text_section — CMS schema fragment (spec 0.4).
 *
 * Pure data (no tsx imports) so the Node assembler can import it.
 *
 * Heading policy (NOTES.md): the markdown `buttons` list deliberately OMITS
 * "heading-one" — editors can style h2–h4 but cannot emit a second <h1> on a
 * live page. RichText still styles h1 for legacy content, just unreachable from
 * this toolbar. `buttons` is Decap-compatible config; confirm in a live /admin
 * that Sveltia hides the H1 control (build only serialises the YAML).
 */
import type { BlockSchema } from "../../../lib/cms/types.ts";

const schema: BlockSchema = {
  name: "rich_text_section",
  label: "Rich text section",
  summary: "Rich text",
  fields: [
    {
      name: "body",
      label: "Body",
      widget: "markdown",
      buttons: [
        "bold",
        "italic",
        "code",
        "link",
        "heading-two",
        "heading-three",
        "heading-four",
        "quote",
        "bulleted-list",
        "numbered-list",
      ],
    },
  ],
};

export default schema;
