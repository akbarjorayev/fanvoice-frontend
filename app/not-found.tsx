import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-6">
      <style>{`
        @keyframes rise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .rise { animation: rise 0.5s ease-out both; }
        .fade { animation: fade 0.5s ease-out both; }
      `}</style>

      {/* Glow blob */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Each digit rises independently */}
        <p className="flex leading-none tracking-tighter select-none">
          {['4', '0', '4'].map((digit, i) => (
            <span
              key={i}
              className="rise text-[120px] font-black bg-gradient-to-br from-violet-500 via-fuchsia-400 to-blue-500 bg-clip-text text-transparent"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {digit}
            </span>
          ))}
        </p>

        <div className="fade mt-2 mb-4 h-px w-16 bg-gradient-to-r from-transparent via-violet-400 to-transparent" style={{ animationDelay: '0.5s' }} />

        <h1 className="fade text-2xl font-bold text-gray-900 dark:text-white" style={{ animationDelay: '0.55s' }}>
          Page not found
        </h1>

        <p className="fade mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed" style={{ animationDelay: '0.6s' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="fade mt-8" style={{ animationDelay: '0.65s' }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
          >
            <Home size={14} />
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
