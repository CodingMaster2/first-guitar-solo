import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SoloShareButtons from '@/components/SoloShareButtons'
import { prisma } from '@/lib/prisma'

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

const Hr = () => (
  <div style={{
    color: '#f59e0b',
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: '0.7rem',
    letterSpacing: '0.05em',
    textAlign: 'center',
    opacity: 0.5,
    margin: '20px 0',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  }}>
    {'━'.repeat(60)}
  </div>
)

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

  // Parse tab lines
  const tabLines = profile.customSolo
    ? profile.customSolo.split('\n')
    : []

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      <style>{`
        @media (max-width: 640px) {
          .tab-scroll { overflow-x: auto; }
          .tab-content { min-width: 600px; }
        }
      `}</style>

      <Navbar />

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '60px 16px 80px' }}>
        {/* Certificate container */}
        <div
          style={{
            backgroundColor: '#0d0d0d',
            border: '1px solid #1f1f1f',
            borderRadius: 16,
            padding: 'clamp(24px, 5vw, 52px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Amber top accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, #d97706, #f59e0b, #fde68a, #f59e0b, #d97706)' }} />

          {/* Certificate header */}
          <div style={{ textAlign: 'center', marginBottom: 8, marginTop: 8 }}>
            <Hr />
            <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>🎸</div>
            <h1
              style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 'clamp(1rem, 3vw, 1.4rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#f59e0b',
                marginBottom: 4,
              }}
            >
              First Guitar Solo
            </h1>
            <p style={{ color: '#525252', fontFamily: '"Courier New", Courier, monospace', fontSize: '0.7rem', letterSpacing: '0.15em' }}>
              CERTIFICATE OF COMPLETION
            </p>
            <Hr />
          </div>

          {/* Graduate info */}
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <p style={{ color: '#737373', fontSize: '0.85rem', marginBottom: 8 }}>This certifies that</p>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                marginBottom: 12,
                lineHeight: 1.1,
              }}
            >
              {name}
            </h2>
            <p style={{ color: '#a3a3a3', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 16 }}>
              composed and performed their first guitar solo
              {profile.soloStyle && (
                <>
                  {' '}in the style of{' '}
                  <span
                    style={{
                      backgroundColor: `${badgeColor}1a`,
                      color: badgeColor,
                      border: `1px solid ${badgeColor}3d`,
                      borderRadius: 4,
                      padding: '1px 8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    {profile.soloStyle}
                  </span>
                </>
              )}
              {profile.guitarHero && (
                <>, inspired by <span style={{ color: '#f59e0b', fontWeight: 600 }}>{profile.guitarHero}</span></>
              )}
            </p>
          </div>

          <Hr />

          {/* The solo tab */}
          {tabLines.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <p
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  color: '#525252',
                  textAlign: 'center',
                  marginBottom: 16,
                  textTransform: 'uppercase',
                }}
              >
                The Solo
              </p>
              <div className="tab-scroll">
                <div
                  className="tab-content"
                  style={{
                    backgroundColor: '#111111',
                    border: '1px solid #1f1f1f',
                    borderRadius: 8,
                    padding: '20px 20px',
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
            <div style={{ margin: '20px 0', padding: '16px 20px', borderLeft: '3px solid #f59e0b', backgroundColor: '#111111', borderRadius: '0 8px 8px 0' }}>
              <p style={{ color: '#a3a3a3', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
                &ldquo;{profile.graduateNote}&rdquo;
              </p>
            </div>
          )}

          <Hr />

          {/* Footer */}
          <div style={{ textAlign: 'center' }}>
            {gradDate && (
              <p style={{ color: '#525252', fontFamily: '"Courier New", Courier, monospace', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                Graduated {gradDate} &nbsp;·&nbsp; firstguitarsolo.com
              </p>
            )}
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
                    backgroundColor: '#1a1a1a',
                    color: '#d4d4d4',
                    border: '1px solid #262626',
                    borderRadius: 6,
                    padding: '5px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
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
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 48,
            backgroundColor: '#111111',
            border: '1px solid #1f1f1f',
            borderRadius: 12,
            padding: '28px 28px',
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
                color: '#000000',
                padding: '12px 28px',
                borderRadius: 8,
                fontWeight: 900,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Start Free / $25 Lifetime Access
            </Link>
            <Link
              href="/graduates"
              style={{
                backgroundColor: '#1a1a1a',
                color: '#f59e0b',
                border: '1px solid #f59e0b',
                padding: '12px 24px',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'inline-block',
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
