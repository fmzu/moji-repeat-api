# CLAUDE.md

## 概要

文字列を指定文字数まで繰り返して返すAPI。Cloudflare Workersにデプロイ。

## 技術スタック

- Hono（Webフレームワーク）
- Zod + @hono/zod-validator（バリデーション）
- Wrangler（Cloudflare Workers CLI）
- Biome（フォーマッタ・リンタ）

## コーディングルール

- `app.route()` はプレフィックスを指定してルートをマウントする（Hono公式推奨）
- バリデーションには `@hono/zod-validator` の `zValidator` を使う
- エラーレスポンスは `HTTPException` で返す
