# Demo content consumed by the build. Cleared per project (clone step 3).

## Shape

- `site.yml` — global settings (name, nav, footer). One file collection.
- `pages/*.md` — standalone pages. Filename is the slug; `home.md` maps to `/`.
- `<collection>/*.md` — folder collections: listing/detail content types such as
  services, areas or projects. Each file becomes a page at
  `/<basePath>/<filename>`.

Pages and collection items share the same block vocabulary — a collection item is
just a page with card metadata (`excerpt`, `image`, `order`).

## Adding a collection

1. Add an entry to `lib/cms/collections.ts`.
2. Create `content/<name>/`.

That is all. The reader, the routes and the CMS collection are generated from the
registry — no new component, reader or route file.

To list one on a page, add a `collection_list` block; it only offers collections
that are actually registered.
