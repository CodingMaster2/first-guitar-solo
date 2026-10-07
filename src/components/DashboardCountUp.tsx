'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  label: string
  color?: string
  suffix?: string
  prefix?: string
}

export default function DashboardCountUp({
  value,
  label,
  color = '#ffffff',
  suffix = '',
  prefix = '',
}: Props) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1000
          const startTime = performance.now()

          function tick(now: number) {
            const elapsed = now - startTime
            const t = Math.min(1, elapsed / duration)
            // ease-out cubic
            const eased = 1 - Math.pow(1 - t, 3)
            setDisplay(Math.round(eased * value))
            if (t < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref}>
      <p style={{ color, fontSize: '1.75rem', fontWeight: 900, lineHeight: 1 }}>
        {prefix}{display.toLocaleString()}{suffix}
      </p>
      <p style={{ color: '#a3a3a3', fontSize: '0.75rem', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </p>
    </div>
  )
}
