'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { emailSignIn, emailSignUp } from '@/lib/api'

type Mode = 'signin' | 'signup'

export function EmailAuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmError, setConfirmError] = useState(false)
  const [credError, setCredError] = useState(false)

  function handleForgotPassword() {
    toast.info("Password recovery is coming soon! 😅 We're still building it.")
  }

  function switchMode(next: Mode) {
    setMode(next)
    setPassword('')
    setConfirm('')
    setConfirmError(false)
    setCredError(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setConfirmError(false)
    setCredError(false)

    if (mode === 'signup' && password !== confirm) {
      requestAnimationFrame(() => setConfirmError(true))
      toast.error("Passwords don't match")
      return
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        await emailSignUp(email, password)
      } else {
        await emailSignIn(email, password)
      }
      router.push('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
      requestAnimationFrame(() => setCredError(true))
      setLoading(false)
    }
  }

  const inputClass =
    'w-full h-12 px-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.06] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-transparent transition-all'
  const errorInputClass = 'border-red-400 dark:border-red-500 focus:ring-red-500/60'

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setCredError(false) }}
        placeholder="Email address"
        required
        disabled={loading}
        className={`${inputClass} ${credError ? `${errorInputClass} animate-shake` : ''}`}
      />

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setCredError(false) }}
          placeholder="Password"
          required
          disabled={loading}
          className={`${inputClass} pr-11 ${credError ? `${errorInputClass} animate-shake` : ''}`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <FontAwesomeIcon
            key={showPassword ? 'hide' : 'show'}
            icon={showPassword ? faEyeSlash : faEye}
            className="animate-scale-in"
            style={{ width: 15, height: 15 }}
          />
        </button>
      </div>

      {mode === 'signup' && (
        <input
          type="password"
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setConfirmError(false) }}
          placeholder="Confirm password"
          required
          disabled={loading}
          className={`${inputClass} ${confirmError ? `${errorInputClass} animate-shake` : ''}`}
        />
      )}

      {mode === 'signin' && (
        <div className="flex justify-end -mt-1">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            Forgot password?
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && (
          <FontAwesomeIcon icon={faCircleNotch} spin style={{ width: 15, height: 15 }} />
        )}
        {loading
          ? mode === 'signup'
            ? 'Creating account…'
            : 'Signing in…'
          : mode === 'signup'
            ? 'Create account'
            : 'Sign in'}
      </button>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500 pt-1">
        {mode === 'signin' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className="text-violet-600 dark:text-violet-400 font-medium hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="text-violet-600 dark:text-violet-400 font-medium hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </form>
  )
}
