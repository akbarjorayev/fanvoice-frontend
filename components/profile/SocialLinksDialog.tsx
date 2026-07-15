'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faInstagram, faYoutube, faTiktok, faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons'
import { faGlobe, faTrash, faLink, faCheck, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { PenLine, X } from 'lucide-react'
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
      : `Must be a valid ${PLATFORM_META[platform].label} link`
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

  const [addOpen, setAddOpen] = useState(false)
  const [addPlatform, setAddPlatform] = useState<Platform>(
    () => PLATFORMS.find(p => !initialLinks.some(l => l.platform === p)) ?? 'twitter'
  )

  useEffect(() => {
    if (!open) setAddOpen(false)
  }, [open])
  const [addUrl, setAddUrl] = useState('')
  const [adding, setAdding] = useState(false)

  const [editingPlatform, setEditingPlatform] = useState<string | null>(null)
  const [editUrl, setEditUrl] = useState('')
  const [saving, setSaving] = useState(false)

  const [deletingPlatform, setDeletingPlatform] = useState<string | null>(null)
  const [confirmDeletePlatform, setConfirmDeletePlatform] = useState<string | null>(null)

  const available = PLATFORMS.filter((p) => !links.some((l) => l.platform === p))

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!addOpen) { setAddOpen(true); return }
    const trimmed = addUrl.trim()
    if (!trimmed) return
    const err = validatePlatformUrl(addPlatform, trimmed)
    if (err) { toast.error(err); return }
    setAdding(true)
    try {
      const { link } = await upsertSocialLink(addPlatform, trimmed)
      setLinks((prev) => [...prev.filter((l) => l.platform !== addPlatform), link]
        .sort((a, b) => a.platform.localeCompare(b.platform)))
      toast.success('Link added!')
      setAddUrl('')
      const next = available.find((p) => p !== addPlatform)
      if (next) setAddPlatform(next)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save link.')
    } finally {
      setAdding(false)
    }
  }

  async function handleSaveEdit(p: Platform) {
    const trimmed = editUrl.trim()
    if (!trimmed) return
    const err = validatePlatformUrl(p, trimmed)
    if (err) { toast.error(err); return }
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

  return (
    <Dialog open={open} onClose={handleClose} title="Social links">
      {/* Existing links */}
      <div className="space-y-2 mb-5">
        {links.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
            No links added yet.
          </p>
        ) : links.map((link) => {
          const icon = ICONS[link.platform as Platform] ?? faGlobe
          const isEditing = editingPlatform === link.platform
          const isDeleting = deletingPlatform === link.platform
          const label = PLATFORM_META[link.platform as Platform]?.label ?? link.platform

          return (
            <div key={link.platform} className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
              {isEditing ? (
                /* Edit mode — replaces row */
                <div className="p-3 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={icon} className="text-gray-500 dark:text-gray-400" style={{ width: 12, height: 12 }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
                  </div>
                  <div className="relative">
                    <FontAwesomeIcon icon={faLink} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ width: 12, height: 12 }} />
                    <input
                      type="url"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder={PLACEHOLDERS[link.platform as Platform]}
                      autoFocus
                      className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingPlatform(null); setEditUrl('') }}
                      className="flex-1 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(link.platform as Platform)}
                      disabled={saving || !editUrl.trim() || editUrl.trim() === link.url}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-40"
                    >
                      {saving
                        ? <FontAwesomeIcon icon={faCircleNotch} spin style={{ width: 12, height: 12 }} />
                        : <FontAwesomeIcon icon={faCheck} style={{ width: 12, height: 12 }} />}
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Normal row */
                <div className="flex items-center justify-between gap-3 px-3 py-3">
                  {/* Left: icon + info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={icon} className="text-gray-500 dark:text-gray-400" style={{ width: 14, height: 14 }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500">{label}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-200 truncate">{link.url}</p>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {confirmDeletePlatform === link.platform ? (
                      <>
                        <span className="text-xs font-medium text-red-500 mr-1">Remove?</span>
                        <button
                          onClick={() => setConfirmDeletePlatform(null)}
                          className="px-2.5 py-1 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          No
                        </button>
                        <button
                          onClick={() => { setConfirmDeletePlatform(null); handleDelete(link.platform) }}
                          disabled={isDeleting}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-40"
                        >
                          {isDeleting
                            ? <FontAwesomeIcon icon={faCircleNotch} spin style={{ width: 10, height: 10 }} />
                            : 'Yes'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditingPlatform(link.platform); setEditUrl(link.url) }}
                          disabled={isDeleting}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors disabled:opacity-40"
                        >
                          <PenLine size={13} />
                        </button>
                        <button
                          onClick={() => setConfirmDeletePlatform(link.platform)}
                          disabled={isDeleting}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-40"
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add new link */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
        {available.length === 0 ? (
          <p className="text-xs text-center text-gray-400 dark:text-gray-500">All platforms added.</p>
        ) : (
          <form onSubmit={handleAdd}>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${addOpen ? 'max-h-[200px] opacity-100 mb-3' : 'max-h-0 opacity-0'}`}>
              <div className="p-0.5">
                {/* Platform icon picker */}
                <div className="flex flex-wrap justify-between gap-2">
                  {available.map((p) => (
                    <button
                      key={p}
                      type="button"
                      title={PLATFORM_META[p].label}
                      onClick={() => { setAddPlatform(p); setAddUrl('') }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                        addPlatform === p
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <FontAwesomeIcon icon={ICONS[p]} style={{ width: 16, height: 16 }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* URL input — shown after platform picked */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${addOpen ? 'max-h-[80px] opacity-100 mb-3' : 'max-h-0 opacity-0'}`}>
              <div className="p-0.5">
                <div className="relative">
                  <FontAwesomeIcon icon={faLink} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ width: 12, height: 12 }} />
                  <input
                    type="url"
                    value={addUrl}
                    onChange={(e) => setAddUrl(e.target.value)}
                    placeholder={PLACEHOLDERS[addPlatform]}
                    required={addOpen}
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={adding}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors disabled:opacity-40"
            >
              {adding
                ? <FontAwesomeIcon icon={faCircleNotch} spin style={{ width: 13, height: 13 }} />
                : <FontAwesomeIcon icon={faLink} style={{ width: 13, height: 13 }} />}
              {adding ? 'Adding…' : 'Add link'}
            </button>
          </form>
        )}
      </div>
    </Dialog>
  )
}
