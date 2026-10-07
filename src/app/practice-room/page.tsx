'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Metronome from '@/components/Metronome'
import Tuner from '@/components/Tuner'

function formatClock(d: Date): string {
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  const s = d.getSeconds().toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

function formatSession(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function PracticeRoomPage() {
  const router = useRouter()
  const [time, setTime] = useState<Date | null>(null)
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [exercise, setExercise] = useState('')
  const isFirstMount = useRef(true)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Initialise time client-side only (avoids hydration mismatch)
  useEffect(() => {
    setTime(new Date())
    const clock = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(clock)
  }, [])

  // Session timer — starts immediately
  useEffect(() => {
    const timer = setInterval(() => setSessionSeconds((s) => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load saved exercise note
  useEffect(() => {
    try {
      const saved = localStorage.getItem('practice-room-exercise')
      if (saved) setExercise(saved)
    } catch {}
  }, [])

  // Save exercise to localStorage with debounce
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      try { localStorage.setItem('practice-room-exercise', exercise) } catch {}
    }, 500)
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [exercise])

  // Escape key exits
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.push('/dashboard')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [router])

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 16px 64px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 640 }}>

        {/* Top bar: clock + exit */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div
              style={{
                color: '#2a2a2a',
                fontSize: '2rem',
                fontWeight: 900,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              {time ? formatClock(time) : '──:──:──'}
            </div>
            <div
              style={{
                color: '#f59e0b',
                fontSize: '1rem',
                fontWeight: 900,
                fontVariantNumeric: 'tabular-nums',
                marginTop: 4,
              }}
            >
              {formatSession(sessionSeconds)}
            </div>
          </div>

          <Link
            href="/dashboard"
            style={{
              color: '#404040',
              fontSize: '0.7rem',
              border: '1px solid #1f1f1f',
              borderRadius: 8,
              padding: '6px 12px',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
          >
            Exit Practice Room
          </Link>
        </div>

        <p style={{ color: '#1f1f1f', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 28 }}>
          Practice Room · Press Esc to exit
        </p>

        {/* Metronome */}
        <div style={{ marginBottom: 16 }}>
          <Metronome />
        </div>

        {/* Tuner */}
        <div style={{ marginBottom: 16 }}>
          <Tuner />
        </div>

        {/* Today's Exercise note */}
        <div
          style={{
            backgroundColor: '#0d0d0d',
            border: '1px solid #1a1a1a',
            borderRadius: 12,
            padding: '16px 18px',
            marginBottom: 16,
          }}
        >
          <label
            htmlFor="practice-exercise"
            style={{
              display: 'block',
              color: '#404040',
              fontSize: '0.6rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              marginBottom: 10,
            }}
          >
            Today&apos;s Exercise
          </label>
          <textarea
            id="practice-exercise"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="What are you working on today?"
            rows={3}
            style={{
              width: '100%',
              backgroundColor: '#080808',
              border: '1px solid #1a1a1a',
              borderRadius: 8,
              padding: '10px 12px',
              color: '#737373',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#f59e0b' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#1a1a1a' }}
          />
          <p style={{ color: '#262626', fontSize: '0.65rem', marginTop: 6 }}>Auto-saved to this device</p>
        </div>

      </div>
    </div>
  )
}
