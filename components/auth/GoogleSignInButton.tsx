'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import Image from 'next/image'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { useTranslations } from 'next-intl'
import { googleSignIn } from '@/lib/api'
import { GOOGLE_CLIENT_ID } from '@/lib/constants'
import { useApiErrorMessage } from '@/lib/i18n/useApiErrorMessage'

interface CodeResponse {
  code: string
  error?: string
  error_description?: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initCodeClient(config: {
            client_id: string
            scope: string
            ux_mode: 'popup'
            callback: (response: CodeResponse) => void
          }): { requestCode(): void }
        }
      }
    }
  }
}

interface GoogleSignInButtonProps {
  disabled?: boolean
  onLoadingChange?: (loading: boolean) => void
  onSuccess?: () => void
}

export function GoogleSignInButton({ disabled, onLoadingChange, onSuccess }: GoogleSignInButtonProps) {
  const t = useTranslations('auth')
  const getApiErrorMessage = useApiErrorMessage()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const clientRef = useRef<{ requestCode(): void } | null>(null)
  const callbackFiredRef = useRef(false)

  function setLoadingState(v: boolean) {
    setLoading(v)
    onLoadingChange?.(v)
  }

  function initGSI() {
    if (!window.google) return
    clientRef.current = window.google.accounts.oauth2.initCodeClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      ux_mode: 'popup',
      callback: async (response) => {
        callbackFiredRef.current = true
        if (response.error) {
          setLoadingState(false)
          if (response.error !== 'access_denied') {
            toast.error(t('googleSignInFailed'))
          }
          return
        }
        try {
          await googleSignIn(response.code)
          onSuccess?.()
          router.push('/dashboard')
        } catch (err) {
          toast.error(getApiErrorMessage(err))
          setLoadingState(false)
        }
      },
    })
    setReady(true)
  }

  useEffect(() => {
    if (window.google) initGSI()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleScriptLoad() {
    initGSI()
  }

  function handleClick() {
    if (!ready || loading || !clientRef.current) return
    callbackFiredRef.current = false
    setLoadingState(true)
    clientRef.current.requestCode()

    const onFocus = () => {
      // Give the callback ~500ms to fire before assuming the popup was closed silently
      setTimeout(() => {
        if (!callbackFiredRef.current) setLoadingState(false)
      }, 500)
      window.removeEventListener('focus', onFocus)
    }
    window.addEventListener('focus', onFocus)
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />

      <div className="w-full">
        <button
          onClick={handleClick}
          disabled={!ready || loading || disabled}
          className="w-full flex items-center justify-center gap-3 h-12 px-5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.10] text-sm font-medium text-gray-700 dark:text-gray-200 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FontAwesomeIcon icon={faCircleNotch} spin className="shrink-0 text-[#4285F4]" style={{ width: 20, height: 20 }} />
              <span className="text-gray-500 dark:text-gray-400">{t('signingIn')}</span>
            </>
          ) : (
            <>
              <Image src="/google-g-logo.webp" alt="Google" width={20} height={20} className="shrink-0" />
              <span>{t('continueWithGoogle')}</span>
            </>
          )}
        </button>
      </div>
    </>
  )
}
