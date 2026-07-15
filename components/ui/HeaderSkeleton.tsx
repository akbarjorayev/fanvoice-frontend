export function HeaderSkeleton({ left, children }: { left?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="sticky top-[20px] z-40 h-14 px-4 sm:px-6 flex items-center justify-between bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl">
      {left ?? <div className="h-8 w-36 rounded-full bg-gray-200 dark:bg-gray-800" />}
      <div className="flex items-center gap-3">
        {children ?? <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800" />}
      </div>
    </div>
  )
}
