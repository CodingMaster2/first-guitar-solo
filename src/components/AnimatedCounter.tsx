'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  target: number
  label: string
  prefix?: string
  suffix?: string
}

export default function AnimatedCounter({
  target,
  label,
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const isFloat = !Number.isInteger(target)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const start = performance.now()

          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // ease-out quadratic: 1 - (1 - t)^2
            const eased = 1 - Math.pow(1 - progress, 2)
            const current = eased * target

            setCount(isFloat ? Math.round(current * 10) / 10 : Math.floor(current))

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(target)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, isFloat])

  const displayValue = isFloat ? count.toFixed(1) : count.toFixed(0)

  return (
    <div ref={ref}>
      <div
        style={{
          color: '#f59e0b',
          fontWeight: 900,
          fontSize: '2.25rem',
          lineHeight: 1.1,
          marginBottom: '0.375rem',
        }}
      >
        {prefix}
        {displayValue}
        {suffix}
      </div>
      <div
        style={{
          color: '#737373',
          fontSize: '0.875rem',
          lineHeight: 1.4,
        }}
      >
        {label}
      </div>
    </div>
  )
}
