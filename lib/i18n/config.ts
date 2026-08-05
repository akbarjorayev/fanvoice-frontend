export const LOCALES = ['uz', 'uz-Cyrl', 'ru', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'uz'

export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const LOCALE_LABELS: Record<Locale, string> = {
  uz: "O'zbek",
  'uz-Cyrl': 'Ўзбекча (кирилл)',
  ru: 'Русский',
  en: 'English',
}

export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  uz: 'uz',
  'uz-Cyrl': 'ўз',
  ru: 'ru',
  en: 'en',
}

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}

// Accept-Language values are 'en-US', 'ru-RU', etc. — the first 2 chars are enough
// to match against our 2-letter locales. Script variants like 'uz-Cyrl' are never
// auto-detected this way and stay an explicit choice from the language switcher.
export function detectLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE
  const preferred = header.split(',').map((part) => part.split(';')[0].trim().toLowerCase().slice(0, 2))
  return preferred.find(isLocale) ?? DEFAULT_LOCALE
}
