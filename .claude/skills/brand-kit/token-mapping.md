# Brand Kit → `styles/tokens.css` mapping

How each `brand-kit.md` decision compiles into token values. **Edit values only;
never rename/remove groups.** Token groups referenced here are the ones defined in
`styles/tokens.css` (Phase 0). After editing, run `npm run build` and check
`/reference`.

## Golden rules

- **Primitives carry brand; semantic aliases stay aliases.** Set the *primitive*
  ramps (`--color-neutral-*`, `--color-brand-*`, `--color-accent-*`) and the
  *primitive* scales (radius, spacing, text). The semantic layer
  (`--color-bg`, `--color-primary`, `--radius-md` usage, …) mostly keeps its
  `var(--…)` references and inherits the new primitives automatically. Only remap
  a semantic alias when the brief explicitly needs it (e.g. dark base mode).
- **Never inline a literal in a component.** If the brand needs a value no token
  expresses, add a token in the correct group with a comment, then reference it.

---

## Colour

### Brand / primary → `--color-brand-500 / -600 / -700`
Anchor is `--color-brand-600` (that's what `--color-primary` aliases). From the
brand hex:
- `--color-brand-600` = the brand hex (the resting primary).
- `--color-brand-500` = a lighter step (~10–15% lighter / higher L) — used for the
  focus-ring colour (`--color-focus-ring`).
- `--color-brand-700` = a darker step (~10–15% darker) — the hover/pressed primary
  (`--color-primary-hover`).
Keep the three perceptually even. Verify `--color-primary-fg` (text on primary)
clears **AA (4.5:1)** against `--color-brand-600` — usually `--color-neutral-0`
(white); if the brand hue is light, set `--color-primary-fg` to a dark neutral.

### Accent → `--color-accent-500`
Set to the accent hex. Ensure `--color-accent-fg` clears AA on it.

### Neutral tone → `--color-neutral-0 … -950`
The ramp drives backgrounds, surfaces, text and borders, so its tint sets the
whole mood.
- **pure:** true greys (default file values).
- **warm:** nudge hue toward ~30–50° and add a touch of saturation at the light end
  (cream `#faf9f7`-ish at `-50`) through to a warm near-black at `-950`.
- **cool:** nudge toward ~220° (bluish greys).
Keep 0 = lightest (near-white), 950 = darkest (near-black), monotonic L across the
ramp. The semantic aliases pull from here: `--color-bg`=`neutral-0`,
`--color-surface`=`neutral-50`, `--color-fg`=`neutral-900`,
`--color-fg-muted`=`neutral-500`, `--color-fg-subtle`=`neutral-400`,
`--color-border`=`neutral-200`. **Re-check AA after tinting** —
`fg-muted` on `bg` must stay ≥ 4.5:1 (see the Phase 0 contrast notes; `fg-subtle`
is for placeholders only, not body text).

### Base mode = dark
Only if the brief asks. Remap the semantic aliases (not the ramp): `--color-bg` →
a dark neutral, `--color-fg` → a light neutral, `--color-surface(-raised)` a step
lighter than bg, `--color-border` a mid neutral. Re-verify every contrast pair.

### Feedback → `--color-success-500 / --color-warning-500 / --color-danger-500`
Set if the brief gives them; else keep defaults. Keep `--color-danger-fg` /
`--color-danger-surface` consistent with any new danger hue.

---

## Typography

### Families → `--font-sans` (body) / `--font-display` (headings) / `--font-mono`
- **Body** → `--font-sans`. Put the brand body family first, keep a full fallback
  stack.
- **Headings / display** → `--font-display`. All `h1–h6` (including RichText
  headings) reference this via globals.css, so **serif display + sans body** works
  purely through tokens: set `--font-display` to the display face, leave
  `--font-sans` as the body face. `--font-display` defaults to `var(--font-sans)`,
  so a brand with one family just leaves it alone. (`--font-serif` still exists as
  a generic serif slot if you need a third family, e.g. for quotes.)
- **Self-host webfonts** — add `@font-face` in `app/globals.css` pointing at files
  under `public/`, `font-src 'self'`. **No external font host** (the CSP blocks it;
  that's why Sveltia's Google Fonts needed a scoped CSP widen — see NOTES.md).

### Scale personality → `--text-xs … --text-5xl`
- **balanced:** keep defaults.
- **expressive:** increase the top end (`--text-4xl`, `--text-5xl`) and tighten
  their paired `--text-*--line-height` for a bigger display jump.
- **tight:** compress the top end toward the body size.
Keep each `--text-*--line-height` sensible (display tighter, body ~1.5–1.6).

### Weights → `--font-weight-*`
Usually keep. If the brand font lacks a weight the tokens assume (e.g. no 700),
remap the semantic use (headings) to an available weight and note it.

### Tracking / leading → `--tracking-*` / `--leading-*`
Adjust only if the brief calls for tighter display type; leave the scales intact.

---

## Form & feel

### Corner radius → `--radius-sm … --radius-xl` (and `--radius-full`)
One knob rescales the whole family:
- **sharp:** all near 0 (`--radius-sm: 0; --radius-md: 0; …`) — keep `--radius-full`.
- **soft:** defaults.
- **rounded:** bump each step up (~1.5×).
- **pill:** small elements lean on `--radius-full`; keep the numbered scale soft.

### Elevation → `--shadow-xs … --shadow-lg`
- **flat:** near-zero shadows; rely on `--color-border`. Keep `--shadow-focus`.
- **subtle:** defaults.
- **elevated:** deepen blur/spread/alpha on `-md`/`-lg`.

### Spacing density → `--spacing-*` scale
`--spacing` (base) + named steps `--spacing-3xs … -3xl` drive rhythm and gutters.
- **comfortable:** defaults.
- **tight:** scale the named steps down ~0.85×.
- **airy:** scale up ~1.15× (esp. `-lg`/`-xl`/`-2xl`/`-3xl`, which Section spacing
  uses). Keep the progression monotonic.

### Motion → `--duration-*` / `--ease-*`
- **snappy:** shorten durations (`--duration-fast` ~120ms), crisper easing.
- **smooth:** defaults / slightly longer.
- **none:** set durations near 0 (respect the existing reduced-motion block; don't
  remove it).

### Border weight → `--border-width-*`
Default rule weight is `--border-width-hairline` (1px). If the brand wants heavier
default rules, components reference the token — adjust the token, not components.

---

## Leave alone unless the brief demands otherwise

`--container-*` (measure), `--breakpoint-*` (responsive), `--z-*` (layering),
`--aspect-*` (media ratios — set only if the imagery direction specifies),
`--focus-ring-width/offset/style` (the *colour* follows the brand via
`--color-focus-ring`; keep width/offset for the a11y floor), `--opacity-*`.

## After compiling — always

1. `npm run build` passes.
2. `/reference` + home render in the new brand.
3. **Text contrast (WCAG 1.4.3, 4.5:1):** body text, muted text (`fg-muted` on
   `bg`/`surface`/`surface-raised`), on-primary, on-accent, error text, links.
   `fg-subtle` is placeholder-only (exempt), not body text.
4. **Non-text / UI contrast (WCAG 1.4.11, 3:1):** `--color-border-strong` on `bg`
   must clear 3:1 — it's the visible boundary of inputs and secondary buttons. If
   the neutral tint lightened it below 3:1, darken the ramp step it aliases (it
   points at `--color-neutral-400`) until it passes. Also check the focus ring is
   visible against every surface.
5. Fix any failure via `brand-kit.md` → recompile — never by patching components.
