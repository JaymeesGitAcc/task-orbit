export const limitText = (text?: string, limit = 50) => {
  if (!text?.trim()) return
  const str = text.split("")
  const length = str.length
  return length > limit ? str.slice(0, limit + 1).join("") + " ... " : text
}
