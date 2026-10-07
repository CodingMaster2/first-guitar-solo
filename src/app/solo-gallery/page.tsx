import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'The Solo Gallery — First Guitar Solo',
  description:
    'Real students, real solos. Every one of these people was a beginner.',
}

const genericQuotes = [
  'I never thought I could play a solo. Now I can.',
  '30 days changed everything about how I see the guitar.',
  "My fingers couldn't keep up at first. Day 30 was magic.",
  'I used to just strum chords. Now I\'m a lead guitarist.',
  'The structure kept me going when motivation dipped.',
  'Best $25 I ever spent on music education.',
  'I cried when I played through the full solo for the first time.',
  'My bandmates couldn\'t believe the progress.',
]

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export default async function SoloGalleryPage() {
  const graduates = await prisma.user.findMany({
    where: { profile: { soloCompleted: true } },
    include: { profile: true },
    orderBy: { profile: { soloCompletedAt: 'desc' } },
    take: 50,
  })

  const count = graduates.length

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .gallery-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .gallery-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(245,158,11,0.1);
          border-color: #262626 !important;
        }
      `}</style>

      <Navbar />

      {/* Page header */}
      <section
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 60%), #0a0a0a',
          borderBottom: '1px solid #1f1f1f',
          padding: '80px 16px 48px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🎸</div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
              fontSize: 'clamp(2.5rem, 7vw, 4rem)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#ffffff',
              marginBottom: 12,
              lineHeight: 1.05,
            }}
          >
            The Solo Gallery
          </h1>
          <p
            style={{
              color: '#a3a3a3',
              fontSize: '1.1rem',
              lineHeight: 1.7,
              maxWidth: 480,
              margin: '0 auto 24px',
            }}
          >
            Real students, real solos. Every one of these people was a beginner.
          </p>

          {/* Stats banner */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              backgroundColor: '#111111',
              border: '1px solid #1f1f1f',
              borderRadius: 40,
              padding: '10px 24px',
            }}
          >
            <span style={{ color: '#f59e0b', fontWeight: 900, fontSize: '1.5rem' }}>{count}</span>
            <span style={{ color: '#737373', fontSize: '0.9rem' }}>
              {count === 1 ? 'guitarist has' : 'guitarists have'} completed the 30-day program
            </span>
          </div>
        </div>
      </section>

      {/* Gallery grid */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 16px 80px' }}>
        {count === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 16px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 20 }}>🎸</div>
            <p style={{ color: '#737373', marginBottom: 24, fontSize: '1rem' }}>
              No graduates yet. Be the first.
            </p>
            <Link
              href="/register"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000000',
                padding: '12px 28px',
                borderRadius: 8,
                fontWeight: 900,
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Start the 30-Day Program →
            </Link>
          </div>
        ) : (
          <div style={{ columns: '280px', columnGap: '1rem' }}>
            {graduates.map((grad, index) => {
              const name = grad.name ?? grad.email.split('@')[0]
              const initials = getInitials(grad.name)
              const completionDate = grad.profile?.soloCompletedAt
                ? new Date(grad.profile.soloCompletedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : null
              const quote =
                grad.profile?.graduateNote ?? genericQuotes[index % genericQuotes.length]

              return (
                <div key={grad.id} style={{ breakInside: 'avoid', marginBottom: '1rem' }}>
                  <div
                    className="gallery-card"
                    style={{
                      backgroundColor: '#111111',
                      border: '1px solid #1f1f1f',
                      borderRadius: 12,
                      padding: 20,
                    }}
                  >
                    {/* Avatar circle */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000000',
                        fontWeight: 900,
                        fontSize: '1rem',
                        marginBottom: 12,
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>

                    {/* Name */}
                    <p
                      style={{
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        marginBottom: 4,
                      }}
                    >
                      {name}
                    </p>

                    {/* Completion date */}
                    {completionDate && (
                      <p style={{ color: '#737373', fontSize: '0.75rem', marginBottom: 8 }}>
                        completed Day 30 on {completionDate}
                      </p>
                    )}

                    {/* Guitar hero */}
                    {grad.profile?.guitarHero && (
                      <p style={{ color: '#525252', fontSize: '0.75rem', marginBottom: 8 }}>
                        Guitar hero:{' '}
                        <span style={{ color: '#a3a3a3' }}>{grad.profile.guitarHero}</span>
                      </p>
                    )}

                    {/* Quote */}
                    <p
                      style={{
                        color: '#737373',
                        fontSize: '0.8rem',
                        lineHeight: 1.6,
                        fontStyle: 'italic',
                        marginTop: 8,
                      }}
                    >
                      &ldquo;{quote}&rdquo;
                    </p>

                    {/* Link to solo */}
                    <div
                      style={{
                        marginTop: 12,
                        paddingTop: 10,
                        borderTop: '1px solid #1a1a1a',
                      }}
                    >
                      <Link
                        href={`/solo/${grad.id}`}
                        style={{
                          color: '#f59e0b',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        View Solo →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 64,
            paddingTop: 48,
            borderTop: '1px solid #1f1f1f',
          }}
        >
          <p style={{ color: '#737373', fontSize: '0.95rem', marginBottom: 8 }}>
            Your solo belongs here.
          </p>
          <Link
            href="/register"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000000',
              padding: '14px 32px',
              borderRadius: 8,
              fontWeight: 900,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Start the 30-day program →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
