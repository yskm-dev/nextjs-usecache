# PokeSearch

PokeAPI を使ってポケモン一覧・詳細を閲覧できる Next.js アプリです。

## 主な機能

- ポケモン一覧の取得（1ページ 10 件）
- 「前のページ / 次のページ」によるページネーション
- 一覧から選択したポケモンの詳細表示
  - 公式アートワーク画像
  - タイプアイコン
  - 高さ・重さ
- 一覧項目の hover / focus 時に詳細データをプリフェッチ
- タイプ検索 UI（選択状態の保持のみ）
  - ※タイプによる絞り込み処理自体は未実装

## 技術スタック

- Next.js 16 (App Router)
- React 19
- TypeScript
- TanStack Query (React Query)
- Sass (SCSS Modules + グローバルスタイル)

## セットアップ

```bash
npm install
```

## 開発

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いて確認できます。

## 利用可能スクリプト

```bash
npm run dev        # 開発サーバー起動
npm run build      # 本番ビルド
npm run start      # 本番サーバー起動
npm run lint       # ESLint 実行
npm run pages:build # open-next で Cloudflare 向けビルド
```

## ディレクトリ構成（抜粋）

```text
src/
	app/
		layout.tsx        # ルートレイアウト（フォント・グローバルスタイル）
		page.tsx          # メイン画面（一覧 / 詳細 / クエリ管理）
		page.module.scss  # 画面固有スタイル
	styles/             # Sass の共通スタイル・変数
public/
	type/               # ポケモンタイプアイコン
```

## 実装メモ

- データ取得先:
  - 一覧: `https://pokeapi.co/api/v2/pokemon?limit=10`
  - 詳細: `https://pokeapi.co/api/v2/pokemon/{name}`
- 画像表示は `next/image` を使用し、`raw.githubusercontent.com` を `next.config.ts` の `images.remotePatterns` で許可しています。
- Query の `staleTime` は 60 秒です。
