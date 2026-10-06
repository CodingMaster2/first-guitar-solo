'use client'
import { useEffect, useState } from 'react'

interface Props { value: number; max: number; label: string; xp: number }

export default function XPRing({ value, max, label, xp }: Props) {
  const [progress, setProgress] = useState(0)
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(100, Math.max(0, (value / Math.max(max, 1)) * 100))
  const offset = circumference * (1 - progress / 100)

  useEffect(() => {
    const t = setTimeout(() => setProgress(pct), 150)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
      <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#1a1a1a" strokeWidth="6" />
        <circle
          cx="48" cy="48" r={radius} fill="none"
          stroke="url(#xpGrad)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <defs>
          <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 900, lineHeight: 1 }}>{xp.toLocaleString()}</span>
        <span style={{ color: '#525252', fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>XP</span>
        <span style={{ color: '#a3a3a3', fontSize: '0.45rem', marginTop: 1 }}>{label}</span>
      </div>
    </div>
  )
}
