import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME } from './lib/constants'
import { LOCALE_COOKIE, isLocale, detectLocaleFromAcceptLanguage } from './lib/i18n/config'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME)

  const isExpired = searchParams.get('expired') === '1'

  let response: NextResponse

  if ((pathname === '/' || pathname === '/login') && hasSession && !isExpired) {
    response = NextResponse.redirect(new URL('/dashboard', request.url))
  } else if ((pathname.startsWith('/dashboard') || pathname.startsWith('/me') || pathname.startsWith('/message')) && !hasSession) {
    response = NextResponse.redirect(new URL('/login', request.url))
  } else if (pathname.endsWith('/send') && pathname.startsWith('/u/') && !hasSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    response = NextResponse.redirect(loginUrl)
  } else {
    response = NextResponse.next()
  }

  if (!isLocale(request.cookies.get(LOCALE_COOKIE)?.value)) {
    const detected = detectLocaleFromAcceptLanguage(request.headers.get('accept-language'))
    response.cookies.set(LOCALE_COOKIE, detected, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
