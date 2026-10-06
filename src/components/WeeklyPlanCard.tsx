'use client'

import { useEffect, useState, useCallback } from 'react'

interface DayPlan {
  day: string
  focus: string
  duration: number
  type: 'new' | 'review' | 'rest'
  tip: string
}

interface PlanData {
  plan: DayPlan[] | null
  stale: boolean
  generatedAt: string | null
}

const TYPE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  new: { bg: '#1a0f00', color: '#f59e0b', label: 'New' },
  review: { bg: '#0a1a0a', color: '#22c55e', label: 'Review' },
  rest: { bg: '#111111', color: '#525252', label: 'Rest' },
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const todayName = DAY_NAMES[new Date().getDay()]

export default function WeeklyPlanCard() {
  const [data, setData] = useState<PlanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlan = useCallback(() => {
    setLoading(true)
    setError(null)
    fetch('/api/practice-plan')
      .then((r) => r.json())
      .then((d: PlanData) => setData(d))
      .catch(() => setError('Failed to load plan'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchPlan()
  }, [fetchPlan])

  const generatePlan = async () => {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/practice-plan', { method: 'POST' })
      if (!res.ok) {
        const e = await res.json() as { error?: string }
        throw new Error(e.error ?? 'Generation failed')
      }
      const d = await res.json() as PlanData
      setData(d)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const generatedLabel = data?.generatedAt
    ? new Date(data.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  return (
    <div
      style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
      className="rounded-xl p-5 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">
            Weekly Practice Plan
          </h3>
          {generatedLabel && (
            <p style={{ color: '#525252' }} className="text-xs mt-0.5">
              Generated {generatedLabel}
              {data?.stale && (
                <span style={{ color: '#f59e0b' }}> &middot; Outdated</span>
              )}
            </p>
          )}
        </div>
        <button
          onClick={generatePlan}
          disabled={generating || loading}
          style={{
            backgroundColor: generating ? '#1a1a1a' : '#f59e0b',
            color: generating ? '#525252' : '#000',
            fontSize: '0.72rem',
            fontWeight: 700,
            border: 'none',
            cursor: generating ? 'not-allowed' : 'pointer',
          }}
          className="px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
        >
          {generating ? 'Generating...' : data?.plan ? 'Refresh Plan' : 'Generate Plan'}
        </button>
      </div>

      {error && (
        <p style={{ color: '#ef4444' }} className="text-xs mb-3">
          {error}
        </p>
      )}

      {/* Loading shimmer */}
      {(loading || generating) && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              style={{ backgroundColor: '#1a1a1a', minWidth: 120, height: 110 }}
              className="rounded-lg flex-shrink-0 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* No plan yet */}
      {!loading && !generating && !data?.plan && (
        <div className="text-center py-6">
          <p style={{ color: '#a3a3a3' }} className="text-sm mb-3">
            Get a personalized 7-day practice schedule built from your progress and weak areas.
          </p>
          <button
            onClick={generatePlan}
            style={{ backgroundColor: '#f59e0b', color: '#000', border: 'none', cursor: 'pointer' }}
            className="px-5 py-2.5 rounded-lg text-sm font-black hover:opacity-90 transition-opacity"
          >
            Generate My Weekly Plan &#8594;
          </button>
        </div>
      )}

      {/* Plan cards */}
      {!loading && !generating && data?.plan && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {data.plan.map((d) => {
            const isToday =
              d.day.toLowerCase() === todayName.toLowerCase() ||
              d.day.toLowerCase().startsWith(todayName.toLowerCase().slice(0, 3))
            const typeStyle = TYPE_STYLES[d.type] ?? TYPE_STYLES['new']
            return (
              <div
                key={d.day}
                style={{
                  backgroundColor: isToday ? '#1a1000' : '#161616',
                  border: isToday ? '2px solid #f59e0b' : '1px solid #262626',
                  minWidth: 130,
                  flexShrink: 0,
                }}
                className="rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p
                    style={{ color: isToday ? '#f59e0b' : '#a3a3a3', fontSize: '0.7rem', fontWeight: 700 }}
                    className="uppercase tracking-wider"
                  >
                    {d.day.slice(0, 3)}
                    {isToday && (
                      <span style={{ color: '#f59e0b', fontSize: '0.6rem', marginLeft: 4 }}>
                        TODAY
                      </span>
                    )}
                  </p>
                  <span
                    style={{
                      backgroundColor: typeStyle.bg,
                      color: typeStyle.color,
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: 4,
                    }}
                  >
                    {typeStyle.label}
                  </span>
                </div>
                <p className="text-white text-xs font-medium mb-1 leading-tight">{d.focus}</p>
                <p style={{ color: '#525252', fontSize: '0.65rem' }}>{d.duration} min</p>
                <p style={{ color: '#6b7280', fontSize: '0.62rem', marginTop: 4, lineHeight: 1.4 }}>
                  {d.tip}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
