import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { LESSONS } from '@/lib/lessons'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface PageProps {
  params: Promise<{ day: string }>
}

export default async function LessonPreviewPage({ params }: PageProps) {
  const { day: dayParam } = await params
  const day = parseInt(dayParam)
  if (isNaN(day) || day < 1 || day > 30) notFound()

  // Days 2–30 require registration
  if (day !== 1) {
    redirect('/register?ref=preview&message=Start+from+Day+1+free')
  }

  const lesson = LESSONS.find((l) => l.day === day)
  if (!lesson) notFound()

  const weekColors = ['#f59e0b', '#0ea5e9', '#a855f7', '#22c55e']
  const weekColor = weekColors[(lesson.week - 1) % weekColors.length]

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      {/* Amber top banner — Day 1 only */}
      <div
        style={{
          backgroundColor: '#f59e0b',
          color: '#000000',
          textAlign: 'center',
          padding: '0.5rem 1rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
        }}
      >
        Free Preview — Day 1 of 30 &nbsp;·&nbsp; No account required
      </div>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Free preview badge */}
        <div className="mb-6 flex items-center gap-3">
          <span
            style={{ backgroundColor: '#1a1a1a', color: '#f59e0b', border: '1px solid #262626' }}
            className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded"
          >
            Free Preview
          </span>
          <span style={{ color: '#525252' }} className="text-xs">Day {day} of 30</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div style={{ color: weekColor }} className="text-xs font-bold uppercase tracking-widest mb-2">
            Week {lesson.week} &bull; Day {lesson.day}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase mb-2">{lesson.title}</h1>
          <p style={{ color: '#a3a3a3' }} className="text-base">{lesson.subtitle}</p>
        </div>

        {/* Why it matters */}
        <section style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-6">
          <div style={{ color: weekColor }} className="text-xs font-bold uppercase tracking-widest mb-3">
            Why This Matters
          </div>
          <p style={{ color: '#d4d4d4' }} className="text-sm leading-relaxed">{lesson.why}</p>
        </section>

        {/* Main content */}
        <section className="mb-6">
          <div style={{ color: '#a3a3a3' }} className="text-xs font-bold uppercase tracking-widest mb-4">
            Lesson Content
          </div>
          <div
            className="prose-custom"
            style={{ color: '#d4d4d4' }}
            dangerouslySetInnerHTML={{ __html: lesson.mainContent }}
          />
        </section>

        {/* Exercise */}
        <section style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl p-6 mb-8">
          <div style={{ color: weekColor }} className="text-xs font-bold uppercase tracking-widest mb-3">
            Today&apos;s Exercise
          </div>
          <p style={{ color: '#d4d4d4' }} className="text-sm leading-relaxed">{lesson.exercise}</p>
        </section>

        {/* CTA — Day 1 completion card */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '2px solid #f59e0b',
            borderRadius: '0.75rem',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}
          >
            Free Preview Complete
          </div>
          <h2
            style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              fontWeight: 800,
              marginBottom: '0.625rem',
            }}
          >
            You just completed Day 1 — for free.
          </h2>
          <p
            style={{
              color: '#a3a3a3',
              fontSize: '0.9rem',
              lineHeight: 1.65,
              marginBottom: '1.75rem',
              maxWidth: '28rem',
              margin: '0 auto 1.75rem',
            }}
          >
            Join 500+ students who&apos;ve learned their first guitar solo. Unlock all 30 days, the AI
            Guitar Coach, and progress tracking.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <Link
              href="/register"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000000',
                fontWeight: 900,
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '1rem 2.25rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
              }}
            >
              Start Learning — $25
            </Link>
            <a
              href="#the-curriculum"
              style={{
                color: '#a3a3a3',
                fontSize: '0.875rem',
                textDecoration: 'none',
                border: '1px solid #262626',
                borderRadius: '0.5rem',
                padding: '0.75rem 1.5rem',
                display: 'inline-block',
              }}
            >
              See what&apos;s in the course ↓
            </a>
          </div>
          <p style={{ color: '#525252', fontSize: '0.75rem', marginTop: '1rem' }}>
            One-time payment &middot; 30-day money-back guarantee
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
