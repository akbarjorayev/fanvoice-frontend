export const PLATFORM_FEE = 0.10
export const CREATOR_SHARE = 1 - PLATFORM_FEE
export const PLATFORM_FEE_PCT = Math.round(PLATFORM_FEE * 100)
export const CREATOR_SHARE_PCT = Math.round(CREATOR_SHARE * 100)

// Absolute so'm amounts — must match the backend's src/constants/pricing.ts
export const PLATFORM_MIN_PRICE = 10_000
export const PRICE_STEP = 1000
export const CREATOR_MAX_PRICE = 1_000_000

export function creatorAmount(price: number): number {
  return Math.round(price * CREATOR_SHARE)
}

export function formatPrice(n: number): string {
  // Manual grouping instead of n.toLocaleString('uz-UZ') — the browser's
  // ICU/CLDR data decides the separator character for that locale, and it
  // isn't consistent across browsers (Chrome uses ',', Edge uses ' ' for the
  // same code). Building the string ourselves guarantees the same output
  // everywhere.
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
