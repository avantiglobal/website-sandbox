# Build Notes → Skill File

Running log of things that fought us during the template build. These become rules
in `.claude/skills/` so the next build avoids them. Newest section at the bottom.

## Versioning / dependencies

- **Never guess a version.** Run `npm view <pkg> version` for every pinned dep before
  writing it into `package.json`. `@types/*` packages do **not** track their runtime
  package's version — e.g. React 19.2.8 pairs with `@types/react@19.2.17` and
  `@types/react-dom@19.2.3`. Guessing `@types/react-dom@19.2.8` failed with ETARGET.
- **`typescript@latest` is now the Go compiler (7.x).** Untrodden with Next 16's bundled
  types. Pin the battle-tested `typescript@5.9.3` instead until 7.x is proven.

## Next 16 behaviour

- **Next 16 rewrites `tsconfig.json` on first build.** Sets `jsx: "preserve"` →
  `"react-jsx"` and adds `.next/dev/types/**` to `include`. Expected — do NOT revert.
- Build runs on **Turbopack** by default in 16.

## npm audit

- **Never run `npm audit fix --force`.** It proposed `next@9.3.3` — a 7-major
  catastrophic downgrade — to "fix" transitive build-time advisories. Assess transitive
  build-time advisories by hand.
- **`--omit=optional` is NOT a way to drop one optional dep.** It strips ALL optionals,
  including the native `lightningcss` and `@next/swc-*` binaries the build needs
  (`Cannot find module '../lightningcss.darwin-arm64.node'`). No npm-native surgical
  single-package omit exists.
- **sharp**: it's an *optional* (not hard) dep of Next; the build succeeds without it,
  and under route (a) it never executes (image optimisation goes to Netlify Image CDN).
  Since it can't be cleanly omitted, pin it to the patched latest via
  `overrides: { "sharp": "0.35.3" }` to clear the libvips CVE advisories. Re-audit and
  drop the pin once Next's own sharp floor moves past it.
- Remaining postcss advisories live under `node_modules/next/node_modules/postcss`
  (Next-internal, build-time-only, not in static output). Clears when Next bumps.

## Tokens

- Token groups that get hardcoded during 0.3 if they don't exist first, so define them
  up front: focus ring (width/offset/colour/style), standalone line-height + tracking
  scales (display type), font weights, opacity (disabled/overlay/scrim), aspect ratios
  (media blocks). The per-font-size line-heights are not enough on their own.

## Sveltia CMS (0.2)

- **Self-host the bundle; do NOT load from a CDN.** A CDN `<script>` violates
  `script-src 'self'`. Vendor `node_modules/@sveltia/cms/dist/sveltia-cms.js` into
  `public/admin/` at build (the config assembler does this).
- **`dist/sveltia-cms.js` is an IIFE bundle, not an ES module.** Load it as a plain
  `<script src="./sveltia-cms.js">` — a `type="module"` attribute makes Sveltia warn.
  (The `.mjs` sibling is the ESM build, for the JS API — not what admin/index.html wants.)
- **Sveltia boots fine under a tight CSP.** Verified locally with the exact netlify.toml
  headers: `script-src 'self'`, no `unsafe-inline`/`unsafe-eval` in script-src. Login
  screen rendered, config.yml parsed, ZERO CSP violations. Only benign console output is
  an optional "validate your config against the JSON schema" info message.
- **The `.mts` assembler triggers a Node "Reparsing as ES module" perf warning.** Cosmetic;
  silence only by adding `"type": "module"` to package.json (which has other knock-on
  effects on .js config files — not worth it).
- **config.yml must NOT contain** `base_url`, `git-gateway`, `local_backend`, or any
  Netlify Identity widget. Backend is plain `github` + repo + branch; Netlify's OAuth
  provider completes the handshake.
- **What localhost CANNOT prove (per spec):** the actual acceptance test is a commit from
  `/admin` on the DEPLOYED Netlify URL. Local uses the File System Access API
  ("Work with Local Repository") and never exercises OAuth. The GitHub-login popup goes to
  `https://api.netlify.com/auth` and needs a real site + registered OAuth app.
- **CSP directive most likely to need widening on the live test:** `connect-src`. Currently
  `'self' https://api.github.com https://api.netlify.com`. The OAuth popup is a top-level
  nav (not governed by connect-src), but post-login GitHub API calls need api.github.com
  (present). Watch for GraphQL/raw.githubusercontent or avatar hosts on first live login.

## Content readers: fail loud, never fall back (0.3)

- **A content reader MUST throw at build time when a required entry is missing or
  a slug fails to resolve.** Never return a placeholder, an empty default, or
  `null`-as-"maybe" for a value a page then papers over with `?? "Untitled"`. The
  build is the only place we can catch a broken/renamed content file; a silent
  fallback ships a page with wrong or empty content and no error. Under
  `output: 'export'` a thrown error fails `next build`, which is exactly what we
  want — a red build, not a quietly wrong page.
