'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const NOTE_STRINGS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const GUITAR_STRINGS = [
  { name: 'Low E', freq: 82.41 },
  { name: 'A', freq: 110.00 },
  { name: 'D', freq: 146.83 },
  { name: 'G', freq: 196.00 },
  { name: 'B', freq: 246.94 },
  { name: 'High E', freq: 329.63 },
]

function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  // Return -1 if too quiet
  let rms = 0
  for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i]
  rms = Math.sqrt(rms / buf.length)
  if (rms < 0.01) return -1

  // Find first zero crossing
  let r1 = 0, r2 = buf.length - 1
  const thres = 0.2
  for (let i = 0; i < buf.length / 2; i++) {
    if (Math.abs(buf[i]) < thres) { r1 = i; break }
  }
  for (let i = 1; i < buf.length / 2; i++) {
    if (Math.abs(buf[buf.length - i]) < thres) { r2 = buf.length - i; break }
  }
  const buf2 = buf.slice(r1, r2)
  const len = buf2.length
  if (len < 4) return -1
  const c = new Float32Array(len).fill(0)
  for (let i = 0; i < len; i++)
    for (let j = 0; j < len - i; j++)
      c[i] += buf2[j] * buf2[j + i]
  let d = 0
  while (d + 1 < len && c[d] > c[d + 1]) d++
  let maxval = -1, maxpos = -1
  for (let i = d; i < len; i++) {
    if (c[i] > maxval) { maxval = c[i]; maxpos = i }
  }
  if (maxpos < 1 || maxpos >= len - 1) return -1
  let T0 = maxpos
  // Parabolic interpolation
  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1]
  const denom = 2 * x2 - x1 - x3
  if (denom !== 0) {
    T0 = T0 + (x3 - x1) / denom
  }
  if (T0 <= 0) return -1
  return sampleRate / T0
}

function frequencyToNote(freq: number) {
  const noteNum = 12 * (Math.log(freq / 440) / Math.log(2))
  const note = Math.round(noteNum) + 69
  const cents = Math.floor((noteNum - Math.round(noteNum)) * 100)
  return {
    note: NOTE_STRINGS[((note % 12) + 12) % 12],
    octave: Math.floor(note / 12) - 1,
    cents,
  }
}

