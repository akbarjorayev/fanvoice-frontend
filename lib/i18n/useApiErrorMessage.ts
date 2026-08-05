'use client'

import { useTranslations } from 'next-intl'
import { ApiError } from '@/lib/apiError'

export function useApiErrorMessage() {
  const t = useTranslations('errors')

  return (err: unknown): string => {
    if (err instanceof ApiError && t.has(err.code)) {
      return t(err.code, err.params)
    }
    return t('UNKNOWN_ERROR')
  }
}
