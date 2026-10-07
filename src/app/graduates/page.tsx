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

export default async function GraduatesPage() {
  const graduates = await prisma.profile.findMany({
    where: { soloCompleted: true },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { soloCompletedAt: 'desc' },
    take: 50,
  })

  const count = graduates.length

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      <style>{`
        .grad-card:hover {
          border-color: #f59e0b !important;
          transform: translateY(-2px);
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
              marginBottom: 12,
              background: 'linear-gradient(135deg, #ffffff 0%, #fde68a 40%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The Wall of First Solos
          </h1>

          {count > 0 && (
            <div style={{ marginBottom: 8 }}>
              <span
                className="count-anim"
                style={{
                  display: 'inline-block',
                  fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                  fontWeight: 900,
                  color: '#f59e0b',
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {count}
              </span>
              <p style={{ color: '#a3a3a3', fontSize: '1.1rem', marginBottom: 4 }}>
                {count === 1 ? 'graduate has' : 'graduates have'} played their first solo.
              </p>
            </div>
          )}

          <p style={{ color: '#525252', fontSize: '0.9rem', marginBottom: 8 }}>
            These guitarists completed all 30 days and earned their solo.
          </p>
          <p style={{ color: '#525252', fontSize: '0.95rem', maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Every one of them started where you are right now.
          </p>

          {/* Section divider */}
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)' }} />
        </div>
      </section>

      {/* GRADUATE GRID */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 16px 80px' }}>
        {count === 0 ? (
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
            {/* Masonry grid */}
            <div style={{ columns: '300px', columnGap: '1rem' }}>
              {graduates.map((grad) => {
                const name = grad.user?.name ?? grad.user?.email?.split('@')[0] ?? 'Anonymous'
                const initial = (grad.user?.name ?? grad.user?.email ?? '?')[0].toUpperCase()
                const badgeColor = styleBadgeColor(grad.soloStyle)
                const tabLine = firstTabLine(grad.customSolo)
                const gradDate = grad.soloCompletedAt
                  ? new Date(grad.soloCompletedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : null

                return (
                  <div key={grad.id} style={{ breakInside: 'avoid', marginBottom: '1rem' }}>
                    <div
                      className="grad-card"
                      style={{
                        backgroundColor: '#111111',
                        border: '1px solid #1f1f1f',
                        borderRadius: 12,
                        padding: '20px',
                        transition: 'border-color 0.2s, transform 0.2s',
                      }}
                    >
                      {/* Avatar circle with initials */}
                      <div style={{
                        width: 48, height: 48, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#000', fontWeight: 900, fontSize: '1.1rem',
                        marginBottom: 12,
                        flexShrink: 0,
                      }}>
                        {initial}
                      </div>

                      {/* Name */}
                      <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>{name}</p>

                      {/* Style badge */}
                      {grad.soloStyle && (
                        <span style={{
                          backgroundColor: `${badgeColor}1a`,
                          color: badgeColor,
                          border: `1px solid ${badgeColor}3d`,
                          borderRadius: 4,
                          padding: '2px 8px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          textTransform: 'uppercase' as const,
                          letterSpacing: '0.08em',
                          display: 'inline-block',
                          marginBottom: 4,
                        }}>
                          {grad.soloStyle}
                        </span>
                      )}

                      {/* Guitar hero */}
                      {grad.guitarHero && (
                        <p style={{ color: '#737373', fontSize: '0.75rem', marginTop: 4 }}>
                          Guitar hero: {grad.guitarHero}
                        </p>
                      )}

                      {/* Tab preview */}
                      {tabLine && (
                        <div style={{
                          borderLeft: '3px solid #f59e0b',
                          backgroundColor: '#0d0d0d',
                          borderRadius: '0 6px 6px 0',
                          padding: '7px 10px',
                          marginTop: 10,
                        }}>
                          <pre style={{
                            fontFamily: '"Courier New", Courier, monospace',
                            fontSize: 11, color: '#f59e0b', margin: 0,
                            whiteSpace: 'pre', overflow: 'hidden', lineHeight: 1.6,
                          }}>
                            {tabLine}
                          </pre>
                        </div>
                      )}

                      {/* Note */}
                      {grad.graduateNote && (
                        <p style={{ color: '#a3a3a3', fontSize: '0.8rem', marginTop: 8, lineHeight: 1.6, fontStyle: 'italic' }}>
                          &ldquo;{grad.graduateNote}&rdquo;
                        </p>
                      )}

                      {/* Completion date + link */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        <p style={{ color: '#404040', fontSize: '0.7rem' }}>{gradDate ?? ''}</p>
                        <Link
                          href={`/solo/${grad.userId}`}
                          style={{ color: '#f59e0b', fontSize: '0.72rem', fontWeight: 600, textDecoration: 'none' }}
                          className="hover:underline"
                        >
                          View Solo →
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
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

      {/* Submit Your Recording */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px 80px' }}>
        <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f', borderRadius: 16, padding: '40px 32px', marginTop: 48, textAlign: 'center', maxWidth: 600, margin: '48px auto 0' }}>
          <h2 style={{ color: '#ffffff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.05em', marginBottom: 8 }}>
            Share Your Solo
          </h2>
          <p style={{ color: '#737373', lineHeight: 1.7, marginBottom: 24 }}>
            Graduated? Post your recording on Instagram or YouTube and tag <strong style={{ color: '#f59e0b' }}>#FirstGuitarSolo</strong> — we feature graduates every week.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#1a1a1a', color: '#ffffff', border: '1px solid #262626', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
              Post on Instagram
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#1a1a1a', color: '#ffffff', border: '1px solid #262626', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
              Upload to YouTube
            </a>
            <a href="/solo-gallery" style={{ backgroundColor: '#f59e0b', color: '#000000', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
              View the Gallery →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
