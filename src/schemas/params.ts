import { z } from "zod"

const MAX_LENGTH = 10000

// パラメータのバリデーションスキーマ
export const paramsSchema = z.object({
  phrase: z
    .string()
    .min(1, { message: "phrase は空にできません" })
    .max(30, { message: "phrase は30文字以下にしてください" }),
  length: z
    .string()
    .regex(/^[1-9]\d*$/, { message: "length は1以上の整数にしてください" })
    .transform((value) => Number(value))
    .refine((value) => value <= MAX_LENGTH, {
      message: `length は${MAX_LENGTH}以下にしてください`,
    }), // DoS対策
})
