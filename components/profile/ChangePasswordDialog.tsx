'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { changePassword } from '@/lib/api'
import { Dialog } from '@/components/ui/Dialog'

interface Props {
  open: boolean
  onClose: () => void
}

export function ChangePasswordDialog({ open, onClose }: Props) {
  const [current, setCurrent] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleClose() {
    if (loading) return
    setCurrent('')
    setNewPwd('')
    setConfirm('')
    setShowCurrent(false)
    setShowNew(false)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (newPwd !== confirm) {
      toast.error("New passwords don't match")
      return
    }

    setLoading(true)
    try {
      await changePassword(current, newPwd)
      toast.success('Password changed successfully')
      handleClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full h-11 px-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.06] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-transparent transition-all disabled:opacity-60'

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Change password"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Current password */}
        <div className="relative">
          <input
            name="current-password"
            type={showCurrent ? 'text' : 'password'}
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Current password"
            required
            disabled={loading}
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <FontAwesomeIcon
              icon={showCurrent ? faEyeSlash : faEye}
              style={{ width: 14, height: 14 }}
            />
          </button>
        </div>

        {/* New password */}
        <div className="space-y-1.5">
          <div className="relative">
            <input
              name="new-password"
              type={showNew ? 'text' : 'password'}
              autoComplete="new-password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="New password"
              required
              disabled={loading}
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <FontAwesomeIcon
                icon={showNew ? faEyeSlash : faEye}
                style={{ width: 14, height: 14 }}
              />
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 px-1">
            Min 8 characters, at least 1 uppercase letter and 1 number
          </p>
        </div>

        {/* Confirm new password */}
        <input
          name="confirm-new-password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm new password"
          required
          disabled={loading}
          className={inputClass}
        />

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-60"
          >
            {loading && (
              <FontAwesomeIcon icon={faCircleNotch} spin style={{ width: 13, height: 13 }} />
            )}
            {loading ? 'Saving…' : 'Change password'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
