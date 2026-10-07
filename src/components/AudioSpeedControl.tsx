'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface AudioSpeedControlProps {
  src: string
  label?: string
}

const PRESETS = [0.5, 0.75, 1.0] as const

export default function AudioSpeedControl({ src, label }: AudioSpeedControlProps) {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const applySpeed = useCallback((s: number) => {
    const el = audioRef.current
    if (!el) return
    el.playbackRate = s
    // Pitch preservation (with vendor prefix fallback)
    try {
      const elAny = el as HTMLAudioElement & {
        preservesPitch?: boolean
        webkitPreservesPitch?: boolean
      }
      if ('preservesPitch' in el) elAny.preservesPitch = true
      if ('webkitPreservesPitch' in el) elAny.webkitPreservesPitch = true
    } catch {}
  }, [])

  const handleSpeedChange = useCallback(
    (s: number) => {
      setSpeed(s)
      applySpeed(s)
    },
    [applySpeed]
  )

  const togglePlay = () => {
    const el = audioRef.current
    if (!el) return
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      applySpeed(speed)
      el.play().catch(() => {})
      setPlaying(true)
    }
  }

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onEnded = () => setPlaying(false)
    const onPause = () => setPlaying(false)
    el.addEventListener('ended', onEnded)
    el.addEventListener('pause', onPause)
    return () => {
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('pause', onPause)
    }
  }, [])

  const displaySpeed =
    speed === 0.5 ? '0.5×' :
    speed === 0.75 ? '0.75×' :
    speed === 1.0 ? '1×' :
    `${speed.toFixed(2)}×`

  return (
    <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-4">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 className="text-white text-xs font-bold uppercase tracking-widest">Speed Control</h3>
        <span style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 700 }}>{displaySpeed} speed</span>
      </div>

      {label && (
        <p style={{ color: '#737373', fontSize: '0.75rem', marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </p>
      )}

      {/* Preset pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => handleSpeedChange(p)}
            style={{
              flex: 1,
              backgroundColor: speed === p ? '#f59e0b' : '#1a1a1a',
              color: speed === p ? '#000' : '#a3a3a3',
              border: `1px solid ${speed === p ? '#f59e0b' : '#262626'}`,
              borderRadius: 9999,
              padding: '5px 0',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.15s, color 0.15s',
            }}
          >
            {p === 1.0 ? '1×' : `${p}×`}
          </button>
        ))}
      </div>

      {/* Custom speed slider */}
      <div style={{ marginBottom: 14 }}>
        <input
          type="range"
          min={0.5}
          max={1.25}
          step={0.05}
          value={speed}
          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: '#f59e0b' }}
          aria-label="Playback speed"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#525252', fontSize: '0.65rem' }}>0.5×</span>
          <span style={{ color: '#525252', fontSize: '0.65rem' }}>1.25×</span>
        </div>
      </div>

      {/* Play / Pause + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio ref={audioRef} src={src} preload="metadata" />
        <button
          onClick={togglePlay}
          style={{
            backgroundColor: '#f59e0b',
            color: '#000',
            border: 'none',
            borderRadius: 8,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
              <rect x="0" y="0" width="4.5" height="14" rx="1" />
              <rect x="7.5" y="0" width="4.5" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
              <polygon points="0,0 12,7 0,14" />
            </svg>
          )}
        </button>
        <span style={{ color: '#525252', fontSize: '0.7rem' }}>
          {playing ? `Playing at ${displaySpeed}` : 'Ready'}
        </span>
      </div>
    </div>
  )
}
