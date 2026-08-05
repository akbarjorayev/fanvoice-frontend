'use client'

import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { MoreVertical, PenLine, Trash2, ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dialog } from '@/components/ui/Dialog'
import { updateMessagePrice, deleteMessage } from '@/lib/api'
import { useApiErrorMessage } from '@/lib/i18n/useApiErrorMessage'
import { PRICE_STEP, CREATOR_MAX_PRICE } from '@/lib/fees'

interface Props {
  messageId: string
  price: number
}

type View = 'menu' | 'editPrice' | 'confirmDelete'

const rowClass =
  'flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors w-full'

export function MessageActions({ messageId, price }: Props) {
  const t = useTranslations('messagePage')
  const tCommon = useTranslations('common')
  const getApiErrorMessage = useApiErrorMessage()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [view, setView] = useState<View>('menu')
  const [priceThousands, setPriceThousands] = useState(String(price / PRICE_STEP))
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const priceRef = useRef<HTMLInputElement>(null)

  const priceActual = priceThousands === '' ? 0 : (parseInt(priceThousands, 10) || 0) * PRICE_STEP
  const isDirty = priceActual !== price

  function openMenu() {
    setView('menu')
    setOpen(true)
  }

  // Memoized with stable identity — Dialog's escape/focus-trap effect depends
  // on onClose/onEscape, so a fresh function reference on every render (e.g.
  // from typing in the price input below) would tear down and rebuild that
  // effect on every keystroke, and its cleanup yanks focus back to the
  // trigger button each time.
  //
  // Deliberately doesn't reset `view` here — the dialog stays mounted during
  // its close animation, so resetting immediately would flash the menu view
  // back in behind the fade-out. Reset happens on next open instead.
  const handleClose = useCallback(() => setOpen(false), [])
  const backToMenu = useCallback(() => setView('menu'), [])

  function openEditPrice() {
    setPriceThousands(String(price / PRICE_STEP))
    setView('editPrice')
    setTimeout(() => priceRef.current?.focus(), 0)
  }

  async function handleSavePrice() {
    if (priceThousands === '' || priceActual <= 0) return
    setSaving(true)
    try {
      await updateMessagePrice(messageId, priceActual)
      toast.success(t('priceUpdated'))
      setOpen(false)
      router.refresh()
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteMessage(messageId)
      toast.success(t('messageDeleted'))
      router.push('/dashboard')
    } catch (err) {
      toast.error(getApiErrorMessage(err))
      setDeleting(false)
    }
  }

  return (
    <>
      <button
        onClick={openMenu}
        aria-label={tCommon('manage')}
        className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        onEscape={view === 'menu' ? handleClose : backToMenu}
      >
        {view === 'menu' && (
          <div className="px-3 pt-4 pb-4 flex flex-col gap-0.5">
            <button onClick={openEditPrice} className={rowClass}>
              <span className="w-8 h-8 rounded-full bg-violet-50 dark:bg-violet-500/[0.12] flex items-center justify-center shrink-0">
                <PenLine size={15} className="text-violet-500" />
              </span>
              {t('editPrice')}
            </button>
            <button onClick={() => setView('confirmDelete')} className={`${rowClass} text-red-500 dark:text-red-400`}>
              <span className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/[0.12] flex items-center justify-center shrink-0">
                <Trash2 size={15} className="text-red-500 dark:text-red-400" />
              </span>
              {t('deleteMessage')}
            </button>
          </div>
        )}

        {view === 'editPrice' && (
          <div>
            <div className="flex items-center gap-1 px-3 pt-4 pb-2">
              <button
                onClick={backToMenu}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors shrink-0"
              >
                <ChevronLeft size={17} />
              </button>
              <p className="font-bold text-gray-900 dark:text-white text-base">{t('editPrice')}</p>
            </div>

            <div className="px-5 pb-5 pt-2 flex flex-col gap-4">
              <div
                onClick={() => priceRef.current?.focus()}
                className="flex items-stretch rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800 w-fit cursor-text focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition"
              >
                <input
                  ref={priceRef}
                  type="number"
                  min={1}
                  max={CREATOR_MAX_PRICE / PRICE_STEP}
                  value={priceThousands}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    if (val === '' || parseInt(val, 10) <= CREATOR_MAX_PRICE / PRICE_STEP) setPriceThousands(val)
                  }}
                  className="w-24 px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-transparent focus:outline-none focus-visible:shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="flex items-center pr-4 text-sm text-gray-400 dark:text-gray-500 select-none">
                  000 so&apos;m
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={backToMenu}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
                >
                  {tCommon('cancel')}
                </button>
                <button
                  onClick={handleSavePrice}
                  disabled={saving || !isDirty || priceThousands === ''}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors disabled:opacity-40"
                >
                  {saving
                    ? <FontAwesomeIcon icon={faCircleNotch} spin style={{ width: 12, height: 12 }} />
                    : <FontAwesomeIcon icon={faCheck} style={{ width: 12, height: 12 }} />}
                  {saving ? tCommon('saving') : tCommon('save')}
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'confirmDelete' && (
          <div>
            <div className="flex items-center gap-1 px-3 pt-4 pb-2">
              <button
                onClick={backToMenu}
                disabled={deleting}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors shrink-0 disabled:opacity-40"
              >
                <ChevronLeft size={17} />
              </button>
              <p className="font-bold text-gray-900 dark:text-white text-base">{t('deleteMessage')}</p>
            </div>

            <div className="px-5 pb-5 pt-2 flex flex-col gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {t('deleteConfirm')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={backToMenu}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
                >
                  {tCommon('cancel')}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-40"
                >
                  {deleting
                    ? <FontAwesomeIcon icon={faCircleNotch} spin style={{ width: 12, height: 12 }} />
                    : <Trash2 size={14} />}
                  {tCommon('remove')}
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </>
  )
}
