'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// Use lookahead scheduling for rock-solid timing
const LOOKAHEAD = 25.0   // how frequently to call scheduler (ms)
const SCHEDULEAHEAD = 0.1  // how far ahead to schedule audio (s)

type Subdivision = 'quarter' | 'eighth' | 'triplet' | 'sixteenth'

const SUBDIVISION_COUNTS: Record<Subdivision, number> = {
  quarter: 1,
  eighth: 2,
  triplet: 3,
  sixteenth: 4,
}

const SUBDIVISION_LABELS: { id: Subdivision; label: string }[] = [
  { id: 'quarter', label: '1/4' },
  { id: 'eighth', label: '1/8' },
  { id: 'triplet', label: 'Trip' },
  { id: 'sixteenth', label: '1/16' },
]

interface MetronomeProps {
  defaultBpm?: number
  className?: string
}

export default function Metronome({ defaultBpm = 80, className }: MetronomeProps) {
  const [bpm, setBpm] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('metronome-bpm')
        if (saved) {
          const parsed = parseInt(saved, 10)
          if (!isNaN(parsed)) return Math.min(240, Math.max(40, parsed))
        }
      } catch {}
    }
    return defaultBpm
  })
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState(false)
  const [subdivision, setSubdivision] = useState<Subdivision>('quarter')

  const audioCtxRef = useRef<AudioContext | null>(null)
  const schedulerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const nextNoteTimeRef = useRef<number>(0)
  const currentNoteRef = useRef<number>(0)
  const bpmRef = useRef(bpm)
  const subdivisionRef = useRef(subdivision)
  const tapTimesRef = useRef<number[]>([])

  // Keep refs in sync with state so scheduler always has fresh values
  useEffect(() => { bpmRef.current = bpm }, [bpm])
  useEffect(() => { subdivisionRef.current = subdivision }, [subdivision])

  const clampBpm = (v: number) => Math.min(240, Math.max(40, Math.round(v)))

  const scheduleNote = useCallback((time: number, noteIndex: number) => {
    if (!audioCtxRef.current) return
    const ctx = audioCtxRef.current
    const subCount = SUBDIVISION_COUNTS[subdivisionRef.current]
    const isMainBeat = noteIndex % subCount === 0

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = isMainBeat ? 880 : 660
    gain.gain.setValueAtTime(isMainBeat ? 0.3 : 0.12, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.01)
    osc.start(time)
    osc.stop(time + 0.01)

    if (isMainBeat) {
      const delayMs = (time - ctx.currentTime) * 1000
      setTimeout(() => {
        setBeat(true)
        setTimeout(() => setBeat(false), 120)
      }, Math.max(0, delayMs))
    }
  }, [])

  const runScheduler = useCallback(() => {
    if (!audioCtxRef.current) return
    const ctx = audioCtxRef.current
    const subCount = SUBDIVISION_COUNTS[subdivisionRef.current]
    const secondsPerBeat = 60.0 / bpmRef.current
    const secondsPerNote = secondsPerBeat / subCount

    while (nextNoteTimeRef.current < ctx.currentTime + SCHEDULEAHEAD) {
      scheduleNote(nextNoteTimeRef.current, currentNoteRef.current)
      nextNoteTimeRef.current += secondsPerNote
      currentNoteRef.current += 1
    }
  }, [scheduleNote])

  useEffect(() => {
    if (schedulerRef.current) {
      clearInterval(schedulerRef.current)
      schedulerRef.current = null
    }
    if (running) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext()
      }
      const ctx = audioCtxRef.current
      nextNoteTimeRef.current = ctx.currentTime + 0.05
      currentNoteRef.current = 0
      schedulerRef.current = setInterval(runScheduler, LOOKAHEAD)
    }
    return () => {
      if (schedulerRef.current) {
        clearInterval(schedulerRef.current)
        schedulerRef.current = null
      }
    }
  }, [running, runScheduler])

  useEffect(() => {
    try { sessionStorage.setItem('metronome-bpm', String(bpm)) } catch {}
  }, [bpm])

  const handleTap = () => {
    const now = Date.now()
    // Keep last 3 stored + new one = 4 taps max
    const recent = tapTimesRef.current.filter((t) => now - t < 5000).slice(-3)
    recent.push(now)
    tapTimesRef.current = recent
    if (recent.length >= 2) {
      const intervals = recent.slice(1).map((t, i) => t - recent[i])
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length
      setBpm(clampBpm(60000 / avg))
    }
  }

  return (
    <div
      style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
      className={`rounded-xl p-5${className ? ` ${className}` : ''}`}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 className="text-white text-xs font-bold uppercase tracking-widest">Metronome</h2>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: beat ? '#f59e0b' : '#262626',
            transition: beat ? 'none' : 'background-color 0.15s',
            boxShadow: beat ? '0 0 10px #f59e0b' : 'none',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Main row: Tap | BPM | Subdivisions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        {/* Tap Tempo */}
        <button
          onClick={handleTap}
          style={{
            backgroundColor: '#1a1a1a',
            color: '#a3a3a3',
            border: '1px solid #262626',
            borderRadius: 8,
            padding: '10px 0',
            minWidth: 64,
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
          }}
        >
          Tap
        </button>

        {/* BPM with ±1 and ±5 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <button
              onClick={() => setBpm((b) => clampBpm(b + 5))}
              style={{ backgroundColor: '#1a1a1a', color: '#737373', border: '1px solid #262626', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}
              aria-label="BPM +5"
            >+5</button>
            <button
              onClick={() => setBpm((b) => clampBpm(b - 5))}
              style={{ backgroundColor: '#1a1a1a', color: '#737373', border: '1px solid #262626', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}
              aria-label="BPM −5"
            >−5</button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#f59e0b', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {bpm}
            </div>
            <div style={{ color: '#525252', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>BPM</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <button
              onClick={() => setBpm((b) => clampBpm(b + 1))}
              style={{ backgroundColor: '#1a1a1a', color: '#737373', border: '1px solid #262626', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}
              aria-label="BPM +1"
            >+1</button>
            <button
              onClick={() => setBpm((b) => clampBpm(b - 1))}
              style={{ backgroundColor: '#1a1a1a', color: '#737373', border: '1px solid #262626', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}
              aria-label="BPM −1"
            >−1</button>
          </div>
        </div>

        {/* Subdivision selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {SUBDIVISION_LABELS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSubdivision(s.id)}
              style={{
                backgroundColor: subdivision === s.id ? '#f59e0b' : '#1a1a1a',
                color: subdivision === s.id ? '#000' : '#737373',
                border: `1px solid ${subdivision === s.id ? '#f59e0b' : '#262626'}`,
                fontSize: '0.6rem',
                padding: '2px 7px',
                borderRadius: 4,
                fontWeight: subdivision === s.id ? 700 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* BPM slider */}
      <div style={{ marginBottom: 14 }}>
        <input
          type="range"
          min={40}
          max={240}
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value, 10))}
          style={{ width: '100%', accentColor: '#f59e0b' }}
          aria-label="BPM slider"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#525252', fontSize: '0.65rem' }}>40</span>
          <span style={{ color: '#525252', fontSize: '0.65rem' }}>240</span>
        </div>
      </div>

      {/* Start / Stop */}
      <button
        onClick={() => setRunning((r) => !r)}
        style={{
          width: '100%',
          backgroundColor: running ? '#1a1a1a' : '#f59e0b',
          color: running ? '#a3a3a3' : '#000',
          border: running ? '1px solid #262626' : 'none',
          padding: '10px 0',
          borderRadius: 8,
          fontSize: '0.75rem',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          cursor: 'pointer',
          transition: 'background-color 0.15s, color 0.15s',
        }}
      >
        {running ? 'Stop' : 'Start'}
      </button>
    </div>
  )
}
