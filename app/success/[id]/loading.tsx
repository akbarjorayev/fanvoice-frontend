import { HeaderSkeleton } from '@/components/ui/HeaderSkeleton'

export default function SuccessLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col animate-pulse">
      <HeaderSkeleton left={<div className="h-8 w-32 rounded-full bg-gray-200 dark:bg-gray-800" />} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="flex flex-col items-center gap-7 max-w-sm w-full">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800" />

          {/* Title + description */}
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="h-7 w-40 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-64 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-40 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* What happens next */}
          <div className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 text-left">
            <div className="h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-800 mb-4" />
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
                  <div className="flex-1 space-y-1.5 pt-0.5">
                    <div className="h-3.5 w-48 rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="h-3 w-36 rounded-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <div className="w-full h-11 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="w-full h-11 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  )
}
