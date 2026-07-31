'use client'

import { useState } from 'react'
import Image from 'next/image'

const HASH_GRADIENTS = [
  'from-violet-400 to-purple-600',
  'from-blue-400 to-cyan-500',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-500',
  'from-pink-400 to-rose-500',
  'from-indigo-400 to-blue-600',
  'from-teal-400 to-green-600',
  'from-red-400 to-pink-600',
  'from-cyan-400 to-sky-600',
  'from-fuchsia-400 to-violet-600',
  'from-lime-400 to-emerald-500',
  'from-orange-400 to-red-500',
  'from-sky-400 to-blue-500',
  'from-purple-400 to-fuchsia-600',
  'from-green-400 to-cyan-500',
  'from-rose-400 to-pink-600',
]

function hashedGradient(name: string) {
  let hash = 0
  const lower = name.toLowerCase()
  for (let i = 0; i < Math.min(lower.length, 5); i++) {
    hash = (hash * 31 + lower.charCodeAt(i)) & 0xffff
  }
  return HASH_GRADIENTS[hash % HASH_GRADIENTS.length]
}

interface AvatarProps {
  name: string
  avatarUrl?: string | null
  size?: number
  /** 'violet' is the fixed brand gradient fallback; 'hashed' picks a per-name gradient from a palette. */
  variant?: 'violet' | 'hashed'
  /** Extra classes for the avatar circle itself (e.g. ring styles). */
  className?: string
  /** Tailwind width/height classes (e.g. responsive `w-14 h-14 md:w-[72px] md:h-[72px]`) that replace the fixed inline size — use when the avatar needs to resize across breakpoints. `size` still sets the Image's intrinsic width/height. */
  sizeClassName?: string
  /** Overrides the proportional initial size — pass Tailwind text-size/weight classes. */
  textClassName?: string
  priority?: boolean
}

export function Avatar({
  name,
  avatarUrl,
  size = 40,
  variant = 'violet',
  className = '',
  sizeClassName,
  textClassName,
  priority,
}: AvatarProps) {
  const initial = name.charAt(0).toUpperCase()
  const style = sizeClassName ? undefined : { width: size, height: size }
  const [loaded, setLoaded] = useState(priority)

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={size}
        height={size}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={`rounded-full object-cover shrink-0 transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${sizeClassName ?? ''} ${className}`}
        style={style}
      />
    )
  }

  const gradient = variant === 'hashed' ? hashedGradient(name) : 'from-white via-violet-400 to-blue-500'

  return (
    <div
      className={`rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 ${sizeClassName ?? ''} ${className}`}
      style={style}
    >
      <span
        className={`text-white ${textClassName ?? 'font-bold'}`}
        style={textClassName ? undefined : { fontSize: size * 0.35 }}
      >
        {initial}
      </span>
    </div>
  )
}
