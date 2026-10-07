'use client'

import { useEffect, useState } from 'react'

interface Props {
  practiceDates: string[]
}

function getDayLabel(d: number): string {
  return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d]
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short' })
}

export default function PracticeCalendar({ practiceDates }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const dateSet = new Set(practiceDates)

  // Build last 84 days (12 weeks), starting from Monday
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Find the most recent Monday on or before today
  const todayDay = today.getDay() // 0=Sun, 1=Mon...
  const daysToMonday = (todayDay + 6) % 7 // 0 for Mon, 6 for Sun
  const end = new Date(today)
  end.setDate(today.getDate() + (6 - daysToMonday)) // end on Sunday of current week

  const start = new Date(end)
  start.setDate(end.getDate() - 83) // 84 days back

  // Build a grid: 7 rows (Mon-Sun), 12 columns (weeks)
  const days: { date: Date; iso: string; hasPractice: boolean }[] = []
  for (let i = 0; i < 84; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    days.push({ date: d, iso, hasPractice: dateSet.has(iso) })
  }

  // Group into 12 weeks of 7 days
  const weeks: typeof days[] = []
  for (let w = 0; w < 12; w++) {
    weeks.push(days.slice(w * 7, w * 7 + 7))
  }

  // Month labels per column (show label if first day of month appears in this week)
  const monthLabels = weeks.map(week => {
    const firstDay = week.find(d => d.date.getDate() === 1)
    return firstDay ? getMonthLabel(firstDay.date) : ''
  })

  const cellSize = 12
  const gap = 3
  const rowLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

  return (
    <div style={{ userSelect: 'none' }}>
      {/* Month labels */}
      <div style={{ display: 'flex', gap: gap, marginBottom: 4, paddingLeft: 20 }}>
        {weeks.map((_, wi) => (
          <div
            key={wi}
            style={{
              width: cellSize,
              fontSize: '0.6rem',
              color: '#525252',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'visible',
            }}
          >
            {monthLabels[wi]}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', gap: 4 }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: gap, marginRight: 2 }}>
          {rowLabels.map((lbl, ri) => (
            <div
              key={ri}
              style={{
                width: 16,
                height: cellSize,
                fontSize: '0.55rem',
                color: '#525252',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {lbl}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap }}>
            {week.map((day, di) => (
              <div
                key={di}
                title={day.iso}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: 3,
                  backgroundColor: day.hasPractice ? 'rgba(245,158,11,0.8)' : '#1a1a1a',
                  transition: `opacity 0.3s ease ${(wi * 7 + di) * 8}ms`,
                  opacity: visible ? 1 : 0,
                  cursor: 'default',
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 8 }}>
        <span style={{ color: '#525252', fontSize: '0.6rem' }}>Less</span>
        {[0.15, 0.35, 0.55, 0.75, 1].map((alpha, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: alpha < 0.2 ? '#1a1a1a' : `rgba(245,158,11,${alpha})`,
            }}
          />
        ))}
        <span style={{ color: '#525252', fontSize: '0.6rem' }}>More</span>
      </div>
    </div>
  )
}
