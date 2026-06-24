# ProductTrapper — Deployment

## Local deployment

```bash
npm run build
npm run deploy
```

Required environment variables in `.env.local`:

- `PH_DEVELOPER_TOKEN` — Product Hunt API token (prebuild only)
- `NEXT_PUBLIC_SITE_URL` — public URL for canonical/OGP

## GitHub Actions

- `.github/workflows/scheduled-build.yml` — runs daily at JST 00:00, fetches incrementally, then deploys.
- `.github/workflows/deploy-on-push.yml` — deploys on push to `main`; prebuild can be triggered manually via `workflow_dispatch`.

Required GitHub Secrets:

- `PH_DEVELOPER_TOKEN`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `NEXT_PUBLIC_SITE_URL`

## Wrangler

- Worker name: `producttrapper` (from `wrangler.toml`)
- Compatibility date: `2025-04-17`
- Node.js compatibility is enabled via `compatibility_flags = ["nodejs_compat"]`.

## Notes

- `SKIP_PREBUILD=true` skips API fetching during build; useful when reusing cached `src/generated/posts.json`.
- `INCREMENTAL=true` makes the prebuild hook run `fetch-posts.js --incremental`.
