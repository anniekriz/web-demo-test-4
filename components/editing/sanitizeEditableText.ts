export const sanitizePlainText = (value: string) => {
  return value.replace(/\r\n?/g, '\n').replace(/\u00a0/g, ' ')
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

