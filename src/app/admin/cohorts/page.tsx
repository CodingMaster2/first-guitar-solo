import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'

async function createCohortAction(formData: FormData) {
  'use server'
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') return
  const name = formData.get('name')
  const startDate = formData.get('startDate')
  if (typeof name !== 'string' || typeof startDate !== 'string' || !name || !startDate) return
  await prisma.cohort.create({ data: { name, startDate: new Date(startDate) } })
  revalidatePath('/admin/cohorts')
}

export default async function AdminCohortsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const cohorts = await prisma.cohort.findMany({
    include: { users: { include: { profile: true, progress: true } } },
    orderBy: { startDate: 'desc' },
  })

  const cohortStats = cohorts.map((cohort) => {
    const total = cohort.users.length
    const day7 = cohort.users.filter((u) =>
      u.progress.some((p) => p.day === 7 && p.completed)
    ).length
    const graduated = cohort.users.filter((u) => u.profile?.soloCompleted === true).length
    const avgDay =
      total > 0
        ? Math.round(
            cohort.users.reduce((s: number, u) => s + (u.profile?.currentDay ?? 1), 0) / total
          )
        : 0
    const avgStreak =
      total > 0
        ? Math.round(
            cohort.users.reduce((s: number, u) => s + (u.profile?.streak ?? 0), 0) / total
          )
        : 0
    const day7Rate = total > 0 ? Math.round((day7 / total) * 100) : 0
    const gradRate = total > 0 ? Math.round((graduated / total) * 100) : 0
    return { cohort, total, day7, graduated, avgDay, avgStreak, day7Rate, gradRate }
  })

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <h1 className="text-2xl font-black text-white uppercase mb-7">Cohorts</h1>

          {/* Create Cohort */}
          <div
            style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
            className="rounded-xl p-5 mb-6"
          >
            <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Create Cohort
            </h2>
            <form action={createCohortAction} className="flex flex-wrap gap-3 items-end">
              <div className="flex flex-col gap-1">
                <label style={{ color: '#737373' }} className="text-xs">
                  Cohort Name
                </label>
                <input
                  name="name"
                  required
                  placeholder="e.g. October 2026"
                  style={{
                    backgroundColor: '#0a0a0a',
                    border: '1px solid #262626',
                    color: '#fff',
                  }}
                  className="px-3 py-2 rounded-lg text-sm min-w-48 focus:outline-none focus:border-amber-700 placeholder-neutral-600"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label style={{ color: '#737373' }} className="text-xs">
                  Start Date
                </label>
                <input
                  name="startDate"
                  type="date"
                  required
                  style={{
                    backgroundColor: '#0a0a0a',
                    border: '1px solid #262626',
                    color: '#fff',
                  }}
                  className="px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700"
                />
              </div>
              <button
                type="submit"
                style={{ backgroundColor: '#f59e0b', color: '#000' }}
                className="px-4 py-2 rounded-lg text-sm font-bold"
              >
                Create
              </button>
            </form>
          </div>

          {/* Cohorts Table */}
          {cohortStats.length === 0 ? (
            <div
              style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
              className="rounded-xl p-12 text-center"
            >
              <p className="text-white font-bold mb-2">No cohorts yet</p>
              <p style={{ color: '#525252' }} className="text-sm">
                Create a cohort above to start tracking cohort performance.
              </p>
            </div>
          ) : (
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
                        'Cohort Name',
                        'Start Date',
                        'Students',
                        'Day 7 Rate',
                        'Grad Rate',
                        'Avg Day',
                        'Avg Streak',
                      ].map((h) => (
                        <th
                          key={h}
                          style={{ color: '#525252' }}
                          className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cohortStats.map(
                      ({ cohort, total, avgDay, avgStreak, day7Rate, gradRate }) => (
                        <tr
                          key={cohort.id}
                          style={{ borderBottom: '1px solid #161616' }}
                          className="hover:bg-neutral-900 transition-colors"
                        >
                          <td className="px-4 py-3 text-white font-medium text-sm">
                            {cohort.name}
                          </td>
                          <td style={{ color: '#737373' }} className="px-4 py-3 text-xs">
                            {new Date(cohort.startDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-white text-sm font-bold">{total}</td>
                          <td className="px-4 py-3">
                            <span
                              style={{
                                color:
                                  day7Rate >= 50
                                    ? '#86efac'
                                    : day7Rate >= 25
                                    ? '#fbbf24'
                                    : '#fca5a5',
                              }}
                              className="text-sm font-bold"
                            >
                              {day7Rate}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              style={{
                                color:
                                  gradRate >= 30
                                    ? '#86efac'
                                    : gradRate >= 15
                                    ? '#f59e0b'
                                    : '#fca5a5',
                              }}
                              className="text-sm font-bold"
                            >
                              {gradRate}%
                            </span>
                          </td>
                          <td style={{ color: '#f59e0b' }} className="px-4 py-3 text-sm font-bold">
                            Day {avgDay}
                          </td>
                          <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-sm">
                            {avgStreak}d
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
