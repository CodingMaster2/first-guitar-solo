'use client'

interface LessonHeatmapProps {
  data: { day: number; completions: number }[]
}

function cellColor(completions: number): string {
  if (completions === 0) return '#161616'
  if (completions <= 5) return '#451a03'
  if (completions <= 15) return '#92400e'
  if (completions <= 30) return '#d97706'
  return '#f59e0b'
}

export default function LessonHeatmap({ data }: LessonHeatmapProps) {
  // 6 columns × 5 rows = 30 cells
  const COLS = 6
  const ROWS = 5
  const GAP = 6
  const CELL = 48

  const totalWidth = COLS * CELL + (COLS - 1) * GAP
  const totalHeight = ROWS * CELL + (ROWS - 1) * GAP

  return (
    <div style={{ width: '100%' }}>
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {data.map(({ day, completions }) => {
          const idx = day - 1
          const col = idx % COLS
          const row = Math.floor(idx / COLS)
          const x = col * (CELL + GAP)
          const y = row * (CELL + GAP)
          const bg = cellColor(completions)

          return (
            <g key={day}>
              <rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx={6}
                fill={bg}
              >
                <title>{`Day ${day}: ${completions} completion${completions !== 1 ? 's' : ''}`}</title>
              </rect>
              <text
                x={x + CELL / 2}
                y={y + CELL / 2 - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={completions > 5 ? '#fef3c7' : '#737373'}
                fontSize={11}
                fontWeight="700"
              >
                {day}
              </text>
              <text
                x={x + CELL / 2}
                y={y + CELL / 2 + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={completions > 5 ? '#fde68a' : '#525252'}
                fontSize={9}
              >
                {completions}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <span style={{ color: '#525252', fontSize: 10 }}>Low</span>
        {(['#161616', '#451a03', '#92400e', '#d97706', '#f59e0b'] as const).map((c) => (
          <div
            key={c}
            style={{ width: 14, height: 14, backgroundColor: c, borderRadius: 3, border: '1px solid #262626' }}
          />
        ))}
        <span style={{ color: '#525252', fontSize: 10 }}>High completions</span>
      </div>
    </div>
  )
}
