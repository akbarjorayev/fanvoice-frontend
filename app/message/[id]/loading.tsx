import { HeaderSkeleton } from '@/components/ui/HeaderSkeleton'

export default function MessageLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 animate-pulse">
      <HeaderSkeleton>
        <div className="h-8 w-28 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800" />
      </HeaderSkeleton>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-14">
        {/* Title */}
        <div className="space-y-3 mb-8 md:mb-10">
          <div className="h-7 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-7 w-2/3 rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* From → To card */}
        <div className="flex items-center gap-2 sm:gap-4 mb-8 md:mb-10 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="h-2.5 w-8 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-24 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="h-2.5 w-4 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800 mb-8 md:mb-10" />

        {/* Message body */}
        <div className="space-y-3 mb-12 md:mb-16">
          {[100, 95, 100, 80, 100, 60].map((w, i) => (
            <div key={i} className="h-4 rounded-full bg-gray-100 dark:bg-gray-800" style={{ width: `${w}%` }} />
          ))}
        </div>

        {/* Footer meta */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-5 sm:pt-6 flex items-center gap-6">
          <div className="h-4 w-24 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-32 rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  )
}
