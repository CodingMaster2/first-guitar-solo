'use client'

interface DauChartProps {
  data: { date: string; dau: number; wau: number }[]
}

export default function DauChart({ data }: DauChartProps) {
  const WIDTH = 600
  const HEIGHT = 200
  const PADDING = { top: 16, right: 16, bottom: 36, left: 40 }

  const innerW = WIDTH - PADDING.left - PADDING.right
  const innerH = HEIGHT - PADDING.top - PADDING.bottom

  const maxVal = Math.max(...data.map((d) => Math.max(d.dau, d.wau)), 1)

  const xScale = (i: number) => PADDING.left + (i / Math.max(data.length - 1, 1)) * innerW
  const yScale = (v: number) => PADDING.top + innerH - (v / maxVal) * innerH

  const toPath = (vals: number[]) =>
    vals
      .map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)} ${yScale(v).toFixed(1)}`)
      .join(' ')

  const dauPath = toPath(data.map((d) => d.dau))
  const wauPath = toPath(data.map((d) => d.wau))

  // Grid lines at 25%, 50%, 75%, 100%
  const gridLevels = [0.25, 0.5, 0.75, 1]

  // X-axis labels every 5th point
  const xLabels = data
    .map((d, i) => ({ i, label: d.date.slice(5) }))
    .filter((_, i) => i % 5 === 0 || i === data.length - 1)

  return (
    <div style={{ width: '100%' }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 24, height: 3, backgroundColor: '#f59e0b', borderRadius: 2 }} />
          <span style={{ color: '#a3a3a3', fontSize: 11 }}>DAU</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 24, height: 3, backgroundColor: '#60a5fa', borderRadius: 2 }} />
          <span style={{ color: '#a3a3a3', fontSize: 11 }}>WAU</span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ width: '100%', height: 'auto', display: 'block', backgroundColor: '#111111', borderRadius: 8 }}
      >
        {/* Grid lines */}
        {gridLevels.map((level) => {
          const y = yScale(maxVal * level)
          return (
            <g key={level}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={WIDTH - PADDING.right}
                y2={y}
                stroke="#1f1f1f"
                strokeWidth={1}
              />
              <text
                x={PADDING.left - 4}
                y={y + 4}
                textAnchor="end"
                fill="#404040"
                fontSize={9}
              >
                {Math.round(maxVal * level)}
              </text>
            </g>
          )
        })}

        {/* X-axis labels */}
        {xLabels.map(({ i, label }) => (
          <text
            key={i}
            x={xScale(i)}
            y={HEIGHT - 4}
            textAnchor="middle"
            fill="#404040"
            fontSize={9}
          >
            {label}
          </text>
        ))}

        {/* WAU line */}
        <path d={wauPath} fill="none" stroke="#60a5fa" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />

        {/* DAU line */}
        <path d={dauPath} fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />

        {/* DAU data points */}
        {data.map((d, i) => (
          <circle key={`dau-${i}`} cx={xScale(i)} cy={yScale(d.dau)} r={3} fill="#f59e0b">
            <title>{`${d.date} — DAU: ${d.dau}`}</title>
          </circle>
        ))}

        {/* WAU data points */}
        {data.map((d, i) => (
          <circle key={`wau-${i}`} cx={xScale(i)} cy={yScale(d.wau)} r={3} fill="#60a5fa">
            <title>{`${d.date} — WAU: ${d.wau}`}</title>
          </circle>
        ))}
      </svg>
    </div>
  )
}
