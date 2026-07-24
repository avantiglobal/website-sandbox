import type { Metadata } from "next";
import {
  Button,
  Checkbox,
  Container,
  Field,
  Grid,
  Image,
  Input,
  Link,
  RadioGroup,
  RichText,
  Section,
  Select,
  Textarea,
  type ButtonVariant,
  type ControlSize,
} from "@/components/primitives";
import { Center, Split } from "@/components/patterns";

export const metadata: Metadata = {
  title: "Primitive reference",
  description:
    "Every tier-1 primitive composed with its states — a living visual reference.",
};

/* Markdown that exercises EVERY element the CMS editor can emit, so RichText's
   styling coverage is visible at a glance (spec 0.3). */
const RICHTEXT_SAMPLE = `## Heading level 2

Intro paragraph with **bold**, _italic_, ~~strikethrough~~, \`inline code\`,
and a [text link](https://example.com).

### Heading level 3
#### Heading level 4
##### Heading level 5
###### Heading level 6

Unordered list:

- First item
- Second item with a nested list
  - Nested one
  - Nested two
- Third item

Ordered list:

1. Step one
2. Step two
3. Step three

Task list (GFM):

- [x] Done
- [ ] Not done

> A blockquote. The editor can emit these and they must look intentional,
> not like an accident.

A fenced code block:

\`\`\`ts
function greet(name: string): string {
  return \`Hello, \${name}\`;
}
\`\`\`

A table (GFM):

| Primitive | Tier | Ships JS? |
| --------- | ---- | --------- |
| Container | 1    | No        |
| Input     | 1    | Yes       |
| RichText  | 1    | No        |

![Sample image alt text](/media/sample-landscape.png)

---

Final paragraph after a horizontal rule.
`;

const BUTTON_VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "ghost",
  "danger",
];
const SIZES: ControlSize[] = ["sm", "md", "lg"];

/** Small labelled wrapper to title each demo group without extra primitives. */
function Demo({
  title,
  children,
  note,
}: {
  title: string;
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-[var(--spacing-sm)]">
      <h3 className="text-xl font-[var(--font-weight-semibold)] tracking-[var(--tracking-tight)]">
        {title}
      </h3>
      {note && (
        <p className="max-w-[var(--container-prose)] text-sm text-[var(--color-fg-muted)]">
          {note}
        </p>
      )}
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-[var(--font-weight-bold)] tracking-[var(--tracking-tight)]">
      {children}
    </h2>
  );
}

/** Neutral cell for layout demos (Grid/Container). */
function Cell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-sm text-[var(--color-fg-muted)]">
      {children}
    </div>
  );
}

