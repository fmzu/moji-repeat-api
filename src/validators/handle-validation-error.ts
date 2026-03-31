import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import type { z } from "zod"

/**
 * Zodバリデーションエラーをハンドリングし、最初のエラーメッセージを400で返す
 */
export const handleValidationError = (
  result: { success: false; error: z.ZodError },
  c: Context,
): void => {
  const firstMessage = result.error.issues[0]?.message ?? "Invalid"
  throw new HTTPException(400, {
    res: c.text(firstMessage, 400),
  })
}
