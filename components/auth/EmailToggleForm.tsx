'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleNotch,
  faEye,
  faEyeSlash,
  faChevronDown,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons'
import { emailSignIn, emailSignUp } from '@/lib/api'

interface Props {
  mode: 'signin' | 'signup'
  disabled?: boolean
  forceClose?: boolean
  onLoadingChange?: (loading: boolean) => void
  onSuccess?: () => void
}

export function EmailToggleForm({ mode, disabled, forceClose, onLoadingChange, onSuccess }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => emailRef.current?.focus(), 180)
      return () => clearTimeout(timer)
    }
  }, [open])

  useEffect(() => {
    if (forceClose) setOpen(false)
  }, [forceClose])

  function handleForgotPassword() {
    toast.info('Coming soon! 😅 Still working on this.')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'signup' && password !== confirm) {
      toast.error("Passwords don't match")
      return
    }
    setLoading(true)
    onLoadingChange?.(true)
    try {
      if (mode === 'signup') {
        await emailSignUp(email, password)
      } else {
        await emailSignIn(email, password)
      }
      onSuccess?.()
      router.push('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
      onLoadingChange?.(false)
    }
  }

  const inputBase =
    'w-full h-11 px-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.06] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-transparent transition-all disabled:opacity-60'

  return (
    <div>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2.5 h-12 px-5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.10] text-sm font-medium text-gray-600 dark:text-gray-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FontAwesomeIcon
          icon={faEnvelope}
          className="text-gray-400"
          style={{ width: 14, height: 14 }}
        />
        {mode === 'signin' ? 'Sign in with Email' : 'Sign up with Email'}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          style={{ width: 11, height: 11 }}
        />
      </button>

      {/* Collapsible form */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[420px] opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        {/* p-0.5 gives the 2px focus ring room on all sides so overflow-hidden doesn't clip it */}
        <div className="p-0.5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            ref={emailRef}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            disabled={loading}
            className={inputBase}
          />

          <div className="relative">
            <input
              name="password"
              type={showPwd ? 'text' : 'password'}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={loading}
              className={`${inputBase} pr-11`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <FontAwesomeIcon
                icon={showPwd ? faEyeSlash : faEye}
                style={{ width: 14, height: 14 }}
              />
            </button>
          </div>

          {mode === 'signup' && (
            <input
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              required
              disabled={loading}
              className={inputBase}
            />
          )}

          {mode === 'signin' && (
            <div className="flex justify-end -mt-0.5">
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
            className="w-full h-11 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <FontAwesomeIcon icon={faCircleNotch} spin style={{ width: 14, height: 14 }} />
            )}
            {loading
              ? mode === 'signup'
                ? 'Creating account…'
                : 'Signing in…'
              : mode === 'signup'
                ? 'Create account'
                : 'Sign in'}
          </button>
        </form>
        </div>
      </div>
    </div>
  )
}
