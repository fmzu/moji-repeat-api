import { describe, expect, it } from "vitest"
import { repeatPhrase } from "./repeat-phrase"

describe("repeatPhrase", () => {
  it("文字列を指定文字数になるまで繰り返す", () => {
    expect(repeatPhrase("abc", 10)).toBe("abcabcabca")
  })

  it("ちょうど割り切れる場合はそのまま返す", () => {
    expect(repeatPhrase("hello", 5)).toBe("hello")
  })

  it("1文字を繰り返す", () => {
    expect(repeatPhrase("a", 5)).toBe("aaaaa")
  })

  it("length=1 の場合は先頭1文字を返す", () => {
    expect(repeatPhrase("abc", 1)).toBe("a")
  })

  it("phraseとlengthが同じ長さの場合はそのまま返す", () => {
    expect(repeatPhrase("abcde", 5)).toBe("abcde")
  })
})
