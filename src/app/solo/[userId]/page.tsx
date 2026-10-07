import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SoloShareButtons from '@/components/SoloShareButtons'
import { prisma } from '@/lib/prisma'

// notFound is imported but used conditionally — keep the import for correctness
void notFound

interface Props {
  params: Promise<{ userId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { user: { select: { name: true } } },
  })

  if (!profile || !profile.soloCompleted) {
    return { title: 'Solo Not Found — First Guitar Solo' }
  }

  const name = profile.user?.name ?? 'A guitarist'
  const style = profile.soloStyle ?? 'original'
  const hero = profile.guitarHero

  return {
    title: `${name}'s First Guitar Solo`,
    description: `${name} played their first ${style} guitar solo in 30 days.${hero ? ` Inspired by ${hero}.` : ''}`,
    openGraph: {
      title: `${name}'s First Guitar Solo 🎸`,
      description: `${name} played their first ${style} guitar solo in 30 days.${hero ? ` Inspired by ${hero}.` : ''}`,
    },
  }
}

/** Detect techniques used in a tab string */
function detectTechniques(solo: string | null): string[] {
  if (!solo) return []
  const techniques: string[] = []
  if (/h\d/.test(solo)) techniques.push('Hammer-ons')
  if (/p\d/.test(solo)) techniques.push('Pull-offs')
  if (/[bB]\d/.test(solo)) techniques.push('String Bends')
  if (/~/.test(solo)) techniques.push('Vibrato')
  if (/[/\\]/.test(solo)) techniques.push('Slides')
  return techniques
}

/** Render a tab line: string name in amber, content in white */
function TabLine({ line }: { line: string }) {
  const match = line.match(/^([eBGDAE])\|(.*)$/)
  if (match) {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span style={{ color: '#f59e0b', fontFamily: '"Courier New", Courier, monospace', fontSize: 'inherit', userSelect: 'none', minWidth: '1.4ch' }}>
          {match[1]}
        </span>
        <span style={{ color: '#d4d4d4', fontFamily: '"Courier New", Courier, monospace', fontSize: 'inherit' }}>
          |{match[2]}
        </span>
      </div>
    )
  }
  return (
    <div style={{ color: '#525252', fontFamily: '"Courier New", Courier, monospace', fontSize: 'inherit' }}>
      {line}
    </div>
  )
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

