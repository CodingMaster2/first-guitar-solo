'use client'

import { useState } from 'react'
import Link from 'next/link'

const TECHNIQUE_MILESTONES = [
  { name: 'Picking', day: 1, symbol: '↓' },
  { name: 'Hammer-ons', day: 5, symbol: 'h' },
  { name: 'Pull-offs', day: 6, symbol: 'p' },
  { name: 'Slides', day: 7, symbol: '/' },
  { name: 'Bends', day: 8, symbol: 'b' },
  { name: 'Vibrato', day: 12, symbol: '~' },
]

const STRING_COLORS: Record<string, string> = {
  'e': '#d4d4d4',
  'B': '#a3a3a3',
  'G': '#8b8b8b',
  'D': '#737373',
  'A': '#5a5a5a',
  'E': '#404040',
}

function detectTechniques(tab: string): string[] {
  const found: string[] = []
  if (/h\d/.test(tab)) found.push('Hammer-ons')
  if (/p\d/.test(tab)) found.push('Pull-offs')
  if (/\/\d|\d\//.test(tab)) found.push('Slides')
  if (/\d+b\d*/.test(tab)) found.push('Bends')
  if (/~/.test(tab)) found.push('Vibrato')
  if (tab.length > 20) found.push('Picking')
  return found
}

interface Props {
  customSolo: string
  soloStyle: string
  guitarHero: string | null
  soloVibe: string
  userName: string
  currentDay: number
  soloCompleted: boolean
  soloCompletedAt: string | null
  graduateNote: string | null
}

export default function SoloDisplayClient({
  customSolo,
  soloStyle,
  guitarHero,
  soloVibe,
  userName,
  currentDay,
  soloCompleted,
  soloCompletedAt,
  graduateNote,
}: Props) {
  const [showRegenConfirm, setShowRegenConfirm] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [completedNote, setCompletedNote] = useState('')
  const [justCompleted, setJustCompleted] = useState(false)
  const [completeError, setCompleteError] = useState('')
  const [showCompleteForm, setShowCompleteForm] = useState(false)

  const tabLines = customSolo.split('\n').filter((l) => /^[eBGDAE]\|/.test(l))
  const techniques = detectTechniques(customSolo)
  const unlockedTechniques = TECHNIQUE_MILESTONES.filter((t) => currentDay >= t.day)
  const isReadyToComplete = currentDay >= 30 || soloCompleted

  const styleLabel = soloStyle.charAt(0).toUpperCase() + soloStyle.slice(1)
  const vibeLabel =
    soloVibe === 'slow_melodic' ? 'Slow & Expressive'
    : soloVibe === 'fast_shreddy' ? 'Fast & Shreddy'
    : 'Balanced'

  const handleComplete = async () => {
    setCompleting(true)
    setCompleteError('')
    try {
      const res = await fetch('/api/my-solo/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ graduateNote: completedNote.trim() || undefined }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setJustCompleted(true)
      setShowCompleteForm(false)
    } catch (err) {
      setCompleteError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setCompleting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{ backgroundColor: '#111111', border: '2px solid #f59e0b', background: 'linear-gradient(135deg, #111111 0%, #0f0e00 100%)' }}
        className="rounded-xl p-6 mb-6"
      >
        <div style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-2">
          Your First Guitar Solo
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
          Composed for {userName || 'You'}
        </h1>
        <p style={{ color: '#a3a3a3' }} className="text-sm">
          <span style={{ color: '#f59e0b' }}>{styleLabel}</span>
          {guitarHero ? ` · Inspired by ${guitarHero}` : ''}
          {' · '}{vibeLabel}
        </p>
      </div>

      {/* Tab Display */}
      <div
        style={{
          backgroundColor: '#0d0d0d',
          border: '1px solid #262626',
          borderLeft: '4px solid #f59e0b',
        }}
        className="rounded-xl p-5 mb-6 overflow-x-auto"
      >
        <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-4 font-bold">
          Tab Notation · A Minor Pentatonic · 5th Position
        </p>
        <pre
          style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 'clamp(11px, 1.8vw, 14px)',
            lineHeight: 1.6,
            overflowX: 'auto',
          }}
        >
          {tabLines.map((line, i) => {
            const strName = line[0]
            const color = STRING_COLORS[strName] ?? '#a3a3a3'
            return (
              <div key={i}>
                <span style={{ color, fontWeight: 700 }}>{strName}</span>
                <span style={{ color: '#d4d4d4' }}>{line.slice(1)}</span>
              </div>
            )
          })}
          {tabLines.length === 0 && (
            <span style={{ color: '#525252' }}>Tab data unavailable.</span>
          )}
        </pre>
      </div>

      {/* Techniques */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5 mb-6">
        <p style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider font-bold mb-3">
          Techniques in Your Solo
        </p>
        <div className="flex flex-wrap gap-2">
          {techniques.length > 0 ? techniques.map((t) => (
            <span
              key={t}
              style={{ backgroundColor: '#1a1000', border: '1px solid #78350f', color: '#f59e0b' }}
              className="text-xs font-bold px-3 py-1 rounded-full"
            >
              {t}
            </span>
          )) : (
            <span style={{ color: '#525252' }} className="text-xs">Techniques detected from the tab above.</span>
          )}
        </div>
      </div>

      {/* Lesson Path */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-5 mb-6">
        <p style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider font-bold mb-4">
          The Lessons That Build to This Moment
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {TECHNIQUE_MILESTONES.map((t, i) => {
            const unlocked = currentDay >= t.day
            return (
              <div key={t.name} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    style={{
                      backgroundColor: unlocked ? '#1a1000' : '#0a0a0a',
                      border: `1px solid ${unlocked ? '#78350f' : '#1f1f1f'}`,
                      color: unlocked ? '#f59e0b' : '#404040',
                      fontSize: '0.65rem',
                      fontFamily: 'monospace',
                    }}
                    className="px-2 py-0.5 rounded font-bold"
                  >
                    {t.symbol}
                  </span>
                  <div>
                    <span
                      style={{ color: unlocked ? '#ffffff' : '#404040' }}
                      className="text-xs font-bold block"
                    >
                      {t.name}
                    </span>
                    <span
                      style={{ color: unlocked ? '#f59e0b' : '#404040' }}
                      className="text-xs"
                    >
                      Day {t.day}
                    </span>
                  </div>
                </div>
                {i < TECHNIQUE_MILESTONES.length - 1 && (
                  <span style={{ color: '#404040' }} className="text-xs">→</span>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-3">
          <div style={{ backgroundColor: '#1a1a1a', height: 4 }} className="rounded-full overflow-hidden">
            <div
              style={{
                background: 'linear-gradient(90deg, #f59e0b, #fde68a)',
                width: `${Math.min(100, Math.round((unlockedTechniques.length / TECHNIQUE_MILESTONES.length) * 100))}%`,
                height: '100%',
                transition: 'width 0.4s ease',
              }}
              className="rounded-full"
            />
          </div>
          <p style={{ color: '#525252' }} className="text-xs mt-1.5">
            {unlockedTechniques.length}/{TECHNIQUE_MILESTONES.length} techniques unlocked
          </p>
        </div>
      </div>

      {/* Completion Section */}
      {isReadyToComplete && !soloCompleted && !justCompleted && (
        <div
          style={{ background: 'linear-gradient(135deg, #1a1000 0%, #0f0800 100%)', border: '2px solid #f59e0b' }}
          className="rounded-xl p-6 mb-6 text-center"
        >
          <div style={{ fontSize: '2rem', lineHeight: 1, marginBottom: '0.75rem' }}>🎸</div>
          <h2 className="text-white font-black text-xl mb-2">You&apos;re ready. Time to play your solo.</h2>
          <p style={{ color: '#a3a3a3' }} className="text-sm mb-5">
            30 days of work has been leading to this moment. Record your performance and graduate.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/lesson/30#play`}
              style={{ backgroundColor: '#f59e0b', color: '#000' }}
              className="px-6 py-3 rounded-lg text-sm font-black uppercase tracking-wider hover:opacity-90 transition-opacity text-center"
            >
              Record My Performance
            </Link>
            <button
              onClick={() => setShowCompleteForm(true)}
              style={{ border: '1px solid #f59e0b', color: '#f59e0b' }}
              className="px-6 py-3 rounded-lg text-sm font-bold hover:bg-amber-950 transition-colors"
            >
              Mark as Completed
            </button>
          </div>
        </div>
      )}

      {/* Complete Form */}
      {showCompleteForm && !soloCompleted && !justCompleted && (
        <div
          style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
          className="rounded-xl p-6 mb-6"
        >
          <h3 className="text-white font-black text-lg mb-2">Graduate Note</h3>
          <p style={{ color: '#a3a3a3' }} className="text-sm mb-4">
            Leave a note about your journey — optional, but worth writing.
          </p>
          <textarea
            value={completedNote}
            onChange={(e) => setCompletedNote(e.target.value)}
            maxLength={500}
            placeholder="What was the hardest part? What surprised you? What are you proud of?"
            rows={3}
            style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#ffffff', resize: 'vertical' }}
            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors mb-4"
          />
          {completeError && (
            <p style={{ color: '#ef4444' }} className="text-xs mb-3">{completeError}</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setShowCompleteForm(false)}
              style={{ border: '1px solid #262626', color: '#a3a3a3' }}
              className="px-5 py-2 rounded-lg text-sm font-bold hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              disabled={completing}
              style={{ backgroundColor: '#f59e0b', color: '#000' }}
              className="px-6 py-2 rounded-lg text-sm font-black uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {completing ? 'Saving...' : 'Complete My Solo (+500 XP)'}
            </button>
          </div>
        </div>
      )}

      {/* Graduate Card */}
      {(soloCompleted || justCompleted) && (
        <div
          style={{ background: 'linear-gradient(135deg, #0a1a0a 0%, #050f05 100%)', border: '2px solid #22c55e' }}
          className="rounded-xl p-6 mb-6"
        >
          <div style={{ fontSize: '2rem', lineHeight: 1, marginBottom: '0.75rem' }}>🎓</div>
          <h2 style={{ color: '#22c55e' }} className="font-black text-xl mb-1">Solo Complete.</h2>
          <p style={{ color: '#a3a3a3' }} className="text-sm mb-2">
            {soloCompletedAt || justCompleted
              ? `Completed${soloCompletedAt ? ' ' + new Date(soloCompletedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}.`
              : ''}
          </p>
          {(graduateNote || (justCompleted && completedNote)) && (
            <blockquote
              style={{ borderLeft: '3px solid #22c55e', color: '#d4d4d4', fontStyle: 'italic' }}
              className="pl-4 text-sm mt-3"
            >
              &ldquo;{graduateNote || completedNote}&rdquo;
            </blockquote>
          )}
        </div>
      )}

      {/* Regenerate */}
      {!showRegenConfirm && (
        <div className="text-center mt-4 mb-2">
          <button
            onClick={() => setShowRegenConfirm(true)}
            style={{ color: '#525252' }}
            className="text-xs hover:text-amber-500 transition-colors underline"
          >
            Regenerate Solo
          </button>
        </div>
      )}
      {showRegenConfirm && (
        <div
          style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
          className="rounded-xl p-5 mt-4 text-center"
        >
          <p style={{ color: '#a3a3a3' }} className="text-sm mb-4">
            This will generate a new solo. Your current one will be replaced.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowRegenConfirm(false)}
              style={{ border: '1px solid #262626', color: '#a3a3a3' }}
              className="px-5 py-2 rounded-lg text-sm font-bold hover:text-white transition-colors"
            >
              Keep My Solo
            </button>
            <Link
              href="/my-solo?regen=1"
              style={{ backgroundColor: '#1a1000', border: '1px solid #f59e0b', color: '#f59e0b' }}
              className="px-5 py-2 rounded-lg text-sm font-bold hover:bg-amber-950 transition-colors"
            >
              Yes, Regenerate
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
