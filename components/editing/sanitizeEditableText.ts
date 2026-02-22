const TAG_LIKE_PATTERN = /<\/?[a-z][^>]*>/gi

export const sanitizePlainText = (value: string) => {
  return value.replace(/\r\n?/g, '\n').replace(/\u00a0/g, ' ')
}

export const stripDisallowedMarkup = (value: string) => {
  const normalized = sanitizePlainText(value)
  const cleaned = normalized.replace(TAG_LIKE_PATTERN, '')
  return {
    cleaned,
    blocked: cleaned !== normalized,
  }
}

export const enforceTextLimit = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return { value, trimmed: false }
  }

  return {
    value: value.slice(0, maxLength),
    trimmed: true,
  }
}

export const insertPlainTextAtCursor = (text: string) => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  range.deleteContents()
  const node = document.createTextNode(text)
  range.insertNode(node)
  range.setStartAfter(node)
  range.collapse(true)

  selection.removeAllRanges()
  selection.addRange(range)
}
