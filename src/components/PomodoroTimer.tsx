'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const WORK_DURATION = 25 * 60
const BREAK_DURATION = 5 * 60

export default function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessionsToday, setSessionsToday] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalTime = isBreak ? BREAK_DURATION : WORK_DURATION
  const elapsed = totalTime - timeLeft
  const progressPct = (elapsed / totalTime) * 100
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progressPct / 100)

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const playBeep = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AudioContextClass()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.8)
    } catch {
      // AudioContext unavailable
    }
  }, [])

  const completeSession = useCallback(async () => {
    playBeep()
    if (!isBreak) {
      try {
        const res = await fetch('/api/pomodoro', { method: 'POST' })
        const data = await res.json() as { sessions?: number }
        setSessionsToday(typeof data.sessions === 'number' ? data.sessions : (s) => s + 1)
      } catch {
        setSessionsToday((s) => s + 1)
      }
      setIsBreak(true)
      setTimeLeft(BREAK_DURATION)
    } else {
      setIsBreak(false)
      setTimeLeft(WORK_DURATION)
    }
    setIsRunning(false)
  }, [isBreak, playBeep])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  // When timeLeft hits 0 while running, trigger completion
  useEffect(() => {
    if (timeLeft === 0 && !isRunning) {
      // Only fire if we actually ran down (not on a reset)
    }
  }, [timeLeft, isRunning])

  // Detect countdown to 0 for session complete
  const prevTimeRef = useRef(timeLeft)
  useEffect(() => {
    if (prevTimeRef.current > 0 && timeLeft === 0) {
      completeSession()
    }
    prevTimeRef.current = timeLeft
  }, [timeLeft, completeSession])

  const reset = useCallback(() => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(WORK_DURATION)
  }, [])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          backgroundColor: '#1a1200',
          border: '1px solid #78350f',
          color: '#f59e0b',
          padding: '8px 16px',
          borderRadius: 8,
          fontSize: '0.875rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>🍅</span>
        <span>Start Practice Timer</span>
      </button>
    )
  }

  return (
    <div
      style={{
        backgroundColor: '#111111',
        border: '1px solid #262626',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🍅</span>
          <span style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {isBreak ? 'Break Time' : 'Practice Timer'}
          </span>
        </div>
        <button
          onClick={() => { setIsOpen(false); reset() }}
          style={{ color: '#525252', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 140, height: 140 }}>
          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#1a1a1a" strokeWidth="8" />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={isBreak ? '#22c55e' : '#f59e0b'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span style={{ color: '#525252', fontSize: '0.65rem', marginTop: 4, textTransform: 'uppercase' }}>
              {isBreak ? 'break' : 'focus'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button
            onClick={() => setIsRunning((r) => !r)}
            style={{
              backgroundColor: '#f59e0b',
              color: '#000000',
              padding: '8px 20px',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 900,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button
            onClick={reset}
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #262626',
              color: '#a3a3a3',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>

        {sessionsToday > 0 && (
          <p style={{ color: '#a3a3a3', fontSize: '0.75rem', marginTop: 12 }}>
            {sessionsToday} pomodoro{sessionsToday !== 1 ? 's' : ''} completed today
          </p>
        )}
      </div>
    </div>
  )
}
