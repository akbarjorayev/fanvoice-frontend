import { HeaderSkeleton } from '@/components/ui/HeaderSkeleton'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 animate-pulse">
      <HeaderSkeleton
        left={
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gray-200 dark:bg-gray-800" />
            <div className="w-20 h-4 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
        }
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Greeting */}
        <div className="mb-8">
          <div className="h-7 w-52 rounded-full bg-gray-200 dark:bg-gray-800 mb-3" />
          <div className="flex items-center gap-4">
            <div className="h-4 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>

        {/* Tab bar + filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div className="h-10 w-44 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="flex items-center gap-1.5">
            <div className="h-8 w-28 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-8 w-28 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>

        {/* Message rows */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-4 border-b border-gray-50 dark:border-gray-800/80 last:border-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
              <div className="flex-1 min-w-0">
                {/* Row 1: name + time */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="h-3 w-24 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-3 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
                {/* Row 2: title + badges (desktop) / title only (mobile) */}
                <div className="flex items-center justify-between gap-2">
                  <div className="h-4 rounded-full bg-gray-200 dark:bg-gray-800" style={{ width: `${55 + (i % 3) * 15}%` }} />
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <div className="h-3 w-14 rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                </div>
                {/* Row 3: badges (mobile only) */}
                <div className="flex items-center gap-2 mt-1.5 sm:hidden">
                  <div className="h-3 w-14 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
