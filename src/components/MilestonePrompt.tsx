'use client'

interface Props {
  completedDays: number
  streak: number
}

function getPromptText(completedDays: number, streak: number): string {
  if (streak >= 30) return `🏆 ${streak}-day streak. Legendary.`
  if (streak >= 7) return `🔥 ${streak}-day streak — you're on fire!`
  if (completedDays >= 28) return "🎸 The finish line is right there. Don't stop now."
  if (completedDays === 21) return '⚡ Week 3 done. The solo is almost yours.'
  if (completedDays === 14) return '🔥 Halfway there! You\'re ahead of most beginners.'
  if (completedDays >= 8 && completedDays <= 13) return 'Week 2 starts now — this is where the sound really comes together.'
  if (completedDays === 7) return "🎉 Week 1 complete! You've built the foundation."
  if (completedDays >= 1 && completedDays <= 6) return `You're building momentum! ${7 - completedDays} day${7 - completedDays !== 1 ? 's' : ''} until your first week milestone.`
  return 'Ready to begin? Day 1 is waiting for you.'
}

export default function MilestonePrompt({ completedDays, streak }: Props) {
  const text = getPromptText(completedDays, streak)

  return (
    <div
      style={{
        backgroundColor: '#111111',
        border: '1px solid #262626',
        borderLeft: '3px solid #f59e0b',
        borderRadius: '0.75rem',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <p style={{ color: '#d4d4d4', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
        {text}
      </p>
    </div>
  )
}
