import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"

const app = new Hono()

// パラメータのバリデーションスキーマ
const paramsSchema = z.object({
  phrase: z.string().min(1, { message: "phrase は空にできません" }),
  length: z
    .string()
    .regex(/^[1-9]\d*$/, { message: "length は1以上の整数にしてください" })
    .transform((value) => Number(value)),
})

/**
 * 渡された文字列を指定文字数繰り返して返す
 */
app.get("/repeat/:phrase/:length", (c) => {
  const parsed = paramsSchema.safeParse(c.req.param())
  if (!parsed.success) {
    // 最初のエラーメッセージを返す
    const message = parsed.error.issues[0]?.message ?? "パラメーターが不正です"
    throw new HTTPException(400, { message: message })
  }

  const { phrase, length } = parsed.data
  const repeatNeeded = Math.ceil(length / phrase.length)
  const result = phrase.repeat(repeatNeeded).slice(0, length)
  return c.text(result)
})

export default app
