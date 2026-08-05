'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const EXIT_DURATION_MS = 150

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

// querySelectorAll doesn't know about `inert` — an inert element still matches
// the selector but silently no-ops on .focus(), so it has to be filtered out here.
function getFocusable(container: HTMLElement | null): HTMLElement[] {
  if (!container) return []
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter((el) => !el.closest('[inert]'))
}

interface DialogProps {
  open: boolean
  onClose: () => void
  /** Called on Escape instead of onClose, e.g. to step back to a parent view rather than closing entirely. Defaults to onClose. */
  onEscape?: () => void
  title?: string
  description?: string
  children: React.ReactNode
}

export function Dialog({ open, onClose, onEscape, title, description, children }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const prevOpenRef = useRef(open)

  // Adjust mount/closing state synchronously during render (not in an effect) so
  // the panel is already in the DOM by the time any same-render effects run —
  // e.g. QRDialog's canvas-mount effect, or the auto-focus effect below.
  if (open !== prevOpenRef.current) {
    prevOpenRef.current = open
    if (open) {
      setMounted(true)
      setClosing(false)
    } else if (mounted) {
      setClosing(true)
    }
  }

  // Once closing starts, unmount after the exit animation finishes
  useEffect(() => {
    if (!closing) return
    const timer = setTimeout(() => {
      setMounted(false)
      setClosing(false)
    }, EXIT_DURATION_MS)
    return () => clearTimeout(timer)
  }, [closing])

  // Escape key, Tab focus trap, body scroll lock, and focus restore on close
  useEffect(() => {
    if (!open) return
    const trigger = document.activeElement as HTMLElement | null

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        (onEscape ?? onClose)()
        return
      }
      if (e.key !== 'Tab') return

      const focusable = getFocusable(panelRef.current)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      const withinPanel = !!active && panelRef.current?.contains(active)

      if (e.shiftKey) {
        if (!withinPanel || active === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (!withinPanel || active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      trigger?.focus?.()
    }
  }, [open, onClose, onEscape])

  // Auto-focus first input when opened
  useEffect(() => {
    if (!open) return
    getFocusable(panelRef.current)[0]?.focus()
  }, [open])

  if (!mounted || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center sm:justify-center p-0 sm:p-4">
      {/* Backdrop — click anywhere outside panel to close */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm ${closing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={`relative w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 ${closing ? 'animate-dialog-out' : 'animate-dialog-in'}`}
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
