# ProductTrapper 仕様書

> **作成背景**: Matt Pocock の "grill-me" メソッド（深掘り質問による要件明確化）により 7 ラウンドで採択された仕様を記録したもの。
> このドキュメントが本プロジェクトの **Single Source of Truth** となる。

**作成日**: 2026-06-23  
**ステータス**: MVP 仕様確定（実装前）

---

## 1. 製品概要

**製品名**: ProductTrapper

**コンセプト**:  
Product Hunt に登録された featured プロダクト（Post）を、2026 年以降の範囲で日次収集し、一覧・ランキング・トピック別に俯瞰できる Web サイト。個人の市場調査・競合リサーチを主目的とする。

**ターゲットユーザー**:
- 自分（運営者）— 市場動向・競合プロダクトの把握
- 公開 URL を知っている一般閲覧者（認証なし）

**価値提案**:
- Product Hunt 公式 GraphQL API (v2) から取得したデータを、投票数・トピック・ローンチ日で素早く比較できる
- 日次バッチ更新により、レート制限内で安定的にデータを蓄積
- mtg プロジェクトと同じ Astro + Cloudflare Workers 構成で、低コスト運用

**本番 URL**: `https://product.trapper.workers.dev`  
**Worker 名**: `producttrapper`（`wrangler.toml`）  
**リポジトリ**: `/home/masasikatano/project/producttrapper`

---

## 2. Grill-me メソッドで採択された主要決定事項

### Round 1: プロダクトの核心

| 質問 | 採択 | 不採用 |
|------|------|--------|
| 一番の目的は？ | **個人の市場調査・競合リサーチ** | 公開ディレクトリ、ニッチキュレーション、分析ダッシュボード |
| データ範囲は？ | **特定の期間以降**（後続ラウンドで 2026 年に確定） | 全 Post、featured のみ（この時点）、今後のみ |

### Round 2: 範囲・更新・技術

| 質問 | 採択 | 不採用 |
|------|------|--------|
| 開始時期は？ | **2026 年以降** | 2024/2022/2020 以降、最古まで |
| 更新頻度は？ | **1 日 1 回**（mtg の scheduled-build パターン） | 数時間おき、手動のみ、閲覧時 API |
| 技術スタックは？ | **mtg と同じ**（Astro 6 + CF Workers + prebuild JSON + 日本語） | ローカル専用、別スタック |

### Round 3: 機能・閲覧・表示

| 質問 | 採択 | 不採用 |
|------|------|--------|
| 公開範囲は？ | **公開 OK**（個人用だが認証不要） | Basic 認証、Cloudflare Access、URL 秘匿 |
| 必須機能は？ | **一覧、トピックフィルター、投票数ランキング** | 詳細ページ、検索、日付フィルター、統計、エクスポート |
| Post の対象は？ | **featured（日次ローンチ）のみ** | non-featured 含む、投票数閾値 |

### Round 4: 名称・言語・表示項目

| 質問 | 採択 | 不採用 |
|------|------|--------|
| 言語は？ | **日本語のみ**（UI ラベル。プロダクト名・タグラインは API 原文の英語） | 英語のみ、日英併記 |
| サイト名は？ | **ProductTrapper** | ph-tracker / ph-archive / ph-radar |
| カード表示項目は？ | **全項目**（下記 §3.2 参照） | — |

### Round 5: ランキング構成・配置

| 質問 | 採択 | 不採用 |
|------|------|--------|
| ランキング構成は？ | **2026 年以降の全期間ランキング 1 本** | 月別、年別、期間切替 UI |
| トピック UI は？ | **タブ**（mtg の年代タブと同様） | ドロップダウン、サイドバー、チップ |
| プロジェクト配置は？ | **`/home/masasikatano/project/producttrapper`**（新規） | 現在のワークスペース、ph フォルダ |

### Round 6: デプロイ・一覧のデフォルト

| 質問 | 採択 | 不採用 |
|------|------|--------|
| 本番 URL は？ | **`https://product.trapper.workers.dev`** | ph.syowa.workers.dev |
| デフォルト並び順は？ | **投票数降順** | ローンチ日順、コメント数順、登録日順 |
| 付帯ページは？ | **不要** | about / privacy / contact |

### Round 7: 一覧とランキングの関係

| 質問 | 採択 | 不採用 |
|------|------|--------|
| 一覧とランキングの分け方は？ | **同一ページで表示切替**（一覧 ⟷ ランキング） | 別ページ、TOP10 + 全件 |
| トピックタブの範囲は？ | **取得データから自動生成した全トピック** | 上位 N 件のみ、手動キュレーション |

---

## 3. 画面・UX 仕様

### 3.1 ページ構成（MVP は単一ページ）

