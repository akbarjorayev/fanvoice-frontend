'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Mic, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { markMessageRead } from '@/lib/api'

const LANGS = [
  { code: 'uz-UZ', label: "O'zbek" },
  { code: 'ru-RU', label: 'Русский' },
  { code: 'en-US', label: 'English' },
]

const STOP_THRESHOLD = 0.80

function normalizeWord(w: string): string {
  return w.toLowerCase().replace(/[.,!?;:'"«»\-–—()[\]{}]/g, '').trim()
}

// Two-pass matching:
// Pass 1 — sequential: walk orig left→right, find each word in transcript in
//   order. On a miss, keep tIdx where it is (don't reset) so later orig words
//   can still match words that come next in the transcript.
// Pass 2 — backfill: for any orig word missed in pass 1, check if it appears
//   in the unused portion of the transcript (user said it out of order).
// Result: normal reading lights up left→right; saying a skipped word later
//   fills in only that word without disrupting anything already matched.
function getMatchedIndices(origWords: string[], transcriptWords: string[]): Set<number> {
  const matched = new Set<number>()
  const usedTransIdx = new Set<number>()
  let tIdx = 0

  // Pass 1: sequential
  for (let oIdx = 0; oIdx < origWords.length; oIdx++) {
    const w = origWords[oIdx]
    if (!w) continue
    for (let t = tIdx; t < transcriptWords.length; t++) {
      if (transcriptWords[t] === w && !usedTransIdx.has(t)) {
        matched.add(oIdx)
        usedTransIdx.add(t)
        tIdx = t + 1
        break
      }
    }
    // not found → tIdx unchanged, next orig word searches from same position
  }

  // Pass 2: backfill skipped words from unused transcript words
  const remainFreq = new Map<string, number>()
  for (let t = 0; t < transcriptWords.length; t++) {
    if (!usedTransIdx.has(t)) {
      const w = transcriptWords[t]
      if (w) remainFreq.set(w, (remainFreq.get(w) ?? 0) + 1)
    }
  }
  const usedBackfill = new Map<string, number>()
  for (let oIdx = 0; oIdx < origWords.length; oIdx++) {
    if (matched.has(oIdx)) continue
    const w = origWords[oIdx]
    if (!w) continue
    const avail = (remainFreq.get(w) ?? 0) - (usedBackfill.get(w) ?? 0)
    if (avail > 0) {
      matched.add(oIdx)
      usedBackfill.set(w, (usedBackfill.get(w) ?? 0) + 1)
    }
  }

  return matched
}

type Step = 'idle' | 'lang-picker' | 'reading' | 'success' | 'unsupported'

interface Props {
  messageId: string
  messageText: string
}

export function ReadAloud({ messageId, messageText }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('idle')
  const [lang, setLang] = useState('uz-UZ')
  const [matched, setMatched] = useState<Set<number>>(new Set())

  const stepRef = useRef<Step>('idle')
  const shouldRestartRef = useRef(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => { stepRef.current = step }, [step])

  // Check support once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setStep('unsupported')
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => () => {
    shouldRestartRef.current = false
    recognitionRef.current?.stop()
  }, [])

  // Precompute word list — each word gets a stable idx
  const wordDisplay = useMemo(() => {
    let idx = 0
    return messageText.split('\n').map((line) => ({
      words: line.split(/\s+/).filter(Boolean).map((raw) => ({
        raw,
        normalized: normalizeWord(raw),
        idx: idx++,
      })),
    }))
  }, [messageText])

  const origNormalized = useMemo(
    () => wordDisplay.flatMap((l) => l.words.map((w) => w.normalized)),
    [wordDisplay],
  )

  const totalWords = useMemo(
    () => origNormalized.filter(Boolean).length,
    [origNormalized],
  )

  const score = totalWords > 0 ? matched.size / totalWords : 0

  // Mark as read
  const handleSuccess = useCallback(async () => {
    shouldRestartRef.current = false
    recognitionRef.current?.stop()
    setStep('success')
    try {
      await markMessageRead(messageId)
      router.refresh()
    } catch {}
  }, [messageId, router])

  // Auto-complete when all words matched
  useEffect(() => {
    if (step === 'reading' && totalWords > 0 && matched.size >= totalWords) {
      handleSuccess()
    }
  }, [matched.size, step, totalWords, handleSuccess])

  // Start / stop recognition based on step
  useEffect(() => {
    if (step !== 'reading') {
      shouldRestartRef.current = false
      recognitionRef.current?.stop()
      return
    }

    const API = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!API) return

    setMatched(new Set())
    shouldRestartRef.current = true

    const r = new API()
    r.continuous = true
    r.interimResults = true
    r.lang = lang

    r.onresult = (e: any) => {
      let full = ''
      for (let i = 0; i < e.results.length; i++) {
        full += e.results[i][0].transcript + ' '
      }
      const transWords = full.trim().split(/\s+/).filter(Boolean).map(normalizeWord)
      setMatched(getMatchedIndices(origNormalized, transWords))
    }

    r.onend = () => {
      if (shouldRestartRef.current && stepRef.current === 'reading') {
        try { r.start() } catch {}
      }
    }

    r.onerror = (e: any) => {
      if (e.error === 'aborted') return
      if (shouldRestartRef.current && stepRef.current === 'reading') {
        try { r.start() } catch {}
      }
    }

    recognitionRef.current = r
    r.start()

    return () => {
      shouldRestartRef.current = false
      r.stop()
    }
  }, [step, lang, origNormalized])

  const openLangPicker = () => setStep('lang-picker')
  const startReading = () => setStep('reading')
  const closeReading = useCallback(() => {
    setStep('idle')
    setMatched(new Set())
  }, [])

  // ─── Unsupported ───────────────────────────────────────────────────────────
  if (step === 'unsupported') {
    return (
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
        <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-400">
          Speech recognition isn&apos;t supported in your browser.{' '}
          <span className="font-semibold">Please use Chrome or Edge.</span>
        </p>
      </div>
    )
  }

  // ─── Success ───────────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20">
        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0">
          <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
        </div>
        <div>
          <p className="font-semibold text-green-700 dark:text-green-400 text-sm">Verified!</p>
          <p className="text-sm text-green-600/70 dark:text-green-500 mt-0.5">
            Message marked as read. The fan will be notified.
          </p>
        </div>
      </div>
    )
  }

  // ─── Idle + dialogs ────────────────────────────────────────────────────────
  return (
    <>
      {step === 'idle' && (
        <button
          onClick={openLangPicker}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
        >
          <Mic size={14} />
          Read aloud
        </button>
      )}

      {/* Step 1 — Language picker */}
      <Dialog
        open={step === 'lang-picker'}
        onClose={() => setStep('idle')}
        title="Choose language"
      >
        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-colors ${
                  lang === l.code
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    lang === l.code ? 'border-violet-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {lang === l.code && (
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                  )}
                </span>
                <span
                  className={`text-sm font-medium ${
                    lang === l.code
                      ? 'text-violet-700 dark:text-violet-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {l.label}
                </span>
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            Don&apos;t see your language?{' '}
            <a
              href="https://t.me/fanvoice_support_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-600 dark:text-violet-400 hover:underline"
            >
              Tell support
            </a>
          </p>

          <button
            onClick={startReading}
            className="w-full py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
          >
            Start
          </button>
        </div>
      </Dialog>

      {/* Step 2 — Reading modal */}
      {step === 'reading' &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeReading}
            />
            <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Read aloud
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs tabular-nums text-gray-400 dark:text-gray-500">
                    {matched.size} / {totalWords} words
                  </span>
                  <button
                    onClick={closeReading}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Progress bar + percentage */}
              <div className="px-6 pt-3 pb-2 flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(score * 100, 100)}%` }}
                  />
                </div>
                <span className={`text-sm font-bold tabular-nums w-12 text-right transition-colors ${
                  score >= STOP_THRESHOLD
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-violet-600 dark:text-violet-400'
                }`}>
                  {Math.round(score * 100)}%
                </span>
              </div>

              {/* Message with word-by-word highlighting */}
              <div className="px-6 py-6 max-h-[55vh] overflow-y-auto">
                <p className="text-base leading-10 select-none">
                  {wordDisplay.map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {line.words.map(({ raw, idx }) => (
                        <span
                          key={idx}
                          className={`transition-colors duration-500 ${
                            matched.has(idx)
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-300 dark:text-gray-700'
                          }`}
                        >
                          {raw}{' '}
                        </span>
                      ))}
                      {lineIdx < wordDisplay.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>

              {/* Footer — stop button only at 95%+ */}
              {score >= STOP_THRESHOLD && (
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Close enough — you can stop here.
                  </p>
                  <button
                    onClick={handleSuccess}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-colors"
                  >
                    <CheckCircle2 size={14} />
                    Mark as read
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
