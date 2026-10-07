'use client'

import { getLevelInfo } from '@/lib/levels'

interface Props {
  xp: number
  animate?: boolean
}

export default function LevelBadge({ xp, animate }: Props) {
  const { current } = getLevelInfo(xp)

  return (
    <span
      className={animate ? 'animate-pop-in' : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        backgroundColor: '#1a1a1a',
        border: `1px solid ${current.color}44`,
        borderRadius: '9999px',
        padding: '0.2rem 0.65rem',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: current.color,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontWeight: 900 }}>Level {current.level}</span>
      <span style={{ color: '#737373' }}>·</span>
      <span>{current.title}</span>
    </span>
  )
}
