/**
 * page_hero — CMS schema fragment (spec 0.4).
 *
 * Pure data: NO React/tsx imports, so the Node-based config assembler
 * (scripts/build-cms-config.mts, type-stripping) can import it directly. The
 * relative type import is erased at runtime and only guides the editor.
 */
import type { BlockSchema } from "../../../lib/cms/types.ts";

const schema: BlockSchema = {
  name: "page_hero",
  label: "Page hero",
  summary: "Hero — {{fields.heading}}",
  fields: [
    { name: "heading", label: "Heading", widget: "string" },
    {
      name: "subheading",
      label: "Subheading",
      widget: "text",
      required: false,
    },
    {
      name: "cta",
      label: "Call to action",
      widget: "object",
      required: false,
      fields: [
        { name: "label", label: "Label", widget: "string" },
        { name: "href", label: "Link", widget: "string" },
      ],
    },
  ],
};

export default schema;
