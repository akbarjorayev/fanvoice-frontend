'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faInstagram, faYoutube, faTiktok, faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons'
import { faGlobe, faTrash, faPlus, faLink, faPencil, faCheck, faXmark, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { Dialog } from '@/components/ui/Dialog'
import { upsertSocialLink, deleteSocialLink } from '@/lib/api'
import type { SocialLink, Platform } from '@/types/social-link'
import { PLATFORMS, PLATFORM_META } from '@/types/social-link'

const ICONS: Record<Platform, IconDefinition> = {
  twitter:   faXTwitter,
  instagram: faInstagram,
  youtube:   faYoutube,
  tiktok:    faTiktok,
  telegram:  faTelegram,
  github:    faGithub,
  website:   faGlobe,
}

const PLACEHOLDERS: Record<Platform, string> = {
  twitter:   'https://x.com/username',
  instagram: 'https://instagram.com/username',
  youtube:   'https://youtube.com/@channel',
  tiktok:    'https://tiktok.com/@username',
  telegram:  'https://t.me/username',
  github:    'https://github.com/username',
  website:   'https://yourwebsite.com',
}

// Returns an error message string if the URL doesn't match the platform, or null if OK
function validatePlatformUrl(platform: Platform, url: string): string | null {
  const rules: Record<Platform, RegExp | null> = {
    twitter:   /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i,
    instagram: /^https?:\/\/(www\.)?instagram\.com\//i,
    youtube:   /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i,
    tiktok:    /^https?:\/\/(www\.)?tiktok\.com\//i,
    telegram:  /^https?:\/\/(t\.me|telegram\.me|telegram\.org)\//i,
    github:    /^https?:\/\/(www\.)?github\.com\//i,
    website:   /^https?:\/\/[^\s]+\.[^\s]{2,}/i,
  }
  const rule = rules[platform]
  if (rule && !rule.test(url)) {
    return platform === 'website'
      ? `Must be a valid URL (e.g. ${PLACEHOLDERS[platform]})`
      : `Must be a valid ${PLATFORM_META[platform].label} link (e.g. ${PLACEHOLDERS[platform]})`
  }
  return null
}

interface Props {
  open: boolean
  onClose: () => void
  initialLinks: SocialLink[]
}

export function SocialLinksDialog({ open, onClose, initialLinks }: Props) {
  const router = useRouter()
  const [links, setLinks] = useState<SocialLink[]>(initialLinks)

  // Add form
  const [platform, setPlatform] = useState<Platform>('twitter')
  const [url, setUrl] = useState('')
  const [adding, setAdding] = useState(false)

  // Edit mode
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null)
  const [editUrl, setEditUrl] = useState('')
  const [saving, setSaving] = useState(false)

  // Delete
  const [deletingPlatform, setDeletingPlatform] = useState<string | null>(null)

  const available = PLATFORMS.filter((p) => !links.some((l) => l.platform === p))

  // ── Add ────────────────────────────────────────────────────────────
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    const validationError = validatePlatformUrl(platform, trimmed)
    if (validationError) { toast.error(validationError); return }
    setAdding(true)
    try {
      const { link } = await upsertSocialLink(platform, trimmed)
      setLinks((prev) => {
        const without = prev.filter((l) => l.platform !== platform)
        return [...without, link].sort((a, b) => a.platform.localeCompare(b.platform))
      })
      toast.success('Link added!')
      setUrl('')
      const next = available.find((p) => p !== platform)
      if (next) setPlatform(next)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save link.')
    } finally {
      setAdding(false)
    }
  }

  // ── Edit ───────────────────────────────────────────────────────────
  function startEdit(link: SocialLink) {
    setEditingPlatform(link.platform)
    setEditUrl(link.url)
  }

  function cancelEdit() {
    setEditingPlatform(null)
    setEditUrl('')
  }

  async function handleSaveEdit(p: Platform) {
    const trimmed = editUrl.trim()
    if (!trimmed) return
    const validationError = validatePlatformUrl(p, trimmed)
    if (validationError) { toast.error(validationError); return }
    setSaving(true)
    try {
      const { link } = await upsertSocialLink(p, trimmed)
      setLinks((prev) => prev.map((l) => l.platform === p ? link : l))
      setEditingPlatform(null)
      toast.success('Link updated!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────
  async function handleDelete(p: string) {
    setDeletingPlatform(p)
    try {
      await deleteSocialLink(p)
      setLinks((prev) => prev.filter((l) => l.platform !== p))
      if (editingPlatform === p) setEditingPlatform(null)
      toast.success('Link removed.')
    } catch {
      toast.error('Failed to remove link.')
    } finally {
      setDeletingPlatform(null)
    }
  }

  function handleClose() {
    router.refresh()
    onClose()
  }

  const currentIcon = ICONS[platform] ?? faGlobe

  return (
    <Dialog open={open} onClose={handleClose} title="Social links" description={undefined}>
      {/* Existing links */}
      <div className="space-y-2 mb-5">
        {links.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-3">
            No links added yet.
          </p>
        ) : (
          links.map((link) => {
            const icon = ICONS[link.platform as Platform] ?? faGlobe
            const isEditing = editingPlatform === link.platform

            return (
              <div key={link.platform} className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Row */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <FontAwesomeIcon icon={icon} className="flex-shrink-0 text-gray-400 dark:text-gray-500" style={{ width: 15, height: 15 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {PLATFORM_META[link.platform as Platform]?.label ?? link.platform}
                    </p>
                    {!isEditing && (
                      <p className="text-sm text-gray-700 dark:text-gray-200 truncate">{link.url}</p>
                    )}
                  </div>
                  {/* Edit button */}
                  <button
                    onClick={() => isEditing ? cancelEdit() : startEdit(link)}
                    disabled={deletingPlatform === link.platform}
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title={isEditing ? 'Cancel edit' : 'Edit'}
                  >
                    <FontAwesomeIcon icon={isEditing ? faXmark : faPencil} style={{ width: 12, height: 12 }} />
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(link.platform)}
                    disabled={deletingPlatform === link.platform}
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-40"
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} style={{ width: 12, height: 12 }} />
                  </button>
                </div>

                {/* Inline edit form */}
                {isEditing && (
                  <div className="px-3 pb-3 space-y-1.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <FontAwesomeIcon icon={faLink} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ width: 12, height: 12 }} />
                        <input
                          type="url"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          placeholder={PLACEHOLDERS[link.platform as Platform]}
                          autoFocus
                          className="w-full pl-8 pr-3 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                        />
                      </div>
                      <button
                        onClick={() => handleSaveEdit(link.platform as Platform)}
                        disabled={saving || !editUrl.trim() || editUrl.trim() === link.url}
                        className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-violet-600 text-white text-xs font-semibold hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <FontAwesomeIcon icon={faCircleNotch} spin style={{ width: 11, height: 11 }} />
                        ) : (
                          <FontAwesomeIcon icon={faCheck} style={{ width: 11, height: 11 }} />
                        )}
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Add new link */}
      {available.length > 0 && (
        <form onSubmit={handleAdd} className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Add a link</p>

          <div className="flex gap-2">
            {/* Platform picker */}
            <div className="relative flex-shrink-0">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <FontAwesomeIcon icon={currentIcon} style={{ width: 14, height: 14 }} />
              </div>
              <select
                value={platform}
                onChange={(e) => { setPlatform(e.target.value as Platform); setUrl('') }}
                className="pl-8 pr-3 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition appearance-none"
              >
                {available.map((p) => (
                  <option key={p} value={p}>{PLATFORM_META[p].label}</option>
                ))}
              </select>
            </div>

            {/* URL input */}
            <div className="relative flex-1">
              <FontAwesomeIcon icon={faLink} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ width: 13, height: 13 }} />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={PLACEHOLDERS[platform]}
                required
                className="w-full pl-8 pr-3 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={adding || !url.trim()}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {adding ? (
              <FontAwesomeIcon icon={faCircleNotch} spin style={{ width: 14, height: 14 }} />
            ) : (
              <FontAwesomeIcon icon={faPlus} style={{ width: 13, height: 13 }} />
            )}
            {adding ? 'Adding…' : 'Add link'}
          </button>
        </form>
      )}

      {available.length === 0 && links.length > 0 && (
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-4">
          All platforms added.
        </p>
      )}

      <button
        onClick={handleClose}
        className="mt-4 w-full py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        Done
      </button>
    </Dialog>
  )
}
