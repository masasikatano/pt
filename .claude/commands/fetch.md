---
name: Fetch
description: Fetch featured Product Hunt posts and regenerate posts.json.
---

Refresh the Product Hunt data used by ProductTrapper.

1. Ensure `PH_DEVELOPER_TOKEN` is set in `.env.local`.
2. By default, run `node scripts/fetch-posts.js --incremental` to fetch only posts newer than the latest cached entry.
3. If the user asks for a full refresh, run `node scripts/fetch-posts.js`.
4. After fetching, confirm `src/generated/posts.json` and `public/posts.json` were updated.
5. Report the total post count and topic summary count from the generated file.
