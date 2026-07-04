'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, AtSign, Check } from 'lucide-react'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { Dialog } from '@/components/ui/Dialog'
import { updateProfile, updateCreator } from '@/lib/api'
import type { User as UserType } from '@/types/user'

interface Props {
  open: boolean
  onClose: () => void
  user: UserType
}

export function EditProfileDialog({ open, onClose, user }: Props) {
  const router = useRouter()
  const displayNameInit = user.display_name ?? ''
  const usernameInit = user.username ?? ''
  const bioInit = user.creator_bio ?? ''
  const priceInit = user.creator_min_price ?? 0

  const [displayName, setDisplayName] = useState(displayNameInit)
  const [username, setUsername] = useState(usernameInit)
  const [bio, setBio] = useState(bioInit)
  const [priceThousands, setPriceThousands] = useState(priceInit > 0 ? String(priceInit / 1000) : '')
  const [saving, setSaving] = useState(false)

  const profileDirty =
    displayName.trim() !== displayNameInit ||
    username.trim() !== usernameInit
  const bioDirty = user.is_creator && bio.trim() !== bioInit
  const priceDirty = user.is_creator && priceThousands !== (priceInit > 0 ? String(priceInit / 1000) : '')
  const isDirty = profileDirty || bioDirty || priceDirty

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isDirty) return

    const newName = displayName.trim()
    const newUsername = username.trim()
    const nameChanged = newName !== displayNameInit
    const usernameChanged = newUsername !== usernameInit

    if (nameChanged) {
      if (newName.length === 0) { toast.error('Name cannot be empty'); return }
      if (newName.length < 2) { toast.error('Name must be at least 2 characters'); return }
    }
    if (usernameChanged) {
      if (newUsername.length === 0) { toast.error('Username cannot be empty'); return }
      if (newUsername.length < 2) { toast.error('Username must be at least 2 characters'); return }
      if (!/^[a-z_][a-z0-9_]*$/.test(newUsername)) {
        toast.error('Username must start with a letter or _ and contain only letters, numbers, and _')
        return
      }
    }

    setSaving(true)
    try {
      const tasks: Promise<unknown>[] = []
      const n = parseInt(priceThousands, 10)
      const actual = priceThousands === '' ? 0 : (isNaN(n) ? 0 : n * 1000)

      if (profileDirty) {
        const patch: { display_name?: string; username?: string } = {}
        if (nameChanged) patch.display_name = newName
        if (usernameChanged) patch.username = newUsername
        tasks.push(updateProfile(patch))
      }

      if (bioDirty || priceDirty) {
        tasks.push(updateCreator({
          ...(bioDirty ? { bio: bio.trim() } : {}),
          ...(priceDirty ? { min_price_per_message: actual } : {}),
        }))
      }

      await Promise.all(tasks)
      toast.success('Profile saved!')
      router.refresh()
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save.')
      setSaving(false)
    }
  }

  function handleClose() {
    setDisplayName(displayNameInit)
    setUsername(usernameInit)
    setBio(bioInit)
    setPriceThousands(priceInit > 0 ? String(priceInit / 1000) : '')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Edit profile">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Display name */}
        <div>
          <label htmlFor="ep-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Display name
          </label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              id="ep-name"
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              minLength={2}
              maxLength={30}
              placeholder="Your display name"
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label htmlFor="ep-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Username
          </label>
          <div className="relative">
            <AtSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              id="ep-username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase())}
              minLength={2}
              maxLength={20}
              pattern="[a-z_][a-z0-9_]*"
              placeholder="your_username"
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            2–20 chars · start with a letter or _ · letters, numbers, _ only
          </p>
        </div>

        {/* Bio + price — creators only */}
        {user.is_creator && (
          <>
            <div>
              <label htmlFor="ep-bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Bio
              </label>
              <textarea
                id="ep-bio"
                value={bio}
                onChange={e => setBio(e.target.value.slice(0, 200))}
                rows={3}
                placeholder="Tell your fans about yourself…"
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
              <p className="text-right text-xs text-gray-400 dark:text-gray-500 mt-1">{bio.length}/200</p>
            </div>

            <div>
              <label htmlFor="ep-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Min price per message
              </label>
              <div className="flex items-center gap-2">
              <div className="flex items-stretch rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800 w-fit focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition">
                <input
                  id="ep-price"
                  type="number"
                  min={1}
                  max={1000}
                  value={priceThousands}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '')
                    if (val === '' || parseInt(val, 10) <= 1000) setPriceThousands(val)
                  }}
                  placeholder="50"
                  className="w-24 px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="flex items-center pr-4 text-sm text-gray-400 dark:text-gray-500 select-none">
                  000 so&apos;m
                </span>
              </div>
              {priceInit > 0 && priceThousands !== '' && (
                <button
                  type="button"
                  onClick={() => setPriceThousands('')}
                  className="shrink-0 px-3 py-2 rounded-full text-xs font-semibold text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  Remove
                </button>
              )}
              </div>
              <p className="text-xs mt-1.5 text-gray-400 dark:text-gray-500">
                {priceThousands
                  ? <span className="text-violet-500 dark:text-violet-400">= {parseInt(priceThousands, 10).toLocaleString('uz-UZ')} 000 so&apos;m</span>
                  : 'Leave empty for no minimum'
                }
                {' · '}Max 1&nbsp;000&nbsp;000 so&apos;m
              </p>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isDirty || saving}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving
              ? <FontAwesomeIcon icon={faCircleNotch} spin style={{ width: 15, height: 15 }} />
              : <Check size={15} />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

      </form>
    </Dialog>
  )
}
