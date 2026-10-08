'use client'

interface Session {
  day: number
  duration: number
  createdAt: string
}

interface Props {
  sessions: Session[]
}

export default function PracticeChart({ sessions }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Build array of last 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (13 - i))
    return d
  })

  // Sum duration per day
  const totals = days.map((d) => {
    const ds = d.toISOString().slice(0, 10)
    return sessions
      .filter((s) => new Date(s.createdAt).toISOString().slice(0, 10) === ds)
      .reduce((sum, s) => sum + s.duration, 0)
  })

  const maxDuration = Math.max(...totals, 1)
  const average = totals.reduce((a, b) => a + b, 0) / 14

  // Chart dimensions
  const svgW = 560
  const svgH = 140
  const paddingLeft = 36
  const paddingRight = 8
  const paddingTop = 10
  const paddingBottom = 28
  const chartW = svgW - paddingLeft - paddingRight
  const chartH = svgH - paddingTop - paddingBottom
  const maxBar = 100 // max bar height in px (relative scale: 100px = 60 min cap for display)
  const displayMax = Math.max(maxDuration, 60) // scale against 60 min or actual max

  const barWidth = Math.floor(chartW / 14) - 2
  const barSlot = chartW / 14

  // Y-axis gridlines at 0, 15, 30, 45, 60 minutes
  const yTicks = [0, 15, 30, 45, 60]

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      aria-label="Practice time chart"
    >
      {/* Gridlines */}
      {yTicks.map((min) => {
        const yFraction = min / displayMax
        const y = paddingTop + chartH - yFraction * chartH
        return (
          <g key={min}>
            <line
              x1={paddingLeft}
              y1={y}
              x2={svgW - paddingRight}
              y2={y}
              stroke="#1f1f1f"
              strokeWidth={1}
            />
            <text
              x={paddingLeft - 4}
              y={y + 4}
              textAnchor="end"
              style={{ fill: '#525252', fontSize: 8, fontFamily: 'inherit' }}
            >
              {min}
            </text>
          </g>
        )
      })}

      {/* Bars */}
      {totals.map((dur, i) => {
        const x = paddingLeft + i * barSlot + (barSlot - barWidth) / 2
        const barH = dur > 0 ? Math.max((dur / displayMax) * chartH, 3) : 0
        const y = paddingTop + chartH - barH
        const labelDay = days[i]
        const dayNum = 13 - i
        const label = `D${14 - dayNum}`

        return (
          <g key={i}>
            <rect
              x={x}
              y={dur > 0 ? y : paddingTop + chartH - 2}
              width={barWidth}
              height={dur > 0 ? barH : 2}
              rx={2}
              fill={dur > 0 ? '#f59e0b' : '#1f1f1f'}
            >
              <title>
                {labelDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: {dur} min
              </title>
            </rect>
            {/* X-axis label */}
            <text
              x={x + barWidth / 2}
              y={svgH - 4}
              textAnchor="middle"
              style={{ fill: '#525252', fontSize: 7, fontFamily: 'inherit' }}
            >
              {label}
            </text>
          </g>
        )
      })}

      {/* Average line */}
      {average > 0 && (
        (() => {
          const avgY = paddingTop + chartH - (average / displayMax) * chartH
          return (
            <line
              x1={paddingLeft}
              y1={avgY}
              x2={svgW - paddingRight}
              y2={avgY}
              stroke="#f59e0b"
              strokeWidth={1}
              strokeDasharray="4 3"
              opacity={0.5}
            />
          )
        })()
      )}
    </svg>
  )
}
