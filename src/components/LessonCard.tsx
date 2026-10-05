import Link from 'next/link'
import type { Lesson } from '@/types'

interface LessonCardProps {
  lesson: Lesson
  completed: boolean
  isCurrent: boolean
  locked: boolean
}

export default function LessonCard({ lesson, completed, isCurrent, locked }: LessonCardProps) {
  const weekColors = ['#f59e0b', '#0ea5e9', '#a855f7', '#22c55e']
  const weekColor = weekColors[(lesson.week - 1) % weekColors.length]

  return (
    <div
      style={{
        backgroundColor: isCurrent ? '#1a1a1a' : '#111111',
        border: `1px solid ${isCurrent ? '#f59e0b' : completed ? '#262626' : '#1a1a1a'}`,
        opacity: locked ? 0.5 : 1,
      }}
      className="rounded-lg p-4 flex items-center justify-between gap-4 transition-all"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          style={{
            backgroundColor: completed ? weekColor : '#262626',
            color: completed ? '#000' : '#a3a3a3',
            minWidth: '2.5rem',
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
        >
          {completed ? '✓' : lesson.day}
        </div>
        <div className="min-w-0">
          <p style={{ color: '#a3a3a3' }} className="text-xs font-medium uppercase tracking-wider">
            Week {lesson.week} · Day {lesson.day}
          </p>
          <h3 className="text-white font-bold text-sm truncate">{lesson.title}</h3>
          <p style={{ color: '#a3a3a3' }} className="text-xs truncate hidden sm:block">
            {lesson.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span style={{ color: '#a3a3a3' }} className="text-xs hidden sm:block">
          {lesson.duration} min
        </span>
        {!locked && (
          <Link
            href={`/lesson/${lesson.day}`}
            style={{
              backgroundColor: isCurrent ? '#f59e0b' : 'transparent',
              color: isCurrent ? '#000000' : '#a3a3a3',
              border: isCurrent ? 'none' : '1px solid #262626',
            }}
            className="text-xs font-bold px-3 py-1.5 rounded hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            {completed ? 'Review' : isCurrent ? 'Start →' : 'Start'}
          </Link>
        )}
      </div>
    </div>
  )
}
