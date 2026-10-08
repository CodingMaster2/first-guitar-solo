import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Changelog — First Guitar Solo',
  description:
    'Every update, improvement, and new feature added to First Guitar Solo. See the full history of the platform.',
  openGraph: {
    title: 'Changelog — First Guitar Solo',
    description: 'Every update and new feature added to First Guitar Solo, in order.',
    type: 'website',
  },
}

interface ChangelogEntry {
  date: string
  version: string
  title: string
  items: string[]
}

const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2025-10-07',
    version: '3.0',
    title: 'The Biggest Update Yet',
    items: [
      'Solo Forge — AI custom solo generator that builds a personalised blues-rock solo based on your preferences',
      'Interactive Fretboard Explorer — visualise any scale, chord, or interval across the full neck in real time',
      'Lesson comment threads — ask questions and leave notes directly on lesson pages',
      'Weekly Report Card — automated weekly summary of your practice time, licks reviewed, and streak',
      'Annual subscription option — save 40% by paying once per year',
      '300+ improvements across the platform including speed, accessibility, and mobile layout fixes',
    ],
  },
  {
    date: '2025-10-01',
    version: '2.0',
    title: 'Major Platform Overhaul',
    items: [
      'Built-in Metronome & Tuner — precision tools accessible from any lesson page',
      'Practice Room — dedicated focused practice mode with timer and session logging',
      'SEO Blog — guitar technique and learning articles to help students find the course',
      'Gift cards — buy a course access code as a gift for any guitarist',
      'Monthly subscription option — pay $5/month in addition to the existing one-time price',
      'Admin analytics upgrade — cohort analysis, revenue dashboards, and funnel tracking',
      'Email drip sequences — automated onboarding emails to guide new students through Day 1',
      'Service worker (offline) — practise with the app even without an internet connection',
    ],
  },
  {
    date: '2025-09-15',
    version: '1.5',
    title: 'Polish & Foundation',
    items: [
      'Guitar illustration on the landing page — original hand-drawn artwork of the course guitar',
      'App mockup preview — interactive screenshot of the dashboard on the landing page',
      'Trophy Room — achievements and badges to celebrate milestones in the course',
      'Daily Challenges — short, focused skill-building exercises delivered each morning',
      'StreakFlame — animated streak counter that pulses and celebrates consecutive practice days',
      'Glossary — plain-English definitions of every guitar technique and term used in the course',
      'Gear page — recommended guitar, amp, cables, and accessories for beginners',
    ],
  },
  {
    date: '2025-09-01',
    version: '1.0',
    title: 'Launch',
    items: [
      '30-day curriculum — the complete structured lesson plan from Day 1 to graduation',
      'AI Guitar Coach — unlimited questions answered by a guitar-specialist AI, available 24/7',
      'Spaced repetition review system — SM-2 algorithm automatically schedules lick reviews',
      'Progress tracking — practice calendar heatmap and daily completion logging',
      'Graduation certificate — shareable proof of completion for students who finish all 30 days',
    ],
  },
]

function VersionBadge({ version }: { version: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'rgba(245,158,11,0.12)',
        color: '#f59e0b',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: '0.375rem',
        padding: '2px 10px',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      v{version}
    </span>
  )
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ChangelogPage() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <p
            style={{
              color: '#f59e0b',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '0.625rem',
            }}
          >
            First Guitar Solo
          </p>
          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              lineHeight: 1.1,
              marginBottom: '0.75rem',
            }}
          >
            Changelog
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: 1.7, maxWidth: '460px' }}>
            {"Everything that's been added to First Guitar Solo — newest first."}
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div
            style={{
              position: 'absolute',
              left: '11px',
              top: '8px',
              bottom: '8px',
              width: '1px',
              background: 'linear-gradient(to bottom, #f59e0b, rgba(245,158,11,0.1))',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingLeft: '2.75rem' }}>
            {CHANGELOG.map((entry, i) => (
              <article key={entry.version} style={{ position: 'relative' }}>
                {/* Timeline dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-2.75rem',
                    top: '6px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: i === 0 ? '#f59e0b' : '#111111',
                    border: `2px solid ${i === 0 ? '#f59e0b' : '#262626'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                >
                  {i === 0 && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#000',
                      }}
                    />
                  )}
                </div>

                {/* Entry card */}
                <div
                  style={{
                    backgroundColor: '#111111',
                    border: `1px solid ${i === 0 ? 'rgba(245,158,11,0.25)' : '#1f1f1f'}`,
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card header */}
                  <div
                    style={{
                      padding: '1.125rem 1.375rem',
                      borderBottom: '1px solid #1a1a1a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <VersionBadge version={entry.version} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <h2
                          style={{
                            color: '#ffffff',
                            fontSize: '1rem',
                            fontWeight: 900,
                            margin: 0,
                            fontFamily: 'inherit',
                            letterSpacing: '0.01em',
                          }}
                        >
                          {entry.title}
                        </h2>
                        {i === 0 && (
                          <span
                            style={{
                              backgroundColor: 'rgba(245,158,11,0.15)',
                              color: '#f59e0b',
                              border: '1px solid rgba(245,158,11,0.3)',
                              borderRadius: 100,
                              padding: '0px 7px',
                              fontSize: '0.6rem',
                              fontWeight: 700,
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                            }}
                          >
                            Latest
                          </span>
                        )}
                      </div>
                      <p style={{ color: '#525252', fontSize: '0.75rem', margin: '2px 0 0' }}>
                        {formatDate(entry.date)}
                      </p>
                    </div>
                  </div>

                  {/* Item list */}
                  <ul
                    style={{
                      margin: 0,
                      padding: '1rem 1.375rem',
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {entry.items.map((item) => {
                      const [name, ...rest] = item.split(' — ')
                      const detail = rest.join(' — ')
                      return (
                        <li key={item} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                          <span
                            style={{
                              color: '#f59e0b',
                              fontWeight: 900,
                              flexShrink: 0,
                              marginTop: '2px',
                              fontSize: '0.75rem',
                            }}
                          >
                            +
                          </span>
                          <span style={{ color: '#d4d4d4', fontSize: '0.875rem', lineHeight: 1.55 }}>
                            {detail ? (
                              <>
                                <strong style={{ color: '#ffffff', fontWeight: 600 }}>{name}</strong>
                                {' — '}
                                {detail}
                              </>
                            ) : (
                              name
                            )}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Foundation note */}
        <div
          style={{
            marginTop: '3rem',
            paddingLeft: '2.75rem',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '7px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#262626',
              border: '1px solid #333',
            }}
          />
          <p style={{ color: '#525252', fontSize: '0.8rem', fontStyle: 'italic' }}>
            First Guitar Solo was built by Zachary Lee at Sixth String Labs. Every feature on this page was
            designed to help one kind of person: someone who wants to play a complete guitar solo for the first time.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
