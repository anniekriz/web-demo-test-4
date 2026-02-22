type LexicalTextChild = {
  text?: string
}

type LexicalNode = {
  children?: LexicalTextChild[]
}

type LexicalRoot = {
  root?: {
    children?: LexicalNode[]
  }
}

export const lexicalToPlainText = (value: unknown): string => {
  const children = (value as LexicalRoot | null | undefined)?.root?.children
  if (!Array.isArray(children)) return ''

  return children
    .map((node) =>
      Array.isArray(node.children)
        ? node.children.map((child) => child.text ?? '').join('')
        : '',
    )
    .join('\n')
}

export const plainTextToLexical = (text: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    children: text.split('\n').map((line) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      direction: null,
      version: 1,
      children: [
        {
          type: 'text',
          text: line,
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          version: 1,
        },
      ],
    })),
  },
})
