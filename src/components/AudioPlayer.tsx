'use client'
import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

interface AudioPlayerProps {
  url: string
  label?: string
}

export default function AudioPlayer({ url, label }: AudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WaveSurfer | null>(null)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#262626',
      progressColor: '#f59e0b',
      cursorColor: '#f59e0b',
      barWidth: 2,
      barGap: 1,
      height: 48,
      normalize: true,
    })
    wsRef.current = ws
    ws.load(url)
    ws.on('ready', () => { setLoading(false); setDuration(ws.getDuration()) })
    ws.on('error', () => { setError(true); setLoading(false) })
    ws.on('audioprocess', () => setCurrentTime(ws.getCurrentTime()))
    ws.on('finish', () => setPlaying(false))
    return () => ws.destroy()
  }, [url])

  const togglePlay = () => {
    wsRef.current?.playPause()
    setPlaying((p) => !p)
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  if (error) return (
    <div style={{ backgroundColor: '#111111', border: '1px dashed #262626' }} className="rounded-lg p-4 text-center">
      <p style={{ color: '#525252' }} className="text-sm">Audio unavailable</p>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-4">
      {label && <p style={{ color: '#a3a3a3' }} className="text-xs mb-3 font-medium">{label}</p>}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          disabled={loading}
          style={{
            backgroundColor: playing ? '#1a1a1a' : '#f59e0b',
            color: playing ? '#a3a3a3' : '#000',
            border: playing ? '1px solid #262626' : 'none',
            width: 36,
            height: 36,
            borderRadius: '50%',
            flexShrink: 0,
          }}
          className="flex items-center justify-center transition-all disabled:opacity-50"
        >
          {loading ? '...' : playing ? '⏸' : '▶'}
        </button>
        <div className="flex-1 relative" style={{ minHeight: 48 }}>
          {loading && (
            <div
              style={{ backgroundColor: '#1a1a1a', height: 48, position: 'absolute', inset: 0 }}
              className="rounded animate-pulse"
            />
          )}
          <div
            ref={containerRef}
            className="w-full cursor-pointer"
            style={{ visibility: loading ? 'hidden' : 'visible' }}
          />
        </div>
        {playing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 20, flexShrink: 0 }}>
            <style>{`
              @keyframes wave1 { 0%,100% { height: 4px; } 50% { height: 16px; } }
              @keyframes wave2 { 0%,100% { height: 8px; } 50% { height: 4px; } }
              @keyframes wave3 { 0%,100% { height: 12px; } 50% { height: 20px; } }
              @keyframes wave4 { 0%,100% { height: 6px; } 50% { height: 14px; } }
              @keyframes wave5 { 0%,100% { height: 10px; } 50% { height: 6px; } }
            `}</style>
            {[
              { anim: 'wave1', delay: '0s' },
              { anim: 'wave2', delay: '0.1s' },
              { anim: 'wave3', delay: '0.2s' },
              { anim: 'wave4', delay: '0.3s' },
              { anim: 'wave5', delay: '0.4s' },
              { anim: 'wave1', delay: '0.5s' },
              { anim: 'wave2', delay: '0.15s' },
            ].map((w, i) => (
              <div key={i} style={{
                width: 3, backgroundColor: '#f59e0b', borderRadius: 2,
                animation: `${w.anim} 0.8s ease-in-out infinite`,
                animationDelay: w.delay,
                height: 8,
              }} />
            ))}
          </div>
        )}
        <span style={{ color: '#525252', flexShrink: 0 }} className="text-xs tabular-nums">
          {fmt(currentTime)}/{fmt(duration)}
        </span>
      </div>
    </div>
  )
}
