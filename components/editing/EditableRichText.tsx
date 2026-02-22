'use client'

import styles from './EditableRichText.module.css'
import { lexicalToPlainText, plainTextToLexical } from '@/lib/richtext'
import { insertPlainTextAtCursor, sanitizePlainText } from './sanitizeEditableText'

type Props = {
  value: unknown
  editing: boolean
  onChange: (next: unknown) => void
}

export function EditableRichText({ value, editing, onChange }: Props) {
  const text = lexicalToPlainText(value)
  return (
    <div
      className={`${styles.body} ${editing ? styles.editing : ''}`}
      contentEditable={editing}
      suppressContentEditableWarning
      onPaste={(event) => {
        if (!editing) return
        event.preventDefault()
        const plain = sanitizePlainText(event.clipboardData.getData('text/plain'))
        insertPlainTextAtCursor(plain)
      }}
      onDrop={(event) => {
        if (!editing) return
        event.preventDefault()
      }}
      onBlur={(event) => onChange(plainTextToLexical(sanitizePlainText(event.currentTarget.innerText)))}
    >
      {text.split('\n').map((line, index) => (
        <p key={`${line}-${index}`}>{line}</p>
      ))}
    </div>
  )
}
