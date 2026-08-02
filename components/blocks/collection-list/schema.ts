/**
 * collection_list — CMS schema fragment (spec 0.6).
 *
 * Pure data: NO React/tsx imports, so the Node-based config assembler can
 * import it directly. The collection options are derived from the registry, so
 * an editor can only ever pick a collection that actually exists.
 */
import type { BlockSchema } from "../../../lib/cms/types.ts";
import { COLLECTIONS } from "../../../lib/cms/collections.ts";

const schema: BlockSchema = {
  name: "collection_list",
  label: "Collection list",
  summary: "List — {{fields.collection}}",
  fields: [
    {
      name: "collection",
      label: "Collection",
      widget: "select",
      options: COLLECTIONS.map((c) => ({ label: c.label, value: c.name })),
      hint: "Which folder collection to list. Cards link to each item's page.",
    },
    { name: "heading", label: "Heading", widget: "string", required: false },
    { name: "intro", label: "Intro", widget: "text", required: false },
    {
      name: "featuredOnly",
      label: "Featured items only",
      widget: "boolean",
      required: false,
      default: false,
      hint: "Show only items ticked as Featured — lets one page list a curated subset while another lists everything.",
    },
    {
      name: "columns",
      label: "Columns",
      widget: "select",
      required: false,
      default: "3",
      options: [
        { label: "Two", value: "2" },
        { label: "Three", value: "3" },
        { label: "Four", value: "4" },
      ],
      hint: "Widest breakpoint only — always one column on mobile.",
    },
    {
      name: "limit",
      label: "Maximum items",
      widget: "number",
      required: false,
      value_type: "int",
      min: 1,
      hint: "Leave blank to show every item in the collection.",
    },
  ],
};

export default schema;
