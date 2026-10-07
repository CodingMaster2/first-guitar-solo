'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Challenge {
  id: number
  title: string
  description: string
  technique: string
  xp: number
}

const TECHNIQUE_COLORS: Record<string, string> = {
  chord: '#3b82f6',
  technique: '#8b5cf6',
  'hammer-on': '#10b981',
  'pull-off': '#06b6d4',
  vibrato: '#f59e0b',
  bend: '#ef4444',
  slide: '#ec4899',
  picking: '#f97316',
  rhythm: '#84cc16',
  trill: '#6366f1',
  scales: '#14b8a6',
  legato: '#22c55e',
  improvisation: '#a855f7',
  performance: '#f59e0b',
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function getDateKey(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

function getDayLabel(daysAgo: number): string {
  if (daysAgo === 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function isCompletedFromStorage(dateKey: string): boolean {
  try {
    return localStorage.getItem(`daily-challenge-${dateKey}`) === 'completed'
  } catch {
    return false
  }
}

function markCompletedInStorage(dateKey: string): void {
  try {
    localStorage.setItem(`daily-challenge-${dateKey}`, 'completed')
  } catch {
    // silently fail
  }
}

export default function ChallengesPage() {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedToday, setCompletedToday] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [history, setHistory] = useState<{ date: string; label: string; completed: boolean }[]>([])
  const [xpStreak, setXpStreak] = useState(0)

  const todayKey = getTodayKey()
  const todayDisplay = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  useEffect(() => {
    // Load today's completion from localStorage
    const done = isCompletedFromStorage(todayKey)
    setCompletedToday(done)

    // Build 7-day history
    const hist = Array.from({ length: 7 }, (_, i) => {
      const dateKey = getDateKey(i)
      return {
        date: dateKey,
        label: getDayLabel(i),
        completed: isCompletedFromStorage(dateKey),
      }
    })
    setHistory(hist)

    // Calculate consecutive streak from today backwards
    let streak = 0
    for (const day of hist) {
      if (day.completed) {
        streak++
      } else {
        break
      }
    }
    setXpStreak(streak)

    // Fetch today's challenge
    fetch('/api/challenges')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch')
        return r.json()
      })
      .then((data) => {
        setChallenge(data.challenge)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load today\'s challenge.')
        setLoading(false)
      })
  }, [todayKey])

  function handleMarkComplete() {
    markCompletedInStorage(todayKey)
    setCompletedToday(true)
    setJustCompleted(true)
    // Update history
    setHistory((prev) =>
      prev.map((h) => (h.date === todayKey ? { ...h, completed: true } : h))
    )
    setXpStreak((prev) => prev + 1)
  }

  const techniqueColor = challenge ? (TECHNIQUE_COLORS[challenge.technique] ?? '#a3a3a3') : '#a3a3a3'

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 900, lineHeight: 1.1 }}>
            ⚡ Daily Challenge
          </h1>
          <p style={{ color: '#737373', fontSize: '0.875rem', marginTop: '0.25rem' }}>{todayDisplay}</p>
        </div>

        {/* XP streak counter */}
        {xpStreak > 0 && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#1a1200',
              border: '1px solid #d97706',
              borderRadius: 20,
              padding: '6px 14px',
              marginBottom: '1.25rem',
            }}
          >
            <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>
              🔥 {xpStreak}-day challenge streak!
            </span>
          </div>
        )}

        {/* Today's challenge card */}
        {loading ? (
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderRadius: '0.75rem',
              padding: '2.5rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <p style={{ color: '#525252', fontSize: '0.875rem' }}>Loading challenge...</p>
          </div>
        ) : error ? (
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #ef4444',
              borderRadius: '0.75rem',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <p style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{error}</p>
          </div>
        ) : challenge ? (
          <div
            style={{
              backgroundColor: '#111111',
              border: `1px solid ${completedToday ? '#16a34a' : '#f59e0b'}`,
              borderRadius: '0.75rem',
              padding: '2rem',
              marginBottom: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background glow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 200,
                height: 200,
                background: completedToday
                  ? 'radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Technique badge */}
            <div style={{ marginBottom: '1rem' }}>
              <span
                style={{
                  backgroundColor: `${techniqueColor}20`,
                  color: techniqueColor,
                  border: `1px solid ${techniqueColor}40`,
                  borderRadius: 100,
                  padding: '3px 12px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {challenge.technique}
              </span>
            </div>

            <h2
              style={{
                color: '#ffffff',
                fontSize: '1.75rem',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: '0.75rem',
                letterSpacing: '0.01em',
              }}
            >
              {challenge.title}
            </h2>

            <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {challenge.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {/* XP reward */}
              <span
                style={{
                  backgroundColor: 'rgba(245,158,11,0.15)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: 100,
                  padding: '4px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                +{challenge.xp} XP
              </span>

              {/* Mark complete / completed state */}
              {completedToday ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.4)',
                    borderRadius: 100,
                    padding: '6px 16px',
                  }}
                >
                  <span
                    className={justCompleted ? 'check-bounce' : ''}
                    style={{ fontSize: '1rem', display: 'inline-block' }}
                  >
                    ✅
                  </span>
                  <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.875rem' }}>
                    Completed!
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleMarkComplete}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: '#000000',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 20px',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'opacity 0.15s ease',
                  }}
                  onMouseOver={(e) => ((e.target as HTMLButtonElement).style.opacity = '0.85')}
                  onMouseOut={(e) => ((e.target as HTMLButtonElement).style.opacity = '1')}
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        ) : null}

        {/* Challenge History */}
        <div>
          <h2
            style={{
              color: '#ffffff',
              fontSize: '1.1rem',
              fontWeight: 900,
              marginBottom: '0.75rem',
              letterSpacing: '0.02em',
            }}
          >
            Last 7 Days
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {history.map((day) => (
              <div
                key={day.date}
                style={{
                  backgroundColor: '#111111',
                  border: `1px solid ${day.completed ? '#16a34a' : '#262626'}`,
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ color: '#a3a3a3', fontSize: '0.875rem' }}>{day.label}</span>
                <span style={{ fontSize: '1.1rem' }}>{day.completed ? '✅' : '⬜'}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
