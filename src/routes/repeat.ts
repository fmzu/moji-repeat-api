import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { paramsSchema } from "../schemas/params"
import { repeatPhrase } from "../utils/repeat-phrase"
import { handleValidationError } from "../validators/handle-validation-error"

const repeatRoute = new Hono()

/**
 * 渡された文字列を指定文字数繰り返して返す
 */
repeatRoute.get(
  "/:phrase/:length",
  zValidator("param", paramsSchema, (result, c) => {
    if (!result.success) {
      handleValidationError(result, c)
    }
  }),
  (c) => {
    const { phrase, length } = c.req.valid("param")
    const result = repeatPhrase(phrase, length)
    return c.text(result)
  },
)

export { repeatRoute }
