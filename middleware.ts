import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME } from './lib/constants'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME)

  const isExpired = searchParams.get('expired') === '1'

  if ((pathname === '/' || pathname === '/login') && hasSession && !isExpired) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/me') || pathname.startsWith('/message')) && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.endsWith('/send') && pathname.startsWith('/u/') && !hasSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/me/:path*', '/message/:path*', '/u/:username/send'],
}
