import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { LESSONS } from '@/lib/lessons'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import React from 'react'

const MILESTONES: Record<number, { title: string; desc: string; emoji: string }> = {
  7:  { title: 'Week 1 Complete!', desc: "You've built your foundation. The techniques start connecting now.", emoji: '🎯' },
  14: { title: 'Halfway There!', desc: 'Your fingers know the scale. Now you start sounding like a guitarist.', emoji: '⚡' },
  21: { title: 'Three Weeks In!', desc: 'The solo is taking shape. Most students say this is where it clicks.', emoji: '🔥' },
  30: { title: 'The Final Push!', desc: "One week left. You're so close to playing your first complete solo.", emoji: '🎸' },
}

export const metadata = {
  title: 'All 30 Lessons | First Guitar Solo',
}

export default async function LessonsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.purchaseStatus !== 'PAID') redirect('/success?new=true')

  const [profile, progress] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.progress.findMany({ where: { userId: session.user.id, completed: true } }),
  ])

  if (!profile) redirect('/onboarding')

  const completedDays = new Set(progress.map((p) => p.day))
  const currentDay = profile.currentDay
  const adaptivePath: number[] = profile?.adaptivePath ? JSON.parse(profile.adaptivePath as string) : []
  const adaptivePathSet = new Set(adaptivePath)

  const weekGroups = [
    { label: 'Week 1 — Lead Guitar Foundations', color: '#f59e0b', num: 1 },
    { label: 'Week 2 — Sounding Like a Lead Guitarist', color: '#0ea5e9', num: 2 },
    { label: 'Week 3 — Learn the Solo', color: '#a855f7', num: 3 },
    { label: 'Week 4 — Performance', color: '#22c55e', num: 4 },
  ]

  // Progress ring for badge: circumference ~138 (r=22)
  const pct = completedDays.size / 30
  const circumference = 2 * Math.PI * 22
  const dashOffset = circumference * (1 - pct)

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'First Guitar Solo — 30-Day Program',
    description:
      'Learn to play your first guitar solo in 30 days with structured daily lessons, AI coaching, and spaced repetition.',
    provider: {
      '@type': 'Organization',
      name: 'Sixth String Labs',
      url: 'https://firstguitarsolo.com',
    },
    numberOfLessons: 30,
    timeRequired: 'PT30D',
    educationalLevel: 'Beginner',
    teaches:
      'Electric guitar soloing techniques including bends, hammer-ons, pull-offs, vibrato, and pentatonic scales',
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase">All 30 Lessons</h1>
            <p style={{ color: '#a3a3a3' }} className="text-sm mt-1">The complete curriculum, one lesson at a time.</p>
          </div>
          {/* Progress ring badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="22" fill="none" stroke="#1f1f1f" strokeWidth="3" />
              <circle
                cx="26" cy="26" r="22" fill="none"
                stroke="#f59e0b" strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 26 26)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
              <text x="26" y="30" textAnchor="middle" style={{ fontSize: 10, fontWeight: 900, fill: '#f59e0b', fontFamily: 'inherit' }}>
                {completedDays.size}/30
              </text>
            </svg>
            <div>
              <p style={{ color: '#f59e0b', fontWeight: 900, fontSize: '1rem', lineHeight: 1 }}>{completedDays.size}/30</p>
              <p style={{ color: '#525252', fontSize: '0.7rem' }}>complete</p>
            </div>
          </div>
        </div>

        {adaptivePath.length > 0 && (
          <div
            style={{ backgroundColor: '#1a1200', border: '1px solid #78350f' }}
            className="rounded-xl p-4 mb-8 flex flex-wrap items-center gap-3"
          >
            <div>
              <p style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-wider">
                Your Personalized Path — {adaptivePath.length} Lessons
              </p>
              <p style={{ color: '#d97706' }} className="text-xs mt-0.5">
                Following your path:&nbsp;
                {adaptivePath.slice(0, 8).map((d, i) => (
                  <span key={d}>
                    Day {d}{i < Math.min(adaptivePath.length - 1, 7) ? ' → ' : ''}
                  </span>
                ))}
                {adaptivePath.length > 8 && <span> → … → Day {adaptivePath[adaptivePath.length - 1]}</span>}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-10">
          {weekGroups.map((week) => {
            const weekLessons = LESSONS.filter((l) => l.week === week.num)
            const weekDone = weekLessons.filter((l) => completedDays.has(l.day)).length
            return (
              <div key={week.num}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div style={{ backgroundColor: week.color, width: 3, height: 20, borderRadius: 2 }} />
                    <h2 style={{ color: week.color }} className="font-bold text-sm uppercase tracking-wider">
                      {week.label}
                    </h2>
                  </div>
                  <span style={{ color: '#525252' }} className="text-xs">
                    {weekDone}/{weekLessons.length}
                  </span>
                </div>
                {/* Week progress bar */}
                <div style={{ height: 2, backgroundColor: '#1f1f1f', borderRadius: 1, marginBottom: 16 }}>
                  <div style={{ height: '100%', width: `${(weekDone / weekLessons.length) * 100}%`, backgroundColor: week.color, borderRadius: 1, transition: 'width 0.5s ease' }} />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {weekLessons.map((lesson) => {
                    const isDone = completedDays.has(lesson.day)
                    const isCurrent = lesson.day === currentDay
                    const isInPath = adaptivePathSet.size > 0 && adaptivePathSet.has(lesson.day)
                    const pathBorder = isInPath && !isDone && !isCurrent ? '#92400e' : undefined
                    const difficultyFilled = Math.min(5, Math.ceil(lesson.day / 6))
                    const milestone = MILESTONES[lesson.day]
                    return (
                      <React.Fragment key={lesson.day}>
                        <Link
                          href={`/lesson/${lesson.day}`}
                          style={{
                            background: isDone ? 'linear-gradient(135deg, #0f0c00, #111111)' : '#111111',
                            border: `1px solid ${isDone ? '#78350f' : isCurrent ? '#f59e0b' : pathBorder ?? '#262626'}`,
                            minHeight: 160,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                          className="p-4 rounded-lg hover:border-amber-600 transition-all group block"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span style={{ color: isDone ? '#f59e0b' : isCurrent ? '#f59e0b' : '#525252' }} className="text-xs font-bold">
                              Day {lesson.day}
                              {isCurrent && <span className="ml-1 text-xs">← Today</span>}
                            </span>
                            {isDone && (
                              <div style={{
                                width: 20, height: 20, borderRadius: '50%',
                                backgroundColor: '#f59e0b',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <span style={{ color: '#000', fontSize: 11, fontWeight: 900 }}>✓</span>
                              </div>
                            )}
                          </div>
                          <h3 className="text-white text-sm font-bold mb-1 group-hover:text-amber-400 transition-colors leading-snug">
                            {lesson.title}
                          </h3>
                          <p style={{ color: '#525252' }} className="text-xs mb-3 leading-snug line-clamp-2">
                            {lesson.subtitle}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              style={{ color: '#525252', backgroundColor: '#1a1a1a', border: '1px solid #1f1f1f' }}
                              className="text-xs px-2 py-0.5 rounded"
                            >
                              {lesson.duration} min
                            </span>
                            <span
                              style={{ color: '#d97706', backgroundColor: '#1a0f00', border: '1px solid #44240f' }}
                              className="text-xs px-2 py-0.5 rounded font-bold"
                            >
                              +{lesson.xpReward} XP
                            </span>
                            {lesson.soloSection && (
                              <span
                                style={{ color: '#a855f7', backgroundColor: '#1a0f1a', border: '1px solid #3b1f3b' }}
                                className="text-xs px-2 py-0.5 rounded font-bold"
                              >
                                Solo §{lesson.soloSection}
                              </span>
                            )}
                            {isInPath && !isDone && (
                              <span
                                style={{ color: '#f59e0b', backgroundColor: '#1a1200', border: '1px solid #78350f' }}
                                className="text-xs px-2 py-0.5 rounded font-bold"
                              >
                                Your Path
                              </span>
                            )}
                          </div>
                          {/* Difficulty dots */}
                          <div className="flex gap-1 mt-auto pt-3">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div key={i} style={{
                                width: 6, height: 6, borderRadius: '50%',
                                backgroundColor: i < difficultyFilled ? '#f59e0b' : '#262626',
                              }} />
                            ))}
                          </div>
                        </Link>
                        {milestone && (
                          <div
                            style={{
                              gridColumn: '1 / -1',
                              backgroundColor: '#0a0801',
                              border: '1px solid #1f1f1f',
                              borderLeft: '4px solid #f59e0b',
                              borderRadius: '0.5rem',
                              padding: '14px 20px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 14,
                            }}
                          >
                            <span style={{ fontSize: '1.75rem', lineHeight: 1, flexShrink: 0 }}>{milestone.emoji}</span>
                            <div>
                              <p style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.9rem', margin: 0 }}>{milestone.title}</p>
                              <p style={{ color: '#a3a3a3', fontSize: '0.8rem', margin: '2px 0 0', lineHeight: 1.5 }}>{milestone.desc}</p>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  )
}
