'use client'

import { useRef, useState, useEffect } from 'react'

interface AudioPlayerProps {
  url: string
  label: string
}

export default function AudioPlayer({ url, label }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => setPlaying(false)
    const onWaiting = () => setLoading(true)
    const onCanPlay = () => setLoading(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play()
      setPlaying(true)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const time = parseFloat(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (t: number) => {
    if (!isFinite(t)) return '0:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626' }} className="rounded-lg p-4">
      <audio ref={audioRef} src={url} preload="metadata" />
      <p style={{ color: '#a3a3a3' }} className="text-xs mb-3">{label}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          style={{ backgroundColor: '#f59e0b', color: '#000', width: '36px', height: '36px', flexShrink: 0 }}
          className="rounded-full flex items-center justify-center font-bold text-sm"
        >
          {loading ? '...' : playing ? '&#9646;&#9646;' : '&#9654;'}
        </button>
        <div className="flex-1 flex flex-col gap-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            style={{ accentColor: '#f59e0b', width: '100%' }}
            className="h-1 cursor-pointer"
          />
          <div className="flex justify-between">
            <span style={{ color: '#a3a3a3' }} className="text-xs">{formatTime(currentTime)}</span>
            <span style={{ color: '#a3a3a3' }} className="text-xs">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
