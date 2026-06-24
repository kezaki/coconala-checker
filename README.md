# ココナラ出品者チェッカー

ココナラ出品者のランク、評価、価格、口コミ、説明文をもとに、購入前の信頼材料を整理するNext.js MVPです。

Phase 1は手入力ベースのルールスコアリングのみで動作します。Claude APIやスクレイピング用の環境変数は不要です。

## 開発

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## デプロイ前チェック

```bash
npm run lint
npm run build
```

## Vercelデプロイ手順

このリポジトリをGitHubへpushし、VercelでNext.jsプロジェクトとしてImportします。

- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: 未指定
- Environment Variables: Phase 1では不要

この作業メモでは、`vercel` コマンド実行やGitHub連携は行いません。Vercel上で接続するだけでデプロイできる状態を目標にしています。

## 実装メモ

- スコアリング本体: `src/lib/scoring.ts`
- API: `src/app/api/score/route.ts`
- 入力画面: `src/app/page.tsx`
- 結果画面: `src/app/result/page.tsx`
- ガイド: `src/app/guide/page.tsx`

## Phase 2候補

- 有料ユーザー向けの公開ページ自動取得
- スクレイパー側SQLite/HTMLレポートとの接続
- 口コミのジャンル別分析
- LLMによる補助コメント生成
