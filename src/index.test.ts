import { describe, it, expect } from "vitest"
import app from "./index"

describe("GET /repeat/:phrase/:length", () => {
  it("文字列を指定回数分の長さに繰り返す", async () => {
    const res = await app.request("/repeat/abc/7")
    expect(res.status).toBe(200)
    expect(await res.text()).toBe("abcabca")
  })

  it("phraseより短いlengthで切り詰められる", async () => {
    const res = await app.request("/repeat/abcdef/3")
    expect(res.status).toBe(200)
    expect(await res.text()).toBe("abc")
  })

  it("lengthとphraseが同じ長さ", async () => {
    const res = await app.request("/repeat/hello/5")
    expect(res.status).toBe(200)
    expect(await res.text()).toBe("hello")
  })

  it("1文字のphraseを繰り返す", async () => {
    const res = await app.request("/repeat/a/10")
    expect(res.status).toBe(200)
    expect(await res.text()).toBe("aaaaaaaaaa")
  })

  it("日本語を繰り返せる", async () => {
    const res = await app.request(`/repeat/${encodeURIComponent("あ")}/3`)
    expect(res.status).toBe(200)
    expect(await res.text()).toBe("あああ")
  })

  it("length=1 で1文字だけ返す", async () => {
    const res = await app.request("/repeat/abc/1")
    expect(res.status).toBe(200)
    expect(await res.text()).toBe("a")
  })
})

describe("バリデーションエラー", () => {
  it("lengthが0だと400", async () => {
    const res = await app.request("/repeat/abc/0")
    expect(res.status).toBe(400)
  })

  it("lengthが負の数だと400", async () => {
    const res = await app.request("/repeat/abc/-1")
    expect(res.status).toBe(400)
  })

  it("lengthが数字以外だと400", async () => {
    const res = await app.request("/repeat/abc/foo")
    expect(res.status).toBe(400)
  })

  it("lengthが上限(10000)を超えると400", async () => {
    const res = await app.request("/repeat/abc/10001")
    expect(res.status).toBe(400)
    expect(await res.text()).toContain("10000以下")
  })

  it("phraseが30文字を超えると400", async () => {
    const longPhrase = "a".repeat(31)
    const res = await app.request(`/repeat/${longPhrase}/5`)
    expect(res.status).toBe(400)
    expect(await res.text()).toContain("30文字以下")
  })
})
