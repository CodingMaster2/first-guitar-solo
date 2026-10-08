import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About — First Guitar Solo by Sixth String Labs',
  description:
    'The story behind First Guitar Solo: why Zachary Lee built it, what problem it solves, and the mission to help 10,000 people play their first guitar solo by 2026.',
  openGraph: {
    title: 'About First Guitar Solo',
    description: 'The story behind the 30-day guitar solo course and the mission to help 10,000 people play their first solo.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
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
            Sixth String Labs
          </p>
          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              lineHeight: 1.1,
            }}
          >
            About First Guitar Solo
          </h1>
        </div>

        {/* ─── Section 1: The Founder ─── */}
        <section style={{ marginBottom: '4rem' }}>
          <h2
            style={{
              color: '#f59e0b',
              fontSize: '1.375rem',
              fontWeight: 900,
              letterSpacing: '0.05em',
              marginBottom: '1.5rem',
            }}
          >
            The Founder
          </h2>

          {/* Photo + intro layout */}
          <div
            style={{
              display: 'flex',
              gap: '1.75rem',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              marginBottom: '1.5rem',
            }}
          >
            {/* Photo placeholder */}
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '0.75rem',
                backgroundColor: '#111111',
                border: '1px dashed #262626',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                gap: '0.375rem',
              }}
            >
              <span style={{ fontSize: '2rem' }}>📷</span>
              <span
                style={{
                  color: '#525252',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  lineHeight: 1.4,
                  padding: '0 8px',
                }}
              >
                [ Photo goes here ]
              </span>
            </div>

            {/* Intro text */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <p
                style={{
                  color: '#ffffff',
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  fontWeight: 500,
                  marginBottom: '0.875rem',
                }}
              >
                {"Hi, I'm "}
                <strong style={{ color: '#f59e0b' }}>Zachary Lee</strong>
                {", founder of Sixth String Labs."}
              </p>
              <p style={{ color: '#a3a3a3', fontSize: '0.9375rem', lineHeight: 1.75, margin: 0 }}>
                {/* ── PLACEHOLDER — replace with your personal story ── */}
                {`[YOUR GUITAR STORY HERE — when you started playing, what drew you to the guitar,
                  the moment you realised you wanted to help other people learn.
                  Be specific: name the song, the guitar, the feeling.]`}
              </p>
            </div>
          </div>

          <p style={{ color: '#a3a3a3', fontSize: '0.9375rem', lineHeight: 1.8, marginBottom: '1rem' }}>
            {/* ── PLACEHOLDER ── */}
            {`[CONTINUE YOUR STORY — how long have you been playing? What genres do you love?
              Have you been in bands? Performed live? Taught before? What is your relationship
              with blues and rock guitar specifically? This is where readers decide if they trust you.]`}
          </p>
        </section>

        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.2), transparent)', marginBottom: '4rem' }} />

        {/* ─── Section 2: Why I Built This ─── */}
        <section style={{ marginBottom: '4rem' }}>
          <h2
            style={{
              color: '#f59e0b',
              fontSize: '1.375rem',
              fontWeight: 900,
              letterSpacing: '0.05em',
              marginBottom: '1.25rem',
            }}
          >
            Why I Built This
          </h2>
          <p style={{ color: '#d4d4d4', fontSize: '0.9375rem', lineHeight: 1.8, marginBottom: '1rem' }}>
            I watched too many friends buy a guitar and never pick it up again.
          </p>
          <p style={{ color: '#d4d4d4', fontSize: '0.9375rem', lineHeight: 1.8, marginBottom: '1rem' }}>
            It always went the same way. They got excited, bought the gear, spent a weekend watching YouTube videos,
            learned half of a chord, got frustrated, and left the guitar in the corner to collect dust.
            Six months later it was on Facebook Marketplace.
          </p>
          <p style={{ color: '#d4d4d4', fontSize: '0.9375rem', lineHeight: 1.8, marginBottom: '1rem' }}>
            The problem was never ability. It was structure. There is an overwhelming amount of free guitar content
            online — and almost none of it tells you what to do first, what to do second, and what actually matters
            for the goal you care about. Most beginners do not want to become professional guitarists.
            They want to do one thing: play a solo.
          </p>
          <p style={{ color: '#d4d4d4', fontSize: '0.9375rem', lineHeight: 1.8, marginBottom: '0' }}>
            So I built the course I wish had existed. Thirty days. One specific goal.
            Every lesson a step closer to a complete, performable blues-rock solo.
            No subscriptions, no distractions, no ambiguity about what to do today.
          </p>
        </section>

        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.2), transparent)', marginBottom: '4rem' }} />

        {/* ─── Section 3: The Mission ─── */}
        <section style={{ marginBottom: '4rem' }}>
          <h2
            style={{
              color: '#f59e0b',
              fontSize: '1.375rem',
              fontWeight: 900,
              letterSpacing: '0.05em',
              marginBottom: '1.25rem',
            }}
          >
            The Mission
          </h2>

          <div
            style={{
              backgroundColor: 'rgba(245,158,11,0.07)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderLeft: '3px solid #f59e0b',
              borderRadius: '0 0.75rem 0.75rem 0',
              padding: '1.5rem 1.75rem',
              marginBottom: '1.5rem',
            }}
          >
            <p
              style={{
                color: '#ffffff',
                fontSize: '1.25rem',
                fontWeight: 900,
                letterSpacing: '0.02em',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              Help 10,000 people play their first guitar solo by 2026.
            </p>
          </div>

          <p style={{ color: '#a3a3a3', fontSize: '0.9375rem', lineHeight: 1.8, marginBottom: '1rem' }}>
            That is the number. Not revenue targets, not subscriber counts.
            Ten thousand people who sat down, did the work for 30 days, and experienced the feeling
            of playing a complete guitar solo for the first time.
          </p>
          <p style={{ color: '#a3a3a3', fontSize: '0.9375rem', lineHeight: 1.8 }}>
            Every feature added to First Guitar Solo is evaluated against one question:
            does this help a beginner finish the 30 days? If it does, it ships. If it does not, it waits.
          </p>
        </section>

        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.2), transparent)', marginBottom: '4rem' }} />

        {/* ─── Section 4: Product Philosophy ─── */}
        <section style={{ marginBottom: '4rem' }}>
          <h2
            style={{
              color: '#f59e0b',
              fontSize: '1.375rem',
              fontWeight: 900,
              letterSpacing: '0.05em',
              marginBottom: '1.5rem',
            }}
          >
            The Product Philosophy
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1px',
              backgroundColor: '#1f1f1f',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              marginBottom: '1.5rem',
            }}
          >
            {[
              {
                icon: '🎯',
                label: 'One Goal',
                description: 'Play your first complete guitar solo. Nothing else. Every lesson serves that single outcome.',
              },
              {
                icon: '🛤️',
                label: 'One Path',
                description: 'A linear, day-by-day curriculum. No choices, no rabbit holes. Open the app, do the lesson, close it.',
              },
              {
                icon: '💳',
                label: 'One Price',
                description: '$25. Pay once, own it forever. No subscriptions, no upsells, no hidden costs.',
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  backgroundColor: '#111111',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <span style={{ fontSize: '1.75rem' }}>{item.icon}</span>
                <h3
                  style={{
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: 900,
                    margin: 0,
                    fontFamily: 'inherit',
                    letterSpacing: '0.02em',
                  }}
                >
                  {item.label}
                </h3>
                <p style={{ color: '#737373', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>{item.description}</p>
              </div>
            ))}
          </div>

          <p style={{ color: '#a3a3a3', fontSize: '0.9375rem', lineHeight: 1.8 }}>
            Simplicity is not a limitation — it is the product. The subscription guitar education market is full of
            platforms that add features to justify their monthly fee. First Guitar Solo does the opposite:
            every feature must earn its place by helping students finish.
          </p>
        </section>

        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.2), transparent)', marginBottom: '4rem' }} />

        {/* ─── Section 5: Contact ─── */}
        <section style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              color: '#f59e0b',
              fontSize: '1.375rem',
              fontWeight: 900,
              letterSpacing: '0.05em',
              marginBottom: '1.25rem',
            }}
          >
            Get in Touch
          </h2>
          <p style={{ color: '#a3a3a3', fontSize: '0.9375rem', lineHeight: 1.8, marginBottom: '1.75rem' }}>
            Questions about the course, feedback, or just want to share a clip of your progress?
            {"I'd love to hear from you."}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000000',
                fontWeight: 900,
                fontSize: '0.875rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.625rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
              }}
            >
              Contact Us →
            </Link>

            {/* Social placeholders */}
            {[
              { label: 'Instagram', href: '#', icon: '📸' },
              { label: 'YouTube', href: '#', icon: '▶' },
              { label: 'TikTok', href: '#', icon: '🎵' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  backgroundColor: '#111111',
                  color: '#a3a3a3',
                  border: '1px solid #262626',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  padding: '0.625rem 1.125rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                }}
              >
                <span>{social.icon}</span>
                {social.label}
              </a>
            ))}
          </div>

          <p style={{ color: '#525252', fontSize: '0.75rem', marginTop: '1rem', fontStyle: 'italic' }}>
            Social links are placeholders — update these with your actual profiles.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
