'use client'

import { useEffect, useRef } from 'react'
import styles from './EditableRichText.module.css'
import { lexicalToPlainText, plainTextToLexical } from '@/lib/richtext'
import { enforceTextLimit, insertPlainTextAtCursor, stripDisallowedMarkup } from './sanitizeEditableText'

type Props = {
  value: unknown
  editing: boolean
  maxLength?: number
  onChange: (next: unknown) => void
}

const INVALID_INPUT_MESSAGE = 'Nepovolený vstup: HTML/SCRIPT tagy nejsou povolené.'
const DEFAULT_RICH_TEXT_MAX_LENGTH = 10000

export function EditableRichText({ value, editing, maxLength = DEFAULT_RICH_TEXT_MAX_LENGTH, onChange }: Props) {
  const text = lexicalToPlainText(value)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (document.activeElement === ref.current) return
    ref.current.innerText = text
  }, [text])

  const sanitizeAndLimit = (input: string) => {
    const { cleaned, blocked } = stripDisallowedMarkup(input)
    const { value: limited, trimmed } = enforceTextLimit(cleaned, maxLength)
    return { limited, blocked, trimmed }
  }

  return (
    <div
      ref={ref}
      className={`${styles.body} ${editing ? styles.editing : ''}`}
      contentEditable={editing}
      suppressContentEditableWarning
      onPaste={(event) => {
        if (!editing) return
        event.preventDefault()
        const { limited, blocked, trimmed } = sanitizeAndLimit(event.clipboardData.getData('text/plain'))
        if (blocked) window.alert(INVALID_INPUT_MESSAGE)
        if (trimmed) window.alert(`Text je příliš dlouhý. Maximální délka je ${maxLength} znaků.`)
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
        const { value: limited, trimmed } = enforceTextLimit(current, maxLength)
        if (trimmed) {
          event.currentTarget.innerText = limited
          window.alert(`Text je příliš dlouhý. Maximální délka je ${maxLength} znaků.`)
        }
      }}
      onBlur={(event) => {
        const { limited, blocked, trimmed } = sanitizeAndLimit(event.currentTarget.innerText)
        if (blocked) {
          window.alert(INVALID_INPUT_MESSAGE)
        }
        if (trimmed) {
          window.alert(`Text je příliš dlouhý. Maximální délka je ${maxLength} znaků.`)
        }
        event.currentTarget.innerText = limited
        onChange(plainTextToLexical(limited))
      }}
    />
  )
}
