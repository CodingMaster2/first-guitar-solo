'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Lesson } from '@/types'

interface TryClientProps {
  lesson: Lesson
}

export default function TryClient({ lesson }: TryClientProps) {
  const [email, setEmail] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hydrated, setHydrated] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('try_email')
      if (stored) setUnlocked(true)
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      await fetch('/api/try-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      // Always unlock regardless of API result — the email capture is in localStorage
      try { localStorage.setItem('try_email', email.trim()) } catch { /* ignore */ }
      setUnlocked(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Before hydration, show nothing interactive to avoid flicker
  if (!hydrated) {
    return (
      <div className="py-12 text-center">
        <div style={{ color: '#525252' }} className="text-sm">Loading...</div>
      </div>
    )
  }

  if (!unlocked) {
    return (
      <div>
        {/* Teaser */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #262626',
            borderTop: '3px solid #f59e0b',
          }}
          className="rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <span style={{ color: '#f59e0b' }}>🎸</span>
            <p style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-wider">
              Day 1 Preview
            </p>
          </div>
          <h2 className="text-white font-black text-xl mb-1">{lesson.title}</h2>
          <p style={{ color: '#a3a3a3' }} className="text-sm mb-4">{lesson.subtitle}</p>

          {/* Blurred preview */}
          <div style={{ position: 'relative', overflow: 'hidden', maxHeight: 120 }}>
            <p style={{ color: '#d4d4d4', filter: 'blur(4px)', userSelect: 'none' }} className="text-sm leading-relaxed">
              {lesson.why}
            </p>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 60,
                background: 'linear-gradient(to bottom, transparent, #111111)',
              }}
            />
          </div>
        </div>

        {/* Email gate */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #f59e0b',
            background: 'linear-gradient(135deg, #111111, #0f0e00)',
          }}
          className="rounded-2xl p-8 mb-8"
        >
          <h3 className="text-white font-black text-xl mb-2">Unlock Day 1 — Free</h3>
          <p style={{ color: '#a3a3a3' }} className="text-sm mb-6 leading-relaxed">
            Enter your email to access the full Day 1 lesson with no payment required. See what the program is really like.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #262626',
                color: '#ffffff',
                flex: 1,
              }}
              className="rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !email.trim()}
              style={{ backgroundColor: '#f59e0b', color: '#000' }}
              className="px-6 py-3 rounded-lg text-sm font-black uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? 'Unlocking...' : 'Unlock Day 1'}
            </button>
          </form>
          {error && (
            <p style={{ color: '#ef4444' }} className="text-xs mt-3">{error}</p>
          )}
          <p style={{ color: '#404040' }} className="text-xs mt-3">
            No spam. No credit card. Just guitar.
          </p>
        </div>
      </div>
    )
  }

  // Unlocked — show full lesson
  return (
    <div>
      {/* Lesson header */}
      <div
        style={{
          backgroundColor: '#111111',
          border: '2px solid #f59e0b',
          background: 'linear-gradient(135deg, #111111, #0f0e00)',
        }}
        className="rounded-2xl p-8 mb-6"
      >
        <div style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-2">
          Day 1 Lesson — Free Preview
        </div>
        <h2 className="text-3xl font-black text-white mb-2">{lesson.title}</h2>
        <p style={{ color: '#a3a3a3' }} className="text-sm mb-4">{lesson.subtitle}</p>
        <div className="flex gap-3 flex-wrap">
          <span
            style={{ backgroundColor: '#1a1a1a', color: '#a3a3a3', border: '1px solid #262626' }}
            className="text-xs px-3 py-1 rounded"
          >
            {lesson.duration} min
          </span>
          <span
            style={{ backgroundColor: '#1a0f00', color: '#f59e0b', border: '1px solid #78350f' }}
            className="text-xs px-3 py-1 rounded font-bold"
          >
            Week {lesson.week}
          </span>
        </div>
      </div>

      {/* Why this lesson */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-5">
        <h3 style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-wider mb-3">
          Why This Matters
        </h3>
        <p style={{ color: '#d4d4d4' }} className="text-sm leading-relaxed">{lesson.why}</p>
      </div>

      {/* Warmup */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-5">
        <h3 style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-wider mb-3">
          Warm Up
        </h3>
        <p style={{ color: '#d4d4d4' }} className="text-sm leading-relaxed">{lesson.warmup}</p>
      </div>

      {/* Main content */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-5">
        <h3 style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-wider mb-4">
          Lesson
        </h3>
        <div
          style={{ color: '#d4d4d4' }}
          className="text-sm leading-relaxed prose-lesson"
          dangerouslySetInnerHTML={{ __html: lesson.mainContent }}
        />
      </div>

      {/* Exercise */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-5">
        <h3 style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-wider mb-3">
          Today&apos;s Exercise
        </h3>
        <p style={{ color: '#d4d4d4' }} className="text-sm leading-relaxed">{lesson.exercise}</p>
      </div>

      {/* Self check */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-6 mb-8">
        <h3 style={{ color: '#a3a3a3' }} className="text-xs font-bold uppercase tracking-wider mb-3">
          Self Check
        </h3>
        <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed">{lesson.selfCheck}</p>
      </div>

      {/* CTA */}
      <div
        style={{ backgroundColor: '#111111', border: '1px solid #f59e0b', background: 'linear-gradient(135deg, #111111, #0f0e00)' }}
        className="rounded-2xl p-8 text-center"
      >
        <p style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-3">
          Ready for More?
        </p>
        <h3 className="text-2xl font-black text-white mb-3">
          Continue with the Full 30 Days
        </h3>
        <p style={{ color: '#a3a3a3' }} className="text-sm mb-6 max-w-md mx-auto leading-relaxed">
          You just completed Day 1. Days 2–30 build everything you started today into a complete lead guitar skill set.
        </p>
        <Link
          href="/#pricing"
          style={{ backgroundColor: '#f59e0b', color: '#000' }}
          className="inline-block px-10 py-4 rounded-xl text-sm font-black uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Ready for the Full 30 Days? →
        </Link>
        <p style={{ color: '#404040' }} className="text-xs mt-4">$25 one-time · Lifetime access · 30-day guarantee</p>
      </div>
    </div>
  )
}
