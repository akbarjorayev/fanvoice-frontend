import { HeaderSkeleton } from '@/components/ui/HeaderSkeleton'

export default function SuccessLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col animate-pulse">
      <HeaderSkeleton left={<div className="h-8 w-32 rounded-full bg-gray-200 dark:bg-gray-800" />} />

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center gap-6 max-w-sm w-full">
          {/* Emoji placeholder */}
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800" />

          {/* Title + description */}
          <div className="space-y-2 text-center w-full">
            <div className="h-7 w-44 rounded-full bg-gray-200 dark:bg-gray-800 mx-auto" />
            <div className="h-4 w-56 rounded-full bg-gray-200 dark:bg-gray-800 mx-auto" />
          </div>

          {/* Amount pill */}
          <div className="h-10 w-36 rounded-full bg-gray-200 dark:bg-gray-800" />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="flex-1 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="flex-1 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  )
}
