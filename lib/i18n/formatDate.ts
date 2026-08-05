import type { Locale } from './config'

export interface DateNames {
  monthsShort: string[]
  monthsLong: string[]
  monthsLongGenitive: string[]
  weekdaysShort: string[]
}

/**
 * All month/weekday names below come from our own message catalog rather than
 * Intl.DateTimeFormat, because browsers can ship incomplete CLDR data for
 * less-common locales (observed: 'uz' falling back to a "M07 17" style
 * placeholder on the client while Node's full ICU renders it correctly on
 * the server), which causes an SSR/hydration text mismatch. Numeric-only
 * Intl calls (hour/minute) are still safe since they don't need name lookups.
 */

export function formatShortDate(date: Date, locale: Locale, names: DateNames): string {
  const day = date.getDate()
  const month = names.monthsShort[date.getMonth()]
  return locale === 'en' ? `${month} ${day}` : `${day} ${month}`
}

export function formatLongMonthYear(date: Date, names: DateNames): string {
  return `${names.monthsLong[date.getMonth()]} ${date.getFullYear()}`
}

export function formatFullDate(date: Date, locale: Locale, names: DateNames): string {
  const day = date.getDate()
  const year = date.getFullYear()
  return locale === 'en'
    ? `${names.monthsLong[date.getMonth()]} ${day}, ${year}`
    : `${day} ${names.monthsLongGenitive[date.getMonth()]} ${year}`
}

export function formatFullDateTime(date: Date, locale: Locale, names: DateNames): string {
  const weekday = names.weekdaysShort[date.getDay()]
  const day = date.getDate()
  const month = names.monthsLongGenitive[date.getMonth()]
  const year = date.getFullYear()
  const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(date)
  return locale === 'en'
    ? `${weekday}, ${names.monthsLong[date.getMonth()]} ${day}, ${year}, ${time}`
    : `${weekday}, ${day} ${month} ${year}, ${time}`
}