```
┌─────────────────────────────────────────────────────────┐
│  ProductTrapper                          [一覧|ランキング] │
├─────────────────────────────────────────────────────────┤
│  [すべて] [AI] [Developer Tools] [Productivity] ...      │  ← トピックタブ
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ サムネ   │  │ サムネ   │  │ サムネ   │   ← 一覧モード │
│  │ 名前     │  │ 名前     │  │ 名前     │              │
│  │ タグライン│  │ タグライン│  │ タグライン│              │
│  │ 投票/コメ │  │ 投票/コメ │  │ 投票/コメ │              │
│  │ トピック  │  │ トピック  │  │ トピック  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                         │
│  または                                                  │
│                                                         │
│  1. ProductA  —  1,234 votes  —  2026-03-15            │  ← ランキングモード
│  2. ProductB  —    987 votes  —  2026-02-01            │
│  ...                                                    │
├─────────────────────────────────────────────────────────┤
│  Data from Product Hunt · 最終更新: 2026-06-23          │  ← attribution
└─────────────────────────────────────────────────────────┘
```

### 3.2 カード表示項目（詳細ページなしのためカード内に全情報を収める）

| 項目 | データソース | 表示 |
|------|-------------|------|
| サムネイル | `Post.thumbnail.url` | 画像 |
| プロダクト名 | `Post.name` | テキスト（英語原文） |
| タグライン | `Post.tagline` | テキスト（英語原文） |
| 投票数 | `Post.votesCount` | 数値 + 「投票」ラベル |
| コメント数 | `Post.commentsCount` | 数値 + 「コメント」ラベル |
| ローンチ日 | `Post.featuredAt` | `YYYY-MM-DD` + 「ローンチ日」ラベル |
| トピック | `Post.topics` | タグ（複数可） |
| メーカー | `Post.makers` | 名前リスト |
| 外部サイト | `Post.website` | リンク（新規タブ） |
| PH 元ページ | `Post.url` | リンク（新規タブ） |

### 3.3 表示モード

| モード | 並び順 | レイアウト |
|--------|--------|-----------|
| 一覧 | 投票数降順（デフォルト） | カードグリッド（レスポンシブ） |
| ランキング | 投票数降順（固定） | 順位番号付きリスト |

- 表示切替は React Island でクライアントサイド実装
- URL 状態保持（任意）: `?view=ranking&topic={slug}`

### 3.4 トピックタブ

- 先頭タブ: **すべて**（フィルターなし）
- 以降: 取得 Post に含まれる全トピックを **投稿数の多い順** でタブ表示
- タブ選択時: 該当トピックを持つ Post のみ表示（一覧・ランキング両モードに適用）
- トピック数が多い場合: 横スクロール可能なタブバー（mtg の `TabBar` パターン）

### 3.5 日本語 UI ラベル（例）

| キー | 表示 |
|------|------|
| view.list | 一覧 |
| view.ranking | ランキング |
| votes | 投票 |
| comments | コメント |
| featuredAt | ローンチ日 |
| makers | メーカー |
| website | サイト |
| productHunt | Product Hunt |
| topic.all | すべて |
| lastUpdated | 最終更新 |

---

## 4. ルーティング

| パス | 説明 |
|------|------|
| `/` | 唯一のページ。一覧 / ランキング / トピックフィルター |

クエリパラメータ（任意、ブックマーク・共有用）:

| パラメータ | 値 | 説明 |
|-----------|-----|------|
| `view` | `list` / `ranking` | 表示モード（デフォルト: `list`） |
| `topic` | トピック slug | トピックフィルター（デフォルト: なし = すべて） |

---

## 5. データ取得・保存

### 5.1 Product Hunt GraphQL API

| 項目 | 値 |
|------|-----|
| エンドポイント | `https://api.producthunt.com/v2/api/graphql` |
| 認証 | `Authorization: Bearer {PH_DEVELOPER_TOKEN}` |
| API アプリ名 | `ph` |
| トークン種別 | Developer Token（有効期限なし、prebuild 専用） |

**利用規約上の注意**:
- デフォルトでは **商用利用禁止**。本サイトは個人リサーチ用途として運用する
- Product Hunt への **attribution 必須**（フッターにロゴ + リンク）
- レート制限に従う（fair-use）。日次バッチに限定

### 5.2 取得クエリ設計

```graphql
query FetchFeaturedPosts($postedAfter: DateTime!, $first: Int!, $after: String) {
  posts(
    featured: true
    postedAfter: $postedAfter
    order: FEATURED_AT
    first: $first
    after: $after
  ) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        slug
        name
        tagline
        votesCount
        commentsCount
        featuredAt
        createdAt
        website
        url
        thumbnail {
          url(width: 200, height: 200)
        }
        topics(first: 10) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
        makers {
          id
          name
          username
          url
        }
      }
    }
  }
}
```

