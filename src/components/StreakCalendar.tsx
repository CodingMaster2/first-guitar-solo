'use client'

interface ProgressItem {
  day: number
  completed: boolean
  completedAt: string | null
}

interface Props {
  progress: ProgressItem[]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function StreakCalendar({ progress }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Build a set of completed date strings
  const completedDates = new Set<string>()
  for (const p of progress) {
    if (p.completed && p.completedAt) {
      completedDates.add(new Date(p.completedAt).toISOString().slice(0, 10))
    }
  }

  // Build 12 weeks × 7 days grid (84 cells), ending today
  // Find the Sunday on or before 83 days ago
  const endDate = new Date(today)
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - (12 * 7 - 1))

  // Align to Sunday
  const dayOfWeek = startDate.getDay() // 0=Sun
  startDate.setDate(startDate.getDate() - dayOfWeek)

  // Build weeks
  const weeks: Date[][] = []
  let cursor = new Date(startDate)
  for (let w = 0; w < 12; w++) {
    const week: Date[] = []
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }

  // Month labels: find which week each month starts in
  const monthLabels: { week: number; label: string }[] = []
  weeks.forEach((week, wi) => {
    const firstOfWeek = week[0]
    // Show month label if this week contains the 1st of a month
    for (const d of week) {
      if (d.getDate() === 1 && d <= today) {
        monthLabels.push({ week: wi, label: MONTHS[d.getMonth()] })
        break
      }
    }
  })

  const cellSize = 12
  const cellGap = 3
  const step = cellSize + cellGap

  const activeDays = completedDates.size

  return (
    <div>
      <div style={{ position: 'relative', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${12 * step + 16} ${7 * step + 20}`}
          style={{ display: 'block', width: '100%', maxWidth: 220 }}
          aria-label="Practice streak calendar"
        >
          {/* Month labels */}
          {monthLabels.map(({ week, label }) => (
            <text
              key={`${week}-${label}`}
              x={week * step}
              y={9}
              style={{ fill: '#525252', fontSize: 7, fontFamily: 'inherit' }}
            >
              {label}
            </text>
          ))}

          {/* Day cells */}
          {weeks.map((week, wi) =>
            week.map((date, di) => {
              const dateStr = date.toISOString().slice(0, 10)
              const isFuture = date > today
              const isCompleted = completedDates.has(dateStr)
              const isPast = date <= today

              let fill = '#161616'
              if (isFuture) {
                fill = '#0d0d0d'
              } else if (isCompleted) {
                // Slight opacity variation based on day of week
                fill = '#f59e0b'
              } else if (isPast) {
                fill = '#161616'
              }

              const opacity = isCompleted ? (0.75 + (di / 7) * 0.25) : 1

              return (
                <rect
                  key={dateStr}
                  x={wi * step}
                  y={di * step + 12}
                  width={cellSize}
                  height={cellSize}
                  rx={2}
                  fill={fill}
                  opacity={opacity}
                >
                  <title>
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {isCompleted ? ' — practiced' : isFuture ? '' : ' — no practice'}
                  </title>
                </rect>
              )
            })
          )}
        </svg>
      </div>
      <p style={{ color: '#525252', fontSize: '0.7rem', marginTop: '0.25rem' }}>
        <span style={{ color: '#f59e0b', fontWeight: 700 }}>{activeDays}</span> active days
      </p>
    </div>
  )
}
