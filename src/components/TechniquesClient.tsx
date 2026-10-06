'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Technique {
  name: string
  slug: string
  day: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  description: string
  tip: string
  tab: string
  exercises: string[]
}

type DifficultyFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced'

// ─── SVG Animation Demos ──────────────────────────────────────────────────────

function TechniqueAnimation({ slug }: { slug: string }) {
  const bgLine = <line x1="12" y1="44" x2="108" y2="44" stroke="#3a3020" strokeWidth="2" />

  switch (slug) {
    case 'alternate-picking':
      return (
        <svg viewBox="0 0 120 72" width="100%" height="68" style={{ display: 'block' }}>
          {bgLine}
          <line x1="12" y1="56" x2="108" y2="56" stroke="#3a3020" strokeWidth="1.5" />
          <g transform="translate(60,44)">
            <g style={{ animation: 'ta-pick 0.75s ease-in-out infinite' }}>
              <polygon points="0,-22 -6,-6 6,-6" fill="#f59e0b" opacity="0.9" />
            </g>
          </g>
          <text x="24" y="18" fill="#525252" fontSize="8" fontFamily="monospace">↓↑↓↑</text>
        </svg>
      )

    case 'hammer-on':
      return (
        <svg viewBox="0 0 120 72" width="100%" height="68" style={{ display: 'block' }}>
          {bgLine}
          <circle cx="38" cy="44" r="8" fill="#f59e0b" opacity="0.45" />
          <text x="38" y="48" textAnchor="middle" fill="#000" fontSize="7" fontWeight="900">5</text>
          <g transform="translate(74,44)">
            <g style={{ animation: 'ta-hammer 1.4s ease-in-out infinite' }}>
              <circle cx="0" cy="-20" r="9" fill="#f59e0b" />
              <line x1="0" y1="-11" x2="0" y2="0" stroke="#f59e0b" strokeWidth="2" />
            </g>
          </g>
          <text x="56" y="66" textAnchor="middle" fill="#525252" fontSize="8" fontFamily="monospace">5h7</text>
        </svg>
      )

    case 'pull-off':
      return (
        <svg viewBox="0 0 120 72" width="100%" height="68" style={{ display: 'block' }}>
          {bgLine}
          <circle cx="74" cy="44" r="8" fill="#f59e0b" opacity="0.45" />
          <text x="74" y="48" textAnchor="middle" fill="#000" fontSize="7" fontWeight="900">5</text>
          <g transform="translate(38,44)">
            <g style={{ animation: 'ta-pull 1.4s ease-in-out infinite' }}>
              <circle cx="0" cy="0" r="9" fill="#f59e0b" />
              <line x1="0" y1="-9" x2="0" y2="-20" stroke="#f59e0b" strokeWidth="2" />
            </g>
          </g>
          <text x="56" y="66" textAnchor="middle" fill="#525252" fontSize="8" fontFamily="monospace">7p5</text>
        </svg>
      )

    case 'bending':
      return (
        <svg viewBox="0 0 120 72" width="100%" height="68" style={{ display: 'block' }}>
          <line x1="12" y1="54" x2="60" y2="54" stroke="#3a3020" strokeWidth="2" />
          <g transform="translate(60,54)">
            <g style={{ animation: 'ta-bend 1.6s ease-in-out infinite' }}>
              <line x1="0" y1="0" x2="48" y2="0" stroke="#f59e0b" strokeWidth="2" />
              <line x1="72" y1="-20" x2="72" y2="-6" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2,2" />
              <polygon points="72,-24 68,-10 76,-10" fill="#f59e0b" />
            </g>
          </g>
          <circle cx="60" cy="54" r="7" fill="#f59e0b" opacity="0.7" />
          <text x="60" y="66" textAnchor="middle" fill="#525252" fontSize="8" fontFamily="monospace">8b10</text>
        </svg>
      )

    case 'vibrato':
      return (
        <svg viewBox="0 0 120 72" width="100%" height="68" style={{ display: 'block' }}>
          <line x1="12" y1="44" x2="40" y2="44" stroke="#3a3020" strokeWidth="2" />
          <line x1="90" y1="44" x2="108" y2="44" stroke="#3a3020" strokeWidth="2" />
          <g transform="translate(65,44)">
            <g style={{ animation: 'ta-vibrato 0.35s ease-in-out infinite alternate' }}>
              <line x1="-25" y1="0" x2="25" y2="0" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="8" fill="#f59e0b" opacity="0.8" />
            </g>
          </g>
          <text x="65" y="66" textAnchor="middle" fill="#525252" fontSize="8" fontFamily="monospace">~~~</text>
        </svg>
      )

    case 'slide':
      return (
        <svg viewBox="0 0 120 72" width="100%" height="68" style={{ display: 'block' }}>
          {bgLine}
          <g transform="translate(60,44)">
            <g style={{ animation: 'ta-slide 1.6s ease-in-out infinite' }}>
              <rect x="-9" y="-11" width="18" height="13" rx="3" fill="#f59e0b" />
              <line x1="0" y1="2" x2="0" y2="0" stroke="#f59e0b" strokeWidth="2" />
            </g>
          </g>
          <text x="60" y="66" textAnchor="middle" fill="#525252" fontSize="8" fontFamily="monospace">5/9</text>
        </svg>
      )

    case 'palm-muting':
      return (
        <svg viewBox="0 0 120 72" width="100%" height="68" style={{ display: 'block' }}>
          {[36, 44, 52].map(y => (
            <line key={y} x1="12" y1={y} x2="108" y2={y} stroke="#3a3020" strokeWidth="1.5" />
          ))}
          <g style={{ animation: 'ta-pm 1.4s ease-in-out infinite' }}>
            <rect x="60" y="28" width="44" height="32" rx="10" fill="#2a1800" stroke="#f59e0b" strokeWidth="1" />
            <text x="82" y="48" textAnchor="middle" fill="#f59e0b" fontSize="8">PM</text>
          </g>
        </svg>
      )

    case 'pentatonic':
      return (
        <svg viewBox="0 0 120 72" width="100%" height="68" style={{ display: 'block' }}>
          {[18, 28, 38, 48, 58, 68].map((y, i) => (
            <line key={y} x1="12" y1={y} x2="108" y2={y} stroke="#3a3020" strokeWidth="1" />
          ))}
          {/* Two pentatonic columns */}
          {[
            { cx: 38, cy: 18 }, { cx: 38, cy: 28 }, { cx: 38, cy: 38 }, { cx: 38, cy: 48 }, { cx: 38, cy: 58 }, { cx: 38, cy: 68 },
            { cx: 68, cy: 18 }, { cx: 68, cy: 28 }, { cx: 68, cy: 48 }, { cx: 68, cy: 58 }, { cx: 68, cy: 68 },
            { cx: 58, cy: 38 },
          ].map((dot, idx) => (
            <circle
              key={idx}
              cx={dot.cx} cy={dot.cy} r={5}
              fill="#f59e0b"
              style={{ animation: `ta-penta 1.8s ease-in-out ${idx * 0.12}s infinite` }}
            />
          ))}
        </svg>
      )

    case 'tapping':
      return (
        <svg viewBox="0 0 120 72" width="100%" height="68" style={{ display: 'block' }}>
          {bgLine}
          {/* Pick hand note (left) */}
          <circle cx="32" cy="44" r="7" fill="#f59e0b" opacity="0.5" />
          <text x="32" y="48" textAnchor="middle" fill="#000" fontSize="6" fontWeight="900">5</text>
          {/* Middle note */}
          <circle cx="64" cy="44" r="7" fill="#f59e0b" opacity="0.5" />
          <text x="64" y="48" textAnchor="middle" fill="#000" fontSize="6" fontWeight="900">8</text>
          {/* Tapping finger from right/top */}
          <g transform="translate(96,44)">
            <g style={{ animation: 'ta-hammer 1.3s ease-in-out 0.2s infinite' }}>
              <circle cx="0" cy="-20" r="8" fill="#0ea5e9" />
              <line x1="0" y1="-12" x2="0" y2="0" stroke="#0ea5e9" strokeWidth="2" />
            </g>
          </g>
          <text x="64" y="66" textAnchor="middle" fill="#525252" fontSize="8" fontFamily="monospace">T12p8p5</text>
        </svg>
      )

    case 'legato':
      return (
        <svg viewBox="0 0 120 72" width="100%" height="68" style={{ display: 'block' }}>
          {bgLine}
          {/* Three notes */}
          {[28, 56, 84].map((cx, i) => (
            <circle
              key={cx}
              cx={cx} cy={44} r={7}
              fill="#f59e0b"
              style={{ animation: `ta-penta 1.5s ease-in-out ${i * 0.4}s infinite` }}
            />
          ))}
          {[28, 56, 84].map((cx, i) => (
            <text key={cx} x={cx} y={48} textAnchor="middle" fill="#000" fontSize="6" fontWeight="900">
              {['5', '7', '8'][i]}
            </text>
          ))}
          {/* Slur curve */}
          <path
            d="M 28,34 Q 56,22 84,34"
            fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6"
          />
          <text x="56" y="66" textAnchor="middle" fill="#525252" fontSize="8" fontFamily="monospace">h  h</text>
        </svg>
      )

    default:
      return (
        <svg viewBox="0 0 120 72" width="100%" height="68" style={{ display: 'block' }}>
          {bgLine}
          <circle cx="60" cy="44" r="10" fill="#f59e0b" opacity="0.5" />
        </svg>
      )
  }
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────

function DifficultyBadge({ level }: { level: 'Beginner' | 'Intermediate' | 'Advanced' }) {
  const colors: Record<typeof level, { bg: string; text: string; border: string }> = {
    Beginner:     { bg: '#052e16', text: '#4ade80', border: '#166534' },
    Intermediate: { bg: '#1a1000', text: '#f59e0b', border: '#78350f' },
    Advanced:     { bg: '#2d0000', text: '#f87171', border: '#991b1b' },
  }
  const c = colors[level]
  return (
    <span
      style={{
        backgroundColor: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        borderRadius: 4,
        padding: '2px 8px',
        fontSize: '0.6875rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}
    >
      {level}
    </span>
  )
}

// ─── Main Client Component ────────────────────────────────────────────────────

interface TechniquesClientProps {
  techniques: Technique[]
}

export default function TechniquesClient({ techniques }: TechniquesClientProps) {
  const [filter, setFilter] = useState<DifficultyFilter>('All')
  const [expandedSlugs, setExpandedSlugs] = useState<Set<string>>(new Set())

  const filtered =
    filter === 'All' ? techniques : techniques.filter(t => t.difficulty === filter)

  const toggleExercises = (slug: string) => {
    setExpandedSlugs(prev => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const filterOptions: DifficultyFilter[] = ['All', 'Beginner', 'Intermediate', 'Advanced']

  return (
    <>
      {/* All animation keyframes in one block */}
      <style>{`
        @keyframes ta-pick {
          0%,100% { transform: translateY(-8px) rotate(-12deg); }
          50%      { transform: translateY(10px) rotate(12deg); }
        }
        @keyframes ta-hammer {
          0%,60%,100% { transform: translateY(-14px); }
          44%,56%     { transform: translateY(0); }
        }
        @keyframes ta-pull {
          0%,40%,100% { transform: translate(0, 0); }
          70%          { transform: translate(-6px, -14px); }
        }
        @keyframes ta-bend {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-18px); }
        }
        @keyframes ta-vibrato {
          from { transform: translateY(-4px); }
          to   { transform: translateY(4px); }
        }
        @keyframes ta-slide {
          0%,100% { transform: translateX(-28px); }
          50%      { transform: translateX(28px); }
        }
        @keyframes ta-pm {
          0%,100% { opacity: 0.4; }
          50%      { opacity: 0.85; }
        }
        @keyframes ta-penta {
          0%,100% { opacity: 0.25; }
          50%      { opacity: 1; }
        }
        .tech-card { transition: border-color 0.2s ease, transform 0.2s ease; }
        .tech-card:hover { border-color: rgba(245,158,11,0.4) !important; transform: translateY(-2px); }
      `}</style>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filterOptions.map(opt => {
          const isActive = filter === opt
          return (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              style={{
                backgroundColor: isActive ? '#f59e0b' : '#111111',
                color: isActive ? '#000' : '#a3a3a3',
                border: `1px solid ${isActive ? '#f59e0b' : '#262626'}`,
                borderRadius: 8,
                padding: '6px 16px',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 900 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {opt}
              {opt !== 'All' && (
                <span style={{ marginLeft: 6, opacity: 0.7, fontWeight: 400 }}>
                  ({techniques.filter(t => t.difficulty === opt).length})
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Technique count */}
      <p style={{ color: '#525252' }} className="text-xs mb-6 uppercase tracking-wider">
        Showing {filtered.length} technique{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-5">
        {filtered.map(technique => {
          const isExpanded = expandedSlugs.has(technique.slug)

          return (
            <article
              key={technique.slug}
              className="tech-card rounded-xl overflow-hidden"
              style={{
                backgroundColor: '#111111',
                border: '1px solid #262626',
              }}
            >
              {/* Card header */}
              <div style={{ borderBottom: '1px solid #1f1f1f' }} className="p-5 pb-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2
                    style={{ color: '#ffffff', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.06em' }}
                    className="text-2xl leading-tight"
                  >
                    {technique.name}
                  </h2>
                  <DifficultyBadge level={technique.difficulty} />
                </div>
                <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed">
                  {technique.description}
                </p>
              </div>

              {/* SVG Animation */}
              <div
                style={{ backgroundColor: '#0e0e0e', borderBottom: '1px solid #1f1f1f' }}
                className="px-4 py-3"
              >
                <TechniqueAnimation slug={technique.slug} />
              </div>

              {/* Tip */}
              <div
                style={{
                  backgroundColor: '#0e1200',
                  borderBottom: '1px solid #1f1f1f',
                  borderLeft: '3px solid #f59e0b',
                }}
                className="px-4 py-3"
              >
                <p style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-wider mb-1">
                  Key Tip
                </p>
                <p style={{ color: '#a3a3a3' }} className="text-xs leading-relaxed">
                  {technique.tip}
                </p>
              </div>

              {/* Tab example */}
              <div style={{ borderBottom: '1px solid #1f1f1f' }} className="px-5 py-4">
                <p style={{ color: '#525252' }} className="text-xs font-bold uppercase tracking-wider mb-2">
                  Tab
                </p>
                <pre
                  style={{
                    backgroundColor: '#0a0a0a',
                    border: '1px solid #1f1f1f',
                    borderRadius: 6,
                    padding: '10px 12px',
                    color: '#a3a3a3',
                    fontSize: '0.75rem',
                    lineHeight: 1.6,
                    margin: 0,
                    overflowX: 'auto',
                  }}
                >
                  {technique.tab}
                </pre>
              </div>

              {/* Footer row: first taught + exercises */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <Link
                    href={`/lesson/${technique.day}`}
                    style={{ color: '#f59e0b' }}
                    className="text-xs font-bold hover:opacity-80 transition-opacity"
                  >
                    First taught: Day {technique.day} →
                  </Link>

                  <button
                    onClick={() => toggleExercises(technique.slug)}
                    style={{
                      color: '#a3a3a3',
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    Exercises {isExpanded ? '▲' : '▼'}
                  </button>
                </div>

                {/* Collapsible exercises list */}
                {isExpanded && (
                  <ul
                    style={{ borderTop: '1px solid #1f1f1f', paddingTop: 10 }}
                    className="space-y-1.5"
                  >
                    {technique.exercises.map((ex, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span style={{ color: '#f59e0b', marginTop: 1 }} className="text-xs leading-none flex-shrink-0">
                          ›
                        </span>
                        <span style={{ color: '#a3a3a3' }} className="text-xs leading-snug">
                          {ex}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p style={{ color: '#f59e0b' }} className="text-3xl mb-3">🎸</p>
          <p style={{ color: '#a3a3a3' }} className="text-sm">No techniques found for this filter.</p>
        </div>
      )}
    </>
  )
}
