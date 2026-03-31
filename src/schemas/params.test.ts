import { describe, expect, it } from "vitest"
import { paramsSchema } from "./params"

describe("paramsSchema", () => {
  describe("正常系", () => {
    it("有効なパラメータをパースできる", () => {
      const result = paramsSchema.safeParse({ phrase: "abc", length: "10" })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.phrase).toBe("abc")
        expect(result.data.length).toBe(10)
      }
    })
  })

  describe("phrase のバリデーション", () => {
    it("空文字はエラーになる", () => {
      const result = paramsSchema.safeParse({ phrase: "", length: "10" })
      expect(result.success).toBe(false)
    })

    it("31文字はエラーになる", () => {
      const result = paramsSchema.safeParse({
        phrase: "a".repeat(31),
        length: "10",
      })
      expect(result.success).toBe(false)
    })

    it("1文字は成功する", () => {
      const result = paramsSchema.safeParse({ phrase: "a", length: "10" })
      expect(result.success).toBe(true)
    })

    it("30文字は成功する", () => {
      const result = paramsSchema.safeParse({
        phrase: "a".repeat(30),
        length: "10",
      })
      expect(result.success).toBe(true)
    })
  })

  describe("length のバリデーション", () => {
    it('"0" はエラーになる', () => {
      const result = paramsSchema.safeParse({ phrase: "abc", length: "0" })
      expect(result.success).toBe(false)
    })

    it('"-1" はエラーになる', () => {
      const result = paramsSchema.safeParse({ phrase: "abc", length: "-1" })
      expect(result.success).toBe(false)
    })

    it('"abc" はエラーになる', () => {
      const result = paramsSchema.safeParse({ phrase: "abc", length: "abc" })
      expect(result.success).toBe(false)
    })

    it('"10001" はエラーになる', () => {
      const result = paramsSchema.safeParse({
        phrase: "abc",
        length: "10001",
      })
      expect(result.success).toBe(false)
    })

    it('"1" は成功する', () => {
      const result = paramsSchema.safeParse({ phrase: "abc", length: "1" })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.length).toBe(1)
      }
    })

    it('"10000" は成功する', () => {
      const result = paramsSchema.safeParse({
        phrase: "abc",
        length: "10000",
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.length).toBe(10000)
      }
    })
  })
})
