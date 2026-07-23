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
    repo: "OWNER/REPO", // clone step 4 replaces this
    branch: "main",
  },
  media_folder: "public/uploads",
  public_folder: "/uploads",
  publish_mode: "simple",
};

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
          label: "Navigation",
          widget: "list",
          fields: [
            { name: "label", widget: "string" },
            { name: "href", widget: "string" },
          ],
        },
        {
          name: "footer",
          label: "Footer",
          widget: "object",
          required: false,
          fields: [
            { name: "text", widget: "string", required: false },
            {
              name: "links",
              widget: "list",
              required: false,
              fields: [
                { name: "label", widget: "string" },
                { name: "href", widget: "string" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
