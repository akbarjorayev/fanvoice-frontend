'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  PenLine, Mail, Calendar, BadgeCheck, LogOut, LinkIcon,
  Share2, KeyRound, QrCode, Sparkles, AlertCircle, Coins,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { SocialLinks } from './SocialLinks'
import { Avatar } from '@/components/ui/Avatar'
import { CreatorBadge } from '@/components/ui/UserBadges'
import { formatPrice } from '@/lib/fees'
import { formatLongMonthYear, type DateNames } from '@/lib/i18n/formatDate'
import type { User } from '@/types/user'
import type { SocialLink } from '@/types/social-link'

// Dialogs are only needed after a user interaction (opening one), so they're
// lazy-loaded instead of shipped in the initial /me bundle.
const EditProfileDialog = dynamic(() => import('./EditProfileDialog').then(m => m.EditProfileDialog))
const SocialLinksDialog = dynamic(() => import('./SocialLinksDialog').then(m => m.SocialLinksDialog))
const ShareDialog = dynamic(() => import('./ShareDialog').then(m => m.ShareDialog))
const QRDialog = dynamic(() => import('./QRDialog').then(m => m.QRDialog))
const BecomeCreatorDialog = dynamic(() => import('./BecomeCreatorDialog').then(m => m.BecomeCreatorDialog))
const GetVerifiedDialog = dynamic(() => import('./GetVerifiedDialog').then(m => m.GetVerifiedDialog))
const ChangePasswordDialog = dynamic(() => import('./ChangePasswordDialog').then(m => m.ChangePasswordDialog))
const SignOutDialog = dynamic(() => import('@/components/ui/SignOutDialog').then(m => m.SignOutDialog))

interface Props {
  user: User
  links: SocialLink[]
}


