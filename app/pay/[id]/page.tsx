import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Coins } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getMeServer, getMessage } from '@/lib/api.server'
import { AppHeader, navBtnClass } from '@/components/ui/AppHeader'
import { PayButton } from './PayButton'
import { PriceInfoButton } from './PriceInfoDialog'
import { formatPrice } from '@/lib/fees'
import { getUserInfo } from '@/lib/user'
import { FanToCreatorCard } from '@/components/message/FanToCreatorCard'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PayPage({ params }: Props) {
  const { id } = await params
  const t = await getTranslations('payPage')
  const [meResult, result] = await Promise.all([
    getMeServer().catch(() => null),
    getMessage(id).catch(() => null),
  ])
  if (!meResult) redirect('/login?expired=1')
  if (!result) notFound()

  const { message: msg } = result
  const userId = meResult.user.id

  if (msg.fan_id !== userId) redirect(`/message/${id}`)
  if (msg.paid_at) redirect(`/message/${id}`)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <AppHeader
        left={<Link href={`/message/${id}`} className={navBtnClass}><ArrowLeft size={14} />{t('backToMessage')}</Link>}
        user={getUserInfo(meResult.user)}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center text-center gap-8">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
          <Coins size={28} className="text-violet-600 dark:text-violet-400" />
        </div>

        {/* Message title */}
        <p className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
          &ldquo;{msg.title}&rdquo;
        </p>

        {/* From → To */}
        <FanToCreatorCard
          fanName={msg.fan_name}
          fanUsername={msg.fan_username}
          fanAvatarUrl={msg.fan_avatar_url}
          fanVerified={msg.fan_verified}
          fanId={msg.fan_id}
          creatorName={msg.creator_name}
          creatorUsername={msg.creator_username}
          creatorAvatarUrl={msg.creator_avatar_url}
          creatorVerified={msg.creator_verified}
          creatorId={msg.creator_id}
          currentUserId={userId}
          className="w-full"
        />

        {/* Amount */}
        <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-500 to-fuchsia-500 p-8 flex flex-col items-center gap-3 shadow-xl shadow-violet-500/25">
          {/* Glow blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-fuchsia-400/20 blur-3xl pointer-events-none" />
          <PriceInfoButton price={msg.price} creatorEarning={msg.creator_earning} creatorName={msg.creator_name} creatorVerified={msg.creator_verified} />

          <p className="relative text-xs font-semibold uppercase tracking-widest text-violet-200/70">
            {t('totalToPay')}
          </p>

          <div className="relative flex items-baseline gap-3">
            <span className="text-6xl sm:text-7xl font-black text-white tracking-tight leading-none">
              {formatPrice(msg.price)}
            </span>
            <span className="text-xl font-semibold text-violet-200/80 mb-1">
              so&apos;m
            </span>
          </div>

        </div>

        {/* Pay button */}
        <PayButton messageId={msg.id} price={msg.price} />
      </div>
    </div>
  )
}
