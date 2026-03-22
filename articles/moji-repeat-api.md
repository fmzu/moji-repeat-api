# 「あいうえお」を100文字分コピペするのが面倒だったのでAPIを作った

## きっかけ

業務でフォームの動作確認をしていると、文字数制限のテストをすることがよくある。「30文字まで入力できるか」「100文字で切れるか」みたいなやつ。

このとき毎回やっていたのが：

1. 「あいうえおあいうえおあいうえお...」と手で打つ
2. コピペで増やす
3. 文字数が合ってるか数える

これが地味に面倒だった。特に「今これ何文字だっけ？」と数え直すのがストレスだったので、指定した文字数ぴったりの文字列を返してくれるAPIを作った。

## 作ったもの

`GET /repeat/:phrase/:length` にリクエストすると、`phrase` を `length` 文字分繰り返して返すだけのシンプルなAPI。

```
GET /repeat/abc/7
→ abcabca
```

```
GET /repeat/あいう/10
→ あいうあいうあいうあ
```

## 技術スタック

- **Hono** - 軽量なWebフレームワーク
- **Zod** - バリデーション
- **Cloudflare Workers** - ホスティング
- **Vitest** - テスト

Hono + Cloudflare Workers の組み合わせは、この規模のAPIにはちょうどいい。`wrangler init` でプロジェクトを作って、1ファイルで完結する。

## コード全体

```ts
import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"

const app = new Hono()

const MAX_PHRASE_LENGTH = 30
const MAX_LENGTH = 10000

const paramsSchema = z.object({
  phrase: z
    .string()
    .min(1, { message: "phrase は空にできません" })
    .max(MAX_PHRASE_LENGTH, {
      message: `phrase は${MAX_PHRASE_LENGTH}文字以下にしてください`,
    }),
  length: z
    .string()
    .regex(/^[1-9]\d*$/, { message: "length は1以上の整数にしてください" })
    .transform((value) => Number(value))
    .refine((value) => value <= MAX_LENGTH, {
      message: `length は${MAX_LENGTH}以下にしてください`,
    }),
})

app.get(
  "/repeat/:phrase/:length",
  zValidator("param", paramsSchema, (result, c) => {
    if (!result.success) {
      const firstMessage = result.error.issues[0]?.message ?? "Invalid"
      throw new HTTPException(400, {
        res: c.text(firstMessage, 400),
      })
    }
  }),
  (c) => {
    const { phrase, length } = c.req.valid("param")
    const repeatNeeded = Math.ceil(length / phrase.length)
    const result = phrase.repeat(repeatNeeded).slice(0, length)
    return c.text(result)
  },
)

export default app
```

## ポイント

### Zod でバリデーションとDoS対策を兼ねる

`@hono/zod-validator` を使うと、パスパラメータのバリデーションをスキーマとして宣言的に書ける。

```ts
const paramsSchema = z.object({
  phrase: z.string().min(1).max(30),
  length: z.string()
    .regex(/^[1-9]\d*$/)
    .transform((value) => Number(value))
    .refine((value) => value <= 10000),
})
```

`length` はパスパラメータなので `string` で受け取って、正規表現でバリデーションしてから `transform` で `number` に変換している。`.refine()` で上限を設けることで、巨大な文字列を生成させるDoS攻撃も防げる。

### 繰り返しロジック

```ts
const repeatNeeded = Math.ceil(length / phrase.length)
const result = phrase.repeat(repeatNeeded).slice(0, length)
```

`phrase.repeat()` で多めに繰り返してから `slice()` で切り詰める。2行で済むのでシンプル。

### Hono のエラーハンドリング

Zodバリデーションが失敗したときは `HTTPException` を投げてレスポンスを返す。

```ts
zValidator("param", paramsSchema, (result, c) => {
  if (!result.success) {
    const firstMessage = result.error.issues[0]?.message ?? "Invalid"
    throw new HTTPException(400, {
      res: c.text(firstMessage, 400),
    })
  }
})
```

エラーメッセージはZodスキーマ側で日本語で定義しているので、クライアントにもわかりやすいメッセージが返る。

## テスト

Hono の `app.request()` を使うと、サーバーを立てずにリクエストをテストできる。

```ts
import { describe, it, expect } from "vitest"
import app from "./index"

describe("GET /repeat/:phrase/:length", () => {
  it("文字列を指定回数分の長さに繰り返す", async () => {
    const res = await app.request("/repeat/abc/7")
    expect(res.status).toBe(200)
    expect(await res.text()).toBe("abcabca")
  })
})

describe("バリデーションエラー", () => {
  it("lengthが上限(10000)を超えると400", async () => {
    const res = await app.request("/repeat/abc/10001")
    expect(res.status).toBe(400)
    expect(await res.text()).toContain("10000以下")
  })
})
```

`app.request()` が便利すぎて、テスト書くハードルがかなり低い。

## まとめ

「文字を繰り返すだけ」という最小限のAPIだけど、Hono + Zod + Cloudflare Workers の構成で作ると、バリデーション・エラーハンドリング・DoS対策・テストまで一通り入った実用的なものになる。

業務の動作確認で地味に便利なので、同じ悩みを持っている人がいたら使ってみてください。