export default function Tuner() {
  const [active, setActive] = useState(false)
  const [noteInfo, setNoteInfo] = useState<{ note: string; octave: number; cents: number } | null>(null)
  const [stringIndex, setStringIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const bufferRef = useRef<Float32Array<ArrayBuffer> | null>(null)

  const stopTuning = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
    analyserRef.current = null
    bufferRef.current = null
    setActive(false)
    setNoteInfo(null)
  }, [])

  const detect = useCallback(() => {
    if (!analyserRef.current || !bufferRef.current || !audioCtxRef.current) return
    analyserRef.current.getFloatTimeDomainData(bufferRef.current)
    const freq = autoCorrelate(bufferRef.current, audioCtxRef.current.sampleRate)
    if (freq > 60 && freq < 1500) {
      setNoteInfo(frequencyToNote(freq))
    }
    rafRef.current = requestAnimationFrame(detect)
  }, [])

  const startTuning = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      streamRef.current = stream
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 2048
      analyserRef.current = analyser
      bufferRef.current = new Float32Array(analyser.fftSize) as Float32Array<ArrayBuffer>
      const source = ctx.createMediaStreamSource(stream)
      source.connect(analyser)
      setActive(true)
      rafRef.current = requestAnimationFrame(detect)
    } catch {
      setError('Microphone access denied. Please allow mic access and try again.')
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopTuning() }
  }, [stopTuning])

  // Cycle through string suggestions every 3 seconds while active
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => setStringIndex((i) => (i + 1) % 6), 3000)
    return () => clearInterval(t)
  }, [active])

  // Needle gauge geometry
  const cents = noteInfo?.cents ?? 0
  const clampedCents = Math.max(-50, Math.min(50, cents))
  const needleAngle = (clampedCents / 50) * 70 // ±70° from vertical
  const r = 58
  const cx = 80, cy = 78
  const rad = (needleAngle * Math.PI) / 180
  const nx = cx + r * Math.sin(rad)
  const ny = cy - r * Math.cos(rad)
  const inTune = noteInfo !== null && Math.abs(cents) <= 5
  const needleColor = inTune ? '#22c55e' : Math.abs(cents) > 25 ? '#ef4444' : '#f59e0b'

  return (
    <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 className="text-white text-xs font-bold uppercase tracking-widest">Chromatic Tuner</h2>
        {active && (
          <span style={{ color: '#f59e0b', fontSize: '0.65rem', fontWeight: 700 }}>● LIVE</span>
        )}
      </div>

      {/* Needle gauge SVG */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <svg width="160" height="92" viewBox="0 0 160 92" aria-label="Tuner needle gauge">
          {/* Background arc */}
          <path d="M 22 78 A 58 58 0 0 1 138 78" fill="none" stroke="#1f1f1f" strokeWidth="5" strokeLinecap="round" />
          {/* Flat zone (left) */}
          <path d="M 22 78 A 58 58 0 0 1 46 28" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
          {/* Sharp zone (right) */}
          <path d="M 114 28 A 58 58 0 0 1 138 78" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
          {/* In-tune center zone */}
          <path d="M 68 22 A 58 58 0 0 1 92 22" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
          {/* Center dashed guide */}
          <line x1="80" y1="78" x2="80" y2="22" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="2,4" />
          {/* Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={nx}
            y2={ny}
            stroke={active ? needleColor : '#333333'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Pivot dot */}
          <circle cx={cx} cy={cy} r="4.5" fill="#262626" />
          {/* Tick labels */}
          <text x="14" y="90" fill="#404040" fontSize="8" textAnchor="middle">−50</text>
          <text x="80" y="14" fill="#404040" fontSize="8" textAnchor="middle">0</text>
          <text x="146" y="90" fill="#404040" fontSize="8" textAnchor="middle">+50</text>
        </svg>
      </div>

      {/* Note display */}
      <div style={{ textAlign: 'center', marginBottom: 10, minHeight: 60 }}>
        {noteInfo ? (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
              <span style={{ color: inTune ? '#22c55e' : '#ffffff', fontSize: '2.25rem', fontWeight: 900, lineHeight: 1 }}>
                {noteInfo.note}
              </span>
              <span style={{ color: '#525252', fontSize: '1rem' }}>{noteInfo.octave}</span>
            </div>
            <div style={{ color: cents > 0 ? '#f59e0b' : cents < 0 ? '#60a5fa' : '#525252', fontSize: '0.75rem', marginTop: 4 }}>
              {cents > 0 ? '+' : ''}{cents} cents
            </div>
            {inTune && (
              <div style={{ color: '#22c55e', fontSize: '0.7rem', fontWeight: 700, marginTop: 3 }}>
                In Tune ✓
              </div>
            )}
          </>
        ) : (
          <div style={{ color: '#525252', fontSize: '0.875rem', paddingTop: 8 }}>
            {active ? 'Listening...' : 'Press Start Tuning'}
          </div>
        )}
      </div>

      {/* String suggestion */}
      <div style={{ textAlign: 'center', color: '#525252', fontSize: '0.7rem', marginBottom: 12, minHeight: 16 }}>
        {active && (
          <span>Tune to: {GUITAR_STRINGS[stringIndex].name} ({GUITAR_STRINGS[stringIndex].freq} Hz)</span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ color: '#ef4444', fontSize: '0.7rem', marginBottom: 10, textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* Button */}
      <button
        onClick={active ? stopTuning : startTuning}
        style={{
          width: '100%',
          backgroundColor: active ? '#1a1a1a' : '#f59e0b',
          color: active ? '#a3a3a3' : '#000',
          border: active ? '1px solid #262626' : 'none',
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
        {active ? 'Stop Tuning' : 'Start Tuning'}
      </button>
    </div>
  )
}