export default function ReferencePage() {
  return (
    <main>
      {/* ---- Page header ---- */}
      <Section spacing="lg" surface="surface">
        <Container>
          <p className="text-sm font-[var(--font-weight-medium)] tracking-[var(--tracking-wide)] text-[var(--color-fg-muted)] uppercase">
            Spec 0.3 · Tier 1
          </p>
          <h1 className="mt-[var(--spacing-2xs)] text-4xl font-[var(--font-weight-bold)] tracking-[var(--tracking-tight)]">
            Primitive reference
          </h1>
          <p className="mt-[var(--spacing-sm)] max-w-[var(--container-prose)] text-lg text-[var(--color-fg-muted)]">
            Every tier-1 primitive composed with its states. Mechanics only —
            zero visual identity beyond the neutral default token palette. Tab
            through the interactive elements to see the token focus ring.
          </p>
        </Container>
      </Section>

      {/* ---- Container ---- */}
      <Section>
        <Container>
          <SectionHeading>Container</SectionHeading>
          <div className="mt-[var(--spacing-md)] flex flex-col gap-[var(--spacing-sm)]">
            {(["prose", "narrow", "base", "wide"] as const).map((size) => (
              <Container key={size} size={size} gutter={false}>
                <Cell>
                  size=&quot;{size}&quot; — capped at the --container-{size} token
                </Cell>
              </Container>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---- Section ---- */}
      <Section surface="raised">
        <Container>
          <SectionHeading>Section</SectionHeading>
          <p className="mt-[var(--spacing-sm)] max-w-[var(--container-prose)] text-[var(--color-fg-muted)]">
            This band itself is a <code className="font-mono">Section</code> with{" "}
            <code className="font-mono">surface=&quot;raised&quot;</code>. Sections
            own vertical rhythm (spacing tokens) and optional surface colour.
          </p>
        </Container>
      </Section>

      {/* ---- Grid ---- */}
      <Section>
        <Container>
          <SectionHeading>Grid</SectionHeading>
          <div className="mt-[var(--spacing-md)] flex flex-col gap-[var(--spacing-lg)]">
            {([2, 3, 4] as const).map((cols) => (
              <Demo key={cols} title={`cols=${cols} (single column on mobile)`}>
                <Grid cols={cols} gap="md">
                  {Array.from({ length: cols * 2 }, (_, i) => (
                    <Cell key={i}>Cell {i + 1}</Cell>
                  ))}
                </Grid>
              </Demo>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---- Button ---- */}
      <Section surface="surface">
        <Container>
          <SectionHeading>Button</SectionHeading>
          <div className="mt-[var(--spacing-md)] flex flex-col gap-[var(--spacing-lg)]">
            {BUTTON_VARIANTS.map((variant) => (
              <Demo key={variant} title={`variant=${variant}`}>
                <div className="flex flex-wrap items-center gap-[var(--spacing-sm)]">
                  {SIZES.map((size) => (
                    <Button key={size} variant={variant} size={size}>
                      {size.toUpperCase()} button
                    </Button>
                  ))}
                  <Button variant={variant} disabled>
                    Disabled
                  </Button>
                </div>
              </Demo>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---- Link ---- */}
      <Section>
        <Container size="prose">
          <SectionHeading>Link</SectionHeading>
          <div className="mt-[var(--spacing-md)] flex flex-col gap-[var(--spacing-lg)]">
            <Demo title="Inline (prose) links">
              <p className="text-[var(--color-fg)]">
                A paragraph with an{" "}
                <Link href="#link">inline link</Link>, a{" "}
                <Link href="#link" disabled>
                  disabled link
                </Link>
                , and text after it.
              </p>
            </Demo>
            <Demo title="Link dressed as a button (CTA that navigates)">
              <div className="flex flex-wrap items-center gap-[var(--spacing-sm)]">
                <Link href="#cta" variant="primary">
                  Primary link
                </Link>
                <Link href="#cta" variant="secondary">
                  Secondary link
                </Link>
                <Link href="#cta" variant="ghost">
                  Ghost link
                </Link>
                <Link href="#cta" variant="secondary" disabled>
                  Disabled
                </Link>
              </div>
            </Demo>
          </div>
        </Container>
      </Section>

      {/* ---- Image ---- */}
      <Section surface="surface">
        <Container>
          <SectionHeading>Image</SectionHeading>
          <p className="mt-[var(--spacing-sm)] max-w-[var(--container-prose)] text-[var(--color-fg-muted)]">
            Routes through the Netlify Image CDN loader (route a). The bytes 404
            locally because <code className="font-mono">/.netlify/images</code>{" "}
            only exists on deploy — the aspect-ratio box, rounding and{" "}
            <code className="font-mono">alt</code> are what&apos;s verifiable here.
          </p>
          <div className="mt-[var(--spacing-md)]">
            <Grid cols={3} gap="md">
              {(["square", "video", "portrait"] as const).map((aspect) => (
                <div key={aspect} className="flex flex-col gap-[var(--spacing-2xs)]">
                  <Image
                    src="/media/sample-landscape.png"
                    alt={`Sample image, ${aspect} crop`}
                    aspect={aspect}
                    rounded="md"
                    wrapperClassName="bg-[var(--color-surface-raised)]"
                    sizes="(min-width: 48rem) 33vw, 100vw"
                  />
                  <span className="text-sm text-[var(--color-fg-muted)]">
                    aspect=&quot;{aspect}&quot;
                  </span>
                </div>
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      {/* ---- RichText ---- */}
      <Section>
        <Container size="narrow">
          <SectionHeading>RichText</SectionHeading>
          <p className="mt-[var(--spacing-sm)] mb-[var(--spacing-lg)] max-w-[var(--container-prose)] text-[var(--color-fg-muted)]">
            Rendered from markdown that uses every emittable element. The sample
            starts at h2 so this page keeps a single h1; RichText still styles h1
            for legacy content, but 0.4 will stop editors emitting one (see
            NOTES.md).
          </p>
          <RichText>{RICHTEXT_SAMPLE}</RichText>
        </Container>
      </Section>

      {/* ---- Form controls ---- */}
      <Section surface="surface">
        <Container size="narrow">
          <SectionHeading>Form controls</SectionHeading>
          <form
            className="mt-[var(--spacing-md)] flex flex-col gap-[var(--spacing-lg)]"
            /* Demo only — no real submission target. */
            action="#"
          >
            <Field label="Text input" description="Default state, with helper text.">
              <Input name="text-default" placeholder="you@example.com" type="email" />
            </Field>

            <Field
              label="Required input"
              description="The asterisk is decorative; required is on the control."
              required
            >
              <Input name="text-required" placeholder="Required" />
            </Field>

            <Field
              label="Invalid input"
              error="This field has an error and is announced to assistive tech."
            >
              <Input name="text-invalid" defaultValue="not-an-email" />
            </Field>

            <Field label="Disabled input" disabled>
              <Input name="text-disabled" defaultValue="Can't touch this" />
            </Field>

            <Field label="Textarea" description="Multi-line, vertically resizable.">
              <Textarea name="message" placeholder="Your message…" />
            </Field>

            <Field label="Select" description="Native single-select.">
              <Select name="choice" defaultValue="">
                <option value="" disabled>
                  Choose one…
                </option>
                <option value="a">Option A</option>
                <option value="b">Option B</option>
                <option value="c">Option C</option>
              </Select>
            </Field>

            <Checkbox
              name="subscribe"
              label="Checkbox with description"
              description="Helper text linked via aria-describedby."
            />
            <Checkbox
              name="terms"
              label="Required checkbox"
              required
              error="You must accept to continue."
            />
            <Checkbox
              name="disabled-check"
              label="Disabled checkbox"
              description="Not interactive."
              disabled
            />

            <RadioGroup
              name="plan"
              legend="Radio group"
              description="Grouped with a fieldset + legend; one shared name."
              defaultValue="standard"
              options={[
                { value: "standard", label: "Standard", description: "The default." },
                { value: "pro", label: "Pro" },
                { value: "enterprise", label: "Enterprise", disabled: true },
              ]}
            />

            <RadioGroup
              name="billing"
              legend="Radio group with error"
              required
              error="Pick a billing cycle."
              options={[
                { value: "monthly", label: "Monthly" },
                { value: "yearly", label: "Yearly" },
              ]}
            />

            <div className="flex flex-wrap gap-[var(--spacing-sm)]">
              <Button type="submit">Submit</Button>
              <Button type="reset" variant="secondary">
                Reset
              </Button>
            </div>
          </form>
        </Container>
      </Section>

      {/* ---- Patterns (tier 3) ---- */}
      <Section>
        <Container>
          <SectionHeading>Patterns (tier 3)</SectionHeading>
          <p className="mt-[var(--spacing-sm)] mb-[var(--spacing-lg)] max-w-[var(--container-prose)] text-[var(--color-fg-muted)]">
            Structural variants with zero content knowledge. Blocks pick one via
            a CMS <code className="font-mono">variant</code> field (e.g. the home
            hero uses <code className="font-mono">Split</code>).
          </p>
          <div className="flex flex-col gap-[var(--spacing-2xl)]">
            <Demo title="Split — media right (stacks on mobile)">
              <Split
                media={
                  <Image
                    src="/media/sample-landscape.png"
                    alt=""
                    aspect="photo"
                    rounded="lg"
                    wrapperClassName="bg-[var(--color-surface)]"
                    sizes="(min-width: 48rem) 50vw, 100vw"
                  />
                }
              >
                <h3 className="text-2xl font-[var(--font-weight-semibold)] tracking-[var(--tracking-tight)]">
                  Content beside media
                </h3>
                <p className="mt-[var(--spacing-sm)] text-[var(--color-fg-muted)]">
                  Two columns on desktop, single column (content first) on
                  mobile.
                </p>
                <p className="mt-[var(--spacing-md)]">
                  <Button>Primary action</Button>
                </p>
              </Split>
            </Demo>

            <Demo title="Split — media left (reverse)">
              <Split
                reverse
                media={
                  <Image
                    src="/media/sample-landscape.png"
                    alt=""
                    aspect="photo"
                    rounded="lg"
                    wrapperClassName="bg-[var(--color-surface)]"
                    sizes="(min-width: 48rem) 50vw, 100vw"
                  />
                }
              >
                <h3 className="text-2xl font-[var(--font-weight-semibold)] tracking-[var(--tracking-tight)]">
                  Same structure, reversed
                </h3>
                <p className="mt-[var(--spacing-sm)] text-[var(--color-fg-muted)]">
                  <code className="font-mono">reverse</code> swaps the columns on
                  desktop only — mobile order is unchanged.
                </p>
              </Split>
            </Demo>

            <Demo title="Center — centred stack">
              <Center>
                <h3 className="text-2xl font-[var(--font-weight-semibold)] tracking-[var(--tracking-tight)]">
                  Centred content
                </h3>
                <p className="mt-[var(--spacing-sm)] max-w-[var(--container-prose)] text-[var(--color-fg-muted)]">
                  A centred column with centred text; the measure comes from the
                  content and the enclosing Container.
                </p>
                <p className="mt-[var(--spacing-md)]">
                  <Button variant="secondary">Secondary action</Button>
                </p>
              </Center>
            </Demo>
          </div>
        </Container>
      </Section>
    </main>
  );
}
