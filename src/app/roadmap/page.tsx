import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Product Roadmap — First Guitar Solo',
  description:
    "See what's been shipped, what's in progress, and what's coming next to First Guitar Solo — the 30-day structured guitar solo course by Sixth String Labs.",
  openGraph: {
    title: 'Product Roadmap — First Guitar Solo',
    description: "What we're building next for the 30-day guitar solo course.",
    type: 'website',
  },
}

type Status = 'released' | 'in-progress' | 'coming-soon'

interface RoadmapItem {
  icon: string
  title: string
  description: string
  status: Status
}

const RELEASED: RoadmapItem[] = [
  {
    icon: '📚',
    title: '30-Day Structured Curriculum',
    description: 'A complete, day-by-day path from foundational technique to performing a full blues-rock solo.',
    status: 'released',
  },
  {
    icon: '🤖',
    title: 'AI Coach (Unlimited Questions)',
    description: 'Ask anything about guitar, technique, theory, or the course — a guitar-specialist AI answers instantly.',
    status: 'released',
  },
  {
    icon: '🧠',
    title: 'Spaced Repetition Review System',
    description: 'The SM-2 algorithm automatically schedules lick reviews at the optimal time for maximum long-term retention.',
    status: 'released',
  },
  {
    icon: '📅',
    title: 'Practice Calendar Heatmap',
    description: 'Visualise every practice session with a GitHub-style heatmap that makes your consistency visible.',
    status: 'released',
  },
  {
    icon: '🎓',
    title: 'Graduation Certificate',
    description: 'Complete all 30 days and earn a shareable certificate of completion from Sixth String Labs.',
    status: 'released',
  },
  {
    icon: '🎵',
    title: 'Metronome & Tuner',
    description: 'Built-in precision tools for timing and intonation — no need to leave the page mid-practice.',
    status: 'released',
  },
  {
    icon: '🔥',
    title: 'Solo Forge (AI Solo Generator)',
    description: 'Generate custom guitar solos in your style instantly, powered by an AI trained on blues-rock phrasing.',
    status: 'released',
  },
  {
    icon: '🎸',
    title: 'Interactive Fretboard Explorer',
    description: 'Visualise any scale or chord position across the entire neck in real-time.',
    status: 'released',
  },
  {
    icon: '⚡',
    title: 'Daily Challenges',
    description: 'Short, focused exercises each day to sharpen speed, accuracy, and ear training alongside the main curriculum.',
    status: 'released',
  },
]

const IN_PROGRESS: RoadmapItem[] = [
  {
    icon: '🎬',
    title: 'Video Lesson Recordings',
    description:
      "Full-length video walkthroughs for every one of the 30 lessons — personally recorded by the founder. Currently filming.",
    status: 'in-progress',
  },
  {
    icon: '📱',
    title: 'Mobile App (iOS / Android)',
    description: 'A native app so you can practise anywhere — in the car, on the couch — without needing a laptop.',
    status: 'in-progress',
  },
  {
    icon: '🎶',
    title: 'Backing Track Library',
    description: 'High-quality backing tracks in multiple keys and tempos to practise over at every stage of the course.',
    status: 'in-progress',
  },
  {
    icon: '📡',
    title: 'Live Q&A Sessions',
    description: 'Scheduled live video sessions where students can ask questions and watch the founder play in real time.',
    status: 'in-progress',
  },
]

const COMING_SOON: RoadmapItem[] = [
  {
    icon: '🎙️',
    title: 'AI Recording Feedback',
    description:
      'Play into your microphone and receive AI feedback on your technique, tone, intonation, and timing — instantly.',
    status: 'coming-soon',
  },
  {
    icon: '💬',
    title: 'Community Forum',
    description: 'A dedicated space to share progress clips, ask questions, and connect with other students worldwide.',
    status: 'coming-soon',
  },
  {
    icon: '🚀',
    title: 'Advanced Solo 2 Course',
    description: 'The sequel — more advanced techniques, longer solos, and deeper music theory for graduates of Course 1.',
    status: 'coming-soon',
  },
  {
    icon: '👩‍🏫',
    title: 'Guitar Teacher Licenses',
    description: 'A bulk license so guitar teachers can assign First Guitar Solo to their students as structured homework.',
    status: 'coming-soon',
  },
  {
    icon: '🎸',
    title: 'Duet Mode',
    description: 'Jam with another student over the internet — real-time collaborative practice sessions from anywhere.',
    status: 'coming-soon',
  },
]

