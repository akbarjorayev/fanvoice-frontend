import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { EmailToggleForm } from '@/components/auth/EmailToggleForm'

interface LoginPageProps {
  searchParams: Promise<{ expired?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const isExpired = params.expired === '1'

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Aurora — dark mode only */}
      <div className="pointer-events-none absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full bg-violet-700/25 blur-[100px] dark:opacity-100 opacity-0 transition-opacity" />
      <div className="pointer-events-none absolute top-10 right-0 w-[400px] h-[400px] rounded-full bg-fuchsia-700/20 blur-[100px] dark:opacity-100 opacity-0 transition-opacity" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 w-[350px] h-[350px] rounded-full bg-indigo-700/15 blur-[100px] dark:opacity-100 opacity-0 transition-opacity" />

      <div className="relative w-full max-w-sm">
        <div className="bg-white dark:bg-white/[0.04] dark:backdrop-blur-2xl border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-[0_0_80px_rgba(139,92,246,0.08)] p-8 sm:p-10">

          {/* Logo */}
          <div className="flex justify-center mb-7">
            <div className="w-13 h-13 w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-white font-black text-xl tracking-tight">F</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">
              {isExpired ? 'Session expired' : 'Welcome back'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {isExpired
                ? 'Your session has expired. Please sign in again.'
                : 'Sign in to your FanVoice account.'}
            </p>
          </div>

          {/* Google — primary */}
          <GoogleSignInButton />

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
          </div>

          {/* Email — secondary, hidden by default */}
          <EmailToggleForm mode="signin" />

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            By continuing you agree to our{' '}
            <a href="/terms" className="text-violet-600 dark:text-violet-400 hover:underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-violet-600 dark:text-violet-400 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        {/* Footer links */}
        <div className="mt-5 flex items-center justify-center gap-5">
          <span className="text-sm text-gray-400 dark:text-gray-500">
            No account?{' '}
            <Link
              href="/signup"
              className="text-violet-600 dark:text-violet-400 font-medium hover:underline"
            >
              Sign up
            </Link>
          </span>
          <span className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
          <a
            href="https://t.me/fanvoice_support_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
          >
            <FontAwesomeIcon icon={faTelegram} style={{ width: 13, height: 13 }} />
            Support
          </a>
          <span className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} style={{ width: 12, height: 12 }} />
            Home
          </Link>
        </div>
      </div>
    </main>
  )
}
