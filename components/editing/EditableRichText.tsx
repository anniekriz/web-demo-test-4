'use client'

import { useEffect, useRef } from 'react'
import styles from './EditableRichText.module.css'
import { lexicalToPlainText, plainTextToLexical } from '@/lib/richtext'
import { insertPlainTextAtCursor, stripDisallowedMarkup } from './sanitizeEditableText'

type Props = {
  value: unknown
  editing: boolean
  onChange: (next: unknown) => void
}

const INVALID_INPUT_MESSAGE = 'Nepovolený vstup: HTML/SCRIPT tagy nejsou povolené.'

export function EditableRichText({ value, editing, onChange }: Props) {
  const text = lexicalToPlainText(value)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (document.activeElement === ref.current) return
    ref.current.innerText = text
  }, [text])

  return (
    <div
      ref={ref}
      className={`${styles.body} ${editing ? styles.editing : ''}`}
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
        onChange(plainTextToLexical(cleaned))
      }}
    />
  )
}
