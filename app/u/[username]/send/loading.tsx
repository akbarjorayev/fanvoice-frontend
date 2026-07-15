import { HeaderSkeleton } from '@/components/ui/HeaderSkeleton'

export default function SendLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 animate-pulse">
      <HeaderSkeleton />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-14">
        <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-14 lg:gap-24">

          {/* Creator panel */}
          <div>
            <div className="flex md:block items-center gap-4">
              <div className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-full bg-gray-200 dark:bg-gray-800 shrink-0 md:mb-5" />
              <div className="space-y-2">
                <div className="h-5 w-32 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
            <div className="hidden md:block space-y-2 mt-4">
              <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-4/5 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-3/5 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="h-7 w-44 rounded-full bg-gray-200 dark:bg-gray-800 mb-8" />
            <div className="space-y-6">
              {/* Title field */}
              <div className="space-y-2">
                <div className="h-3 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="h-12 rounded-full bg-gray-100 dark:bg-gray-800" />
              </div>
              {/* Message field */}
              <div className="space-y-2">
                <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="h-44 rounded-3xl bg-gray-100 dark:bg-gray-800" />
              </div>
              {/* Price field */}
              <div className="space-y-2">
                <div className="h-3 w-14 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="h-12 w-48 rounded-full bg-gray-100 dark:bg-gray-800" />
              </div>
              {/* Button */}
              <div className="h-12 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
