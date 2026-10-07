'use client'

import { useEffect, useState } from 'react'
import { getLevelInfo } from '@/lib/levels'

interface Props {
  xp: number
  size?: number
}

export default function XPRing({ xp, size = 140 }: Props) {
  const { current, nextLevel, progressToNext } = getLevelInfo(xp)
  const [progress, setProgress] = useState(0)

  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 12
  const circumference = 2 * Math.PI * r

  useEffect(() => {
    const t = setTimeout(() => setProgress(progressToNext), 150)
    return () => clearTimeout(t)
  }, [progressToNext])

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f1f1f" strokeWidth={10} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="url(#xpGradient)"
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - (circumference * progress / 100)}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fill="#f59e0b"
        fontSize={size * 0.18}
        fontWeight="900"
        fontFamily="inherit"
      >
        {current.level}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fill="#a3a3a3"
        fontSize={size * 0.085}
        fontFamily="inherit"
      >
        {current.title}
      </text>
      {nextLevel && (
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          fill="#525252"
          fontSize={size * 0.07}
          fontFamily="inherit"
        >
          {progress}%
        </text>
      )}
    </svg>
  )
}
