import { notFound } from 'next/navigation'
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

  const lesson = LESSONS.find((l) => l.day === day)
  if (!lesson) notFound()

  const weekColors = ['#f59e0b', '#0ea5e9', '#a855f7', '#22c55e']
  const weekColor = weekColors[(lesson.week - 1) % weekColors.length]

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
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

        {/* CTA — full program */}
        <div
          style={{ backgroundColor: '#111111', border: '2px solid #f59e0b' }}
          className="rounded-xl p-8 text-center"
        >
          <div style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-4">
            Free Preview Complete
          </div>
          <h2 className="text-2xl font-black uppercase mb-3">
            This is Day 1 of 30.
          </h2>
          <p style={{ color: '#a3a3a3' }} className="text-sm leading-relaxed mb-6 max-w-md mx-auto">
            To track your progress, access the AI Guitar Coach, and unlock all 30 days of the
            blues-rock solo program, register for the full course.
          </p>
          <Link
            href="/register"
            style={{ backgroundColor: '#f59e0b', color: '#000000' }}
            className="inline-block text-base font-black px-8 py-4 rounded uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Start the Full Program &mdash; $25
          </Link>
          <p style={{ color: '#525252' }} className="text-xs mt-4">
            One-time payment &middot; 30-day money-back guarantee
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
