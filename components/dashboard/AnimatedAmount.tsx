'use client'

import { useEffect, useRef, useState } from 'react'
import { formatPrice } from '@/lib/fees'

interface AnimatedAmountProps {
  value: number
  durationMs?: number
}

export function AnimatedAmount({ value, durationMs = 900 }: AnimatedAmountProps) {
  const [displayed, setDisplayed] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(value * eased))
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value, durationMs])

  return <>{formatPrice(displayed)}</>
}
