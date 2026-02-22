'use client'

import { useRef } from 'react'
import styles from './EditableImage.module.css'

type Props = {
  editing: boolean
  needsAlt: boolean
  alt: string
  onSelect: (file: File) => void
  onAltChange: (alt: string) => void
  children: React.ReactNode
}

const MAX_IMAGE_SIZE_MB = 5
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

export function EditableImage({ editing, needsAlt, alt, onSelect, onAltChange, children }: Props) {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div className={styles.wrapper}>
      {editing && (
        <div className={styles.overlay}>
          <button className={styles.button} type="button" onClick={() => ref.current?.click()}>
            Change image
          </button>
          {needsAlt && (
            <input
              className={styles.altInput}
              placeholder="Required alt text"
              value={alt}
              onChange={(event) => onAltChange(event.target.value)}
            />
          )}
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return

              if (file.size > MAX_IMAGE_SIZE_BYTES) {
                window.alert(
                  `Obrázek je příliš velký. Maximální velikost je ${MAX_IMAGE_SIZE_MB} MB. Zmenšete prosím obrázek a zkuste to znovu.`,
                )
                event.currentTarget.value = ''
                return
              }

              onSelect(file)
            }}
          />
        </div>
      )}
      {children}
    </div>
  )
}