export default async function SoloPage({ params }: Props) {
  const { userId } = await params

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { user: { select: { name: true } } },
  })

  if (!profile || !profile.soloCompleted) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 20 }}>🎸</div>
          <h1 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 12 }}>
            This solo isn&apos;t public yet.
          </h1>
          <p style={{ color: '#737373', marginBottom: 32 }}>
            The student who owns this page hasn&apos;t completed the program yet — or their solo isn&apos;t listed publicly.
          </p>
          <Link
            href="/graduates"
            style={{ color: '#f59e0b', border: '1px solid #f59e0b', padding: '10px 24px', borderRadius: 8, fontWeight: 700, fontSize: '0.85rem' }}
            className="hover:opacity-80 transition-opacity"
          >
            View Graduate Wall →
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const name = profile.user?.name ?? 'Anonymous'
  const badgeColor = styleBadgeColor(profile.soloStyle)
  const techniques = detectTechniques(profile.customSolo)
  const gradDate = profile.soloCompletedAt
    ? new Date(profile.soloCompletedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  const tabLines = profile.customSolo ? profile.customSolo.split('\n') : []

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @media (max-width: 640px) {
          .tab-scroll { overflow-x: auto; }
          .tab-content { min-width: 600px; }
        }
      `}</style>

      <Navbar />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '60px 16px 80px' }}>
        {/* Outer glow wrapper */}
        <div style={{ position: 'relative' }}>
          {/* Amber radial glow */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600, height: 400,
            background: 'radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          {/* Certificate frame */}
          <div
            style={{
              border: '2px solid #f59e0b',
              borderRadius: 16,
              padding: 'clamp(24px, 5vw, 48px)',
              position: 'relative',
              background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)',
              boxShadow: '0 0 60px rgba(245,158,11,0.1), inset 0 0 60px rgba(245,158,11,0.02)',
              zIndex: 1,
            }}
          >
            {/* Corner accents */}
            <div style={{ position: 'absolute', top: -2, left: -2, width: 20, height: 20, borderTop: '3px solid #fde68a', borderLeft: '3px solid #fde68a', borderTopLeftRadius: 16 }} />
            <div style={{ position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderTop: '3px solid #fde68a', borderRight: '3px solid #fde68a', borderTopRightRadius: 16 }} />
            <div style={{ position: 'absolute', bottom: -2, left: -2, width: 20, height: 20, borderBottom: '3px solid #fde68a', borderLeft: '3px solid #fde68a', borderBottomLeftRadius: 16 }} />
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderBottom: '3px solid #fde68a', borderRight: '3px solid #fde68a', borderBottomRightRadius: 16 }} />

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <p style={{
                color: '#f59e0b',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}>
                Certificate of Completion
              </p>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🎸</div>
              <p style={{ color: '#404040', fontFamily: '"Courier New", Courier, monospace', fontSize: '0.65rem', letterSpacing: '0.15em' }}>
                First Guitar Solo · Sixth String Labs
              </p>
              {/* Amber underline */}
              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)', margin: '16px auto', maxWidth: 300 }} />
            </div>

            {/* Graduate info */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <p style={{ color: '#737373', fontSize: '0.8rem', marginBottom: 10, letterSpacing: '0.05em' }}>This certifies that</p>
              <h2
                style={{
                  fontFamily: '"Bebas Neue", "Arial Black", sans-serif',
                  fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                  fontWeight: 400,
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                  marginBottom: 16,
                  lineHeight: 1,
                }}
              >
                {name}
              </h2>
              <p style={{ color: '#a3a3a3', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 16, maxWidth: 480, margin: '0 auto 16px' }}>
                has completed the 30-day First Guitar Solo program
                and earned their personalized solo
              </p>
              {/* Style + vibe badges */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
                {profile.soloStyle && (
                  <span style={{
                    backgroundColor: `${badgeColor}1a`,
                    color: badgeColor,
                    border: `1px solid ${badgeColor}3d`,
                    borderRadius: 4, padding: '4px 12px',
                    fontSize: '0.75rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>
                    {profile.soloStyle}
                  </span>
                )}
                {profile.guitarHero && (
                  <span style={{
                    backgroundColor: '#1a1a1a',
                    color: '#f59e0b',
                    border: '1px solid #262626',
                    borderRadius: 4, padding: '4px 12px',
                    fontSize: '0.75rem', fontWeight: 600,
                  }}>
                    inspired by {profile.guitarHero}
                  </span>
                )}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #262626, transparent)', margin: '0 0 28px' }} />

            {/* The solo tab */}
            {tabLines.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <p style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: '0.65rem', letterSpacing: '0.2em',
                  color: '#525252', textAlign: 'center',
                  marginBottom: 16, textTransform: 'uppercase',
                }}>
                  The Solo
                </p>
                <div className="tab-scroll">
                  <div
                    className="tab-content"
                    style={{
                      backgroundColor: '#0d0d0d',
                      border: '1px solid #1f1f1f',
                      borderRadius: 8, padding: '20px',
                      lineHeight: 1.8,
                      fontSize: 'clamp(12px, 1.5vw, 14px)',
                    }}
                  >
                    {tabLines.map((line, i) => (
                      <TabLine key={i} line={line} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Graduate note */}
            {profile.graduateNote && (
              <div style={{ margin: '0 0 24px', padding: '16px 20px', borderLeft: '3px solid #f59e0b', backgroundColor: '#0d0d0d', borderRadius: '0 8px 8px 0' }}>
                <p style={{ color: '#a3a3a3', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
                  &ldquo;{profile.graduateNote}&rdquo;
                </p>
              </div>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #262626, transparent)', margin: '0 0 24px' }} />

            {/* Signature line */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#737373', fontFamily: '"Courier New", Courier, monospace', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: 6 }}>
                Sixth String Labs{gradDate ? ` — ${gradDate}` : ''}
              </p>
              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #f59e0b55, transparent)', maxWidth: 200, margin: '0 auto' }} />
            </div>
          </div>
        </div>

        {/* Techniques */}
        {techniques.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <p style={{ color: '#737373', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
              Techniques in this solo:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {techniques.map((t) => (
                <span
                  key={t}
                  style={{
                    backgroundColor: '#1a1a1a', color: '#d4d4d4',
                    border: '1px solid #262626', borderRadius: 6,
                    padding: '5px 12px', fontSize: '0.8rem', fontWeight: 600,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share buttons */}
        <div style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid #1f1f1f' }}>
          <p style={{ color: '#737373', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>
            Share this solo:
          </p>
          <SoloShareButtons
            userId={userId}
            name={name}
            style={profile.soloStyle}
            guitarHero={profile.guitarHero}
            soloText={profile.customSolo}
            soloCompletedAt={profile.soloCompletedAt ? profile.soloCompletedAt.toISOString() : null}
          />

          {/* LinkedIn + Twitter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            <a
              href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=First+Guitar+Solo&organizationId=&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth()+1}&certUrl=${encodeURIComponent(`https://firstguitarsolo.com/solo/${userId}`)}&certId=${userId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#0077b5', color: '#ffffff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', marginTop: 16 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              Add to LinkedIn Profile
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just completed my first guitar solo! 🎸 30 days of practice paid off. #guitar #firstguitarsolo`)}&url=${encodeURIComponent(`https://firstguitarsolo.com/solo/${userId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#000000', color: '#ffffff', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', marginTop: 16, marginLeft: 8 }}
            >
              Share on X
            </a>
          </div>

          <a href="/solo-gallery" style={{ color: '#737373', fontSize: '0.8rem', display: 'block', textAlign: 'center', marginTop: 12 }}>
            See all graduates →
          </a>
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 48,
            backgroundColor: '#111111',
            border: '1px solid #1f1f1f',
            borderRadius: 12, padding: '28px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 10 }}>
            Want to play YOUR first guitar solo?
          </h3>
          <p style={{ color: '#737373', fontSize: '0.875rem', marginBottom: 20 }}>
            30-day structured program. $25 one-time. Your own solo in 30 days.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link
              href="/register"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000000', padding: '12px 28px', borderRadius: 8,
                fontWeight: 900, fontSize: '0.9rem', textTransform: 'uppercase',
                letterSpacing: '0.08em', textDecoration: 'none', display: 'inline-block',
              }}
            >
              Start Free / $25 Lifetime Access
            </Link>
            <Link
              href="/graduates"
              style={{
                backgroundColor: '#1a1a1a', color: '#f59e0b',
                border: '1px solid #f59e0b', padding: '12px 24px', borderRadius: 8,
                fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'inline-block',
              }}
            >
              See All Graduates →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
