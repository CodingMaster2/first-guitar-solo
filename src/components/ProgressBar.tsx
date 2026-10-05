'use client'

interface ProgressBarProps {
  value: number // 0-100
  color?: string
  height?: number
  showLabel?: boolean
  label?: string
}

export default function ProgressBar({
  value,
  color = '#f59e0b',
  height = 8,
  showLabel = false,
  label,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span style={{ color: '#a3a3a3' }} className="text-xs">{label}</span>}
          {showLabel && <span style={{ color: '#a3a3a3' }} className="text-xs ml-auto">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div
        style={{ backgroundColor: '#262626', height: `${height}px` }}
        className="w-full rounded-full overflow-hidden"
      >
        <div
          style={{
            backgroundColor: color,
            width: `${clamped}%`,
            height: '100%',
            transition: 'width 0.5s ease-in-out',
          }}
          className="rounded-full"
        />
      </div>
    </div>
  )
}
