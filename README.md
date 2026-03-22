# moji-repeat-api

指定した文字列を指定した文字数分繰り返して返すAPI。

業務でフォームの文字数制限をテストするときに、任意の文字数の文字列をサッと用意できる。

## 使い方

```
GET /repeat/:phrase/:length
```

| パラメータ | 説明 | 制限 |
|---|---|---|
| `phrase` | 繰り返す文字列 | 1〜30文字 |
| `length` | 出力する文字数 | 1〜10000 |

### 例

```
GET /repeat/abc/7
→ abcabca

GET /repeat/あいう/10
→ あいうあいうあいうあ
```

## 開発

```sh
npm install
npm run dev
```

## テスト

```sh
npx vitest run
```

## デプロイ

```sh
npm run deploy
```

## 技術スタック

- [Hono](https://hono.dev/) - Webフレームワーク
- [Zod](https://zod.dev/) - バリデーション
- [Cloudflare Workers](https://workers.cloudflare.com/) - ホスティング
- [Vitest](https://vitest.dev/) - テスト
