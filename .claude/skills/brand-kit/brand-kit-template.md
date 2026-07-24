# Brand Kit template

This is the structure for `brand/brand-kit.md` — the human-readable single source
of truth that compiles into `styles/tokens.css` (see `token-mapping.md`). Fill
every section; where a value is inherited from the neutral default, say so
explicitly rather than leaving it blank. Keep it reviewable — a non-designer
should understand each choice and its one-line rationale.

Copy the structure below into `brand/brand-kit.md` and fill it in.

---

## 1. Essence

- **Client / project:** <name>
- **Personality:** 3–5 adjectives (e.g. "calm, precise, premium, human")
- **What it must feel like / must NOT feel like:** one line each
- **Voice & tone:** how copy sounds (e.g. "plain, confident, second person, no hype")

## 2. Colour

State real hex values. The compiler derives the ramps; you decide the anchors.

- **Brand / primary:** `#______` — the main action/identity colour. One line: why.
- **Accent (optional):** `#______` — secondary highlight. Omit → inherits neutral accent.
- **Neutral tone:** `warm` | `cool` | `pure` — the grey family's tint (affects
  backgrounds, text, borders). Warm = slightly brown/cream; cool = slightly blue;
  pure = true grey.
- **Base mode:** `light` (default) | `dark` — which is the site's default surface.
- **Feedback colours:** success / warning / danger — hex, or "keep defaults".
- **Intended semantics** (how the anchors map to roles): e.g. "primary = brand;
  page bg = near-white warm; body text = near-black; on-primary = white".
  Note any AA-contrast concern to check.

## 3. Typography

- **Display / heading family:** font name + fallback stack. Note if it's a system
  font, a self-hosted webfont, or needs licensing. (Webfonts must be self-hosted
  under the CSP — no external `@font-face` hosts.)
- **Body family:** font name + fallback stack.
- **Mono family:** font name + fallback stack (or "keep default").
- **Scale personality:** `tight` | `balanced` | `expressive` — how dramatic the
  jump from body to display is.
- **Weights used:** e.g. "body 400, emphasis 600, display 700". Note if the font
  lacks a weight the tokens assume.
- **Tracking/leading notes:** any display-type tightening the brand wants.

## 4. Form & feel

The non-colour, non-type personality — this is what makes two sites with the same
palette feel different.

- **Corner radius:** `sharp` (0) | `soft` (subtle) | `rounded` (friendly) |
  `pill`. One word sets the radius scale.
- **Elevation / shadow:** `flat` (borders, no shadow) | `subtle` | `elevated`.
- **Spacing density:** `tight` | `comfortable` | `airy` — the vertical rhythm and
  gutters.
- **Motion:** `none` | `snappy` | `smooth` — transition speed/easing personality.
- **Border weight:** `hairline` (default) | `thick` — default rule weight.

## 5. Imagery

- **Style direction:** photographic / illustrative / abstract / product; mood
  (e.g. "bright, human, candid" vs "moody, architectural").
- **Treatment:** any consistent crop, duotone, grain, corner-radius on media.
- **Default aspect ratios** used in layouts (maps to `--aspect-*`).

## 6. Reference images

- Paths under `brand/references/` (supplied and/or generated).
- One line per image on what it's establishing (palette / layout / mood / type).

## 7. Logo

- **Files:** `brand/logo.*` (and variants: on-light, on-dark, mark-only).
- **Clear space & min size:** if specified.
- **On which surfaces** each variant is used.

## 8. Open questions / risks

- Anything unresolved (missing licence, a colour that may fail AA, a font weight
  the design assumes but the file lacks). Surface these — don't bury them.
