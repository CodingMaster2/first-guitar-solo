import Link from 'next/link'

interface NextReview {
  day: number
  nextReviewAt: string
}

interface Props {
  nextReviews: NextReview[]
}

function getRelativeTime(dateStr: string): { label: string; overdue: boolean } {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  const diffMs = target.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { label: 'Overdue', overdue: true }
  if (diffDays === 0) return { label: 'today', overdue: false }
  if (diffDays === 1) return { label: 'tomorrow', overdue: false }
  return { label: `in ${diffDays} days`, overdue: false }
}

export default function ReviewReminders({ nextReviews }: Props) {
  return (
    <div
      style={{
        backgroundColor: '#111111',
        border: '1px solid #262626',
        borderRadius: '0.75rem',
        padding: '1.25rem',
      }}
    >
      <p
        style={{
          color: '#a3a3a3',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '0.75rem',
        }}
      >
        Due for review
      </p>

      {nextReviews.length === 0 ? (
        <p style={{ color: '#525252', fontSize: '0.875rem' }}>
          You&apos;re all caught up! 🎸
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {nextReviews.map(({ day, nextReviewAt }) => {
            const { label, overdue } = getRelativeTime(nextReviewAt)
            return (
              <li key={day} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <span style={{ color: '#d4d4d4', fontSize: '0.8rem' }}>
                  Day {day} —{' '}
                  {overdue ? (
                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>Overdue</span>
                  ) : (
                    <span style={{ color: '#737373' }}>review due {label}</span>
                  )}
                </span>
                <Link
                  href={`/lesson/${day}`}
                  style={{
                    color: '#f59e0b',
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  Review →
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
