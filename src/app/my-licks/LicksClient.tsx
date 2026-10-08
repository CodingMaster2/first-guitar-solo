'use client'

import { useState, useEffect } from 'react'

// ─── Lick data ───────────────────────────────────────────────────
export interface Lick {
  day: number
  name: string
  technique: string
  description: string
  tab: string
}

export const LICKS: Lick[] = [
  {
    day: 1,
    name: 'Chromatic Spider Exercise',
    technique: 'Fretting',
    description: 'The 1-2-3-4 spider exercise across all six strings to build finger independence and fretboard familiarity.',
    tab: 'e|--1-2-3-4-------------------|\nB|----------1-2-3-4-----------|\nG|------------------1-2-3-4---|',
  },
  {
    day: 2,
    name: 'Open String Alternate Picking',
    technique: 'Picking',
    description: 'Alternate picking (down-up-down-up) on open strings to develop a clean, consistent pick attack.',
    tab: 'e|--0-0-0-0-0-0-0-0--|',
  },
  {
    day: 3,
    name: 'One-String Pentatonic Run',
    technique: 'Alternate Picking',
    description: 'A single-string pentatonic run using strict alternate picking to build right-hand efficiency.',
    tab: 'e|--5-8-5-8-5-8--|\nB|--5-8-5-8-5-8--|',
  },
  {
    day: 4,
    name: 'A Minor Scale — Position 1',
    technique: 'Scale',
    description: 'The A natural minor scale in first position, ascending and descending, one note per beat.',
    tab: 'e|--5-7-8--------|\nB|--5-6-8--------|\nG|--5-7----------|\nD|--5-7----------|\nA|--5-7----------|\nE|--5-7-8--------|',
  },
  {
    day: 5,
    name: 'Hammer-on Lick',
    technique: 'Hammer-on',
    description: 'Pick the first note only, then hammer the second finger down firmly to sound the second note without re-picking.',
    tab: 'e|--5h7-5h7-5h7--|\nB|--5h7-5h7------|',
  },
  {
    day: 6,
    name: 'Pull-off Lick',
    technique: 'Pull-off',
    description: 'Fret both notes simultaneously, pick the higher fret, then pull off to sound the lower note.',
    tab: 'e|--7p5-7p5-7p5--|\nB|--7p5-7p5------|',
  },
  {
    day: 7,
    name: 'Pentatonic Box 1 — Lower Half',
    technique: 'Pentatonic',
    description: 'The lower portion of the A minor pentatonic box pattern — the foundation of blues-rock lead.',
    tab: 'e|--5-8--|\nB|--5-8--|\nG|--5-7--|',
  },
  {
    day: 8,
    name: 'Pentatonic Box 1 — Full',
    technique: 'Pentatonic',
    description: 'The complete A minor pentatonic Position 1, ascending and descending across all six strings.',
    tab: 'e|--5-8-----------|\nB|--5-8-----------|\nG|--5-7-----------|\nD|--5-7-----------|\nA|--5-7-----------|\nE|--5-8-----------|',
  },
  {
    day: 9,
    name: 'Diagonal Pentatonic Run',
    technique: 'Pentatonic',
    description: 'Moving diagonally across the neck through the pentatonic shape for a connecting, fluid sound.',
    tab: 'e|--------5-8-|\nB|------5-8---|\nG|----5-7-----|\nD|--5-7-------|',
  },
  {
    day: 10,
    name: 'Half-step String Bend',
    technique: 'Bending',
    description: 'Push the string up by one fret\'s pitch. The target note is in parentheses — you must reach it in tune.',
    tab: 'e|--7b(8)--|\nB|---------|',
  },
  {
    day: 11,
    name: 'Whole-step String Bend',
    technique: 'Bending',
    description: 'The most common blues bend: push up two frets\' worth of pitch. Accuracy is everything here.',
    tab: 'e|--7b(9)--|\nB|---------|',
  },
  {
    day: 12,
    name: 'Bend and Release',
    technique: 'Bending',
    description: 'Bend to the target pitch, hold it for a beat, then release back to the original note smoothly.',
    tab: 'e|--7b(9)r7--|\nB|-----------|',
  },
  {
    day: 13,
    name: 'Wrist Vibrato Introduction',
    technique: 'Vibrato',
    description: 'Sustain a fretted note and apply a gentle, rhythmic pitch oscillation using wrist rotation, not finger motion.',
    tab: 'e|--7~~~~~~~~~--|',
  },
  {
    day: 14,
    name: 'Bend into Vibrato',
    technique: 'Vibrato',
    description: 'Bend to the target pitch and immediately apply vibrato on the peak — the signature blues expression.',
    tab: 'e|--7b(9)~~~--|\nB|------------|',
  },
  {
    day: 15,
    name: 'Ascending Slide Lick',
    technique: 'Slide',
    description: 'Pick the first note and slide your fretting finger up to the second without lifting off the string.',
    tab: 'e|--5/7-5/7-5/7--|\nB|---------------|',
  },
  {
    day: 16,
    name: 'Legato Hammer-Pull Run',
    technique: 'Legato',
    description: 'A fast hammer-on/pull-off string where only the first note is picked — all legato fretting hand.',
    tab: 'e|--5h7p5h7p5--|\nB|-------------|',
  },
  {
    day: 17,
    name: 'Pentatonic Position 2',
    technique: 'Pentatonic',
    description: 'The second box position of the minor pentatonic — shifting one octave up from the root position.',
    tab: 'e|--8-10--|\nB|--8-10--|\nG|--7-9---|\nD|--7-9---|',
  },
  {
    day: 18,
    name: 'String-skipping Lick',
    technique: 'String Skipping',
    description: 'Jump over the middle string for a wide, angular intervallic sound that stands out in a solo.',
    tab: 'e|--5-8------|\nG|----7-5----|',
  },
  {
    day: 19,
    name: 'Classic Blues Phrase',
    technique: 'Blues',
    description: 'The iconic combination: bend to the blue note, release, and resolve down to the root.',
    tab: 'e|--8b(10)r8-5--|\nB|------------5--|',
  },
  {
    day: 20,
    name: 'Double-stop Crush',
    technique: 'Double-stop',
    description: 'Fret and pick two strings simultaneously for a fat, harmonised blues sound.',
    tab: 'e|--7-7-7--|\nB|--5-5-5--|',
  },
  {
    day: 21,
    name: 'Blues Turnaround',
    technique: 'Blues',
    description: 'A two-bar phrase at the end of the 12-bar form that leads the ear back to the top of the progression.',
    tab: 'e|--5-7-5-3--|\nB|--5-7-5-3--|',
  },
  {
    day: 22,
    name: 'Call and Response Phrase',
    technique: 'Phrasing',
    description: 'A short melodic "question" (call) followed by a resolving "answer" (response) — the conversational grammar of blues.',
    tab: 'e|--7b(9)~~---------5-7--|\nB|--------------5--------|',
  },
  {
    day: 23,
    name: 'Combination Lick (Bend + Slide + Pull-off)',
    technique: 'Combination',
    description: 'Stitch a bend, a slide, and a pull-off together in one fluid phrase — combining three days of technique.',
    tab: 'e|--7b(9)r7/9p7-5--|\nB|-----------------|',
  },
  {
    day: 24,
    name: 'Dynamic Swell Phrase',
    technique: 'Dynamics',
    description: 'Play the same four-note phrase twice: once quietly, then with full aggression — contrast is expression.',
    tab: 'e|--5-7-8-7-5 (soft)--5-7-8-7-5 (loud)--|\nB|-----------------------------------------|',
  },
  {
    day: 25,
    name: 'Position-shift Connector',
    technique: 'Position Shifting',
    description: 'Move smoothly from Position 1 to Position 2 using a connecting slide — stitching the neck together.',
    tab: 'e|--5-8---8-10--|\nB|--5-8/8-8-10--|',
  },
  {
    day: 26,
    name: 'Solo — Opening Statement',
    technique: 'Solo',
    description: 'The dramatic opening phrase of the full solo: a high bend, vibrato, then a cascading descent.',
    tab: 'e|--12b(14)~~-10-12-10--|\nB|--------------------10-12|',
  },
  {
    day: 27,
    name: 'Solo — Climactic Mid-section',
    technique: 'Solo',
    description: 'The fast, position-crossing middle run — the "peak" of the solo that shows your full technique.',
    tab: 'e|--10-12-10-8-10-8--|\nB|--10-12-10---------|',
  },
  {
    day: 28,
    name: 'Solo — Closing Resolution',
    technique: 'Solo',
    description: 'The final phrase: slow down, hold a bend with vibrato, then resolve deliberately to the root. Breathe.',
    tab: 'e|--10b(12)~~~-8-10-8-5--|\nB|------------------------|',
  },
  {
    day: 29,
    name: 'Full Solo Run-through',
    technique: 'Solo',
    description: 'Connect all three sections at performance tempo. One continuous 12-bar solo from top to bottom.',
    tab: 'e|--[Lessons 26 + 27 + 28 joined]--|\nB|----------------------------------|',
  },
  {
    day: 30,
    name: 'Graduation Signature Lick',
    technique: 'Solo',
    description: 'The very last moment of the solo — a final bend, vibrato, and a slide off the string. Your signature.',
    tab: 'e|--5-7b(9)~~-7p5---5\\--|\nB|----------------------|',
  },
]