export function ProfileCard({ user, links }: Props) {
  const t = useTranslations('profile')
  const tCommon = useTranslations('common')
  const tDates = useTranslations('dates')
  const dateNames: DateNames = {
    monthsShort: tDates.raw('monthsShort'),
    monthsLong: tDates.raw('monthsLong'),
    monthsLongGenitive: tDates.raw('monthsLongGenitive'),
    weekdaysShort: tDates.raw('weekdaysShort'),
  }
  const router = useRouter()
  const searchParams = useSearchParams()

  // dialogs
  const [editOpen, setEditOpen] = useState(false)
  const [editFocusPrice, setEditFocusPrice] = useState(false)
  const [linksOpen, setLinksOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [creatorOpen, setCreatorOpen] = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [changePwdOpen, setChangePwdOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)

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

  const memberSince = formatLongMonthYear(new Date(user.created_at), dateNames)
  const creatorSince = user.creator_since ? formatLongMonthYear(new Date(user.creator_since), dateNames) : null
  const verifiedSince = user.creator_verified_at ? formatLongMonthYear(new Date(user.creator_verified_at), dateNames) : null

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

        {/* Cover */}
        <div className="h-52 bg-gradient-to-br from-violet-700 via-violet-500 to-fuchsia-500" />

        <div className="max-w-2xl mx-auto px-6">

          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-14 mb-5">
            <div className="relative">
              <Avatar
                name={displayName}
                avatarUrl={user.avatar_url}
                size={112}
                priority
                className="ring-4 ring-gray-50 dark:ring-gray-950"
                textClassName="text-4xl font-black drop-shadow"
              />
            </div>

            <div className="mb-2 flex items-center gap-2">
              <button
                onClick={() => setQrOpen(true)}
                title={t('showQrCode')}
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
                <span className="hidden sm:inline">{tCommon('share')}</span>
              </button>
              <button
                onClick={() => setEditOpen(true)}
                className="inline-flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 sm:gap-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 bg-white dark:bg-gray-900 shadow-sm transition-colors"
              >
                <PenLine size={14} />
                <span className="hidden sm:inline">{t('editProfile')}</span>
              </button>
            </div>
          </div>

          {/* Name + badges */}
          <div className="mb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{displayName}</h1>
              {user.creator_verified_at && <BadgeCheck size={22} className="text-blue-500 flex-shrink-0" />}
              {isCreator && <CreatorBadge />}
            </div>
            {user.username
              ? <p className="text-gray-400 dark:text-gray-500 mt-1">@{user.username}</p>
              : <p className="text-sm italic text-gray-300 dark:text-gray-600 mt-1">{t('noUsernameSet')}</p>}
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
                      {t('completeYourProfile')}
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5 leading-relaxed">
                      {!bio && price === 0
                        ? t('completeProfileBoth')
                        : !bio
                          ? t('completeProfileBio')
                          : t('completeProfilePrice')}
                    </p>
                  </div>
                </div>
              )}

              {/* Bio — read-only, edit via Edit profile */}
              <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-4">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2.5">{t('bio')}</p>
                {bio
                  ? <pre className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">{bio}</pre>
                  : <p className="text-sm italic text-gray-300 dark:text-gray-600">{t('noBioYet')}</p>}
              </div>

              {/* Min price — read-only, edit via Edit profile */}
              <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] px-4 py-3.5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500">{t('minPricePerMessage')}</p>
                  <button
                    onClick={() => { setEditFocusPrice(true); setEditOpen(true) }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-500/50 transition-colors"
                  >
                    <Coins size={11} />
                    {price > 0 ? tCommon('edit') : t('setPrice')}
                  </button>
                </div>
                {price > 0
                  ? <p className="text-sm text-gray-700 dark:text-gray-200">{formatPrice(price)} so&apos;m</p>
                  : <p className="text-sm italic text-gray-300 dark:text-gray-600">{t('noMinimumSet')}</p>}
              </div>

              {/* Social links */}
              <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] px-4 py-3.5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500">{t('socialLinks')}</p>
                  <button
                    onClick={() => setLinksOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-500/50 transition-colors"
                  >
                    <LinkIcon size={11} />
                    {links.length === 0 ? tCommon('add') : tCommon('manage')}
                  </button>
                </div>
                {links.length > 0
                  ? <SocialLinks links={links} />
                  : <p className="text-sm italic text-gray-300 dark:text-gray-600">{t('noLinksYet')}</p>}
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
              <span>{t('memberSince', { date: memberSince })}</span>
            </div>
            {isCreator && creatorSince && (
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <Sparkles size={15} className="flex-shrink-0 text-violet-400 dark:text-violet-500" />
                <span>{t('creatorSince', { date: creatorSince })}</span>
              </div>
            )}
            {verifiedSince && (
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <BadgeCheck size={15} className="flex-shrink-0 text-blue-500" />
                <span>{t('verifiedSince', { date: verifiedSince })}</span>
              </div>
            )}
          </div>

          {/* Become a Creator */}
          {!isCreator && (
            <div className="mb-4 flex items-center justify-between px-4 py-3.5 rounded-2xl border border-violet-100 dark:border-violet-500/20 bg-violet-50/60 dark:bg-violet-500/[0.06]">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-violet-500 dark:text-violet-400 shrink-0" />
                <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">{t('becomeCreator')}</span>
              </div>
              <button
                onClick={() => setCreatorOpen(true)}
                className="px-3 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
              >
                {t('getStarted')}
              </button>
            </div>
          )}

          {/* Get Verified */}
          {isCreator && !user.creator_verified_at && (
            <div className="mb-8 flex items-center justify-between px-4 py-3.5 rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-white/[0.03]">
              <div className="flex items-center gap-2">
                <BadgeCheck size={15} className="text-blue-500 shrink-0" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('getVerified')}</span>
              </div>
              <button
                onClick={() => setVerifyOpen(true)}
                className="px-3 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
              >
                {t('apply')}
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pb-12">
            {user.has_password && (
              <button
                onClick={() => setChangePwdOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-500/50 transition-colors"
              >
                <KeyRound size={14} />
                {t('changePassword')}
              </button>
            )}
            <button
              onClick={() => setConfirmLogout(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-500/50 transition-colors"
            >
              <LogOut size={14} />
              {tCommon('signOut')}
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

      <EditProfileDialog open={editOpen} onClose={() => { setEditOpen(false); setEditFocusPrice(false) }} user={user} focusPrice={editFocusPrice} />
      <ChangePasswordDialog open={changePwdOpen} onClose={() => setChangePwdOpen(false)} />

      {user.username && (
        <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} username={user.username} />
      )}
      {user.username && (
        <QRDialog open={qrOpen} onClose={() => setQrOpen(false)} username={user.username} />
      )}

      <SocialLinksDialog open={linksOpen} onClose={() => setLinksOpen(false)} initialLinks={links} />

      <SignOutDialog open={confirmLogout} onClose={() => setConfirmLogout(false)} />
    </>
  )
}
