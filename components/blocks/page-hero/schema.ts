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
    {
      name: "variant",
      label: "Layout",
      widget: "select",
      required: false,
      default: "stacked",
      options: [
        { label: "Stacked (left)", value: "stacked" },
        { label: "Centered", value: "centered" },
        { label: "Split with media", value: "split" },
      ],
    },
    { name: "heading", label: "Heading", widget: "string" },
    {
      name: "subheading",
      label: "Subheading",
      widget: "text",
      required: false,
    },
    {
      name: "image",
      label: "Media",
      widget: "image",
      required: false,
      hint: "Required for the Split layout; ignored otherwise.",
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
