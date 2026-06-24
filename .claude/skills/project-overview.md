# ProductTrapper — Project Overview

ProductTrapper is a personal market-research site that collects featured Product Hunt posts from 2026 onward and presents them as a browsable list, a vote-based ranking, and topic-filtered views.

## Key facts

- **Name**: ProductTrapper
- **URL**: https://pt.p12r.workers.dev
- **Stack**: Astro 6, React 19 Islands, TypeScript, Cloudflare Workers
- **Language**: Japanese UI labels; product names and taglines remain in English (API original)
- **Data source**: Product Hunt GraphQL API v2
- **Update cadence**: Daily batch (GitHub Actions scheduled workflow)

## Entry points

- `npm run dev` — local dev server
- `npm run build` — prebuild + Astro build
- `npm run deploy` — build + Wrangler deploy
- `node scripts/fetch-posts.js` — full fetch
- `node scripts/fetch-posts.js --incremental` — incremental fetch

## Important rules

- `PH_DEVELOPER_TOKEN` is used **only** in prebuild scripts. Never expose it in client bundles or Worker code.
- `spec.md` is the single source of truth. Update it before implementing scope changes.
- Generated data lives in `src/generated/posts.json` and is copied to `public/posts.json` for runtime use.
