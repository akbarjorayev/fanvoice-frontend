import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FanVoice — Your message, their voice.',
  description:
    'Pay your favorite creator to read your message aloud. Guaranteed — they only receive their payout after they do.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <div className="sticky top-0 z-[60] w-full h-[20px] bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 flex items-center justify-center">
          <span className="text-[10px] font-bold tracking-widest text-yellow-900/80 uppercase">
            ✦ FanVoice is working in BETA version
          </span>
        </div>
        {children}
        <Toaster position="top-center" richColors theme="system" toastOptions={{ style: { borderRadius: '9999px' } }} />
      </body>
    </html>
  )
}
