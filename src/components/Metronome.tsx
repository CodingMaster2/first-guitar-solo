'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export default function Metronome() {
  const [bpm, setBpm] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('metronome-bpm')
        if (saved) {
          const parsed = parseInt(saved, 10)
          if (!isNaN(parsed)) return Math.min(200, Math.max(40, parsed))
        }
      } catch {}
    }
    return 60
  })
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tapTimesRef = useRef<number[]>([])

  const clampBpm = (v: number) => Math.min(200, Math.max(40, Math.round(v)))

  const playClick = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext()
      }
      const ctx = audioCtxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.02)
      setBeat(true)
      setTimeout(() => setBeat(false), 100)
    } catch {}
  }, [])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (running) {
      const ms = (60 / bpm) * 1000
      playClick()
      intervalRef.current = setInterval(playClick, ms)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [running, bpm, playClick])

  useEffect(() => {
    try {
      sessionStorage.setItem('metronome-bpm', String(bpm))
    } catch {}
  }, [bpm])

  const handleBpmInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10)
    if (!isNaN(v)) setBpm(clampBpm(v))
  }

  const handleTap = () => {
    const now = Date.now()
    const recent = tapTimesRef.current.filter((t) => now - t < 5000)
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
      className="rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xs font-bold uppercase tracking-widest">Metronome</h2>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: beat ? '#f59e0b' : '#262626',
            transition: beat ? 'none' : 'background-color 0.15s',
            boxShadow: beat ? '0 0 6px #f59e0b' : 'none',
          }}
          aria-hidden="true"
        />
      </div>

      {/* BPM controls */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setBpm((b) => clampBpm(b - 1))}
          style={{ backgroundColor: '#1a1a1a', color: '#a3a3a3', border: '1px solid #262626' }}
          className="w-8 h-8 rounded-lg font-bold flex items-center justify-center hover:text-white hover:border-gray-500 transition-colors select-none"
          aria-label="Decrease BPM"
        >
          &minus;
        </button>
        <div className="flex-1 text-center">
          <input
            type="number"
            min={40}
            max={200}
            value={bpm}
            onChange={handleBpmInput}
            style={{
              backgroundColor: 'transparent',
              color: '#f59e0b',
              border: 'none',
              textAlign: 'center',
              width: '100%',
              fontWeight: 900,
              fontSize: '2.25rem',
              lineHeight: 1,
            }}
            className="outline-none"
          />
          <p style={{ color: '#525252' }} className="text-xs mt-0.5">BPM</p>
        </div>
        <button
          onClick={() => setBpm((b) => clampBpm(b + 1))}
          style={{ backgroundColor: '#1a1a1a', color: '#a3a3a3', border: '1px solid #262626' }}
          className="w-8 h-8 rounded-lg font-bold flex items-center justify-center hover:text-white hover:border-gray-500 transition-colors select-none"
          aria-label="Increase BPM"
        >
          +
        </button>
      </div>

      {/* Slider */}
      <div className="mb-4">
        <input
          type="range"
          min={40}
          max={200}
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value, 10))}
          className="w-full"
          style={{ accentColor: '#f59e0b' }}
        />
        <div className="flex justify-between">
          <span style={{ color: '#525252' }} className="text-xs">40</span>
          <span style={{ color: '#525252' }} className="text-xs">200</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          style={{
            backgroundColor: running ? '#1a1a1a' : '#f59e0b',
            color: running ? '#a3a3a3' : '#000',
            border: running ? '1px solid #262626' : 'none',
          }}
          className="flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all"
        >
          {running ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={handleTap}
          style={{ backgroundColor: '#1a1a1a', color: '#a3a3a3', border: '1px solid #262626' }}
          className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:text-white hover:border-gray-500 transition-colors"
        >
          Tap Tempo
        </button>
      </div>
    </div>
  )
}
