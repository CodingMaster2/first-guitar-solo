'use client'

import { useState, useEffect, useRef } from 'react'

interface PerformanceRecorderProps {
  day: number
  userName?: string
}

interface StoredRecording {
  id: string
  day: number
  date: string
  blob: Blob
  duration: number
}

interface Recording {
  id: string
  day: number
  date: string
  blobUrl: string
  duration: number
}

const DB_NAME = 'fgs-recordings'
const STORE_NAME = 'recordings'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function saveRec(data: StoredRecording): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(data)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function loadForDay(day: number): Promise<Recording[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).getAll()
    req.onsuccess = () => {
      const all = (req.result as StoredRecording[])
        .filter((r) => r.day === day)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map((r) => ({
          id: r.id,
          day: r.day,
          date: r.date,
          duration: r.duration,
          blobUrl: URL.createObjectURL(r.blob),
        }))
      resolve(all)
    }
    req.onerror = () => reject(req.error)
  })
}

async function deleteRec(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export default function PerformanceRecorder({ day, userName = 'Student' }: PerformanceRecorderProps) {
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [currentUrl, setCurrentUrl] = useState('')
  const [currentBlob, setCurrentBlob] = useState<Blob | null>(null)
  const [error, setError] = useState('')
  const [dbReady, setDbReady] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    openDB()
      .then(() => {
        setDbReady(true)
        return loadForDay(day)
      })
      .then(setRecordings)
      .catch(() => {})
  }, [day])

  const startRecording = async () => {
    try {
      setError('')
      let stream: MediaStream
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      }

      chunksRef.current = []
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr

      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mr.onstop = () => {
        void (async () => {
          stream.getTracks().forEach((t) => t.stop())
          const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' })
          const url = URL.createObjectURL(blob)
          setCurrentBlob(blob)
          setCurrentUrl(url)
          const dur = Math.round((Date.now() - startTimeRef.current) / 1000)
          const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
          try {
            await saveRec({ id, day, date: new Date().toISOString(), blob, duration: dur })
            const updated = await loadForDay(day)
            setRecordings(updated)
          } catch {
            // IndexedDB unavailable in some contexts
          }
        })()
      }

      mr.start(1000)
      startTimeRef.current = Date.now()
      setRecording(true)
      setElapsed(0)
      setCurrentBlob(null)
      setCurrentUrl('')

      timerRef.current = setInterval(() => {
        setElapsed(Math.round((Date.now() - startTimeRef.current) / 1000))
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not access microphone')
    }
  }

  const stopRecording = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteRec(id)
      const updated = await loadForDay(day)
      setRecordings(updated)
    } catch {}
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div
      style={{
        backgroundColor: '#111111',
        border: '1px solid #262626',
        borderRadius: '0.75rem',
        padding: '1.25rem',
      }}
    >
      <style>{`
        @keyframes recPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.45); }
          50% { box-shadow: 0 0 0 14px rgba(239,68,68,0); }
        }
      `}</style>

      <h3
        style={{
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.875rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        🎬 Record Your Performance
        <span style={{ color: '#525252', fontWeight: 400, fontSize: '0.75rem' }}>
          — {userName}, Day {day}
        </span>
      </h3>

      {error && (
        <p
          style={{
            color: '#ef4444',
            fontSize: '0.75rem',
            marginBottom: '0.75rem',
            backgroundColor: '#1a0000',
            border: '1px solid #7f1d1d',
            borderRadius: '0.375rem',
            padding: '0.5rem',
          }}
        >
          {error}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <button
          onClick={() => {
            if (recording) {
              stopRecording()
            } else {
              void startRecording()
            }
          }}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: recording ? '#7f1d1d' : '#1a1a1a',
            border: `3px solid ${recording ? '#ef4444' : '#262626'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            animation: recording ? 'recPulse 1.5s ease-in-out infinite' : 'none',
          }}
          title={recording ? 'Stop recording' : 'Start recording'}
        >
          {recording ? (
            <span
              style={{
                width: 22,
                height: 22,
                backgroundColor: '#ffffff',
                borderRadius: 4,
                display: 'block',
              }}
            />
          ) : (
            <span
              style={{
                width: 22,
                height: 22,
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                display: 'block',
              }}
            />
          )}
        </button>
        {recording && (
          <p
            style={{
              color: '#ef4444',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              fontSize: '1.25rem',
            }}
          >
            ● {formatTime(elapsed)}
          </p>
        )}
        {!recording && !currentUrl && (
          <p style={{ color: '#525252', fontSize: '0.75rem' }}>Tap to start recording</p>
        )}
      </div>

      {currentUrl && !recording && (
        <div
          style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #262626',
            borderRadius: '0.5rem',
            padding: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          <p style={{ color: '#a3a3a3', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            Latest recording
          </p>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls src={currentUrl} style={{ width: '100%', marginBottom: '0.5rem' }} />
          {currentBlob && (
            <a
              href={currentUrl}
              download={`day-${day}-performance.webm`}
              style={{ color: '#f59e0b', fontSize: '0.75rem', textDecoration: 'underline' }}
            >
              Download (.webm)
            </a>
          )}
        </div>
      )}

      {dbReady && recordings.length > 0 && (
        <div>
          <p
            style={{
              color: '#525252',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}
          >
            Past recordings ({recordings.length})
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recordings.map((rec) => (
              <div
                key={rec.id}
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #1f1f1f',
                  borderRadius: '0.5rem',
                  padding: '0.625rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.375rem',
                  }}
                >
                  <span style={{ color: '#a3a3a3', fontSize: '0.7rem' }}>
                    {new Date(rec.date).toLocaleDateString()} · {formatTime(rec.duration)}
                  </span>
                  <button
                    onClick={() => { void handleDelete(rec.id) }}
                    style={{
                      color: '#525252',
                      fontSize: '0.7rem',
                      border: '1px solid #262626',
                      borderRadius: '0.25rem',
                      padding: '0.125rem 0.5rem',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <audio controls src={rec.blobUrl} style={{ width: '100%', height: 32 }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