const ALL_TECHNIQUES = ['All', ...Array.from(new Set(LICKS.map((l) => l.technique)))]

const TECHNIQUE_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  Fretting:         { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.3)'  },
  Picking:          { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' },
  'Alternate Picking': { color: '#c084fc', bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.3)' },
  Scale:            { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)'  },
  'Hammer-on':      { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)'  },
  'Pull-off':       { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)'  },
  Pentatonic:       { color: '#22d3ee', bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.3)'  },
  Bending:          { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
  Vibrato:          { color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.3)'  },
  Slide:            { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)'  },
  Legato:           { color: '#e879f9', bg: 'rgba(232,121,249,0.1)', border: 'rgba(232,121,249,0.3)' },
  'String Skipping': { color: '#38bdf8', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.3)' },
  Blues:            { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)' },
  'Double-stop':    { color: '#a3e635', bg: 'rgba(163,230,53,0.1)', border: 'rgba(163,230,53,0.3)'  },
  Phrasing:         { color: '#fda4af', bg: 'rgba(253,164,175,0.1)', border: 'rgba(253,164,175,0.3)' },
  Combination:      { color: '#d4d4d4', bg: 'rgba(212,212,212,0.1)', border: 'rgba(212,212,212,0.3)' },
  Dynamics:         { color: '#7dd3fc', bg: 'rgba(125,211,252,0.1)', border: 'rgba(125,211,252,0.3)' },
  'Position Shifting': { color: '#86efac', bg: 'rgba(134,239,172,0.1)', border: 'rgba(134,239,172,0.3)' },
  Solo:             { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)'  },
}

function getTechStyle(technique: string) {
  return TECHNIQUE_COLORS[technique] ?? { color: '#a3a3a3', bg: 'rgba(163,163,163,0.1)', border: 'rgba(163,163,163,0.3)' }
}

function TechniquePill({ technique }: { technique: string }) {
  const s = getTechStyle(technique)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        borderRadius: 100,
        padding: '2px 8px',
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {technique}
    </span>
  )
}

