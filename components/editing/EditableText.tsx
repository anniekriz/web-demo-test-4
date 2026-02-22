'use client'

import styles from './EditableText.module.css'
import { insertPlainTextAtCursor, stripDisallowedMarkup } from './sanitizeEditableText'

type Props = {
  tag: 'h1' | 'h2' | 'p' | 'span'
  value: string
  editing: boolean
  className?: string
  onChange: (next: string) => void
}

const INVALID_INPUT_MESSAGE = 'Nepovolený vstup: HTML/SCRIPT tagy nejsou povolené.'

export function EditableText({ tag: Tag, value, editing, className, onChange }: Props) {
  return (
    <Tag
      className={`${styles.editable} ${editing ? styles.editing : ''} ${className ?? ''}`}
      contentEditable={editing}
      suppressContentEditableWarning
      onPaste={(event) => {
        if (!editing) return
        event.preventDefault()
        const { cleaned, blocked } = stripDisallowedMarkup(event.clipboardData.getData('text/plain'))
        if (blocked) window.alert(INVALID_INPUT_MESSAGE)
        insertPlainTextAtCursor(cleaned)
      }}
      onDrop={(event) => {
        if (!editing) return
        event.preventDefault()
        window.alert(INVALID_INPUT_MESSAGE)
      }}
      onBlur={(event) => {
        const { cleaned, blocked } = stripDisallowedMarkup(event.currentTarget.innerText)
        if (blocked) {
          event.currentTarget.innerText = cleaned
          window.alert(INVALID_INPUT_MESSAGE)
        }
        onChange(cleaned)
      }}
    >
      {value}
    </Tag>
  )
}
