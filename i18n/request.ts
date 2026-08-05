import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import { LOCALE_COOKIE, LOCALES, isLocale, detectLocaleFromAcceptLanguage } from '@/lib/i18n/config'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value

  let locale
  if (isLocale(cookieLocale)) {
    locale = cookieLocale
  } else {
    const headerStore = await headers()
    locale = detectLocaleFromAcceptLanguage(headerStore.get('accept-language'))
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})

export const supportedLocales = LOCALES
