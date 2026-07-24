---
name: brand-kit
description: Turn a client's brand into this template's design tokens (Phase 1 reskin). Use when reskinning the site for a client, creating/defining/rebuilding a Brand Kit, setting brand colours, typography, spacing, radius, shadow, motion or voice, or generating reference/moodboard images. Branches on whether a Brand Kit already exists, writes an approved brand/brand-kit.md, compiles it into styles/tokens.css, and previews on /reference.
---

# Brand Kit → Tokens

Turns a client brief into the **design-token layer** so the whole site reskins at
once. This is Phase 1 of the template: Phase 0 built the machine (tokens →
primitives → blocks → patterns, all token-referenced); this skill feeds it.

## Operating principles (do not violate)

1. **The human keeps the creative wheel.** AI *proposes*, the human *approves* at
   each gate. Never skip a gate to "save time".
2. **Single source of truth.** `brand/brand-kit.md` is the human-readable brand
   definition; `styles/tokens.css` is *compiled from it*. **Never hand-edit
   `tokens.css` directly** — change `brand-kit.md`, then recompile. That keeps the
   brand reviewable and reproducible.
3. **Brand lives in tokens only.** Do NOT touch component/block/pattern code to
   restyle — every component already references tokens. If a look needs something
   no token expresses, *add a token* and report it (never inline a literal).
4. **The a11y floor is non-negotiable** and survives reskinning: AA contrast,
   visible token focus ring, semantic HTML, correct heading hierarchy. Verify
   after every compile (Step 5).
5. **No native image generation.** Claude/Fable cannot create images — only read
   them. Reference-image *generation* always goes through an external provider
   (Step 2).

---

## Step 0 — Detect the Brand Kit state (ASK FIRST)

Before anything, ask the user this branching question and pick the path:

> **Does this project already have a Brand Kit?**
> - **(a) Yes — full kit** (defined colours, type, logo, guidelines) → **Ingest**
> - **(b) Partial** (e.g. logo + colours, but no full system) → **Complete**
> - **(c) No / from scratch** → **Generate**
> - **(d) Have one, want to rebuild/evolve it** → **Rebuild**

Use the AskUserQuestion tool. The path chosen changes how Step 3 is done (ingest
vs complete-the-gaps vs generate-from-references vs rebuild).

---

## Step 1 — Intake

Assets live in the project's `brand/` folder (create it if absent). Look for and
read whatever exists:

- `brand/discovery.*` — the discovery doc (goals, audience, personality, content,
  competitors). **Read it fully** — it drives every creative decision.
- `brand/logo.*` — the logo (and variants: on-light, on-dark, mark-only).
- `brand/colors.*` or colours stated in the discovery — hex values.
- `brand/references/` — reference / inspiration images.

If a required input for the chosen path is missing, **ask the user for it** — do
not invent brand values. Summarise what you found back to the user as a short
brief before proceeding.

---

## Step 2 — Reference images (pluggable, optional)

Only relevant when references are thin and the path is **Complete/Generate**.

- If `brand/references/` is empty, **ask whether to auto-generate** reference /
  moodboard images.
- If yes, **detect which image-generation MCP is connected** (e.g. Higgsfield,
  Magnific, or any other image MCP available in this session) and offer only
  those. **Claude writes the image prompts** from the discovery + emerging brand
  direction; the external provider generates the pixels. Save outputs into
  `brand/references/`.
- **If no image MCP is connected**, say so plainly and continue without generated
  references (work from the discovery + any supplied images). Do not block.
- Reminder for the user: neither Fable nor any Claude model generates images, and
  the Anthropic API has no image endpoint — generation is always external. The
  in-repo `Image` primitive/CDN is for *serving* images, not creating them.

---

## Step 3 — Derive the Brand Kit  → `brand/brand-kit.md`  (APPROVAL GATE)

Produce `brand/brand-kit.md` following `brand-kit-template.md` (read it). Per path:

- **Ingest** — transcribe the existing kit into the template structure; fill only
  genuine gaps, flag them.
- **Complete** — take the partial assets, derive the missing pieces (semantic
  colour ramp from the brand hue, type pairing, spacing/radius/shadow/motion
  personality, voice), each choice justified from the brief/references.
- **Generate** — propose **2–3 distinct directions** (each: palette + type +
  form-feel + one-line rationale) and have the user pick one before writing the
  full kit. This is the anti-slop lever — do not converge on one default look.
- **Rebuild** — start from the current kit, evolve it per the new brief.

**Then STOP and present `brand-kit.md` for approval.** The user edits/approves the
doc. Do not compile tokens until they approve — this is the creative-control gate.

---

## Step 4 — Compile `brand-kit.md` → `styles/tokens.css`

Follow `token-mapping.md` (read it) exactly. Rules:

- Edit **token values only**. Never rename, remove, or restructure token groups —
  components depend on the names. Keep every group present.
- Fill the neutral ramp, brand/accent/feedback colours, font families, and the
  personality knobs (radius, shadow, spacing density, motion, type scale,
  weights) from the kit. Semantic aliases (`--color-bg`, `--color-primary`, …)
  stay as aliases unless the kit demands a remap.
- If the kit needs something no token expresses, **add a token** (in the right
  group, with a comment) and **report it to the user** — never inline a literal.
- After editing, report: what changed, what you added, and any brand request you
  could NOT honour with tokens (and why).

---

## Step 5 — Preview, verify, iterate

1. `npm run build` (must pass; the fail-loud readers will catch broken content).
2. Open **`/reference`** — the showroom renders every primitive, block and pattern
   in the new brand at once. Open the home page too.
3. **Verify the a11y floor against the new palette:** AA contrast on text
   (body, muted, on-primary, on-accent, error), the focus ring is visible, links
   are distinguishable. Fix by adjusting `brand-kit.md` → recompile, not by
   patching components.
4. Iterate with the user against the reference bar ("does it read as $10k?").
   Every change goes through `brand-kit.md` → recompile.

When the brand reads right and a11y passes, Phase 1 (brand) is done — content
authoring and deploy (Fases C–F of the new-client procedure) follow.

## Notes

- If invoked in the template/sandbox itself (neutral demo), treat it as a dry run:
  you can produce a sample `brand-kit.md` but do not commit brand values over the
  neutral defaults — the sandbox must stay reskinnable.
- Record anything that fought you in `NOTES.md` so the next client build avoids it.
