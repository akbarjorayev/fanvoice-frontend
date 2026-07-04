'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { MessageCircle, DollarSign, Link2, AlertTriangle, FileText } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { becomeCreator } from '@/lib/api'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const DELAY = 10

const BENEFITS = [
  { icon: MessageCircle, text: 'Receive messages directly from your fans' },
  { icon: DollarSign,    text: 'Earn money — set your own price per message' },
  { icon: Link2,         text: 'Add social links to your public profile' },
  { icon: FileText,      text: 'Write a bio to introduce yourself to fans' },
]

export function BecomeCreatorDialog({ open, onClose, onSuccess }: Props) {
  const [seconds, setSeconds] = useState(DELAY)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setSeconds(DELAY)
    const id = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) { clearInterval(id); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [open])

  async function handleConfirm() {
    if (seconds > 0) {
      toast.error(`Please wait ${seconds} more second${seconds === 1 ? '' : 's'} before confirming.`)
      return
    }
    setLoading(true)
    try {
      await becomeCreator()
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Become a Creator">
      {/* Benefits list */}
      <div className="space-y-3 mb-5">
        {BENEFITS.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
              <Icon size={14} className="text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
          </div>
        ))}
      </div>

      {/* Irreversibility warning */}
      <div className="flex gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 mb-5">
        <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
          <strong>This is permanent.</strong> Once you become a creator you cannot go back to a regular account. There is no undo.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={seconds > 0 || loading}
          className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing…' : seconds > 0 ? `Wait ${seconds}s…` : 'Yes, become a creator'}
        </button>
      </div>
    </Dialog>
  )
}
