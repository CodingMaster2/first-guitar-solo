interface LessonTipProps {
  tip: string
  type?: 'technique' | 'theory' | 'mindset' | 'practice'
}

const TYPE_ICONS: Record<NonNullable<LessonTipProps['type']>, string> = {
  technique: '💡',
  theory: '🎵',
  mindset: '🧠',
  practice: '⏱️',
}

export default function LessonTip({ tip, type = 'technique' }: LessonTipProps) {
  const icon = TYPE_ICONS[type]

  return (
    <div
      style={{
        backgroundColor: '#0d0d0d',
        border: '1px solid #1f1f1f',
        borderLeft: '4px solid #f59e0b',
        borderRadius: '0 0.5rem 0.5rem 0',
        padding: '0.875rem 1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'flex-start',
      }}
    >
      <span style={{ fontSize: '1.125rem', flexShrink: 0, lineHeight: 1.4 }} aria-hidden="true">
        {icon}
      </span>
      <div>
        <p
          style={{
            color: '#f59e0b',
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '0.3rem',
          }}
        >
          Pro Tip
        </p>
        <p
          style={{
            color: '#d4d4d4',
            fontSize: '0.875rem',
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {tip}
        </p>
      </div>
    </div>
  )
}
