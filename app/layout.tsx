import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()
  const t = await getTranslations('layout')

  return (
    <html lang={locale} className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="sticky top-0 z-[60] w-full h-[20px] bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 flex items-center justify-center">
            <span className="text-[10px] font-bold tracking-widest text-yellow-900/80 uppercase">
              ✦ {t('betaBanner')}
            </span>
          </div>
          {children}
          <Toaster position="top-center" richColors theme="system" toastOptions={{ style: { borderRadius: '9999px' } }} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
