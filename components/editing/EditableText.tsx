'use client'

import styles from './EditableText.module.css'
import { insertPlainTextAtCursor, sanitizePlainText } from './sanitizeEditableText'

type Props = {
  tag: 'h1' | 'h2' | 'p' | 'span'
  value: string
  editing: boolean
  className?: string
  onChange: (next: string) => void
}

export function EditableText({ tag: Tag, value, editing, className, onChange }: Props) {
  return (
    <Tag
      className={`${styles.editable} ${editing ? styles.editing : ''} ${className ?? ''}`}
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
      onBlur={(event) => onChange(sanitizePlainText(event.currentTarget.innerText))}
    >
      {value}
    </Tag>
  )
}
