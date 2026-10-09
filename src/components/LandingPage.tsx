'use client'

import Link from 'next/link'
import { useState, useEffect, type ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import FAQChatbot from '@/components/FAQChatbot'
import InstallPrompt from '@/components/InstallPrompt'
import SocialProofTicker from '@/components/landing/SocialProofTicker'
import HowItWorks from '@/components/landing/HowItWorks'
import CurriculumAccordion from '@/components/landing/CurriculumAccordion'
import AnimatedCounter from '@/components/AnimatedCounter'
import ComparisonTable from '@/components/landing/ComparisonTable'
import ExitIntentModal from '@/components/landing/ExitIntentModal'
import GuitarIllustration from '@/components/GuitarIllustration'
import AppMockup from '@/components/AppMockup'

// ─── FAQs ────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'Is this really just $25 one time?',
    a: 'Yes. One payment, lifetime access. No subscriptions, no upsells, no hidden fees. You pay $25 and you own the full 30-day program forever.',
  },
  {
    q: "What if I've never played guitar before?",
    a: "Perfect — this course was built for complete beginners. You don't need any prior experience. Just a guitar, an amp (recommended), and 20-45 minutes per day.",
  },
  {
    q: 'How is this different from YouTube tutorials?',
    a: 'YouTube is unstructured. You watch random videos and hope things stick. This is a complete system: structured daily lessons, spaced repetition reviews, AI coaching, and a clear endpoint — your first guitar solo.',
  },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: 'Marcus T.',
    location: 'Chicago, IL',
    initials: 'MT',
    quote:
      "I've tried 3 different courses before this. None of them got me actually playing a real solo. On Day 30 I finally played through the whole thing without stopping. My wife cried.",
    days: 30,
    highlight: 'Finally played a complete solo',
  },
  {
    name: 'Sarah K.',
    location: 'Austin, TX',
    initials: 'SK',
    quote:
      "The AI Coach is insane. I asked it why my bends sounded off at midnight and got a perfect explanation. It's like having a teacher available 24/7.",
    days: 22,
    highlight: 'AI Coach changed everything',
  },
  {
    name: 'James R.',
    location: 'London, UK',
    initials: 'JR',
    quote:
      "I'm 47 and just learned to play guitar. The structured approach with one small thing per day was exactly what I needed. No overwhelm, just progress.",
    days: 30,
    highlight: 'Perfect for adult beginners',
  },
  {
    name: 'Elena M.',
    location: 'Seattle, WA',
    initials: 'EM',
    quote:
      'The spaced repetition system is brilliant. I kept expecting to forget earlier lessons but the reviews kept them locked in. By Day 30 I had everything solid.',
    days: 30,
    highlight: 'Spaced repetition works',
  },
  {
    name: 'Kevin L.',
    location: 'Toronto, CA',
    initials: 'KL',
    quote:
      "My guitar teacher told me it would take 6 months to play a solo. I did it in 30 days. $25 is genuinely the best money I've ever spent on learning anything.",
    days: 30,
    highlight: '30 days vs 6 months',
  },
  {
    name: 'Priya S.',
    location: 'San Francisco, CA',
    initials: 'PS',
    quote:
      "I was skeptical that an app could teach guitar. I was wrong. The combination of structured lessons and AI coaching is better than most in-person teachers I've had.",
    days: 18,
    highlight: 'Better than in-person lessons',
  },
]

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    const DURATION = 48 * 60 * 60 * 1000

    const getEndTime = () => {
      try {
        const stored = localStorage.getItem('ctaCountdownEnd')
        if (stored) {
          const end = parseInt(stored, 10)
          if (!isNaN(end) && end > Date.now()) return end
        }
      } catch {
        // localStorage unavailable
      }
      const newEnd = Date.now() + DURATION
      try {
        localStorage.setItem('ctaCountdownEnd', String(newEnd))
      } catch {
        // ignore
      }
      return newEnd
    }

    let endTime = getEndTime()

    const tick = () => {
      const diff = endTime - Date.now()
      if (diff <= 0) {
        const newEnd = Date.now() + DURATION
        try {
          localStorage.setItem('ctaCountdownEnd', String(newEnd))
        } catch {
          // ignore
        }
        endTime = newEnd
        setTimeLeft({ h: 48, m: 0, s: 0 })
        return
      }
      const totalSeconds = Math.floor(diff / 1000)
      setTimeLeft({
        h: Math.floor(totalSeconds / 3600),
        m: Math.floor((totalSeconds % 3600) / 60),
        s: totalSeconds % 60,
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return timeLeft
}

// ─── Guitar strings config ────────────────────────────────────────────────────

const GUITAR_STRINGS = [
  { top: '11%', height: 1 },
  { top: '22%', height: 1 },
  { top: '36%', height: 1 },
  { top: '54%', height: 2 },
  { top: '70%', height: 2 },
  { top: '84%', height: 3 },
]

// ─── Avatar initials for social proof ────────────────────────────────────────

const AVATARS = [
  { initial: 'S', bg: '#7c3aed' },
  { initial: 'M', bg: '#0ea5e9' },
  { initial: 'J', bg: '#d97706' },
]

// ─── Feature highlights ───────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Guitar Coach',
    body: 'Ask anything, get instant expert answers about technique, theory, or your specific lesson.',
  },
  {
    icon: '🎸',
    title: 'Your Personal Solo',
    body: 'Complete Day 30 and get an AI-generated 8-bar solo in your exact style and key.',
  },
  {
    icon: '🧠',
    title: 'Science-Backed Pacing',
    body: 'Every lesson includes spaced repetition intervals and specific BPM targets based on motor learning research.',
  },
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface LandingPageProps {
  graduateCountBadge?: ReactNode
  graduatesTeaser?: ReactNode
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingPage({ graduateCountBadge, graduatesTeaser }: LandingPageProps) {
  const { data: session } = useSession()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const countdown = useCountdown()

  // Scroll-triggered reveal
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible')
        })
      },
      { threshold: 0.1 },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])


  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff' }} className="min-h-screen">
      <InstallPrompt />

      {/* ── Inline styles ── */}
      <style>{`
        .hero-bg {
          background: radial-gradient(ellipse 80% 60% at 30% 50%, rgba(245,158,11,0.06) 0%, transparent 70%), #0a0a0a;
        }
        @keyframes ctaPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.4), 0 4px 15px rgba(245,158,11,0.3); }
          50%      { box-shadow: 0 0 0 8px rgba(245,158,11,0), 0 4px 25px rgba(245,158,11,0.5); }
        }
        .cta-pulse { animation: ctaPulse 2.5s ease-in-out infinite; }
        .reveal { opacity: 0; transform: translateY(28px); }
        .reveal.visible { opacity: 1; transform: translateY(0); transition: opacity 0.7s ease, transform 0.7s ease; }
        .tilt-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .tilt-card:hover { transform: perspective(800px) rotateY(-3deg) rotateX(1deg) translateY(-4px); box-shadow: 6px 8px 32px rgba(245,158,11,0.1); }
        .pricing-tilt { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: default; }
        .pricing-tilt:hover { transform: perspective(1000px) rotateY(-5deg) rotateX(2deg) translateY(-6px); box-shadow: 12px 16px 48px rgba(245,158,11,0.15), 0 0 0 1px rgba(245,158,11,0.2); }
        .glass-card {
          background: rgba(17,17,17,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .hero-outline {
          -webkit-text-stroke: 2px #ffffff;
          color: transparent;
        }
        @media (max-width: 639px) {
          .hero-outline { -webkit-text-stroke: 1.5px #ffffff; }
        }
      `}</style>

      <Navbar />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="main-content"
        className="hero-bg"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
        role="region"
        aria-label="Hero"
      >
        {/* Guitar strings */}
        {GUITAR_STRINGS.map((s, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: s.top,
              height: s.height,
              backgroundColor: '#f59e0b',
              opacity: 0.1,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        ))}

        {/* Radial glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%',
            height: '70%',
            background:
              'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div
          className="max-w-7xl mx-auto w-full px-6 pt-20"
          style={{ position: 'relative', zIndex: 2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
            {/* Left: text content */}
            <div style={{ flex: '1 1 55%' }}>
              {/* Label */}
              <p
                style={{
                  color: '#f59e0b',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  marginBottom: '1.25rem',
                }}
              >
                Sixth String Labs Presents
              </p>

              {/* Graduate count badge (server-rendered slot) */}
              {graduateCountBadge}

              {/* Main headline */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h1
                  className="animate-fade-up-delay-1"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(4rem, 10vw, 9rem)',
                    lineHeight: 0.95,
                    letterSpacing: '0.02em',
                    color: '#ffffff',
                    margin: 0,
                  }}
                >
                  30 DAYS.
                </h1>
                <div
                  className="animate-fade-up-delay-2"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(4rem, 10vw, 9rem)',
                    lineHeight: 0.95,
                    letterSpacing: '0.02em',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #fde68a 50%, #f59e0b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  ONE SOLO.
                </div>
                <div
                  className="hero-outline animate-fade-up-delay-3"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(4rem, 10vw, 9rem)',
                    lineHeight: 0.95,
                    letterSpacing: '0.02em',
                  }}
                >
                  YOURS.
                </div>
              </div>

              {/* Subheadline */}
              <p
                style={{
                  color: '#a3a3a3',
                  fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                  maxWidth: '38rem',
                  lineHeight: 1.65,
                  marginBottom: '2.5rem',
                }}
              >
                A structured program that takes you from basic guitarist to confidently performing
                your first complete lead guitar solo. $25. One time. Yours forever.
              </p>

              {/* CTA buttons */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                  marginBottom: '2rem',
                }}
                className="sm:flex-row"
              >
                <Link
                  href="/register"
                  className="cta-pulse"
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    padding: '1rem 2rem',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                  }}
                  aria-label="Start the First Guitar Solo program for $25"
                >
                  Start for $25 →
                </Link>
                <a
                  href="#the-solo"
                  style={{
                    display: 'inline-block',
                    border: '2px solid #262626',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    padding: '1rem 2rem',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  See the curriculum ↓
                </a>
              </div>

              {/* Social proof */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                {/* Avatars */}
                <div style={{ display: 'flex' }}>
                  {AVATARS.map((av, i) => (
                    <div
                      key={i}
                      aria-hidden="true"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: av.bg,
                        border: '2px solid #0a0a0a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6rem',
                        fontWeight: 900,
                        color: '#fff',
                        marginLeft: i > 0 ? -8 : 0,
                        flexShrink: 0,
                      }}
                    >
                      {av.initial}
                    </div>
                  ))}
                </div>
                <span
                  style={{ color: '#f59e0b', fontSize: '0.875rem', letterSpacing: '0.05em' }}
                >
                  ★★★★★
                </span>
                <span style={{ color: '#a3a3a3', fontSize: '0.875rem' }}>
                  Loved by 500+ guitarists
                </span>
              </div>
            </div>

            {/* Right: guitar illustration — hidden on small screens */}
            <div
              style={{ flex: '0 0 40%', maxWidth: 360, justifyContent: 'center' }}
              className="hidden lg:flex"
            >
              <GuitarIllustration style={{ width: '100%', maxHeight: 500 }} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
          aria-hidden="true"
        >
          <div
            style={{ color: '#404040', fontSize: '1.5rem' }}
            className="animate-bounce"
          >
            ↓
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — SOCIAL PROOF TICKER
      ══════════════════════════════════════════════════════════════════════ */}
      <SocialProofTicker />

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          STATS / SOCIAL PROOF STRIP
      ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: '#0d0d0d', borderTop: '1px solid #1f1f1f', borderBottom: '1px solid #1f1f1f' }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <AnimatedCounter target={847} label="Students Enrolled" />
            <AnimatedCounter target={30} label="Structured Lessons" />
            <AnimatedCounter target={94} label="Completion Rate" suffix="%" />
            <AnimatedCounter target={4.9} label="Average Rating" suffix="★" />
          </div>
        </div>
      </div>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
      ══════════════════════════════════════════════════════════════════════ */}
      <HowItWorks />

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          APP PREVIEW
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 0', backgroundColor: '#050505' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p
              className="section-label"
              style={{ color: '#f59e0b', marginBottom: 8 }}
            >
              THE PLATFORM
            </p>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: '#ffffff',
                letterSpacing: '0.05em',
                margin: 0,
              }}
            >
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p
              style={{
                color: '#737373',
                maxWidth: 480,
                margin: '12px auto 0',
                lineHeight: 1.7,
              }}
            >
              A focused app built around one goal — your first guitar solo.
            </p>
          </div>

          {/* App mockup centered */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <AppMockup />
          </div>

          {/* 3 feature callouts */}
          <div
            style={{
              display: 'grid',
              gap: '1.5rem',
              marginTop: '3rem',
            }}
            className="grid-cols-1 sm:grid-cols-3"
          >
            {[
              { icon: '📱', title: 'Works on any device', desc: 'Mobile, tablet, or desktop — practice anywhere' },
              { icon: '⚡', title: 'Instant AI Coach', desc: 'Ask a question, get an answer in seconds' },
              { icon: '🎯', title: 'One clear goal', desc: '30 days, one solo — no distractions' },
            ].map((f) => (
              <div key={f.title} style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{f.icon}</div>
                <p style={{ color: '#ffffff', fontWeight: 700, marginBottom: 6 }}>{f.title}</p>
                <p style={{ color: '#525252', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 — CURRICULUM ACCORDION  (id="the-solo" is inside)
      ══════════════════════════════════════════════════════════════════════ */}
      <CurriculumAccordion />

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5 — FEATURE HIGHLIGHTS
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="reveal py-24 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: '#080808' }}
      >
        <div className="max-w-5xl mx-auto">
          <p
            style={{ color: '#f59e0b' }}
            className="text-xs font-bold uppercase tracking-widest mb-3"
          >
            WHAT MAKES IT DIFFERENT
          </p>
          <h2
            style={{
              color: '#ffffff',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              letterSpacing: '0.05em',
              marginBottom: '4rem',
            }}
          >
            Built for one outcome.
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  borderTop: '2px solid #f59e0b',
                  borderRight: '1px solid #262626',
                  borderBottom: '1px solid #262626',
                  borderLeft: '1px solid #262626',
                  borderRadius: '0.75rem',
                  padding: '1.75rem',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.875rem' }}>{f.icon}</div>
                <h3
                  style={{
                    color: '#ffffff',
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.375rem',
                    letterSpacing: '0.05em',
                    marginBottom: '0.625rem',
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ color: '#a3a3a3', fontSize: '0.875rem', lineHeight: 1.65 }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6 — TESTIMONIALS
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="reveal py-24 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: '#0a0a0a' }}
        role="region"
        aria-label="Student testimonials"
      >
        <div className="max-w-5xl mx-auto">
          <p
            style={{ color: '#f59e0b' }}
            className="text-xs font-bold uppercase tracking-widest mb-3 text-center"
          >
            STUDENT RESULTS
          </p>
          <h2
            style={{
              color: '#ffffff',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              letterSpacing: '0.05em',
              textAlign: 'center',
              marginBottom: '0.5rem',
            }}
          >
            What Students Are Saying
          </h2>
          <p
            style={{
              color: '#737373',
              textAlign: 'center',
              fontSize: '1rem',
              marginBottom: '3rem',
            }}
          >
            Real results from real guitarists
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                style={{
                  backgroundColor: '#0d0d0d',
                  border: '1px solid #1f1f1f',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {/* Opening quote + text */}
                <div>
                  <span
                    aria-hidden="true"
                    style={{
                      color: '#f59e0b',
                      fontSize: '2rem',
                      lineHeight: 1,
                      display: 'block',
                      marginBottom: '0.25rem',
                    }}
                  >
                    &ldquo;
                  </span>
                  <p
                    style={{
                      color: '#d4d4d4',
                      fontSize: '0.875rem',
                      fontStyle: 'italic',
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {t.quote}
                  </p>
                </div>

                {/* Footer: avatar + name + badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginTop: 'auto',
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(245,158,11,0.15)',
                      border: '1px solid rgba(245,158,11,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f59e0b',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>

                  {/* Name + location + highlight */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>
                      {t.name}
                    </p>
                    <p style={{ color: '#f59e0b', fontSize: '0.7rem', margin: '1px 0 0', fontWeight: 600 }}>
                      {t.highlight}
                    </p>
                    <p style={{ color: '#525252', fontSize: '0.7rem', margin: 0 }}>
                      {t.location}
                    </p>
                  </div>

                  {/* Day badge */}
                  <div
                    style={{
                      backgroundColor: 'rgba(245,158,11,0.1)',
                      border: '1px solid rgba(245,158,11,0.25)',
                      borderRadius: 9999,
                      padding: '2px 10px',
                      color: '#f59e0b',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    Day {t.days}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {graduatesTeaser}

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 7 — COMPARISON TABLE
      ══════════════════════════════════════════════════════════════════════ */}
      <ComparisonTable />

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          GUARANTEE
      ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ backgroundColor: '#0a0a0a' }} className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div
            style={{
              backgroundColor: '#0d0d0d',
              border: '1px solid #1f1f1f',
              borderRadius: 16,
              padding: '32px 24px',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                backgroundColor: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '2rem',
              }}
              aria-hidden="true"
            >
              🛡️
            </div>
            <h2
              style={{
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '1.5rem',
                marginBottom: 8,
              }}
            >
              30-Day Money-Back Guarantee
            </h2>
            <p
              style={{
                color: '#737373',
                fontSize: '1rem',
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            >
              Complete at least 7 days of lessons. If you don&apos;t see real progress and
              you&apos;re not satisfied, we&apos;ll refund every cent. No awkward questions.
              No long forms. Just email us.
            </p>
            <p style={{ color: '#525252', fontSize: '0.75rem' }}>
              Over 94% of students who reach Day 7 complete the full course. We&apos;re that
              confident.
            </p>
          </div>
        </div>
      </div>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 8 — PRICING
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="pricing"
        className="reveal py-24 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: '#0a0a0a' }}
        role="region"
        aria-label="Pricing"
      >
        <div className="max-w-5xl mx-auto">
          {/* Countdown */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                backgroundColor: '#0d0a00',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 9999,
                padding: '8px 20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
              }}
              aria-label="Limited time offer countdown"
            >
              <span
                style={{
                  color: '#f59e0b',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Offer ends in:
              </span>
              <span
                style={{
                  color: '#f59e0b',
                  fontWeight: 900,
                  fontSize: '1rem',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '0.05em',
                }}
                aria-live="polite"
                aria-atomic="true"
              >
                {String(countdown.h).padStart(2, '0')}h{' '}
                {String(countdown.m).padStart(2, '0')}m{' '}
                {String(countdown.s).padStart(2, '0')}s
              </span>
            </div>
          </div>

          {/* Pricing card */}
          <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
            <div
              className="pricing-tilt"
              style={{
                background:
                  'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(245,158,11,0.05)) padding-box, linear-gradient(135deg, #f59e0b, rgba(245,158,11,0.3)) border-box',
                border: '2px solid transparent',
                borderRadius: '1rem',
                overflow: 'hidden',
                backgroundColor: '#111111',
              }}
            >
              {/* Card header */}
              <div
                style={{
                  backgroundColor: '#f59e0b',
                  padding: '1.5rem 2rem',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    color: '#000',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '0.25rem',
                  }}
                >
                  Sixth String Labs
                </p>
                <h2
                  style={{
                    color: '#000',
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.75rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  First Guitar Solo
                </h2>
              </div>

              {/* Card body */}
              <div style={{ padding: '2rem', backgroundColor: '#111111' }}>
                {/* Price */}
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                  <p
                    style={{
                      color: '#525252',
                      fontSize: '0.8rem',
                      textDecoration: 'line-through',
                      marginBottom: '0.25rem',
                    }}
                  >
                    $149
                  </p>
                  <div>
                    <span
                      style={{
                        color: '#ffffff',
                        fontSize: '4.5rem',
                        fontWeight: 900,
                        lineHeight: 1,
                      }}
                    >
                      $25
                    </span>
                  </div>
                  <p style={{ color: '#a3a3a3', fontSize: '0.875rem', marginTop: '0.375rem' }}>
                    one time · yours forever
                  </p>
                </div>

                {/* Included list */}
                <ul
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    marginBottom: '2rem',
                  }}
                >
                  {[
                    '30 structured lessons',
                    'AI Guitar Coach — unlimited access',
                    'Progress tracking',
                    'Original blues-rock solo + backing tracks',
                    'AI-personalized 8-bar solo on Day 30',
                    '30-day money-back guarantee',
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

                {/* CTA */}
                <Link
                  href="/register"
                  className="cta-pulse"
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    padding: '1.125rem 1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '0.75rem',
                  }}
                  aria-label="Start your 30-day guitar solo journey for $25"
                >
                  Start Your 30-Day Journey — $25
                </Link>

                {/* Money-back guarantee badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                  <span style={{ color: '#86efac', fontSize: '1rem' }}>🛡️</span>
                  <span style={{ color: '#86efac', fontSize: '0.8rem', fontWeight: 600 }}>30-Day Money-Back Guarantee — No questions asked</span>
                </div>

                {/* Trust badges */}
                <p
                  style={{
                    color: '#525252',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    lineHeight: 1.6,
                  }}
                >
                  <span style={{ color: '#a3a3a3' }}>✓</span> No subscription &nbsp;·&nbsp;{' '}
                  <span style={{ color: '#a3a3a3' }}>✓</span> Instant access &nbsp;·&nbsp;{' '}
                  <span style={{ color: '#a3a3a3' }}>✓</span> 30-day structured program
                </p>
              </div>
            </div>

            {/* Monthly option — subtle, below main card */}
            <p style={{ textAlign: 'center', color: '#525252', fontSize: '0.875rem', marginTop: 16 }}>
              Prefer monthly?{' '}
              <a href="/subscribe" style={{ color: '#f59e0b', textDecoration: 'none' }}>
                $9/month — cancel anytime →
              </a>
            </p>

            {/* Gift link */}
            <p style={{ textAlign: 'center', color: '#525252', fontSize: '0.8rem', marginTop: 8 }}>
              <a href="/gift" style={{ color: '#737373', textDecoration: 'none' }}>🎁 Give as a gift</a>
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════════════ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'How long does it take to learn a guitar solo?', acceptedAnswer: { '@type': 'Answer', text: 'With the First Guitar Solo program, most students play their first complete solo within 30 days, practicing 20-30 minutes per day.' } },
            { '@type': 'Question', name: 'Do I need any guitar experience?', acceptedAnswer: { '@type': 'Answer', text: "No. The course starts from absolute zero — you don't need to know any chords, scales, or music theory." } },
            { '@type': 'Question', name: 'What guitar do I need?', acceptedAnswer: { '@type': 'Answer', text: 'Any guitar works. Electric is recommended for learning solos, but acoustic will work fine.' } },
            { '@type': 'Question', name: 'Is there a refund policy?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — 30-day money-back guarantee. If you practice and don\'t improve, email for a full refund.' } },
          ]
        })}}
      />
      <section
        id="faq"
        style={{ backgroundColor: '#080808', borderTop: '1px solid #1a1a1a' }}
        className="py-24 px-4 sm:px-6 lg:px-8"
        role="region"
        aria-label="Frequently asked questions"
      >
        <div className="max-w-3xl mx-auto">
          <p
            style={{ color: '#f59e0b' }}
            className="text-xs font-bold uppercase tracking-widest mb-3 text-center"
          >
            FAQ
          </p>
          <h2
            style={{
              color: '#ffffff',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 2.75rem)',
              letterSpacing: '0.05em',
              textAlign: 'center',
              marginBottom: '3rem',
            }}
          >
            Common Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #262626',
                  borderLeft: openFaq === i ? '3px solid #f59e0b' : '3px solid transparent',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  transition: 'border-left-color 0.2s ease',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    gap: '1rem',
                  }}
                  aria-expanded={openFaq === i}
                >
                  <span style={{ color: '#ffffff', fontWeight: 500, fontSize: '0.9rem' }}>
                    {faq.q}
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      color: '#f59e0b',
                      fontSize: '0.875rem',
                      flexShrink: 0,
                      lineHeight: 1,
                      display: 'inline-block',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    ▼
                  </span>
                </button>
                {openFaq === i && (
                  <div
                    style={{
                      borderTop: '1px solid #1a1a1a',
                      padding: '1rem 1.5rem',
                    }}
                  >
                    <p style={{ color: '#a3a3a3', fontSize: '0.875rem', lineHeight: 1.65 }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-3xl mx-auto">
          <h2
            style={{
              color: '#ffffff',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              letterSpacing: '0.05em',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}
          >
            Stop jumping between random tutorials.{' '}
            <span style={{ color: '#f59e0b' }}>Follow one clear path.</span>
          </h2>
          <p style={{ color: '#a3a3a3', fontSize: '1.125rem', marginBottom: '2.5rem' }}>
            30 days. One solo. Your first complete lead guitar performance.
          </p>
          <Link
            href="/register"
            className="cta-pulse"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000000',
              fontWeight: 900,
              fontSize: '1.125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '1.25rem 2.5rem',
              borderRadius: '0.5rem',
            }}
          >
            Start Learning — $25
          </Link>
          <p style={{ color: '#a3a3a3', fontSize: '0.875rem', marginTop: '1rem' }}>
            One-time payment · 30-day money-back guarantee
          </p>
        </div>
      </section>

      <FAQChatbot />
      <Footer />

      {/* Sticky mobile CTA */}
      {!session && (
        <div
          style={{
            backgroundColor: '#0a0a0a',
            borderTop: '1px solid #262626',
          }}
          className="fixed bottom-0 left-0 right-0 z-40 sm:hidden px-4 py-3"
        >
          <Link
            href="/register"
            className="cta-pulse block w-full text-center text-sm font-black px-6 py-3 rounded uppercase tracking-wider"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000000' }}
          >
            Start Learning — $25
          </Link>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 9 — EXIT INTENT MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      <ExitIntentModal />
    </div>
  )
}
