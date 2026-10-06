'use client'
import { useEffect, useState } from 'react'

interface Session { createdAt: Date | string; duration: number }
interface Props { sessions: Session[] }

export default function WeeklyActivityChart({ sessions }: Props) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t) }, [])

  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return d
  })

  const dayTotals = days.map(d => {
    const dayStr = d.toDateString()
    return sessions.filter(s => new Date(s.createdAt).toDateString() === dayStr).reduce((sum, s) => sum + s.duration, 0)
  })
  const maxVal = Math.max(...dayTotals, 1)
  const dayLabels = days.map(d => ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d.getDay()])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 56 }}>
        {dayTotals.map((val, i) => {
          const isToday = i === 6
          const pct = animated ? (val / maxVal) * 100 : 0
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
              <div
                title={`${val} min`}
                style={{
                  width: '100%',
                  height: `${Math.max(pct, val > 0 ? 6 : 2)}%`,
                  background: val > 0
                    ? (isToday ? 'linear-gradient(to top, #f59e0b, #fde68a)' : 'linear-gradient(to top, #d97706, #f59e0b)')
                    : '#1a1a1a',
                  borderRadius: '3px 3px 0 0',
                  transition: 'height 0.8s cubic-bezier(0.4,0,0.2,1)',
                  minHeight: 2,
                }}
              />
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        {dayLabels.map((lbl, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', color: '#404040', fontSize: '0.6rem' }}>{lbl}</div>
        ))}
      </div>
    </div>
  )
}
