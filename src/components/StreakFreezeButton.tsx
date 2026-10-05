'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface StreakFreezeButtonProps {
  streakFreezes: number
  streak: number
}

export default function StreakFreezeButton({ streakFreezes, streak }: StreakFreezeButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [used, setUsed] = useState(false)

  const handleUseFreeze = async () => {
    if (loading || used) return
    setLoading(true)
    try {
      const res = await fetch('/api/streak-freeze', { method: 'POST' })
      const data = await res.json() as { ok: boolean }
      if (data.ok) {
        setUsed(true)
        router.refresh()
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626' }} className="rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider">Streak Freezes</p>
        <span style={{ color: '#f59e0b' }} className="text-sm font-black">
          {streakFreezes} remaining
        </span>
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: Math.max(3, streakFreezes) }, (_, i) => (
          <div
            key={i}
            style={{
              width: 24, height: 24,
              backgroundColor: i < streakFreezes ? '#0ea5e9' : '#1a1a1a',
              border: `1px solid ${i < streakFreezes ? '#0284c7' : '#262626'}`,
              fontSize: '0.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            className="rounded"
          >
            {i < streakFreezes ? '❄' : ''}
          </div>
        ))}
      </div>
      {streak === 0 && streakFreezes > 0 && !used && (
        <button
          onClick={handleUseFreeze}
          disabled={loading}
          style={{ backgroundColor: '#0ea5e9', color: '#fff' }}
          className="mt-3 w-full py-2 rounded-lg text-xs font-black uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Applying...' : 'Use Freeze — Restore Streak'}
        </button>
      )}
      {used && (
        <p style={{ color: '#86efac' }} className="mt-2 text-xs">Freeze applied! Streak restored.</p>
      )}
    </div>
  )
}
