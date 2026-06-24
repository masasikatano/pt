---
name: Deploy
description: Build and deploy ProductTrapper to Cloudflare Workers.
---

Deploy ProductTrapper to Cloudflare Workers.

1. Confirm `.env.local` contains `PH_DEVELOPER_TOKEN` or that the environment is otherwise configured.
2. Run `npm run build` (this also runs the prebuild hook unless `SKIP_PREBUILD=true`).
3. Run `npm run deploy`.
4. Verify the deployment URL: `https://pt.p12r.workers.dev`.
5. Report the deployment status and any Wrangler output.

For CI deployments, see `.github/workflows/deploy-on-push.yml` and `README_CLOUDFLARE.md`.
