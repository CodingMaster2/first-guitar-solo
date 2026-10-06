'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface MicrophoneModeProps {
  day: number
  onSessionEnd?: (playingSeconds: number) => void
}

const THRESHOLD = 30

export default function MicrophoneMode({ day: _day, onSessionEnd }: MicrophoneModeProps) {
  const [active, setActive] = useState(false)
  const [playingSeconds, setPlayingSeconds] = useState(0)
  const [idleSeconds, setIdleSeconds] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState('')
  const [freqData, setFreqData] = useState<number[]>(Array(20).fill(0) as number[])

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const isPlayingRef = useRef(false)
  const playingSecondsRef = useRef(0)

  const stopMic = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }
    analyserRef.current = null

    const total = playingSecondsRef.current
    setActive(false)
    setIsPlaying(false)
    setFreqData(Array(20).fill(0) as number[])
    onSessionEnd?.(total)
  }, [onSessionEnd])

  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current)
      if (intervalRef.current !== null) clearInterval(intervalRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {})
    }
  }, [])

  const startMic = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const ctx = new AudioContext()
      audioContextRef.current = ctx

      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser

      const source = ctx.createMediaStreamSource(stream)
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const vizLoop = () => {
        if (!analyserRef.current) return
        analyserRef.current.getByteFrequencyData(dataArray)

        const barCount = 20
        const step = Math.floor(dataArray.length / barCount)
        const bars = Array.from({ length: barCount }, (_, i) => dataArray[i * step] ?? 0)
        setFreqData(bars)

        const avg = dataArray.reduce((s, v) => s + v, 0) / dataArray.length
        const playing = avg > THRESHOLD
        isPlayingRef.current = playing
        setIsPlaying(playing)

        animFrameRef.current = requestAnimationFrame(vizLoop)
      }
      animFrameRef.current = requestAnimationFrame(vizLoop)

      intervalRef.current = setInterval(() => {
        if (isPlayingRef.current) {
          playingSecondsRef.current += 1
          setPlayingSeconds((s) => s + 1)
        } else {
          setIdleSeconds((s) => s + 1)
        }
      }, 1000)

      setActive(true)
      setPlayingSeconds(0)
      setIdleSeconds(0)
      playingSecondsRef.current = 0
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Microphone access denied')
    }
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (!active) {
    return (
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #1f1f1f',
          borderRadius: '0.75rem',
          padding: '1rem',
        }}
      >
        <button
          onClick={() => { void startMic() }}
          style={{
            backgroundColor: '#f59e0b',
            color: '#000000',
            borderRadius: '0.5rem',
            padding: '0.625rem 1rem',
            fontWeight: 700,
            fontSize: '0.875rem',
            width: '100%',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          🎸 Enable Mic Practice Mode
        </button>
        {error && (
          <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>{error}</p>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: '#111111',
        border: `1px solid ${isPlaying ? '#22c55e' : '#262626'}`,
        borderRadius: '0.75rem',
        padding: '1rem',
        transition: 'border-color 0.2s ease',
      }}
    >
      <style>{`
        @keyframes micPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.35); }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: isPlaying ? '#22c55e' : '#ef4444',
              display: 'inline-block',
              animation: 'micPulse 1s ease-in-out infinite',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: isPlaying ? '#22c55e' : '#ef4444',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            {isPlaying ? 'Playing...' : 'Listening...'}
          </span>
        </div>
        <button
          onClick={stopMic}
          style={{
            color: '#525252',
            fontSize: '0.75rem',
            border: '1px solid #262626',
            borderRadius: '0.375rem',
            padding: '0.25rem 0.75rem',
            backgroundColor: 'transparent',
            cursor: 'pointer',
          }}
        >
          Stop
        </button>
      </div>

      {/* Volume meter bars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 2,
          height: 40,
          marginBottom: '0.75rem',
        }}
      >
        {freqData.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${Math.max(4, (v / 255) * 100)}%`,
              backgroundColor: isPlaying ? '#22c55e' : '#525252',
              borderRadius: 2,
              transition: 'height 0.05s ease, background-color 0.2s',
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <div>
          <p style={{ color: '#525252', fontSize: '0.7rem', marginBottom: 2 }}>Playing time</p>
          <p
            style={{
              color: '#22c55e',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              fontSize: '1rem',
            }}
          >
            {formatTime(playingSeconds)}
          </p>
        </div>
        <div>
          <p style={{ color: '#525252', fontSize: '0.7rem', marginBottom: 2 }}>Idle time</p>
          <p
            style={{
              color: '#a3a3a3',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              fontSize: '1rem',
            }}
          >
            {formatTime(idleSeconds)}
          </p>
        </div>
      </div>
    </div>
  )
}
