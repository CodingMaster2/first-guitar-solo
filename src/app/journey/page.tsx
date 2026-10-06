import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { LESSONS } from '@/lib/lessons'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JourneyFretboard from '@/components/JourneyFretboard'

// ─── Week definitions for this page ──────────────────────────────────────────

const WEEK_DEFS = [
  { label: 'Week 1', days: [1, 2, 3, 4, 5, 6, 7, 8],        theme: 'Foundations — Open Strings & Fret 5' },
  { label: 'Week 2', days: [9, 10, 11, 12, 13, 14, 15, 16], theme: 'Pentatonic Box 1 — Frets 7 & 9' },
  { label: 'Week 3', days: [17, 18, 19, 20, 21, 22],         theme: 'Pentatonic Box 2 — Frets 9 & 12' },
  { label: 'Week 4', days: [23, 24, 25, 26, 27, 28, 29, 30], theme: 'Upper Positions — Frets 12 & 14' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function JourneyPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.purchaseStatus !== 'PAID') redirect('/success?new=true')

  const [profile, completedRecords] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.progress.findMany({
      where: { userId: session.user.id, completed: true },
      select: { day: true },
    }),
  ])

  if (!profile) redirect('/onboarding')

  const completedDays = completedRecords.map(p => p.day)
  const completedSet = new Set(completedDays)
  const currentDay = profile.currentDay
  const totalUnlocked = completedDays.length

  const currentWeekIndex = WEEK_DEFS.findIndex(w => w.days.includes(currentDay))
  const currentWeek = currentWeekIndex >= 0 ? currentWeekIndex + 1 : 1

  const nextMilestone = (() => {
    for (const m of [5, 10, 15, 20, 25, 30]) {
      if (totalUnlocked < m) return m
    }
    return 30
  })()

  const lessons = LESSONS.map(l => ({ day: l.day, title: l.title }))

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            <span style={{ color: '#f59e0b' }}>Guitar</span> Journey
          </h1>
          <p style={{ color: '#a3a3a3' }} className="text-sm mt-1">
            Track every note you&apos;ve unlocked on the neck
          </p>
        </div>

        {/* ── Fretboard card ─────────────────────────────────────────────── */}
        <div
          style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
          className="rounded-xl p-4 sm:p-6 mb-6"
        >
          <p style={{ color: '#525252' }} className="text-xs uppercase tracking-widest mb-4 font-bold">
            Guitar Neck — Frets 0–14
          </p>

          <JourneyFretboard
            completedDays={completedDays}
            currentDay={currentDay}
            lessons={lessons}
          />

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-5 pt-4" style={{ borderTop: '1px solid #1f1f1f' }}>
            {[
              { fill: '#f59e0b', stroke: '#d97706', label: 'Unlocked', opacity: 1 },
              { fill: '#2a1800', stroke: '#f59e0b', label: `Today (Day ${currentDay})`, opacity: 1 },
              { fill: '#1a1510', stroke: '#2e2820', label: 'Locked', opacity: 0.4 },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <circle
                    cx="7" cy="7" r="6"
                    fill={item.fill}
                    stroke={item.stroke}
                    strokeWidth="1"
                    opacity={item.opacity}
                  />
                </svg>
                <span style={{ color: '#525252' }} className="text-xs">{item.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <svg width="24" height="8" viewBox="0 0 24 8">
                <line x1="0" y1="4" x2="24" y2="4" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
              </svg>
              <span style={{ color: '#525252' }} className="text-xs">Journey path</span>
            </div>
          </div>
        </div>

        {/* ── Stats row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {[
            {
              label: 'Positions Unlocked',
              value: `${totalUnlocked}/30`,
              sub: `${Math.round((totalUnlocked / 30) * 100)}% of the neck`,
              color: '#ffffff',
            },
            {
              label: 'Current Week',
              value: `Week ${currentWeek}`,
              sub: WEEK_DEFS[currentWeekIndex >= 0 ? currentWeekIndex : 0]?.theme.split(' — ')[0] ?? '',
              color: '#f59e0b',
            },
            {
              label: 'Next Milestone',
              value: `Day ${nextMilestone}`,
              sub: totalUnlocked >= 30
                ? 'All unlocked!'
                : `${nextMilestone - totalUnlocked} position${nextMilestone - totalUnlocked === 1 ? '' : 's'} away`,
              color: '#f59e0b',
            },
          ].map(stat => (
            <div
              key={stat.label}
              style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
              className="rounded-lg p-4"
            >
              <p style={{ color: '#a3a3a3' }} className="text-xs uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p style={{ color: stat.color }} className="text-2xl font-black">
                {stat.value}
              </p>
              <p style={{ color: '#525252' }} className="text-xs mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Week breakdown cards ───────────────────────────────────────── */}
        <div
          style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
          className="rounded-xl p-5 mb-8"
        >
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
            Week Breakdown
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WEEK_DEFS.map((week, wi) => {
              const done = week.days.filter(d => completedSet.has(d)).length
              const pct = Math.round((done / week.days.length) * 100)
              const isCurrentWeek = wi + 1 === currentWeek
              const [weekName, weekTheme] = week.theme.split(' — ')

              return (
                <div
                  key={week.label}
                  style={{
                    backgroundColor: '#0e0e0e',
                    border: `1px solid ${isCurrentWeek ? '#f59e0b' : '#1f1f1f'}`,
                  }}
                  className="rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-white font-bold text-sm">{weekName}</span>
                    {isCurrentWeek && (
                      <span
                        style={{
                          backgroundColor: '#1a1000',
                          color: '#f59e0b',
                          border: '1px solid #78350f',
                        }}
                        className="text-xs px-2 py-0.5 rounded font-bold"
                      >
                        Now
                      </span>
                    )}
                  </div>

                  <p style={{ color: '#525252' }} className="text-xs mb-3 leading-snug">
                    {weekTheme}
                  </p>

                  {/* Progress bar */}
                  <div
                    style={{
                      backgroundColor: '#1a1a1a',
                      height: 4,
                      borderRadius: 9999,
                      marginBottom: 10,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: 4,
                        borderRadius: 9999,
                        background:
                          pct === 100
                            ? 'linear-gradient(90deg, #f59e0b, #fde68a)'
                            : '#f59e0b',
                        width: `${pct}%`,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>

                  {/* Day circles */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {week.days.map(day => {
                      const isDone = completedSet.has(day)
                      const isTodayDay = day === currentDay
                      const lessonTitle = lessons.find(l => l.day === day)?.title ?? ''

                      return (
                        <Link
                          key={day}
                          href={`/lesson/${day}`}
                          title={`Day ${day}: ${lessonTitle}`}
                          aria-label={`Go to Day ${day}: ${lessonTitle}`}
                        >
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              backgroundColor: isDone
                                ? '#f59e0b'
                                : isTodayDay
                                  ? '#2a1800'
                                  : '#1a1a1a',
                              border: isTodayDay
                                ? '1.5px solid #f59e0b'
                                : isDone
                                  ? '1px solid #d97706'
                                  : '1px solid #2a2a2a',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'transform 0.15s',
                            }}
                            className="hover:scale-110"
                          >
                            <span
                              style={{
                                color: isDone ? '#000' : isTodayDay ? '#f59e0b' : '#404040',
                                fontSize: '0.5rem',
                                fontWeight: 900,
                                fontFamily: 'monospace',
                              }}
                            >
                              {day}
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>

                  <p style={{ color: '#a3a3a3' }} className="text-xs">
                    {done}/{week.days.length} done{pct === 100 ? ' ✓' : ''}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Quick nav ──────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#a3a3a3' }}
            className="text-xs px-4 py-2.5 rounded-lg hover:border-amber-600 hover:text-white transition-colors font-bold uppercase tracking-wider"
          >
            ← Dashboard
          </Link>
          <Link
            href={`/lesson/${currentDay}`}
            style={{ backgroundColor: '#f59e0b', color: '#000' }}
            className="text-xs px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity font-black uppercase tracking-wider"
          >
            Today&apos;s Lesson →
          </Link>
          <Link
            href="/techniques"
            style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#a3a3a3' }}
            className="text-xs px-4 py-2.5 rounded-lg hover:border-amber-600 hover:text-white transition-colors font-bold uppercase tracking-wider"
          >
            Technique Library
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  )
}
