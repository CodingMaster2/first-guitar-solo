'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AutoRefreshProps {
  intervalMs?: number
}

export default function AutoRefresh({ intervalMs = 30000 }: AutoRefreshProps) {
  const router = useRouter()
  const [paused, setPaused] = useState(false)
  const [dotActive, setDotActive] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dotRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        router.refresh()
      }, intervalMs)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused, intervalMs, router])

  // Spinning dot animation — pulse every 800ms
  useEffect(() => {
    dotRef.current = setInterval(() => {
      setDotActive((prev) => !prev)
    }, 800)
    return () => {
      if (dotRef.current) clearInterval(dotRef.current)
    }
  }, [])

  const seconds = Math.round(intervalMs / 1000)

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#111111',
        border: '1px solid #1f1f1f',
        borderRadius: 8,
        padding: '6px 12px',
        marginBottom: 20,
      }}
    >
      {/* Dot indicator */}
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: paused ? '#404040' : dotActive ? '#f59e0b' : '#92400e',
          transition: 'background-color 0.4s ease',
          flexShrink: 0,
        }}
      />
      <span style={{ color: '#737373', fontSize: 11 }}>
        {paused ? 'Auto-refresh paused' : `Auto-refreshes every ${seconds}s`}
      </span>
      <button
        onClick={() => setPaused((p) => !p)}
        style={{
          fontSize: 10,
          color: paused ? '#f59e0b' : '#525252',
          background: 'none',
          border: '1px solid #262626',
          borderRadius: 4,
          padding: '2px 8px',
          cursor: 'pointer',
          fontWeight: 700,
          letterSpacing: '0.05em',
        }}
      >
        {paused ? 'Resume' : 'Pause'}
      </button>
    </div>
  )
}
