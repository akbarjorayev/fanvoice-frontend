import { HeaderSkeleton } from '@/components/ui/HeaderSkeleton'

export default function MeLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 animate-pulse">
      <HeaderSkeleton left={<div className="h-8 w-32 rounded-full bg-gray-200 dark:bg-gray-800" />} />

      {/* Cover */}
      <div className="h-52 bg-gradient-to-br from-violet-700 via-violet-500 to-fuchsia-500 opacity-40 dark:opacity-20" />

      <div className="max-w-2xl mx-auto px-6">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-14 mb-5">
          <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-800 ring-4 ring-gray-50 dark:ring-gray-950" />
          <div className="mb-2 flex items-center gap-2">
            <div className="w-9 h-9 sm:w-20 sm:h-9 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="w-9 h-9 sm:w-24 sm:h-9 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="w-9 h-9 sm:w-28 sm:h-9 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>

        {/* Name */}
        <div className="mb-5">
          <div className="h-7 w-40 rounded-full bg-gray-200 dark:bg-gray-800 mb-2" />
          <div className="h-4 w-24 rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Cards */}
        <div className="mb-6 space-y-3">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4 h-24" />
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4 h-20" />
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4 h-20" />
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 mb-6" />

        {/* Info rows */}
        <div className="space-y-4 mb-8">
          {[96, 72, 80].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-800 shrink-0" />
              <div className="h-4 rounded-full bg-gray-200 dark:bg-gray-800" style={{ width: w }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
