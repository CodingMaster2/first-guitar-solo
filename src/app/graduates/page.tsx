import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Graduate Wall — First Guitar Solo',
  description: 'Real students who completed First Guitar Solo and played their first solo in 30 days.',
}

function styleBadgeColor(style: string | null | undefined): string {
  if (!style) return '#f59e0b'
  const s = style.toLowerCase()
  if (s.includes('blues')) return '#3b82f6'
  if (s.includes('rock')) return '#ef4444'
  if (s.includes('metal')) return '#a855f7'
  if (s.includes('country')) return '#f97316'
  if (s.includes('folk')) return '#22c55e'
  return '#f59e0b'
}

function firstTabLine(solo: string | null | undefined): string | null {
  if (!solo) return null
  const lines = solo.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('e|') || trimmed.startsWith('e ')) {
      return trimmed.length > 42 ? trimmed.slice(0, 42) + '…' : trimmed
    }
  }
  const first = lines.find((l) => l.trim().length > 0)
  if (!first) return null
  const t = first.trim()
  return t.length > 42 ? t.slice(0, 42) + '…' : t
}

function GraduateCard({ g }: {
  g: {
    id: string
    userId: string
    soloStyle: string | null
    guitarHero: string | null
    customSolo: string | null
    graduateNote: string | null
    soloCompletedAt: Date | null
    user: { id: string; name: string | null } | null
  }
}) {
  const name = g.user?.name ?? 'Anonymous'
  const badgeColor = styleBadgeColor(g.soloStyle)
  const tabLine = firstTabLine(g.customSolo)
  const gradDate = g.soloCompletedAt
    ? new Date(g.soloCompletedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div
      style={{
        backgroundColor: '#0d0d0d',
        border: '1px solid #1f1f1f',
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="grad-card"
    >
      {/* Header */}
      <div style={{ padding: '16px 16px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: '1.2rem', lineHeight: 1, flexShrink: 0, marginTop: 2 }}>🎸</span>
          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }} className="truncate">{name}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
          {g.soloStyle && (
            <span
              style={{
                backgroundColor: `${badgeColor}1a`,
                color: badgeColor,
                border: `1px solid ${badgeColor}3d`,
                borderRadius: 4,
                padding: '2px 8px',
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {g.soloStyle}
            </span>
          )}
          {g.guitarHero && (
            <span style={{ color: '#525252', fontSize: '0.72rem' }}>{g.guitarHero}</span>
          )}
        </div>
      </div>

      {/* Tab preview */}
      {tabLine && (
        <div
          style={{
            borderLeft: '4px solid #f59e0b',
            margin: '0 14px 10px',
            backgroundColor: '#111111',
            borderRadius: '0 6px 6px 0',
            padding: '8px 10px',
          }}
        >
          <pre
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 11,
              color: '#f59e0b',
              margin: 0,
              whiteSpace: 'pre',
              overflow: 'hidden',
              lineHeight: 1.6,
            }}
          >
            {tabLine}
          </pre>
        </div>
      )}

      {/* Note */}
      {g.graduateNote && (
        <div style={{ padding: '0 14px 6px', flex: 1 }}>
          <p style={{ color: '#737373', fontSize: '0.72rem', fontStyle: 'italic', lineHeight: 1.4 }} className="line-clamp-2">
            &ldquo;{g.graduateNote}&rdquo;
          </p>
        </div>
      )}

      {/* Footer */}
      {gradDate && (
        <div style={{ padding: '8px 14px 14px', marginTop: 'auto', textAlign: 'right' }}>
          <Link
            href={`/solo/${g.userId}`}
            style={{ color: '#f59e0b', fontSize: '0.72rem', fontWeight: 600, textDecoration: 'none' }}
            className="hover:underline"
          >
            Graduated {gradDate} →
          </Link>
        </div>
      )}
    </div>
  )
}

export default async function GraduatesPage() {
  const graduates = await prisma.profile.findMany({
    where: { soloCompleted: true },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { soloCompletedAt: 'desc' },
    take: 50,
  })

  const count = graduates.length

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      <style>{`
        .grad-card:hover {
          transform: translateY(-2px);
          border-color: #f59e0b !important;
          box-shadow: 0 8px 32px rgba(245,158,11,0.08);
        }
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        .count-anim { animation: countUp 0.6s ease forwards; }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.09) 0%, transparent 60%), #0a0a0a',
          borderBottom: '1px solid #1f1f1f',
          padding: '80px 16px 60px',
          textAlign: 'center',
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🎸</div>
          <h1
            style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              marginBottom: 20,
              background: 'linear-gradient(135deg, #ffffff 0%, #fde68a 40%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The Wall of First Solos
          </h1>

          {count > 0 ? (
            <div style={{ marginBottom: 16 }}>
              <span
                className="count-anim"
                style={{
                  display: 'inline-block',
                  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                  fontWeight: 900,
                  color: '#f59e0b',
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {count}
              </span>
              <p style={{ color: '#a3a3a3', fontSize: '1.1rem', marginBottom: 4 }}>
                {count === 1 ? 'graduate has' : 'graduates have'} played their first solo.
              </p>
            </div>
          ) : null}

          <p style={{ color: '#525252', fontSize: '0.95rem', maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Every one of them started where you are right now.
          </p>

          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)', marginBottom: 28 }} />
        </div>
      </section>

      {/* GRADUATE GRID */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 16px 80px' }}>
        {count === 0 ? (
          /* EMPTY STATE */
          <div style={{ textAlign: 'center', padding: '60px 16px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 20 }}>🎸</div>
            <h2 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 12 }}>
              No graduates yet — be the first.
            </h2>
            <p style={{ color: '#737373', fontSize: '0.95rem', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
              Complete the 30-day course to join the Wall.
            </p>
            <Link
              href="/#pricing"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000000',
                padding: '14px 32px',
                borderRadius: 8,
                fontWeight: 900,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'inline-block',
                textDecoration: 'none',
              }}
            >
              Start the Program — $25
            </Link>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 20,
              }}
            >
              {graduates.map((g) => (
                <GraduateCard key={g.id} g={g} />
              ))}
            </div>

            {/* Bottom CTA */}
            <div style={{ textAlign: 'center', marginTop: 64, paddingTop: 48, borderTop: '1px solid #1f1f1f' }}>
              <p style={{ color: '#737373', fontSize: '0.9rem', marginBottom: 20 }}>
                Want your name on this wall?
              </p>
              <Link
                href="/#pricing"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000000',
                  padding: '14px 32px',
                  borderRadius: 8,
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'inline-block',
                  textDecoration: 'none',
                }}
              >
                Start Learning — $25
              </Link>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
