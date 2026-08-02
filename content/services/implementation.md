---
title: Implementation
description: Second demo item — proves the listing enumerates more than one file.
excerpt: Ordered second by the `order` field; unordered items sort alphabetically after these.
order: 2
blocks:
  - type: page_hero
    variant: stacked
    heading: Implementation
    subheading: Same block vocabulary as any page — the detail template is not a special case.
  - type: rich_text_section
    body: |-
      ## One template, every collection

      Services, areas, projects and team members are the same shape: a folder of
      markdown files, one route pattern, one listing block.

      Adding a collection is a single entry in `lib/cms/collections.ts` plus a
      `content/<name>/` folder — no new reader, no new route, no new component.
---

Demo body content. Cleared per project (clone step 3).
