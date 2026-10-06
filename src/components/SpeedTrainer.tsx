'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const MIN_BPM = 60
const MAX_BPM = 180
const STORAGE_KEY = 'speed-trainer-best'

export default function SpeedTrainer() {
  const [targetBpm, setTargetBpm] = useState(120)
  const [currentBpm, setCurrentBpm] = useState(80)
  const [personalBest, setPersonalBest] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const nextClickRef = useRef<number>(0)
  const schedulerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load personal best from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setPersonalBest(parseInt(stored, 10))
    } catch {}
  }, [])

  const scheduleClick = useCallback(() => {
    if (!audioCtxRef.current) return
    const ctx = audioCtxRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, nextClickRef.current)
    gain.gain.exponentialRampToValueAtTime(0.001, nextClickRef.current + 0.08)
    osc.start(nextClickRef.current)
    osc.stop(nextClickRef.current + 0.08)
    const interval = 60 / currentBpm
    nextClickRef.current += interval
    const msUntilNext = (nextClickRef.current - ctx.currentTime) * 1000 - 50
    schedulerRef.current = setTimeout(scheduleClick, Math.max(0, msUntilNext))
  }, [currentBpm])

  useEffect(() => {
    if (isPlaying) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext()
      }
      nextClickRef.current = audioCtxRef.current.currentTime + 0.05
      scheduleClick()
    } else {
      if (schedulerRef.current) clearTimeout(schedulerRef.current)
    }
    return () => {
      if (schedulerRef.current) clearTimeout(schedulerRef.current)
    }
  }, [isPlaying, scheduleClick])

  const togglePlay = () => {
    setIsPlaying((p) => {
      if (!p && currentBpm > personalBest) {
        const newBest = currentBpm
        setPersonalBest(newBest)
        try { localStorage.setItem(STORAGE_KEY, String(newBest)) } catch {}
      }
      return !p
    })
  }

  const pct = Math.min(100, Math.round((currentBpm / targetBpm) * 100))
  const reachedTarget = currentBpm >= targetBpm

  if (!isExpanded) {
    return (
      <div
        style={{ backgroundColor: '#111111', border: '1px solid #262626', borderRadius: '0.75rem', padding: '1rem' }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-white text-xs font-bold uppercase tracking-wider">Speed Trainer</p>
          <p style={{ color: '#525252' }} className="text-xs mt-0.5">BPM challenge tracker</p>
        </div>
        <button
          onClick={() => setIsExpanded(true)}
          style={{ color: '#f59e0b', border: '1px solid #78350f', backgroundColor: 'transparent' }}
          className="text-xs px-3 py-1.5 rounded font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
        >
          Open
        </button>
      </div>
    )
  }

  return (
    <div
      style={{ backgroundColor: '#111111', border: '1px solid #262626', borderTop: '3px solid #f59e0b', borderRadius: '0.75rem', padding: '1.25rem' }}
    >
      <div className="flex items-center justify-between mb-4">
        <p style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-wider">Speed Trainer</p>
        <button
          onClick={() => { setIsPlaying(false); setIsExpanded(false) }}
          style={{ color: '#525252' }}
          className="text-xs hover:text-white transition-colors"
        >
          Close
        </button>
      </div>

      {/* Target BPM input */}
      <div className="mb-4">
        <label style={{ color: '#a3a3a3' }} className="text-xs font-bold uppercase tracking-wider block mb-2">
          Target BPM
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={MIN_BPM}
            max={MAX_BPM}
            value={targetBpm}
            onChange={(e) => setTargetBpm(Math.min(MAX_BPM, Math.max(MIN_BPM, parseInt(e.target.value) || MIN_BPM)))}
            style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid #262626',
              color: '#f59e0b',
              borderRadius: '0.5rem',
              padding: '0.375rem 0.625rem',
              fontSize: '1.25rem',
              fontWeight: 900,
              width: '5rem',
              outline: 'none',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#f59e0b' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#262626' }}
          />
          <span style={{ color: '#525252' }} className="text-xs">BPM goal</span>
          {personalBest > 0 && (
            <span style={{ backgroundColor: '#1a0f00', color: '#f59e0b', border: '1px solid #78350f' }} className="text-xs px-2 py-0.5 rounded font-bold">
              PB: {personalBest} BPM
            </span>
          )}
        </div>
      </div>

      {/* Current speed slider */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label style={{ color: '#a3a3a3' }} className="text-xs font-bold uppercase tracking-wider">
            Current Speed
          </label>
          <span style={{ color: '#ffffff', fontVariantNumeric: 'tabular-nums' }} className="text-xl font-black">
            {currentBpm} <span style={{ color: '#525252' }} className="text-xs font-normal">BPM</span>
          </span>
        </div>
        <input
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          value={currentBpm}
          onChange={(e) => {
            const v = parseInt(e.target.value)
            setCurrentBpm(v)
            if (v > personalBest) {
              setPersonalBest(v)
              try { localStorage.setItem(STORAGE_KEY, String(v)) } catch {}
            }
          }}
          style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
        />
        <div className="flex justify-between mt-1">
          <span style={{ color: '#404040' }} className="text-xs">{MIN_BPM}</span>
          <span style={{ color: '#404040' }} className="text-xs">{MAX_BPM}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span style={{ color: '#525252' }} className="text-xs">Progress to target</span>
          <span style={{ color: reachedTarget ? '#86efac' : '#f59e0b' }} className="text-xs font-bold">
            {pct}%{reachedTarget ? ' — Target reached!' : ''}
          </span>
        </div>
        <div style={{ backgroundColor: '#1a1a1a', height: 6, borderRadius: 3, overflow: 'hidden' }}>
          <div
            style={{
              backgroundColor: reachedTarget ? '#22c55e' : '#f59e0b',
              width: `${pct}%`,
              height: '100%',
              borderRadius: 3,
              transition: 'width 0.3s ease, background-color 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Metronome toggle */}
      <button
        onClick={togglePlay}
        style={{
          backgroundColor: isPlaying ? '#1a0f00' : '#f59e0b',
          color: isPlaying ? '#f59e0b' : '#000',
          border: isPlaying ? '1px solid #f59e0b' : 'none',
        }}
        className="w-full py-2.5 rounded-lg font-black text-xs uppercase tracking-wider transition-all"
      >
        {isPlaying ? `Stop Click (${currentBpm} BPM)` : `Start Click at ${currentBpm} BPM`}
      </button>
      <p style={{ color: '#404040' }} className="text-xs mt-2 text-center">
        Uses your device speaker — make sure your volume is audible
      </p>
    </div>
  )
}
