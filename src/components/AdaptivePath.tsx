'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LESSONS } from '@/lib/lessons'

interface AdaptivePathData {
  path: number[] | null
}

interface NextLessonData {
  nextDay: number | null
  lessonsRemaining: number | null
  totalInPath: number | null
}

export default function AdaptivePath() {
  const [pathData, setPathData] = useState<AdaptivePathData | null>(null)
  const [nextData, setNextData] = useState<NextLessonData | null>(null)
  const [generating, setGenerating] = useState(false)
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set())

  useEffect(() => {
    Promise.all([
      fetch('/api/adaptive-path').then((r) => r.json() as Promise<AdaptivePathData>),
      fetch('/api/adaptive-path/next').then((r) => r.json() as Promise<NextLessonData>),
      fetch('/api/progress').then((r) => r.json() as Promise<{ progress?: Array<{ day: number; completed: boolean }> }>).catch(() => ({ progress: [] })),
    ]).then(([pd, nd, prog]) => {
      setPathData(pd)
      setNextData(nd)
      const done = (prog.progress ?? []).filter((p) => p.completed).map((p) => p.day)
      setCompletedDays(new Set(done))
    }).catch(() => {
      setPathData({ path: null })
    })
  }, [])

  const generatePath = async () => {
    setGenerating(true)
    try {
      const [pd, nd] = await Promise.all([
        fetch('/api/adaptive-path', { method: 'POST' }).then((r) => r.json() as Promise<AdaptivePathData>),
        fetch('/api/adaptive-path/next').then((r) => r.json() as Promise<NextLessonData>),
      ])
      setPathData(pd)
      setNextData(nd)
    } catch {
      // ignore
    } finally {
      setGenerating(false)
    }
  }

  const recalculate = async () => {
    setGenerating(true)
    try {
      const pd = await fetch('/api/adaptive-path', { method: 'POST' }).then((r) => r.json() as Promise<AdaptivePathData>)
      const nd = await fetch('/api/adaptive-path/next').then((r) => r.json() as Promise<NextLessonData>)
      setPathData(pd)
      setNextData(nd)
    } catch {
      // ignore
    } finally {
      setGenerating(false)
    }
  }

  if (pathData === null) {
    return (
      <div
        style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
        className="rounded-xl p-5 animate-pulse"
      >
        <div style={{ backgroundColor: '#1f1f1f', height: 16, width: 200, borderRadius: 4 }} className="mb-2" />
        <div style={{ backgroundColor: '#1f1f1f', height: 12, width: 150, borderRadius: 4 }} />
      </div>
    )
  }

  // No path yet
  if (!pathData.path) {
    return (
      <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Personalized Learning Path</h3>
            <p style={{ color: '#737373' }} className="text-xs mt-1">
              Get a lesson order tailored to your experience level.
            </p>
          </div>
        </div>
        <button
          onClick={generatePath}
          disabled={generating}
          style={{ backgroundColor: '#f59e0b', color: '#000' }}
          className="px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate Your Personal Path'}
        </button>
      </div>
    )
  }

  const path = pathData.path
  const nextDay = nextData?.nextDay
  const nextLesson = nextDay ? LESSONS.find((l) => l.day === nextDay) : null
  const lessonsRemaining = nextData?.lessonsRemaining ?? 0
  const totalInPath = nextData?.totalInPath ?? path.length
  const completedInPath = totalInPath - lessonsRemaining

  return (
    <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Your Adaptive Path</h3>
          <p style={{ color: '#737373' }} className="text-xs mt-1">
            {totalInPath} personalized lessons
          </p>
        </div>
        <button
          onClick={recalculate}
          disabled={generating}
          style={{ color: '#737373', fontSize: 11 }}
          className="hover:text-white transition-colors disabled:opacity-50"
        >
          {generating ? 'Updating...' : 'Recalculate'}
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ backgroundColor: '#1f1f1f', borderRadius: 4, height: 6, overflow: 'hidden' }} className="mb-4">
        <div
          style={{
            backgroundColor: '#f59e0b',
            height: '100%',
            width: `${totalInPath > 0 ? (completedInPath / totalInPath) * 100 : 0}%`,
            borderRadius: 4,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <p style={{ color: '#737373' }} className="text-xs mb-4">
        {completedInPath} of {totalInPath} lessons complete
      </p>

      {/* Next up */}
      {nextLesson && nextDay && (
        <Link
          href={`/lesson/${nextDay}`}
          style={{ backgroundColor: '#1a1200', border: '1px solid #78350f' }}
          className="block rounded-lg p-3 mb-4 hover:border-amber-500 transition-all"
        >
          <p style={{ color: '#d97706' }} className="text-xs font-bold uppercase tracking-wider mb-0.5">Next Up</p>
          <p className="text-white text-sm font-bold">
            Day {nextDay} — {nextLesson.title}
          </p>
          <p style={{ color: '#737373' }} className="text-xs mt-0.5 line-clamp-1">{nextLesson.subtitle}</p>
        </Link>
      )}

      {/* Mini path visualization */}
      <div className="flex flex-wrap gap-1.5">
        {path.map((day) => {
          const isDone = completedDays.has(day)
          const isCurrent = day === nextDay
          return (
            <Link
              key={day}
              href={`/lesson/${day}`}
              title={`Day ${day}`}
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                backgroundColor: isDone ? '#1a1200' : isCurrent ? '#1a1200' : '#1f1f1f',
                border: `1px solid ${isDone ? '#d97706' : isCurrent ? '#f59e0b' : '#262626'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: isDone ? '#f59e0b' : isCurrent ? '#f59e0b' : '#404040',
                  fontSize: 9,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {isDone ? '✓' : day}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