**変数**:
- `postedAfter`: `"2026-01-01T00:00:00Z"`
- `first`: `50`（レート制限を見て調整。最大値は API 制限に従う）
- `after`: ページネーションカーソル

**取得フロー**:
1. `postedAfter: 2026-01-01` + `featured: true` で最初のページを取得
2. `pageInfo.hasNextPage` が `true` の間、`endCursor` でページネーション
3. リクエスト間にスリープ（例: 500ms〜1s）でレート制限回避
4. 全ページ取得後、`src/generated/posts.json` に書き出し
5. トピック一覧・メタデータ（件数、最終取得日時）も同ファイルに含める

**早期終了の最適化**（任意）:
- `order: FEATURED_AT` で新しい順に取得し、日次更新時は既知の最新 `featuredAt` 以降のみ追記取得する差分戦略を将来検討
- MVP 初版はフル取得でも可（2026 年以降かつ featured のみなら件数は限定的）

### 5.3 出力 JSON スキーマ

```typescript
/** src/generated/posts.json */
interface PostsData {
  meta: {
    fetchedAt: string;       // ISO 8601
    postedAfter: string;     // "2026-01-01T00:00:00Z"
    totalCount: number;
    source: "producthunt-api-v2";
  };
  topics: TopicSummary[];    // タブ生成用（投稿数降順）
  posts: PostRecord[];
}

interface TopicSummary {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface PostRecord {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  votesCount: number;
  commentsCount: number;
  featuredAt: string;        // ISO 8601
  createdAt: string;
  website: string;
  url: string;
  thumbnailUrl: string | null;
  topics: { id: string; name: string; slug: string }[];
  makers: { id: string; name: string; username: string; url: string }[];
}
```

### 5.4 prebuild パイプライン

mtg と同様の構成:

| スクリプト | API | 出力 |
|-----------|-----|------|
| `scripts/fetch-posts.js` | Product Hunt GraphQL v2 | `src/generated/posts.json` |

```
npm run prebuild  →  node scripts/prebuild.js  →  fetch-posts.js
npm run build     →  prebuild + astro build
npm run deploy    →  build + wrangler deploy
```

- `SKIP_PREBUILD=true` で prebuild スキップ（CI キャッシュ再利用時）
- 取得失敗時: 既存 `posts.json` を保持してビルド継続（mtg キャッシュパターン）

### 5.5 レート制限・リトライ

- レスポンスヘッダー `X-Rate-Limit-Remaining` / `X-Rate-Limit-Reset` を監視
- 429 受信時: `Retry-After` に従い待機してリトライ（最大 3 回）
- 日次 1 回のバッチに限定し、リアルタイム API 呼び出しは Worker 上では行わない

---

## 6. 技術スタック・開発規約

### 6.1 mtg から流用する構成

| 技術 | バージョン・備考 |
|------|----------------|
| Astro | 6（`output: "server"`） |
| Cloudflare Workers | `@astrojs/cloudflare` + `wrangler deploy` |
| React | 19 Islands（`.tsx` はインタラクティブ部分のみ） |
| TypeScript | strict（`any` 禁止） |
| スタイル | mtg の CSS パターン（または Tailwind 4 を mtg に合わせて採用） |
| E2E（任意） | Playwright |

### 6.2 ディレクトリ構成（予定）

```
producttrapper/
├── spec.md
├── package.json
├── astro.config.mjs
├── wrangler.toml              # name = "producttrapper"
├── scripts/
│   ├── prebuild.js
│   ├── fetch-posts.js         # PH GraphQL 取得
│   └── shared.js              # 共通定数・ヘルパー
├── src/
│   ├── generated/
│   │   └── posts.json         # prebuild 出力（git 管理するかは実装時判断）
│   ├── pages/
│   │   └── index.astro        # 唯一のページ
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   └── react/
│   │       ├── PostGrid.tsx     # 一覧カードグリッド
│   │       ├── RankingList.tsx  # ランキングリスト
│   │       ├── ViewToggle.tsx   # 一覧 ⟷ ランキング切替
│   │       └── TopicTabs.tsx    # トピックタブ
│   ├── lib/
│   │   ├── posts.ts           # JSON 読み込み・フィルター
│   │   ├── types.ts
│   │   └── constants.ts
│   ├── messages/
│   │   └── ja.json            # 日本語 UI ラベル
│   └── styles/
│       └── globals.css
├── public/
│   └── ph-logo.svg            # attribution 用（PH brand assets から）
└── .github/workflows/
    ├── scheduled-build.yml    # 日次 JST 0:00 取得 + デプロイ
    └── deploy-on-push.yml     # push 時デプロイ（キャッシュ再利用）
```

