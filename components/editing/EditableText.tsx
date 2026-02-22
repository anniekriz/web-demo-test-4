'use client'

import styles from './EditableText.module.css'
import { enforceTextLimit, insertPlainTextAtCursor, stripDisallowedMarkup } from './sanitizeEditableText'

type Props = {
  tag: 'h1' | 'h2' | 'p' | 'span'
  value: string
  editing: boolean
  className?: string
  maxLength?: number
  onChange: (next: string) => void
}

const INVALID_INPUT_MESSAGE = 'Nepovolený vstup: HTML/SCRIPT tagy nejsou povolené.'

const defaultMaxLengthByTag: Record<Props['tag'], number> = {
  h1: 120,
  h2: 120,
  p: 5000,
  span: 120,
}

export function EditableText({ tag: Tag, value, editing, className, maxLength, onChange }: Props) {
  const limit = maxLength ?? defaultMaxLengthByTag[Tag]

  const sanitizeAndLimit = (text: string) => {
    const { cleaned, blocked } = stripDisallowedMarkup(text)
    const { value: limited, trimmed } = enforceTextLimit(cleaned, limit)
    return { limited, blocked, trimmed }
  }

  return (
    <Tag
      className={`${styles.editable} ${editing ? styles.editing : ''} ${className ?? ''}`}
      contentEditable={editing}
      suppressContentEditableWarning
      onPaste={(event) => {
        if (!editing) return
        event.preventDefault()
        const { limited, blocked, trimmed } = sanitizeAndLimit(event.clipboardData.getData('text/plain'))
        if (blocked) window.alert(INVALID_INPUT_MESSAGE)
        if (trimmed) window.alert(`Text je příliš dlouhý. Maximální délka je ${limit} znaků.`)
        insertPlainTextAtCursor(limited)
      }}
      onDrop={(event) => {
        if (!editing) return
        event.preventDefault()
        window.alert(INVALID_INPUT_MESSAGE)
      }}
      onInput={(event) => {
        if (!editing) return
        const current = event.currentTarget.innerText
        const { value: limited, trimmed } = enforceTextLimit(current, limit)
        if (trimmed) {
          event.currentTarget.innerText = limited
          window.alert(`Text je příliš dlouhý. Maximální délka je ${limit} znaků.`)
        }
      }}
      onBlur={(event) => {
        const { limited, blocked, trimmed } = sanitizeAndLimit(event.currentTarget.innerText)
        if (blocked) {
          window.alert(INVALID_INPUT_MESSAGE)
        }
        if (trimmed) {
          window.alert(`Text je příliš dlouhý. Maximální délka je ${limit} znaků.`)
        }
        event.currentTarget.innerText = limited
        onChange(limited)
      }}
    >
      {value}
    </Tag>
  )
}
