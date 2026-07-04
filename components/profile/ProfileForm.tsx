'use client'

import { useState } from 'react'
import { updateProfile } from '@/lib/api'
import type { User } from '@/types/user'

interface Props {
  user: User
}

export function ProfileForm({ user }: Props) {
  const [displayName, setDisplayName] = useState(user.display_name ?? '')
  const [username, setUsername] = useState(user.username ?? '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    setErrorMsg(null)

    const patch: { display_name?: string; username?: string } = {}
    if (displayName.trim() !== (user.display_name ?? '')) patch.display_name = displayName.trim()
    if (username.trim() !== (user.username ?? '')) patch.username = username.trim()

    if (Object.keys(patch).length === 0) {
      setStatus('idle')
      return
    }

    try {
      await updateProfile(patch)
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save changes.')
      setStatus('error')
    }
  }

  const isDirty =
    displayName.trim() !== (user.display_name ?? '') ||
    username.trim() !== (user.username ?? '')

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Display name */}
      <div>
        <label
          htmlFor="display_name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Name
        </label>
        <input
          id="display_name"
          type="text"
          value={displayName}
          onChange={(e) => { setDisplayName(e.target.value); setStatus('idle') }}
          maxLength={100}
          placeholder="Your display name"
          className="w-full px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
        />
      </div>

      {/* Username */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Username
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm select-none">
            @
          </span>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value.toLowerCase()); setStatus('idle') }}
            minLength={3}
            maxLength={20}
            pattern="^[a-z0-9_]+$"
            placeholder="your_username"
            className="w-full pl-8 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
          />
        </div>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          3–20 characters. Letters, numbers, and underscores only.
        </p>
      </div>

      {/* Feedback */}
      {status === 'success' && (
        <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900/60 px-4 py-2.5 rounded-full text-center">
          Profile saved.
        </p>
      )}
      {status === 'error' && errorMsg && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60 px-4 py-2.5 rounded-full text-center">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={!isDirty || status === 'saving'}
        className="w-full px-4 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === 'saving' ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