- Applies to the readers that already existed, not just new ones: `getSiteSettings`
  validates required `name`/`nav`; `getAllPages` requires each page's `title`;
  `getPageBySlug` throws when the slug does not resolve (build slugs come from
  `generateStaticParams`, so a miss is a bug, never a 404 — visitors hitting an
  unknown URL get Netlify's static 404 and never reach the reader).
- The error message must name the offending source file (`_sourcePath`) and the
  missing field, so a failed build points straight at the content to fix.
- Legitimately-optional fields (e.g. page `description`, `footer`) stay optional —
  "required" means required. Don't turn every field into a throw; turn the ones a
  page cannot correctly render without into throws.

## Heading policy — one h1 per page (0.3, enforced in 0.4)

- **A page must have exactly one h1** (its title). Body/rich-text content must not
  emit its own h1 or the page ends up with two — an a11y/SEO smell. On `/reference`
  the RichText sample was demoted to start at h2 for this reason.
- **`RichText` keeps h1 styled** so legacy content that already contains an h1 still
  renders correctly — we style it, we just don't want editors producing new ones.
- **Implemented in 0.4** on the `rich_text_section` block: the markdown widget's
  `buttons` list enumerates `heading-two`/`heading-three`/`heading-four` and OMITS
  `heading-one` (see `components/blocks/rich-text-section/schema.ts`). h1 stays
  styled-but-unreachable from the toolbar. **Still to verify on a live `/admin`:**
  that Sveltia honours the Decap-style `buttons` list and actually hides the H1
  control — the build only serialises the YAML, it can't prove the editor UI.
- **The page's single h1 now comes from the `page_hero` block**, not the page shell.
  `app/page.tsx` no longer renders `page.title` as a visible h1 (title feeds
  `generateMetadata`/`<title>` only). Consequence: a page whose first block is NOT a
  hero will have no h1 — model pages so a hero (or another h1-owning block) leads.

## Tier-2 blocks (0.4)

- **A block is a folder** `components/blocks/<name>/` with `schema.ts` (CMS fields)
  + `index.tsx` (renderer). The assembler auto-discovers any `<name>/schema.ts` and
  folds it into the page `blocks` list widget — no registration step in the config.
- **`schema.ts` MUST stay React-free.** The Node config assembler imports it directly
  under type-stripping; a value import of anything tsx/React would break `prebuild`.
  Keep it a pure default-exported object; import the `BlockSchema` *type* via a
  relative `../../../lib/cms/types.ts` path (type-only, erased at runtime — matches
  the assembler's own convention). The blocks barrel deliberately does NOT re-export
  the schemas, to keep that React-free boundary intact.
- **The runtime discriminator lives in TWO places that must agree:** the block
  folder's `schema.name`, and the key in `components/blocks/registry.tsx`. Both must
  equal the `type` written into page frontmatter. `BlockRenderer` throws (fail-loud)
  on an unknown `type`; each block throws on its own missing required fields — both
  verified by building with a bad `home.md`.

## RichText images → Netlify Image CDN (0.3)

- **Markdown `![]()` is rewritten to a native `<img>`, NOT `next/image`.** next/image
  can't run inside react-markdown, so the `img` component override builds the
  `src`/`srcset` by hand via `lib/netlify-image.ts` (same URL builder the Image
  primitive's loader uses → `/.netlify/images?url=…&w=…&q=…`). Adds `loading="lazy"`
  and `decoding="async"`. Raw HTML stays disabled (no rehype-raw), so this override
  is the only image path out of RichText.
- **Intrinsic width/height are NOT emitted yet — deferred, dimensions can follow.**
  Reading them means parsing image headers at build time in the content layer, and
  there is **no image-size lib installed** (and `sharp` isn't resolvable — it's an
  unused optional dep, see the sharp note above). So the choices are: add a small
  build-time dep (`image-size`) or hand-roll a PNG/JPEG/GIF/WebP header parser. Until
  then, body images can cause layout shift. When adding: resolve dims for
  root-relative srcs (`public/…`) only; skip/omit for remote srcs; do NOT hard-fail
  the build on a missing inline image (inline media isn't a "required entry" under
  the fail-loud rule).
- **Remote markdown images** would additionally need `[images] remote_images` allow-
  listing in `netlify.toml`; local (`/media/…`) images work with no extra config.
- **Test fixture:** `public/media/sample-landscape.png` (1600×900) is a real in-repo
  image so the deployed CDN has something to actually transform. Clear/replace per
  project along with the rest of `content/` + demo assets.

## Netlify OAuth app click-path (verified against current docs)

GitHub side:
1. github.com/settings/developers → **OAuth Apps** → **Register a new application**
2. **Authorization callback URL** = `https://api.netlify.com/auth/done` (exact)
3. Save → copy **Client ID**, generate + copy **Client Secret** (shown once)

Netlify side:
4. Site → **Project configuration** → **Access & security** → **OAuth**
5. Under **Authentication Providers** → **Install Provider** → choose **GitHub**
6. Paste **Client ID** + **Client Secret** → **Save**

(Netlify has renamed this pane across versions — "Project configuration → Access & security
→ OAuth" is current as of this build. Re-verify per site.)
