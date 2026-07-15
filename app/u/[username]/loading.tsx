import { HeaderSkeleton } from '@/components/ui/HeaderSkeleton'

export default function PublicProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 animate-pulse">
      <HeaderSkeleton left={<div className="w-7 h-7 rounded-md bg-gray-200 dark:bg-gray-800" />} />

      {/* Cover */}
      <div className="h-52 bg-gradient-to-br from-violet-700 via-violet-500 to-fuchsia-500 opacity-40 dark:opacity-20" />

      <div className="max-w-2xl mx-auto px-6">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-14 mb-5">
          <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-800 ring-4 ring-gray-50 dark:ring-gray-950" />
          <div className="mb-2 flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-9 w-32 rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>

        {/* Name */}
        <div className="mb-5">
          <div className="h-7 w-40 rounded-full bg-gray-200 dark:bg-gray-800 mb-2" />
          <div className="h-4 w-24 rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Bio lines */}
        <div className="space-y-2 mb-5">
          <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-4/5 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-3/5 rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Min price pill */}
        <div className="h-8 w-44 rounded-full bg-gray-200 dark:bg-gray-800 mb-6" />

        {/* Social links */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 mb-6" />

        <div className="space-y-4">
          {[120, 100].map((w, i) => (
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
