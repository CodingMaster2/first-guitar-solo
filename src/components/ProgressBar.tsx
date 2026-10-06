'use client'

import { useState, useEffect } from 'react'

interface ProgressBarProps {
  value: number
  color?: string
  height?: number
  showLabel?: boolean
  label?: string
  shimmer?: boolean
}

export default function ProgressBar({ value, color, height = 8, showLabel = false, label, shimmer = false }: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const clamped = Math.min(100, Math.max(0, value))

  useEffect(() => {
    const t = setTimeout(() => setDisplayValue(clamped), 100)
    return () => clearTimeout(t)
  }, [clamped])

  const fillStyle = color
    ? { backgroundColor: color, width: `${displayValue}%`, height: '100%', transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)' }
    : { background: 'linear-gradient(90deg, #f59e0b, #fde68a)', width: `${displayValue}%`, height: '100%', transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)', position: 'relative' as const, overflow: 'hidden' }

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span style={{ color: '#a3a3a3' }} className="text-xs">{label}</span>}
          {showLabel && <span style={{ color: '#f59e0b' }} className="text-xs font-bold ml-auto">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div style={{ backgroundColor: '#1a1a1a', height: `${height}px` }} className="w-full rounded-full overflow-hidden">
        <div style={fillStyle} className="rounded-full">
          {shimmer && (
            <div className="shimmer" style={{ position: 'absolute', inset: 0, borderRadius: '9999px' }} />
          )}
        </div>
      </div>
    </div>
  )
}
