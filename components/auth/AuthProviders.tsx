'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { GoogleSignInButton } from './GoogleSignInButton'
import { EmailToggleForm } from './EmailToggleForm'

interface Props {
  mode: 'signin' | 'signup'
}

export function AuthProviders({ mode }: Props) {
  const t = useTranslations('auth')
  const [googleLoading, setGoogleLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  return (
    <>
      <GoogleSignInButton
        disabled={emailLoading}
        onLoadingChange={setGoogleLoading}
        onSuccess={() => {}}
      />

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{t('orDivider')}</span>
        <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
      </div>

      <EmailToggleForm
        mode={mode}
        disabled={googleLoading}
        forceClose={googleLoading}
        onLoadingChange={setEmailLoading}
        onSuccess={() => {}}
      />
    </>
  )
}
