'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { getGreetingKey, type GreetingKey } from '@/lib/greeting'

interface Props {
  initialKey: GreetingKey
}

export function Greeting({ initialKey }: Props) {
  const t = useTranslations('dashboard')
  const [key, setKey] = useState(initialKey)

  // `initialKey` was computed on the server using the server's clock, which
  // can be in a different timezone than the visitor's — e.g. it's just past
  // midnight for the visitor but still evening on the server. Re-derive it
  // from the browser's own clock once mounted so it reflects local time.
  // Starting state matches the server-rendered value exactly, so this never
  // causes a hydration mismatch — it just corrects itself right after.
  useEffect(() => {
    setKey(getGreetingKey(new Date()))
  }, [])

  return <>{t(key)}</>
}
