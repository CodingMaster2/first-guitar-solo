'use client'

interface StreakFlameProps {
  streak: number
  size?: number
}

export default function StreakFlame({ streak, size = 48 }: StreakFlameProps) {
  const getFlameConfig = () => {
    if (streak === 0) {
      return {
        fill: '#525252',
        filter: 'none',
        className: '',
        label: '#525252',
      }
    }
    if (streak < 7) {
      return {
        fill: '#f59e0b',
        filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.5))',
        className: '',
        label: '#f59e0b',
      }
    }
    if (streak < 14) {
      return {
        fill: 'url(#amberGlow)',
        filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.7))',
        className: '',
        label: '#fbbf24',
      }
    }
    if (streak < 21) {
      return {
        fill: 'url(#orangeAmber)',
        filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.8))',
        className: '',
        label: '#fb923c',
      }
    }
    return {
      fill: 'url(#redAmber)',
      filter: 'drop-shadow(0 0 12px rgba(245,158,11,0.9))',
      className: 'flame-pulse',
      label: '#ef4444',
    }
  }

  const config = getFlameConfig()
  const scaleX = size / 24
  const scaleY = size / 26

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <svg
        width={size}
        height={Math.round(size * (26 / 24))}
        viewBox="0 0 24 26"
        className={config.className}
        style={{ overflow: 'visible' }}
        aria-label={`${streak} day streak`}
      >
        <defs>
          <linearGradient id="amberGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="orangeAmber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="redAmber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <path
          d="M 12,2 C 12,2 6,8 4,13 C 2,18 4,22 8,23 C 6,20 8,18 10,17 C 10,20 12,24 12,24 C 12,24 14,20 14,17 C 16,18 18,20 16,23 C 20,22 22,18 20,13 C 18,8 12,2 12,2 Z"
          fill={config.fill}
          style={{ filter: config.filter }}
        />
      </svg>
      <span
        style={{
          color: config.label,
          fontSize: Math.max(10, Math.round(size * 0.28)),
          fontWeight: 900,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {streak}
      </span>
    </div>
  )
}
