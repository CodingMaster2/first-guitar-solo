'use client'

import { useState, useEffect } from 'react'

interface WeeklyReport {
  grades: {
    consistency: string
    time: string
    lessons: string
    streak: string
  }
  stats: {
    daysPracticed: number
    totalMinutes: number
    lessonsCompleted: number
    streak: number
  }
  insight: string
  weekStart: string
  weekEnd: string
}

const GRADE_COLORS: Record<string, string> = {
  A: '#22c55e',
  B: '#f59e0b',
  C: '#eab308',
  D: '#ef4444',
}

const GRADE_BG: Record<string, string> = {
  A: '#0a1a0a',
  B: '#1a1200',
  C: '#1a1600',
  D: '#1a0a0a',
}

const GRADE_BORDER: Record<string, string> = {
  A: '#14532d',
  B: '#78350f',
  C: '#713f12',
  D: '#7f1d1d',
}

function formatDateRange(start: string, end: string): string {
  try {
    const s = new Date(start)
    const e = new Date(end)
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', opts)}`
  } catch {
    return ''
  }
}

interface GradeCardProps {
  label: string
  grade: string
  detail: string
}

function GradeCard({ label, grade, detail }: GradeCardProps) {
  const color = GRADE_COLORS[grade] ?? '#a3a3a3'
  const bg = GRADE_BG[grade] ?? '#111111'
  const border = GRADE_BORDER[grade] ?? '#262626'

  return (
    <div
      style={{
        backgroundColor: bg,
        border: `1px solid ${border}`,
        borderRadius: '0.625rem',
        padding: '0.875rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <span
        style={{
          color,
          fontSize: '2rem',
          fontWeight: 900,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          flexShrink: 0,
        }}
      >
        {grade}
      </span>
      <div>
        <p style={{ color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, marginBottom: 1 }}>
          {label}
        </p>
        <p style={{ color: '#737373', fontSize: '0.7rem' }}>{detail}</p>
      </div>
    </div>
  )
}

export default function WeeklyReportCard() {
  const [report, setReport] = useState<WeeklyReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/progress/weekly-report')
      .then((r) => {
        if (!r.ok) throw new Error('Failed')
        return r.json() as Promise<WeeklyReport>
      })
      .then((data) => {
        setReport(data)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: '0.75rem',
          padding: '1.25rem',
        }}
      >
        <p style={{ color: '#525252', fontSize: '0.875rem', textAlign: 'center' }}>
          Loading weekly report...
        </p>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: '0.75rem',
          padding: '1.25rem',
        }}
      >
        <p style={{ color: '#525252', fontSize: '0.875rem', textAlign: 'center' }}>
          Sign in to see your weekly report.
        </p>
      </div>
    )
  }

  const { grades, stats, insight, weekStart, weekEnd } = report

  return (
    <div
      style={{
        backgroundColor: '#111111',
        border: '1px solid #262626',
        borderRadius: '0.75rem',
        padding: '1.25rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1rem',
        }}
      >
        <div>
          <h2 className="text-white text-xs font-bold uppercase tracking-widest mb-0.5">
            Weekly Report Card
          </h2>
          <p style={{ color: '#525252', fontSize: '0.7rem' }}>
            {formatDateRange(weekStart, weekEnd)}
          </p>
        </div>
        <span
          style={{
            backgroundColor: '#1a0f00',
            color: '#f59e0b',
            border: '1px solid #78350f',
            borderRadius: '0.375rem',
            padding: '2px 8px',
            fontSize: '0.7rem',
            fontWeight: 700,
          }}
        >
          7 days
        </span>
      </div>

      {/* Grade grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.625rem',
          marginBottom: '1rem',
        }}
      >
        <GradeCard
          label="Consistency"
          grade={grades.consistency}
          detail={`${stats.daysPracticed}/7 days`}
        />
        <GradeCard
          label="Practice Time"
          grade={grades.time}
          detail={`${stats.totalMinutes} min total`}
        />
        <GradeCard
          label="Lessons Completed"
          grade={grades.lessons}
          detail={`${stats.lessonsCompleted} lesson${stats.lessonsCompleted !== 1 ? 's' : ''}`}
        />
        <GradeCard
          label="Streak Maintenance"
          grade={grades.streak}
          detail={`${stats.streak} day streak`}
        />
      </div>

      {/* Insight */}
      <div
        style={{
          backgroundColor: '#0a0a0a',
          border: '1px solid #1f1f1f',
          borderLeft: '3px solid #f59e0b',
          borderRadius: '0.5rem',
          padding: '0.75rem 0.875rem',
        }}
      >
        <p style={{ color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          Insight
        </p>
        <p style={{ color: '#d4d4d4', fontSize: '0.8rem', lineHeight: 1.6 }}>{insight}</p>
      </div>
    </div>
  )
}
