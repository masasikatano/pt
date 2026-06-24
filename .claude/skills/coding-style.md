# ProductTrapper — Coding Style

## TypeScript

- `strict: true` is enabled. Avoid `any`.
- Prefer explicit return types on exported library functions.
- Use path alias `@/` for imports from `src/`.

## React components

- Islands are placed under `src/components/react/` and marked with `'use client'`.
- Keep components focused: `PostBrowser` orchestrates state, child components render.
- Use hooks (`useState`, `useEffect`, `useMemo`) idiomatically; clean up effects.

## Astro

- Pages live under `src/pages/`.
- The only page is `index.astro`; it is prerendered (`export const prerender = true`).
- Layouts under `src/layouts/` handle HTML boilerplate, SEO tags, and global styles.

## Styling

- Use plain CSS in `src/styles/globals.css`.
- Design tokens are defined in `:root` (colors, spacing, shadows, radius).
- Prefer CSS custom properties and utility classes; avoid inline styles.

## i18n

- UI strings are in `src/messages/ja.json`.
- Import `t` from `@/lib/i18n` for translations.
- Keep keys namespaced (e.g., `post.votes`, `footer.lastUpdated`).

## Data handling

- Product Hunt API responses are normalized in `scripts/fetch-posts.js`.
- Client code fetches `public/posts.json` via `src/lib/data-client.ts`.
- Server/build-time code imports `src/generated/posts.json` through `src/lib/posts.ts`.
