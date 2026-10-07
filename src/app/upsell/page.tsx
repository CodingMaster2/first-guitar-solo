import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'What\'s Next — First Guitar Solo',
  description:
    'You completed your first guitar solo. Here\'s what comes next: Advanced Solo 2 with professional bending, vibrato, and a full-length A minor solo.',
}

export default function UpsellPage() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Celebration header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎸</div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
              letterSpacing: '0.05em',
              color: '#ffffff',
              lineHeight: 1,
              marginBottom: '1rem',
            }}
          >
            You Completed Your First Guitar Solo
          </h1>
          <p
            style={{
              color: '#a3a3a3',
              fontSize: '1.0625rem',
              maxWidth: '36rem',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            30 days ago you picked up a guitar. Today you can play a blues solo.
            <br />
            That&apos;s real. That&apos;s yours. Nobody can take it away.
          </p>
        </div>

        {/* Transition */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #262626',
            borderRadius: '0.75rem',
            padding: '1.5rem 2rem',
            marginBottom: '2.5rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: '#d4d4d4',
              fontSize: '1rem',
              lineHeight: 1.75,
            }}
          >
            But this is just the beginning. You now have the foundation. The pentatonic, the bends,
            the phrasing instinct — those skills are the key to everything that comes next.
          </p>
        </div>

        {/* Advanced Solo 2 pitch card */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.04)) padding-box, linear-gradient(135deg, #f59e0b, rgba(245,158,11,0.3)) border-box',
            border: '2px solid transparent',
            borderRadius: '1rem',
            overflow: 'hidden',
            backgroundColor: '#111111',
            marginBottom: '2.5rem',
          }}
        >
          {/* Card header */}
          <div
            style={{
              backgroundColor: '#f59e0b',
              padding: '1.25rem 2rem',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                color: '#000',
                fontSize: '0.65rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                marginBottom: '0.25rem',
              }}
            >
              Sixth String Labs · Level 2
            </p>
            <h2
              style={{
                color: '#000',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1.75rem',
                letterSpacing: '0.1em',
              }}
            >
              Advanced Solo: Minor Pentatonic Mastery
            </h2>
          </div>

          {/* Card body */}
          <div style={{ padding: '2rem' }}>
            <p
              style={{
                color: '#a3a3a3',
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                marginBottom: '1.75rem',
              }}
            >
              Build on your foundation. Learn bends at professional level, vibrato that sings, and
              your first full-length solo in the style of Clapton or SRV. This is where your
              technique goes from functional to expressive.
            </p>

            {/* What's included */}
            <div style={{ marginBottom: '2rem' }}>
              <p
                style={{
                  color: '#f59e0b',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  marginBottom: '0.875rem',
                }}
              >
                What&apos;s Included
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {[
                  '30 more days of structured lessons',
                  'Advanced string bending at professional level',
                  'Vibrato technique — the thing that makes notes sing',
                  'Full-length solo in A minor (Clapton / SRV style)',
                  'AI Guitar Coach continues — unlimited access',
                  'Backing tracks and performance reference audio',
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      color: '#a3a3a3',
                      fontSize: '0.875rem',
                    }}
                  >
                    <span style={{ color: '#f59e0b', flexShrink: 0 }} aria-hidden="true">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price + CTA */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}>
                <span
                  style={{
                    color: '#ffffff',
                    fontSize: '3.5rem',
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  $25
                </span>
                <p style={{ color: '#a3a3a3', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  one time · same simple price
                </p>
              </div>

              <Link
                href="/register?plan=advanced"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '1.125rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  marginBottom: '0.75rem',
                }}
              >
                Get Advanced Solo 2 — $25
              </Link>

              {/* Money-back guarantee */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  justifyContent: 'center',
                  marginTop: 4,
                }}
              >
                <span style={{ color: '#86efac', fontSize: '1rem' }}>🛡️</span>
                <span
                  style={{ color: '#86efac', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  30-Day Money-Back Guarantee — No questions asked
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #262626',
            borderRadius: '0.75rem',
            padding: '1.5rem 2rem',
            marginBottom: '2.5rem',
          }}
        >
          <p
            style={{
              color: '#d4d4d4',
              fontSize: '0.9375rem',
              lineHeight: 1.75,
              fontStyle: 'italic',
              marginBottom: '1rem',
            }}
          >
            &quot;I finished First Guitar Solo in 32 days (took two days off for a camping trip). By month
            three I was playing blues jams at a local bar on open mic nights. The vibrato work in
            Advanced Solo 2 is what unlocked everything — I finally understood what it meant to make
            a note &apos;sing.&apos; Couldn&apos;t recommend it more.&quot;
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 900,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              MR
            </div>
            <div>
              <p style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 700 }}>
                Marcus R.
              </p>
              <p style={{ color: '#525252', fontSize: '0.75rem' }}>
                Graduate · Now plays weekly at Tin Cup Bar, Austin TX
              </p>
            </div>
          </div>
        </div>

        {/* Not ready link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#525252', fontSize: '0.875rem' }}>
            Not ready yet?{' '}
            <Link
              href="/dashboard"
              style={{ color: '#a3a3a3', textDecoration: 'underline' }}
            >
              Go back to your dashboard
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
