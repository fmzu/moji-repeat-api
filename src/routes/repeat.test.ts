import { describe, expect, it } from "vitest"
import app from "../index"

describe("GET /repeat/:phrase/:length", () => {
  describe("正常系", () => {
    it("文字列を指定文字数繰り返して返す", async () => {
      const res = await app.request("/repeat/abc/10")
      expect(res.status).toBe(200)
      expect(await res.text()).toBe("abcabcabca")
    })

    it("ちょうど割り切れる場合はそのまま返す", async () => {
      const res = await app.request("/repeat/hello/5")
      expect(res.status).toBe(200)
      expect(await res.text()).toBe("hello")
    })
  })

  describe("異常系", () => {
    it("phraseなしは404を返す", async () => {
      const res = await app.request("/repeat//10")
      expect(res.status).toBe(404)
    })

    it("length 0 は400を返す", async () => {
      const res = await app.request("/repeat/abc/0")
      expect(res.status).toBe(400)
    })

    it("length 10001 は400を返す", async () => {
      const res = await app.request("/repeat/abc/10001")
      expect(res.status).toBe(400)
    })

    it("length が数値でない場合は400を返す", async () => {
      const res = await app.request("/repeat/abc/abc")
      expect(res.status).toBe(400)
    })
  })

  describe("エッジケース", () => {
    it("1文字を1回返す", async () => {
      const res = await app.request("/repeat/a/1")
      expect(res.status).toBe(200)
      expect(await res.text()).toBe("a")
    })

    it("日本語文字列を繰り返す", async () => {
      const res = await app.request(`/repeat/${encodeURIComponent("あ")}/3`)
      expect(res.status).toBe(200)
      expect(await res.text()).toBe("あああ")
    })
  })
})
