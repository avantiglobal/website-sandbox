/**
 * Base CMS config (spec 0.2) — site-level settings the assembler wraps around
 * the block fragments.
 *
 * Netlify is the OAuth provider: backend is plain `github` with NO base_url.
 * Netlify's own OAuth endpoint completes the GitHub handshake.
 *
 * Deliberately NOT present (deprecated / unsupported in Sveltia — spec 0.2):
 *   - name: git-gateway
 *   - Netlify Identity
 *   - local_backend / decap-server proxy
 *
 * `repo` is a placeholder; the clone procedure (step 4) sets it per project.
 */

export interface BaseConfig {
  backend: {
    name: "github";
    repo: string;
    branch: string;
  };
  media_folder: string;
  public_folder: string;
  /** Editorial workflow: commit straight to branch (simple default). */
  publish_mode?: "simple" | "editorial_workflow";
  collections: unknown[];
}

export const baseConfig: Omit<BaseConfig, "collections"> = {
  backend: {
    name: "github",
    repo: "avantiglobal/website-sandbox", // clone step 4 replaces this
    branch: "main",
  },
  media_folder: "public/uploads",
  public_folder: "/uploads",
  publish_mode: "simple",
};

/**
 * Navigation fields (spec 0.7) — shared by the header and footer menus.
 *
 * Nested exactly one level: a top-level entry may carry a `children` list, and
 * a child may not. Deeper menus are hostile on touch and the renderer would
 * have nowhere to put them. Keeping the ceiling in the schema means the CMS
 * simply never offers a third level.
 *
 * `href` is optional at the top level so an entry can act purely as a dropdown
 * label; the reader throws if an entry has neither a link nor children.
 */
const navChildFields = [
  { name: "label", label: "Label", widget: "string" },
  { name: "href", label: "Link", widget: "string" },
];

const navItemFields = [
  { name: "label", label: "Label", widget: "string" },
  {
    name: "href",
    label: "Link",
    widget: "string",
    required: false,
    hint: "Leave blank to make this a submenu label only.",
  },
  {
    name: "children",
    label: "Submenu",
    widget: "list",
    required: false,
    collapsed: true,
    fields: navChildFields,
    hint: "One level only — submenu entries cannot have their own submenu.",
  },
];

/**
 * Non-block collections (global site settings as a "file" collection).
 * Block-driven page bodies are added by the assembler.
 */
export const siteFileCollection = {
  name: "settings",
  label: "Site Settings",
  files: [
    {
      name: "site",
      label: "Global",
      file: "content/site.yml",
      fields: [
        { name: "name", label: "Site name", widget: "string" },
        { name: "tagline", label: "Tagline", widget: "string", required: false },
        {
          name: "nav",
          label: "Header navigation",
          widget: "list",
          label_singular: "Menu item",
          summary: "{{fields.label}}",
          fields: navItemFields,
        },
        {
          name: "footer",
          label: "Footer",
          widget: "object",
          required: false,
          fields: [
            { name: "text", label: "Footer text", widget: "string", required: false },
            {
              name: "links",
              label: "Footer navigation",
              widget: "list",
              required: false,
              label_singular: "Footer item",
              summary: "{{fields.label}}",
              fields: navItemFields,
              hint: "An entry with a submenu renders as a labelled column.",
            },
          ],
        },
      ],
    },
  ],
};
