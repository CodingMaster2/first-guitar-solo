'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface YearStats {
  year: number
  daysPracticed: number
  totalPracticeHours: number
  lessonsCompleted: number
  longestStreak: number
  xpEarned: number
  achievementsUnlocked: number
  userName: string | null | undefined
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target === 0) return
    let start: number | null = null
    const duration = 1800

    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target])

  return (
    <span>
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

const STAT_CARDS = (stats: YearStats) => [
  {
    label: 'Days Practiced',
    value: stats.daysPracticed,
    suffix: '',
    color: '#f59e0b',
    icon: '📅',
    context: 'of consistent commitment',
  },
  {
    label: 'Hours Playing',
    value: stats.totalPracticeHours,
    suffix: 'h',
    color: '#fde68a',
    icon: '⏱',
    context: 'of focused practice time',
  },
  {
    label: 'Lessons Completed',
    value: stats.lessonsCompleted,
    suffix: '',
    color: '#f59e0b',
    icon: '🎸',
    context: 'lessons down, solo earned',
  },
  {
    label: 'Longest Streak',
    value: stats.longestStreak,
    suffix: ' days',
    color: '#fde68a',
    icon: '🔥',
    context: 'of consecutive practice',
  },
  {
    label: 'Total XP',
    value: stats.xpEarned,
    suffix: '',
    color: '#f59e0b',
    icon: '⭐',
    context: 'experience points earned',
  },
  {
    label: 'Achievements',
    value: stats.achievementsUnlocked,
    suffix: '',
    color: '#fde68a',
    icon: '🏆',
    context: 'milestones unlocked',
  },
]

export default function YearReviewClient({ stats }: { stats: YearStats }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Small delay for entry animation
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const firstName = stats.userName?.split(' ')[0] ?? 'Guitarist'
  const shareText = encodeURIComponent(
    `I spent ${stats.totalPracticeHours} hours learning guitar in ${stats.year} — ${stats.lessonsCompleted} lessons, ${stats.daysPracticed} days practiced, ${stats.longestStreak}-day streak. First Guitar Solo by @SixthStringLabs`
  )
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      <style>{`
        @keyframes goldShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .year-review-headline {
          background: linear-gradient(135deg, #fde68a 0%, #f59e0b 40%, #fbbf24 70%, #fde68a 100%);
          background-size: 200% 200%;
          animation: goldShimmer 4s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Hero */}
      <section
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 60%), #0a0a0a',
          borderBottom: '1px solid rgba(245,158,11,0.15)',
          padding: '80px 16px 64px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#1a1000',
              border: '1px solid rgba(245,158,11,0.4)',
              borderRadius: 9999,
              padding: '4px 16px',
              fontSize: '0.72rem',
              fontWeight: 900,
              color: '#f59e0b',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: 24,
            }}
          >
            Year in Review
          </div>
          <h1
            className="year-review-headline"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              lineHeight: 1,
              marginBottom: 16,
            }}
          >
            Your {stats.year}<br />Guitar Journey
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '1.1rem', marginBottom: 8 }}>
            {firstName}, you showed up. Here&apos;s what you built this year.
          </p>
          {stats.totalPracticeHours > 0 && (
            <p
              style={{
                color: '#fde68a',
                fontSize: '0.9rem',
                fontStyle: 'italic',
                marginTop: 12,
                maxWidth: 480,
                margin: '12px auto 0',
                lineHeight: 1.6,
              }}
            >
              You spent <strong>{stats.totalPracticeHours} hours</strong> learning guitar this year.
              That&apos;s more than most people ever practice in their lifetime.
            </p>
          )}
        </div>
      </section>

      {/* Stats grid */}
      <section style={{ padding: '64px 16px', maxWidth: 900, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 20,
          }}
        >
          {STAT_CARDS(stats).map((card, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#111111',
                border: '1px solid #1f1f1f',
                borderTop: `3px solid ${card.color}`,
                borderRadius: 12,
                padding: '28px 24px',
                textAlign: 'center',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
              }}
              role="region"
              aria-label={card.label}
            >
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{card.icon}</div>
              <div
                style={{
                  fontSize: 'clamp(2rem, 6vw, 3rem)',
                  fontWeight: 900,
                  color: card.color,
                  lineHeight: 1,
                  marginBottom: 8,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <AnimatedCounter target={card.value} suffix={card.suffix} />
              </div>
              <p
                style={{
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 4,
                }}
              >
                {card.label}
              </p>
              <p style={{ color: '#525252', fontSize: '0.75rem' }}>{card.context}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Share section */}
      <section
        style={{
          borderTop: '1px solid #1f1f1f',
          padding: '48px 16px',
          textAlign: 'center',
          backgroundColor: '#111111',
        }}
      >
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h2
            style={{
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.5rem',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Share Your Stats
          </h2>
          <p style={{ color: '#a3a3a3', fontSize: '0.9rem', marginBottom: 24 }}>
            Let the world know you put in the work.
          </p>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share your stats on Twitter/X"
            style={{
              display: 'inline-block',
              backgroundColor: '#000',
              border: '1px solid #333',
              color: '#ffffff',
              borderRadius: 9999,
              padding: '12px 28px',
              fontSize: '0.875rem',
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: 16,
              transition: 'background 0.15s ease',
            }}
          >
            Share on X (Twitter) &#8599;
          </a>
          <p style={{ color: '#525252', fontSize: '0.75rem' }}>
            Opens in a new tab with your stats pre-filled.
          </p>
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #1f1f1f' }}>
            <Link
              href="/dashboard"
              style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: 700 }}
            >
              &larr; Back to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
