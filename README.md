# ProductTrapper

Product Hunt の featured プロダクトを 2026 年以降から日次収集し、一覧・ランキング・トピック別に俯瞰できる Web サイト。

- 本番 URL: https://pt.p12r.workers.dev
- 技術スタック: Astro 6 + Cloudflare Workers + React Islands
- 言語: 日本語 UI（プロダクト名・タグラインは API 原文の英語）

## 開発

```bash
cp .env.example .env.local
# .env.local に PH_DEVELOPER_TOKEN を設定
npm install
npm run dev
```

## ビルド・デプロイ

```bash
npm run build      # prebuild + astro build
npm run deploy     # build + wrangler deploy
```

`SKIP_PREBUILD=true` を設定すると、API 取得をスキップして既存 `src/generated/posts.json` でビルドします。

## データ取得

```bash
node scripts/fetch-posts.js              # 2026-01-01 以降の全 featured post を取得
node scripts/fetch-posts.js --incremental # 既存データの最新日以降を追記取得
```

## Cloudflare / GitHub Actions 設定

詳細は [README_CLOUDFLARE.md](./README_CLOUDFLARE.md) を参照。

## 仕様

詳細は [spec.md](./spec.md) を参照。
