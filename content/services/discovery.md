---
title: Discovery
description: Neutral demo collection item — the detail half of the listing/detail pair.
excerpt: A short card summary. Falls back to the description when omitted.
order: 1
featured: true
blocks:
  - type: page_hero
    variant: stacked
    heading: Discovery
    subheading: A collection item is a page with card metadata — same blocks, own folder, own route.
  - type: rich_text_section
    body: |-
      ## Routed from the folder, not from a route file

      This item lives at `content/services/discovery.md` and resolves at
      `/services/discovery/`. Nobody wrote that route: the catch-all reads the
      collection registry and generates one path per file.

      An editor adding a service in the CMS gets its page automatically.
---

Demo body content. Cleared per project (clone step 3).
