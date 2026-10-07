'use client'

import Link from 'next/link'

interface Props {
  currentDay: number
  lessonTitle: string
  lessonSubtitle: string
  duration: number
  isCompleted: boolean
}

export default function TodaysMission({
  currentDay,
  lessonTitle,
  lessonSubtitle,
  duration,
  isCompleted,
}: Props) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a1200 0%, #111111 100%)',
        border: '1px solid #262626',
        borderLeft: '4px solid #f59e0b',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      {isCompleted ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span
            style={{
              backgroundColor: '#052e16',
              border: '1px solid #166534',
              color: '#4ade80',
              borderRadius: '9999px',
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            ✓ Completed
          </span>
          <p style={{ color: '#a3a3a3', fontSize: '0.875rem' }}>
            Great work! Come back tomorrow.
          </p>
        </div>
      ) : (
        <div>
          <p
            style={{
              color: '#f59e0b',
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '0.5rem',
            }}
          >
            Today&apos;s Mission
          </p>
          <p
            style={{
              color: '#f59e0b',
              fontSize: '1.5rem',
              fontWeight: 900,
              lineHeight: 1,
              marginBottom: '0.25rem',
            }}
          >
            Day {currentDay}
          </p>
          <h2
            style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              fontWeight: 900,
              marginBottom: '0.25rem',
            }}
          >
            {lessonTitle}
          </h2>
          <p style={{ color: '#a3a3a3', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {lessonSubtitle}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #262626',
                color: '#a3a3a3',
                borderRadius: '0.375rem',
                padding: '0.2rem 0.6rem',
                fontSize: '0.75rem',
              }}
            >
              {duration} min
            </span>
          </div>
          <Link
            href={`/lesson/${currentDay}`}
            style={{
              display: 'inline-block',
              backgroundColor: '#f59e0b',
              color: '#000',
              borderRadius: '0.5rem',
              padding: '0.75rem 2rem',
              fontWeight: 900,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textDecoration: 'none',
            }}
          >
            Start Lesson →
          </Link>
        </div>
      )}
    </div>
  )
}
