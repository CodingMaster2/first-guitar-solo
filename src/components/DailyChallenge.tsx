'use client'

import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

interface Props {
  currentDay: number
  xpReward: number
}

function getChallengeText(day: number): string {
  if (day >= 1 && day <= 7) return 'Play the exercise 10 times without a mistake'
  if (day >= 8 && day <= 14) return 'Practice for 20 minutes straight'
  if (day >= 15 && day <= 21) return 'Play along with a backing track'
  return 'Record yourself and listen back'
}

export default function DailyChallenge({ currentDay, xpReward }: Props) {
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [streak, setStreak] = useState(0)
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    try {
      const cached = localStorage.getItem('daily-challenge-completed')
      if (cached === today) setCompleted(true)
    } catch {
      // localStorage unavailable
    }

    fetch('/api/daily-challenge')
      .then((r) => r.json())
      .then((data: { streak?: number; completedToday?: boolean }) => {
        if (typeof data.streak === 'number') setStreak(data.streak)
        if (data.completedToday) {
          setCompleted(true)
          try { localStorage.setItem('daily-challenge-completed', today) } catch { /* ignore */ }
        }
        setFetched(true)
      })
      .catch(() => setFetched(true))
  }, [])

  const handleComplete = async () => {
    if (completed || loading) return
    const today = new Date().toDateString()
    try {
      const cached = localStorage.getItem('daily-challenge-completed')
      if (cached === today) { setCompleted(true); return }
    } catch { /* ignore */ }

    setLoading(true)
    try {
      const res = await fetch('/api/daily-challenge', { method: 'POST' })
      const data = await res.json() as { success?: boolean; already?: boolean; streak?: number }
      if (data.already || data.success) {
        setCompleted(true)
        try { localStorage.setItem('daily-challenge-completed', today) } catch { /* ignore */ }
        if (typeof data.streak === 'number') setStreak(data.streak)
        if (data.success) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#fde68a', '#ffffff'],
          })
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const challengeText = getChallengeText(currentDay)

  return (
    <div
      style={{
        background: completed
          ? 'linear-gradient(135deg, #111111 0%, #1a0f00 100%)'
          : '#111111',
        border: completed ? '1px solid #f59e0b' : '1px solid #262626',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: '1.25rem' }}>🎸</span>
        <span style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Daily Challenge
        </span>
        {streak > 0 && (
          <span
            style={{
              marginLeft: 'auto',
              backgroundColor: '#1a1200',
              color: '#f59e0b',
              border: '1px solid #78350f',
              fontSize: '0.7rem',
              padding: '2px 8px',
              borderRadius: 6,
              fontWeight: 700,
            }}
          >
            🔥 {streak} day{streak !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', marginBottom: 4 }}>
        Day {currentDay} Challenge
      </p>
      <p style={{ color: '#a3a3a3', fontSize: '0.875rem', marginBottom: 16 }}>{challengeText}</p>

      {completed ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#22c55e', fontSize: '1.25rem' }}>✓</span>
          <span style={{ color: '#22c55e', fontSize: '0.875rem', fontWeight: 700 }}>Completed!</span>
          <span
            style={{
              backgroundColor: '#1a1200',
              border: '1px solid #78350f',
              color: '#f59e0b',
              fontSize: '0.7rem',
              padding: '2px 8px',
              borderRadius: 6,
              fontWeight: 700,
              marginLeft: 8,
            }}
          >
            +{xpReward} XP earned
          </span>
        </div>
      ) : (
        <button
          onClick={handleComplete}
          disabled={loading || !fetched}
          style={{
            backgroundColor: '#f59e0b',
            color: '#000000',
            padding: '8px 20px',
            borderRadius: 8,
            fontSize: '0.875rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: 'none',
            cursor: loading || !fetched ? 'not-allowed' : 'pointer',
            opacity: loading || !fetched ? 0.5 : 1,
          }}
        >
          {loading ? 'Marking...' : `Mark as Complete (+${xpReward} XP)`}
        </button>
      )}
    </div>
  )
}
