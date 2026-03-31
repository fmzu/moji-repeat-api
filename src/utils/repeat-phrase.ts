/**
 * 渡された文字列を指定文字数になるまで繰り返して返す
 */
export const repeatPhrase = (phrase: string, length: number): string => {
  const repeatNeeded = Math.ceil(length / phrase.length)
  return phrase.repeat(repeatNeeded).slice(0, length)
}
