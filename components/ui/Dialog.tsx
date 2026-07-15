'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
}

export function Dialog({ open, onClose, title, description, children }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Escape key + body scroll lock
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  // Auto-focus first input when opened
  useEffect(() => {
    if (!open) return
    const first = panelRef.current?.querySelector<HTMLElement>(
      'input, button, textarea, select, [tabindex]'
    )
    first?.focus()
  }, [open])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center sm:justify-center p-0 sm:p-4">
      {/* Backdrop — click anywhere outside panel to close */}
      <div
        className="animate-backdrop-in absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="animate-dialog-in relative w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800"
      >
        {/* Header — only rendered when title is provided */}
        {title && (
          <div className="px-6 pt-6 pb-2">
            <h2
              id="dialog-title"
              className="text-lg font-bold text-gray-900 dark:text-white"
            >
              {title}
            </h2>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
            )}
          </div>
        )}

        {/* Body */}
        <div className={title ? 'px-6 pb-6 pt-4' : ''}>{children}</div>
      </div>
    </div>,
    document.body
  )
}
