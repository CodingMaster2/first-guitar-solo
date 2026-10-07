'use client'

import { useState } from 'react'

const WEEKS = [
  {
    label: 'Week 1',
    title: 'Lead Guitar Foundations',
    lessons: [
      'Single-note picking & alternate picking fundamentals',
      'Hammer-ons and pull-offs in context',
      'Slides and position shifts',
      'Building pick speed with a metronome',
    ],
  },
  {
    label: 'Week 2',
    title: 'Sounding Like a Lead Guitarist',
    lessons: [
      'Minor pentatonic scale — two positions',
      'Creating melodic phrases (not just scales)',
      'String bending in tune',
      'Vibrato and legato phrasing',
    ],
  },
  {
    label: 'Week 3',
    title: 'Learn the Solo',
    lessons: [
      'Full solo overview — hear it, understand it',
      'Section 1: The Opening melody',
      'Section 2: The Build — intensity and rhythm',
      'Connecting sections at tempo',
    ],
  },
  {
    label: 'Week 4',
    title: 'Performance',
    lessons: [
      'Section 3: The Peak — expressive bends and vibrato',
      'Section 4: The Resolution',
      'Full solo run-throughs with backing track',
      'Performance day — Day 30',
    ],
  },
]

export default function CurriculumAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section
      id="the-solo"
      style={{
        backgroundColor: '#111111',
        borderTop: '1px solid #1f1f1f',
        borderBottom: '1px solid #1f1f1f',
      }}
      className="py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        <p
          style={{ color: '#f59e0b' }}
          className="text-xs font-bold uppercase tracking-widest mb-3"
        >
          THE CURRICULUM
        </p>
        <h2
          style={{
            color: '#ffffff',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
          }}
        >
          30 days. Every detail planned.
        </h2>
        <p style={{ color: '#a3a3a3', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
          30 lessons · 15–20 min each · ~8 hours total
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {WEEKS.map((week, i) => {
            const isOpen = openIdx === i
            return (
              <div
                key={i}
                style={{
                  backgroundColor: '#0a0a0a',
                  border: isOpen ? '1px solid #262626' : '1px solid #1a1a1a',
                  borderLeft: isOpen ? '3px solid #f59e0b' : '3px solid transparent',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full text-left"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  aria-expanded={isOpen}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        color: '#f59e0b',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        flexShrink: 0,
                      }}
                    >
                      {week.label}
                    </span>
                    <span
                      style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9375rem' }}
                    >
                      {week.title}
                    </span>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    style={{
                      color: '#f59e0b',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      flexShrink: 0,
                    }}
                  >
                    <path
                      d="M5 7.5l5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div
                    style={{
                      borderTop: '1px solid #1f1f1f',
                      padding: '1.25rem 1.5rem',
                    }}
                  >
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {week.lessons.map((lesson, j) => (
                        <li
                          key={j}
                          style={{
                            color: '#a3a3a3',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.625rem',
                            lineHeight: 1.6,
                          }}
                        >
                          <span
                            style={{ color: '#f59e0b', flexShrink: 0, marginTop: '0.125rem' }}
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
