import { HeaderSkeleton } from '@/components/ui/HeaderSkeleton'

export default function PayLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 animate-pulse">
      <HeaderSkeleton />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center gap-8">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-800" />

        {/* Title */}
        <div className="space-y-2 w-full max-w-xs text-center">
          <div className="h-5 w-full rounded-full bg-gray-200 dark:bg-gray-800 mx-auto" />
          <div className="h-5 w-3/4 rounded-full bg-gray-200 dark:bg-gray-800 mx-auto" />
        </div>

        {/* From → To card */}
        <div className="w-full flex items-center gap-2 sm:gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="h-2.5 w-8 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="h-2.5 w-4 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>

        {/* Amount card */}
        <div className="w-full h-40 rounded-3xl bg-violet-200 dark:bg-violet-900/30" />

        {/* Pay button */}
        <div className="w-full h-14 rounded-2xl bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  )
}