// ─── Storage helpers ──────────────────────────────────────────────
const STORAGE_KEY = 'fgs:lick-rotation'

function loadRotation(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) return new Set(parsed as number[])
  } catch {}
  return new Set()
}

function saveRotation(days: Set<number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...days]))
  } catch {}
}

// ─── Main component ───────────────────────────────────────────────
export default function LicksClient() {
  const [filter, setFilter] = useState<string>('All')
  const [rotation, setRotation] = useState<Set<number>>(new Set())
  const [showRotationOnly, setShowRotationOnly] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setRotation(loadRotation())
    setMounted(true)
  }, [])

  function toggleRotation(day: number) {
    setRotation((prev) => {
      const next = new Set(prev)
      if (next.has(day)) {
        next.delete(day)
      } else {
        next.add(day)
      }
      saveRotation(next)
      return next
    })
  }

  const filtered = LICKS.filter((l) => {
    const techMatch = filter === 'All' || l.technique === filter
    const rotMatch = !showRotationOnly || rotation.has(l.day)
    return techMatch && rotMatch
  })

  return (
    <div>
      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        {/* Rotation toggle */}
        {mounted && (
          <button
            onClick={() => setShowRotationOnly((v) => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              backgroundColor: showRotationOnly ? 'rgba(245,158,11,0.15)' : '#111111',
              color: showRotationOnly ? '#f59e0b' : '#737373',
              border: `1px solid ${showRotationOnly ? 'rgba(245,158,11,0.4)' : '#262626'}`,
              borderRadius: 100,
              padding: '0.375rem 0.875rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.03em',
              marginRight: '0.5rem',
            }}
          >
            🔁 Practice Rotation ({rotation.size})
          </button>
        )}

        {/* Technique filters */}
        {ALL_TECHNIQUES.map((tech) => (
          <button
            key={tech}
            onClick={() => setFilter(tech)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: filter === tech
                ? tech === 'All' ? '#f59e0b' : getTechStyle(tech).bg
                : '#111111',
              color: filter === tech
                ? tech === 'All' ? '#000000' : getTechStyle(tech).color
                : '#737373',
              border: `1px solid ${filter === tech
                ? tech === 'All' ? '#f59e0b' : getTechStyle(tech).border
                : '#262626'}`,
              borderRadius: 100,
              padding: '0.3rem 0.75rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* Count */}
      <p style={{ color: '#525252', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
        Showing {filtered.length} of {LICKS.length} licks
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #1f1f1f',
            borderRadius: '0.75rem',
            padding: '3rem',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#525252', fontSize: '0.875rem' }}>
            {showRotationOnly
              ? 'No licks in your practice rotation yet. Click the 🔁 button on any lick to add it.'
              : 'No licks match this filter.'}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '0.875rem',
          }}
        >
          {filtered.map((lick) => {
            const inRotation = mounted && rotation.has(lick.day)
            return (
              <div
                key={lick.day}
                style={{
                  backgroundColor: '#111111',
                  border: `1px solid ${inRotation ? 'rgba(245,158,11,0.35)' : '#1f1f1f'}`,
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Rotation indicator */}
                {inRotation && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 32,
                      height: 32,
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
                    }}
                  />
                )}

                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {/* Day badge */}
                    <span
                      style={{
                        backgroundColor: '#1a1a1a',
                        color: '#f59e0b',
                        border: '1px solid #262626',
                        borderRadius: '0.375rem',
                        padding: '1px 7px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        flexShrink: 0,
                      }}
                    >
                      Day {lick.day}
                    </span>
                    <TechniquePill technique={lick.technique} />
                  </div>

                  {/* Rotation toggle button */}
                  <button
                    onClick={() => toggleRotation(lick.day)}
                    title={inRotation ? 'Remove from practice rotation' : 'Add to practice rotation'}
                    style={{
                      backgroundColor: inRotation ? 'rgba(245,158,11,0.15)' : 'transparent',
                      color: inRotation ? '#f59e0b' : '#525252',
                      border: `1px solid ${inRotation ? 'rgba(245,158,11,0.3)' : '#262626'}`,
                      borderRadius: '0.375rem',
                      padding: '3px 7px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      flexShrink: 0,
                      lineHeight: 1,
                    }}
                  >
                    {inRotation ? '🔁' : '○'}
                  </button>
                </div>

                {/* Lick name */}
                <h3
                  style={{
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    margin: 0,
                    fontFamily: 'inherit',
                    letterSpacing: '0.01em',
                    lineHeight: 1.3,
                  }}
                >
                  {lick.name}
                </h3>

                {/* Description */}
                <p style={{ color: '#a3a3a3', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
                  {lick.description}
                </p>

                {/* TAB */}
                <div
                  style={{
                    backgroundColor: '#0d0d0d',
                    border: '1px solid #1a1a1a',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 0.875rem',
                    overflowX: 'auto',
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      color: '#d4d4d4',
                      fontSize: '0.78rem',
                      lineHeight: 1.7,
                      fontFamily: "'Fira Code', 'Courier New', monospace",
                    }}
                  >
                    {lick.tab}
                  </pre>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
