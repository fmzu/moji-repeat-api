import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"

const app = new Hono()

const MAX_PHRASE_LENGTH = 30
const MAX_LENGTH = 10000

// パラメータのバリデーションスキーマ
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
    }), // DoS対策
})

/**
 * 渡された文字列を指定文字数繰り返して返す
 */
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
