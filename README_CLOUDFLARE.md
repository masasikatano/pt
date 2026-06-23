# Cloudflare / GitHub Actions 設定ガイド

本ファイルは ProductTrapper を Cloudflare Workers にデプロイするために必要な値をまとめたものです。

## 必要な GitHub Secrets

| Secret 名 | 用途 | 取得方法 |
|-----------|------|---------|
| `CLOUDFLARE_API_TOKEN` | Wrangler 経由で Workers にデプロイ | Cloudflare ダッシュボード → 「マイ プロフィール」 → 「API トークン」から作成 |
| `CLOUDFLARE_ACCOUNT_ID` | デプロイ先の Cloudflare アカウント識別 | Cloudflare ダッシュボード → 右サイドバーの「アカウント ID」 |
| `NEXT_PUBLIC_SITE_URL` | canonical / OGP 用の公開 URL | `https://pt.p12r.workers.dev` |
| `PH_DEVELOPER_TOKEN` | Product Hunt GraphQL API v2 認証 | Product Hunt ダッシュボード → API アプリ `ph` の Developer Token |

### Cloudflare API Token に必要な権限

- **Cloudflare Workers:Edit**
- **Cloudflare Pages:Edit**（Workers デプロイ時に併せて必要な場合あり）
- **Zone:Read**（カスタムドメインを使用する場合）

アカウント スコープで作成してください。

## ローカル開発

```bash
cp .env.example .env.local
# .env.local に PH_DEVELOPER_TOKEN と NEXT_PUBLIC_SITE_URL を記入
npm install
npm run dev
```

## デプロイ

```bash
npm run deploy
```

GitHub Actions 経由でデプロイする場合は、上記 Secrets を設定後に push または scheduled workflow を実行してください。

## 注意

- `PH_DEVELOPER_TOKEN` は **prebuild スクリプトのみ**で使用します。クライアントや Worker ランタイムには露出しません。
- `src/generated/posts.json` は `.gitignore` で除外されています。CI では各ワークフロー内で取得するか、キャッシュから復元されます。
