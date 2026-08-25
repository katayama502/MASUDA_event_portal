# ますだ日和（益田市地域活動ポータル）— プロトタイプ

[`masuda-portal-design.md`](../masuda-portal-design.md) の企画書・基本設計書をもとに実装した、フロントエンドのみで動作するMVPプロトタイプです。バックエンド・DBは実装しておらず、ブラウザの `localStorage` にデータを保存することで、投稿〜承認〜掲載までの一連の流れを実際に操作して確認できます。

## セットアップ

```bash
npm install
npm run dev
```

`npm run build` で本番ビルド、`npm run lint` でLintを実行できます。

## デプロイ

このリポジトリは以下の2箇所にデプロイできる構成になっています（`base: './'` の相対パス構成のため、どちらでも設定変更なしで動作します）。

### Vercel（推奨・最速）

1. [vercel.com/new](https://vercel.com/new) でこのGitHubリポジトリ（`katayama502/MASUDA_event_portal`）をImport
2. フレームワークは自動的に「Vite」として検出されます（[vercel.json](vercel.json) にビルド設定を明示済み）。設定変更は不要で「Deploy」を押すだけです
3. 以降は `main` ブランチへのpushで自動的に再デプロイされます

CLIから直接デプロイする場合:

```bash
npx vercel        # プレビューデプロイ
npx vercel --prod # 本番デプロイ
```

### GitHub Pages

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) により `main` へのpushで自動ビルド・公開されます。リポジトリの Settings → Pages → Source を「GitHub Actions」に設定してください。公開URLは `https://<ユーザー名>.github.io/MASUDA_event_portal/` です。

## 技術スタック

- React 19 + TypeScript + Vite
- React Router（`HashRouter`）— GitHub Pagesは静的ホスティングでクライアントサイドルーティング用のサーバーリライト設定ができないため、URLの`#`以降だけで遷移が完結するHashRouterを採用（例: `/#/events/xxx`）
- Tailwind CSS v4（デザインシステム／`src/index.css` の `@theme` でカラー・フォントを定義。オレンジ・ライム・ティールのポップな配色と、太いアウトライン＋ベタ影の「ステッカー」風スタイルが特徴）
- 状態管理: React Context（`src/context/AppDataContext.tsx`）＋ `localStorage` 永続化
- データ: モックデータ（`src/data/mockData.ts`）。イベントの写真はPexelsのフリー素材を使用し、カテゴリに合わせて設定（実際の益田市のイベント情報ではありません）

## 実装した画面（設計書 6章 サイトマップ対応）

| 画面 | パス | 対応する設計書の機能 |
|---|---|---|
| トップページ | `/` | 今日/今週末/今週/今後1か月タブ、ピックアップ、今週の定例活動、検索・絞り込み（5.1-1,2,3,7,10） |
| 継続活動まとめ | `/continuous` | 継続活動専用ビュー（5.1-4） |
| 月間カレンダー | `/calendar` | カレンダー表示。繰り返しルールを展開して日別に表示（5.1-6） |
| イベント詳細 | `/events/:id` | 詳細情報、関連活動、シェア、通報導線（5.1-5, 5.2-19） |
| 主催者・店舗ページ | `/organizers/:id` | 主催者プロフィール（5.1-9） |
| 投稿フォーム | `/post` | アカウント登録不要の投稿、単発/継続の切替、入力ガイド（5.1-11,12,13） |
| 使い方ガイド | `/guide` | 投稿ガイド・住民向け使い方 |
| 運営について | `/about` | 運営紹介・お問い合わせ導線 |
| 主催者マイページ | `/mypage` | 自分の投稿一覧、編集・削除・一時停止、簡易ダッシュボード（5.1-14,15） |
| 運営管理画面 | `/admin` | 承認フロー、ピックアップ設定、通報一覧（5.1-16,17,18,19） |

お気に入り（♡）はブラウザ内保存、投稿・承認・ピックアップ・通報はすべてその場で状態が更新され、リロードしても `localStorage` に残ります。

## この設計書から実装していない範囲（今後の本開発フェーズ向け）

- 実際のバックエンド／DB（設計書 8, 9章のSupabase等）・認証（ログイン機能）
- 画像アップロード（代わりに絵文字＋カラーでアイキャッチを表現）
- LINE連携、行政システムとの連携（7章フェーズ2以降）
- 実データ・実地図表示（OpenStreetMap等）

これらはいずれも設計書側でフェーズ2以降として整理されている拡張機能です。
# MASUDA_event_portal