### 6.3 環境変数

| 変数名 | 用途 | 管理場所 |
|--------|------|---------|
| `PH_DEVELOPER_TOKEN` | GraphQL 認証（prebuild のみ） | `.env.local` / GitHub Secrets |
| `NEXT_PUBLIC_SITE_URL` | OGP・canonical（`https://product.trapper.workers.dev`） | `.env.local` |
| `CLOUDFLARE_API_TOKEN` | デプロイ | GitHub Secrets |
| `CLOUDFLARE_ACCOUNT_ID` | デプロイ | GitHub Secrets |

**セキュリティ**: Developer Token はクライアント・Worker ランタイムに露出しない。prebuild スクリプトのみが使用する。

### 6.4 開発フロー

```bash
cd /home/masasikatano/project/producttrapper
npm install
cp .env.example .env.local   # PH_DEVELOPER_TOKEN を設定
npm run dev
npm run build
npm run deploy
```

### 6.5 GitHub Actions（mtg パターン）

| ワークフロー | トリガー | 動作 |
|-------------|---------|------|
| `scheduled-build.yml` | 毎日 JST 0:00 / 手動 | PH API 取得 → キャッシュ → ビルド・デプロイ |
| `deploy-on-push.yml` | main push / 手動 | キャッシュ復元 → ビルド・デプロイ |

---

## 7. 非機能要件

| 項目 | 方針 |
|------|------|
| パフォーマンス | 静的 JSON 配信。クライアントサイドフィルター・ソート |
| 可用性 | 取得失敗時は前回 JSON でビルド継続 |
| SEO | 最低限（`robots` 任意）。積極的な SEO は不要 |
| アクセシビリティ | 画像に alt、リンクに明示的ラベル |
| 分析 | Cloudflare Web Analytics（Cookie 不使用、mtg と同様）を任意採用 |
| attribution | フッターに Product Hunt ロゴ + `https://www.producthunt.com` リンク |
| コスト | Workers 無料枠内。外部 API は日次 1 回のみ |

---

## 8. MVP スコープ外・将来拡張

### 8.1 意図的に含めない（Grill-me で不採用）

- プロダクト詳細ページ（`/post/{slug}`）
- キーワード検索
- 統計ダッシュボード（日別件数、トピック分布チャート）
- CSV / JSON エクスポート UI
- about / privacy / contact ページ
- 認証・会員機能
- non-featured Post
- 2026 年より前のデータ

### 8.2 将来検討

| 機能 | 説明 |
|------|------|
| 差分取得 | 日次更新を最新分のみに最適化 |
| 月別ランキング | 期間切替 UI |
| 検索 | 名前・タグラインのクライアントサイド検索 |
| 詳細ページ | 説明文（`description`）全文表示 |
| 統計ダッシュボード | トピック分布、日別ローンチ数 |
| エクスポート | JSON / CSV ダウンロード |
| 手動キュレーション | ウォッチリスト、メモ機能 |
| カスタムドメイン | `producttrapper.com` 等 |

---

## 9. API 認証情報（参照用・値は記載しない）

| 項目 | 値 |
|------|-----|
| API アプリ名 | `ph` |
| Redirect URI | `https://example.com/` |
| API Key | （ダッシュボードで管理。spec 非記載） |
| API Secret | （ダッシュボードで管理。spec 非記載） |
| Developer Token | 有効期限なし。User Context: masasi katano |
| 利用スコープ | `public`（read-only） |

ローカル開発では `.env.local` に `PH_DEVELOPER_TOKEN=` を設定する。

---

## 10. リスク・注意点

1. **初回全件取得**: 2026 年以降の featured Post は `postedAfter` で絞れるが、ページネーション全体を走査するため初回は数分かかる可能性がある
2. **トピックタブの UI**: トピック数が多いとタブが溢れる。横スクロール + 投稿数順で主要トピックが先頭に来る設計とする
3. **workers.dev サブドメイン**: `product.trapper.workers.dev` は Cloudflare ダッシュボードでカスタムサブドメイン設定が必要（mtg の `mtg.syowa.workers.dev` と同様）
4. **API 仕様変更**: PH API v2 は GitHub Issues（v2 ラベル）で変更が報告される。`schema.graphql` を定期的に確認
5. **データの鮮度**: 日次更新のため最大 24 時間の遅延がある。リアルタイム性は求めない

---

**この仕様書は grill-me プロセス（7 ラウンド）でユーザーが明確に選択・承認した内容を反映しています。**  
今後機能追加を行う場合は、この `spec.md` を更新してから実装すること。