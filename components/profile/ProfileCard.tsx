'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft, PenLine, Mail, Calendar, BadgeCheck, LogOut, LinkIcon,
  Share2, KeyRound, QrCode, Sparkles, AlertCircle,
} from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { EditProfileDialog } from './EditProfileDialog'
import { SocialLinksDialog } from './SocialLinksDialog'
import { SocialLinks } from './SocialLinks'
import { ShareDialog } from './ShareDialog'
import { QRDialog } from './QRDialog'
import { BecomeCreatorDialog } from './BecomeCreatorDialog'
import { GetVerifiedDialog } from './GetVerifiedDialog'
import { ChangePasswordDialog } from './ChangePasswordDialog'
import { Dialog } from '@/components/ui/Dialog'
import { logout } from '@/lib/api'
import type { User } from '@/types/user'
import type { SocialLink } from '@/types/social-link'

interface Props {
  user: User
  links: SocialLink[]
}

function formatPrice(n: number) {
  return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`
}


export function ProfileCard({ user, links }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // dialogs
  const [editOpen, setEditOpen] = useState(false)
  const [linksOpen, setLinksOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [creatorOpen, setCreatorOpen] = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [changePwdOpen, setChangePwdOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // creator state
  const [isCreator, setIsCreator] = useState(!!user.is_creator)

  useEffect(() => {
    if (searchParams.get('becomecreator') === '1' && !isCreator) {
      setCreatorOpen(true)
      router.replace('/me')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const displayName = user.display_name ?? user.email.split('@')[0]
  const bio = user.creator_bio ?? ''
  const price = user.creator_min_price ?? 0
  const profileIncomplete = isCreator && (!bio || price === 0)

  const initial = displayName.charAt(0).toUpperCase()
  const fmt = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
  const memberSince = fmt.format(new Date(user.created_at))
  const creatorSince = user.creator_since ? fmt.format(new Date(user.creator_since)) : null
  const verifiedSince = user.creator_verified_at ? fmt.format(new Date(user.creator_verified_at)) : null

  async function handleLogout() {
    setLoggingOut(true)
    await logout().catch(() => null)
    router.push('/login')
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

        {/* Cover */}
        <div className="h-52 bg-gradient-to-br from-violet-700 via-violet-500 to-fuchsia-500 relative">
          <Link
            href="/dashboard"
            className="absolute top-5 left-5 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
        </div>

        <div className="max-w-2xl mx-auto px-6">

          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-14 mb-5">
            <div className="relative">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={displayName}
                  width={112}
                  height={112}
                  priority
                  className="rounded-full ring-4 ring-gray-50 dark:ring-gray-950 object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full ring-4 ring-gray-50 dark:ring-gray-950 bg-gradient-to-br from-white via-violet-400 to-blue-500 flex items-center justify-center">
                  <span className="text-4xl font-black text-white drop-shadow">{initial}</span>
                </div>
              )}
            </div>

            <div className="mb-2 flex items-center gap-2">
              <button
                onClick={() => setQrOpen(true)}
                title="Show QR code"
                className="inline-flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 sm:gap-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 bg-white dark:bg-gray-900 shadow-sm transition-colors"
              >
                <QrCode size={14} />
                <span className="hidden sm:inline">QR</span>
              </button>
              <button
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 sm:gap-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 bg-white dark:bg-gray-900 shadow-sm transition-colors"
              >
                <Share2 size={14} />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={() => setEditOpen(true)}
                className="inline-flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 sm:gap-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 bg-white dark:bg-gray-900 shadow-sm transition-colors"
              >
                <PenLine size={14} />
                <span className="hidden sm:inline">Edit profile</span>
              </button>
            </div>
          </div>

          {/* Name + badges */}
          <div className="mb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{displayName}</h1>
              {user.creator_verified_at && <BadgeCheck size={22} className="text-blue-500 flex-shrink-0" />}
              {isCreator && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-xs font-semibold text-violet-600 dark:text-violet-400">
                  <Sparkles size={10} />
                  Creator
                </span>
              )}
            </div>
            {user.username
              ? <p className="text-gray-400 dark:text-gray-500 mt-1">@{user.username}</p>
              : <p className="text-sm italic text-gray-300 dark:text-gray-600 mt-1">No username set</p>}
          </div>

          {/* ── Creator section ───────────────────────────────── */}
          {isCreator && (
            <div className="mb-6 space-y-3">

              {/* Incomplete profile — not dismissible */}
              {profileIncomplete && (
                <div className="flex gap-3 px-4 py-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/[0.08] border border-amber-200/80 dark:border-amber-500/20">
                  <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                      Complete your creator profile
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5 leading-relaxed">
                      {!bio && price === 0
                        ? 'Add a bio and set your minimum message price so fans know what to expect.'
                        : !bio
                          ? 'Add a bio to introduce yourself to your fans.'
                          : 'Set a minimum message price for fan messages.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Bio — read-only, edit via Edit profile */}
              <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-4">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2.5">Bio</p>
                {bio
                  ? <pre className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">{bio}</pre>
                  : <p className="text-sm italic text-gray-300 dark:text-gray-600">No bio yet — add one in Edit profile</p>}
              </div>

              {/* Min price — read-only, edit via Edit profile */}
              <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-4">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2.5">Min price per message</p>
                {price > 0
                  ? <p className="text-sm text-gray-700 dark:text-gray-200">{formatPrice(price)}</p>
                  : <p className="text-sm italic text-gray-300 dark:text-gray-600">No minimum — set one in Edit profile</p>}
              </div>

              {/* Social links */}
              <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] px-4 py-3.5">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2.5">Social links</p>
                <div className="flex items-center gap-3">
                  <SocialLinks links={links} />
                  <button
                    onClick={() => setLinksOpen(true)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    <LinkIcon size={13} />
                    {links.length === 0 ? 'Add links' : 'Manage links'}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ── Non-creator social links (display only) ───────── */}
          {!isCreator && links.length > 0 && (
            <div className="mb-5">
              <SocialLinks links={links} />
            </div>
          )}

          <div className="border-t border-gray-100 dark:border-gray-800 mb-6" />

          {/* Info rows */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <Mail size={15} className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={15} className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
              <span>Member since {memberSince}</span>
            </div>
            {isCreator && creatorSince && (
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <Sparkles size={15} className="flex-shrink-0 text-violet-400 dark:text-violet-500" />
                <span>Creator since {creatorSince}</span>
              </div>
            )}
            {verifiedSince && (
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <BadgeCheck size={15} className="flex-shrink-0 text-blue-500" />
                <span>Verified since {verifiedSince}</span>
              </div>
            )}
          </div>

          {/* Become a Creator */}
          {!isCreator && (
            <div className="mb-4 flex items-center justify-between px-4 py-3.5 rounded-2xl border border-violet-100 dark:border-violet-500/20 bg-violet-50/60 dark:bg-violet-500/[0.06]">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-violet-500 dark:text-violet-400 shrink-0" />
                <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">Become a Creator</span>
              </div>
              <button
                onClick={() => setCreatorOpen(true)}
                className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              >
                Get started →
              </button>
            </div>
          )}

          {/* Get Verified */}
          {isCreator && !user.creator_verified_at && (
            <div className="mb-8 flex items-center justify-between px-4 py-3.5 rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-white/[0.03]">
              <div className="flex items-center gap-2">
                <BadgeCheck size={15} className="text-blue-500 shrink-0" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Get Verified</span>
              </div>
              <button
                onClick={() => setVerifyOpen(true)}
                className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              >
                Apply →
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-4 pb-12">
            {user.has_password && (
              <button
                onClick={() => setChangePwdOpen(true)}
                className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                <KeyRound size={14} />
                Change password
              </button>
            )}
            <button
              onClick={() => setConfirmLogout(true)}
              className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>

        </div>
      </div>

      {/* Dialogs */}
      <BecomeCreatorDialog
        open={creatorOpen}
        onClose={() => setCreatorOpen(false)}
        onSuccess={() => { setIsCreator(true); setCreatorOpen(false) }}
      />
      <GetVerifiedDialog open={verifyOpen} onClose={() => setVerifyOpen(false)} />

      <EditProfileDialog open={editOpen} onClose={() => setEditOpen(false)} user={user} />
      <ChangePasswordDialog open={changePwdOpen} onClose={() => setChangePwdOpen(false)} />

      {user.username && (
        <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} username={user.username} />
      )}
      {user.username && (
        <QRDialog open={qrOpen} onClose={() => setQrOpen(false)} username={user.username} />
      )}

      <SocialLinksDialog open={linksOpen} onClose={() => setLinksOpen(false)} initialLinks={links} />

      <Dialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        title="Sign out?"
        description="You'll be returned to the login screen and will need to sign in again."
      >
        <div className="flex gap-3">
          <button
            onClick={() => setConfirmLogout(false)}
            disabled={loggingOut}
            className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loggingOut
              ? <FontAwesomeIcon icon={faCircleNotch} spin style={{ width: 15, height: 15 }} />
              : <LogOut size={15} />}
            {loggingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </Dialog>
    </>
  )
}
