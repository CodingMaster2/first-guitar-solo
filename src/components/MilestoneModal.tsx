'use client'

interface MilestoneModalProps {
  day: number
  xpEarned: number
  onClose: () => void
}

const MILESTONE_DATA: Record<number, { title: string; message: string }> = {
  7: {
    title: 'Milestone: Week 1 Complete',
    message: 'You made it through the first week. The foundation is set — your fingers are learning what they need to.',
  },
  14: {
    title: 'Milestone: Week 2 Complete',
    message: 'Two weeks in. Technique is starting to click. The pentatonic scale is becoming part of you.',
  },
  21: {
    title: 'Milestone: Week 3 Complete',
    message: 'Three weeks of showing up. You\'re playing solo sections now. Most people stop before this.',
  },
  30: {
    title: 'Day 30 — You Did It!',
    message: 'You learned your first guitar solo. Start to finish, 30 days, one complete performance. That\'s real.',
  },
}

const MILESTONE_DAYS = [7, 14, 21, 30]

export default function MilestoneModal({ day, xpEarned, onClose }: MilestoneModalProps) {
  if (!MILESTONE_DAYS.includes(day)) return null

  const data = MILESTONE_DATA[day]

  return (
    <div
      style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999 }}
      className="fixed inset-0 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        style={{ backgroundColor: '#111111', border: '2px solid #f59e0b', maxWidth: 480, width: '100%' }}
        className="rounded-2xl p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '4rem', lineHeight: 1 }} className="mb-4">&#11088;</div>

        <h2 style={{ color: '#f59e0b' }} className="text-2xl font-black uppercase tracking-wider mb-2">
          {data.title}
        </h2>

        <div style={{ color: '#f59e0b', fontSize: '4rem', fontWeight: 900, lineHeight: 1 }} className="my-4">
          {day}
        </div>

        <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed mb-6">
          {data.message}
        </p>

        <div
          style={{ backgroundColor: '#1a0f00', border: '1px solid #78350f', color: '#f59e0b' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm mb-6"
        >
          &#9733; +{xpEarned} XP earned
        </div>

        <button
          onClick={onClose}
          style={{ backgroundColor: '#f59e0b', color: '#000' }}
          className="block w-full py-3 rounded-lg font-black text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Keep Going &#8594;
        </button>
      </div>
    </div>
  )
}
