---
name: Build
description: Build the Astro project, optionally skipping the Product Hunt API prebuild.
---

Build the ProductTrapper project.

1. Check whether `src/generated/posts.json` exists.
2. If it does not exist and `PH_DEVELOPER_TOKEN` is available, run `npm run prebuild` (or `node scripts/fetch-posts.js`).
3. Run `npm run lint`.
4. Run `npm run build`.
5. Report any errors and the final output paths (`dist/client` and `dist/server`).

When the user wants to avoid fetching fresh data, set `SKIP_PREBUILD=true` and use the existing generated JSON.