const STATUS_CONFIG: Record<Status, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  released: {
    label: 'Released',
    emoji: '✅',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.3)',
  },
  'in-progress': {
    label: 'In Progress',
    emoji: '🔄',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
  },
  'coming-soon': {
    label: 'Coming Soon',
    emoji: '🔮',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.3)',
  },
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        borderRadius: 100,
        padding: '2px 10px',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.emoji} {cfg.label}
    </span>
  )
}

function RoadmapSection({
  title,
  items,
  accentColor,
}: {
  title: string
  items: RoadmapItem[]
  accentColor: string
}) {
  return (
    <section style={{ marginBottom: '3rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <h2
          style={{
            color: '#ffffff',
            fontSize: '1.4rem',
            fontWeight: 900,
            letterSpacing: '0.05em',
            margin: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </h2>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: `linear-gradient(to right, ${accentColor}, transparent)`,
          }}
        />
        <span style={{ color: '#525252', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {items.length} items
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {items.map((item) => (
          <div
            key={item.title}
            style={{
              backgroundColor: '#111111',
              border: '1px solid #1f1f1f',
              borderRadius: '0.75rem',
              padding: '1.125rem 1.375rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              transition: 'border-color 0.2s',
            }}
          >
            <span
              style={{
                fontSize: '1.5rem',
                lineHeight: 1,
                flexShrink: 0,
                marginTop: '3px',
              }}
            >
              {item.icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  flexWrap: 'wrap',
                  marginBottom: '0.25rem',
                }}
              >
                <h3
                  style={{
                    color: '#ffffff',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    margin: 0,
                    letterSpacing: '0.01em',
                    fontFamily: 'inherit',
                  }}
                >
                  {item.title}
                </h3>
                <StatusBadge status={item.status} />
              </div>
              <p style={{ color: '#a3a3a3', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function RoadmapPage() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero header */}
        <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
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
            Sixth String Labs · First Guitar Solo
          </p>
          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              lineHeight: 1.1,
              marginBottom: '0.875rem',
            }}
          >
            Product Roadmap
          </h1>
          <p
            style={{
              color: '#a3a3a3',
              fontSize: '1.125rem',
              lineHeight: 1.7,
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            {"Here's what we're building next — and everything we've already shipped."}
          </p>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            backgroundColor: '#1f1f1f',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            marginBottom: '3rem',
          }}
        >
          {[
            { count: RELEASED.length, label: 'Released', color: '#22c55e' },
            { count: IN_PROGRESS.length, label: 'In Progress', color: '#f59e0b' },
            { count: COMING_SOON.length, label: 'Coming Soon', color: '#a78bfa' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: '#111111',
                padding: '1.25rem',
                textAlign: 'center',
              }}
            >
              <p style={{ color: stat.color, fontSize: '2rem', fontWeight: 900, lineHeight: 1, margin: 0 }}>
                {stat.count}
              </p>
              <p style={{ color: '#525252', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '4px 0 0' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <RoadmapSection
          title="Released ✅"
          items={RELEASED}
          accentColor="rgba(34,197,94,0.4)"
        />
        <RoadmapSection
          title="In Progress 🔄"
          items={IN_PROGRESS}
          accentColor="rgba(245,158,11,0.4)"
        />
        <RoadmapSection
          title="Coming Soon 🔮"
          items={COMING_SOON}
          accentColor="rgba(167,139,250,0.4)"
        />
      </main>

      <Footer />
    </div>
  )
}
