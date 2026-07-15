'use client'
import { useRef, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  intensity?: number
}

export function Tilt3D({ children, className = '', intensity = 10 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const glossRef = useRef<HTMLDivElement>(null)

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    const gloss = glossRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.transform = `perspective(900px) rotateX(${(y - 0.5) * -intensity}deg) rotateY(${(x - 0.5) * intensity}deg) scale3d(1.02,1.02,1.02)`
    if (gloss) {
      gloss.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.1) 0%, transparent 65%)`
      gloss.style.opacity = '1'
    }
  }

  function onLeave() {
    const el = ref.current
    const gloss = glossRef.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    if (gloss) gloss.style.opacity = '0'
  }

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)', willChange: 'transform' }}
    >
      {children}
      <div
        ref={glossRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
        style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
      />
    </div>
  )
}
