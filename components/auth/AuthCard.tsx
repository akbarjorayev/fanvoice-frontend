import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { GoogleSignInButton } from './GoogleSignInButton'

interface AuthCardProps {
  headline?: string
  subheadline?: string
}

export function AuthCard({
  headline = 'Welcome to FanVoice',
  subheadline = 'Sign in to send messages to your favorite creators.',
}: AuthCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sm:p-10 max-w-sm w-full">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-6"
      >
        <FontAwesomeIcon icon={faArrowLeft} style={{ width: 13, height: 13 }} />
        Home
      </Link>
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-600 mb-5"
        >
          <span className="text-white font-black text-lg">F</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{headline}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{subheadline}</p>
      </div>
      <GoogleSignInButton />
      <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
        By signing in you agree to our{' '}
        <a href="/terms" className="text-violet-600 dark:text-violet-400 hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-violet-600 dark:text-violet-400 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}
