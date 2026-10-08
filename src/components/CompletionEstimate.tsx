'use client'

interface Props {
  currentDay: number
  avgPracticesPerWeek: number
}

export default function CompletionEstimate({ currentDay, avgPracticesPerWeek }: Props) {
  if (currentDay >= 30) {
    return (
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: '0.75rem',
          padding: '1.25rem',
        }}
      >
        <p style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 700 }}>
          Course complete! 🎉
        </p>
      </div>
    )
  }

  const daysRemaining = 30 - currentDay
  const weeksAtCurrentPace = avgPracticesPerWeek > 0 ? daysRemaining / avgPracticesPerWeek : 999

  const completionDate = new Date()
  completionDate.setDate(completionDate.getDate() + Math.round(weeksAtCurrentPace * 7))

  const formattedDate = completionDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })

  let badge: { text: string; color: string } | null = null
  if (avgPracticesPerWeek >= 5) {
    badge = { text: "You're on track!", color: '#16a34a' }
  } else if (avgPracticesPerWeek < 3) {
    badge = { text: 'Pick up the pace', color: '#f59e0b' }
  }

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
          marginBottom: '0.5rem',
        }}
      >
        Completion Estimate
      </p>
      <p style={{ color: '#d4d4d4', fontSize: '0.875rem', lineHeight: 1.5 }}>
        At your current pace, you&apos;ll complete the course by{' '}
        <strong style={{ color: '#ffffff' }}>{formattedDate}</strong>
      </p>
      {badge && (
        <span
          style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            backgroundColor: `${badge.color}22`,
            color: badge.color,
            border: `1px solid ${badge.color}44`,
            borderRadius: 20,
            padding: '2px 10px',
            fontSize: '0.7rem',
            fontWeight: 700,
          }}
        >
          {badge.text}
        </span>
      )}
    </div>
  )
}
