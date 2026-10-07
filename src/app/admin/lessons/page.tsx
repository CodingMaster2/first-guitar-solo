import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function AdminLessonsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const [allProgress, lessonComments] = await Promise.all([
    prisma.progress.findMany({ select: { day: true, completed: true, difficulty: true, rating: true } }),
    prisma.lessonComment.groupBy({ by: ['day'], _count: { _all: true } }),
  ])

  // Build comment lookup
  const commentByDay: Record<number, number> = {}
  for (const lc of lessonComments) {
    commentByDay[lc.day] = lc._count._all
  }

  // Build per-day stats
  type DayStat = {
    day: number
    completions: number
    attempts: number
    avgRating: number
    hardCount: number
    easyCount: number
    commentCount: number
  }

  const days: DayStat[] = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1
    const rows = allProgress.filter((p) => p.day === day)
    const completions = rows.filter((p) => p.completed).length
    const attempts = rows.length
    const ratingRows = rows.filter((p) => p.rating !== null && p.rating !== undefined)
    const avgRating =
      ratingRows.length > 0
        ? ratingRows.reduce((s, p) => s + (p.rating ?? 0), 0) / ratingRows.length
        : 0
    const hardCount = rows.filter((p) => p.difficulty === 'hard').length
    const easyCount = rows.filter((p) => p.difficulty === 'easy').length
    const commentCount = commentByDay[day] ?? 0
    return { day, completions, attempts, avgRating, hardCount, easyCount, commentCount }
  })

  const maxCompletions = Math.max(...days.map((d) => d.completions), 1)
  const totalCompletions = days.reduce((s, d) => s + d.completions, 0)
  const totalAttempts = days.reduce((s, d) => s + d.attempts, 0)
  const avgCompletionRate =
    totalAttempts > 0 ? Math.round((totalCompletions / totalAttempts) * 100) : 0
  const mostCompletedDay = days.reduce((a, b) => (a.completions >= b.completions ? a : b))
  const hardestDay = days.reduce((a, b) => (a.hardCount >= b.hardCount ? a : b))

  // Top 5 hardest days by hardCount (only if > 0)
  const sortedByHard = [...days].sort((a, b) => b.hardCount - a.hardCount)
  const top5HardDayNums = new Set(
    sortedByHard
      .slice(0, 5)
      .filter((d) => d.hardCount > 0)
      .map((d) => d.day),
  )

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="mb-7">
            <h1 className="text-2xl font-black text-white uppercase">Lesson Performance</h1>
            <p style={{ color: '#525252' }} className="text-xs mt-1">
              Which days students complete, struggle with, or drop off
            </p>
          </div>

          {/* Header stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
            {(
              [
                { label: 'Total Completions', value: totalCompletions.toLocaleString(), color: '#f59e0b' },
                { label: 'Avg Completion Rate', value: `${avgCompletionRate}%`, color: '#86efac' },
                {
                  label: 'Most Completed',
                  value: `Day ${mostCompletedDay.day}`,
                  color: '#93c5fd',
                },
                {
                  label: 'Hardest Day',
                  value: `Day ${hardestDay.day}`,
                  color: '#fca5a5',
                },
              ] as Array<{ label: string; value: string; color: string }>
            ).map((s) => (
              <div
                key={s.label}
                style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
                className="rounded-xl p-4"
              >
                <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-1">
                  {s.label}
                </p>
                <p style={{ color: s.color }} className="text-2xl font-black">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div
            style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
            className="rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid #1f1f1f',
                      backgroundColor: '#0d0d0d',
                    }}
                  >
                    {[
                      'Day',
                      'Completions',
                      'Completion Bar',
                      'Avg Rating',
                      'Difficulty',
                      'Comments',
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        style={{ color: '#525252' }}
                        className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((d) => {
                    const isHardTop5 = top5HardDayNums.has(d.day)
                    const barWidth =
                      maxCompletions > 0 ? (d.completions / maxCompletions) * 100 : 0
                    const fullStars = Math.round(d.avgRating)
                    return (
                      <tr
                        key={d.day}
                        style={{
                          borderBottom: '1px solid #161616',
                          borderLeft: isHardTop5
                            ? '3px solid #ef444480'
                            : '3px solid transparent',
                          backgroundColor: isHardTop5 ? '#110808' : undefined,
                        }}
                        className="hover:bg-neutral-900 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="text-white font-bold text-sm">Day {d.day}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span style={{ color: '#a3a3a3' }} className="text-sm">
                            {d.completions}
                          </span>
                          <span style={{ color: '#404040' }} className="text-xs ml-1">
                            / {d.attempts}
                          </span>
                        </td>
                        <td className="px-4 py-3" style={{ minWidth: '140px' }}>
                          <div
                            style={{
                              backgroundColor: '#1a1a1a',
                              height: '8px',
                              borderRadius: 4,
                              width: '120px',
                            }}
                          >
                            <div
                              style={{
                                width: `${barWidth}%`,
                                height: '8px',
                                borderRadius: 4,
                                backgroundColor: '#f59e0b',
                              }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3" style={{ minWidth: '120px' }}>
                          {d.avgRating > 0 ? (
                            <span style={{ color: '#f59e0b' }} className="text-sm">
                              {'★'.repeat(fullStars)}
                              {'☆'.repeat(5 - fullStars)}
                              <span
                                style={{
                                  color: '#737373',
                                  marginLeft: 6,
                                  fontSize: '0.7rem',
                                }}
                              >
                                {d.avgRating.toFixed(1)}
                              </span>
                            </span>
                          ) : (
                            <span style={{ color: '#404040' }} className="text-xs">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span style={{ color: '#737373', fontSize: '0.75rem' }}>
                            🔴 {d.hardCount} hard · 🟢 {d.easyCount} easy
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            style={{
                              color: d.commentCount > 0 ? '#a3a3a3' : '#404040',
                            }}
                            className="text-sm"
                          >
                            {d.commentCount}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/content/${d.day}`}
                            style={{
                              color: '#f59e0b',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                            className="hover:underline whitespace-nowrap"
                          >
                            Edit content →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
