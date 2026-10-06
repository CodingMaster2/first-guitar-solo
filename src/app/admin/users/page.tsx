import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import BatchUsersTable from './BatchUsersTable'

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string; status?: string; sort?: string }>
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const { page: pageParam, q, status, sort } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1'))
  const limit = 25
  const skip = (page - 1) * limit

  const where = {
    ...(q ? { OR: [{ email: { contains: q, mode: 'insensitive' as const } }, { name: { contains: q, mode: 'insensitive' as const } }] } : {}),
    ...(status === 'PAID' ? { purchaseStatus: 'PAID' } : status === 'UNPAID' ? { purchaseStatus: 'UNPAID' } : {}),
  }

  const orderBy =
    sort === 'xp' ? { profile: { totalXP: 'desc' as const } } :
    sort === 'streak' ? { profile: { streak: 'desc' as const } } :
    sort === 'oldest' ? { createdAt: 'asc' as const } :
    { createdAt: 'desc' as const }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        purchaseStatus: true,
        role: true,
        profile: { select: { currentDay: true, lastPracticeDate: true, streak: true, totalXP: true, bestStreak: true } },
        _count: { select: { progress: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(total / limit)
  const completedMap = await (async () => {
    const userIds = users.map((u) => u.id)
    const prog = await prisma.progress.findMany({
      where: { userId: { in: userIds }, completed: true },
      select: { userId: true, day: true },
    })
    const m = new Map<string, number>()
    for (const p of prog) m.set(p.userId, (m.get(p.userId) ?? 0) + 1)
    return m
  })()

  // Serialize for client component
  const serializedUsers = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    profile: u.profile ? {
      ...u.profile,
      lastPracticeDate: u.profile.lastPracticeDate ? u.profile.lastPracticeDate.toISOString() : null,
    } : null,
    completedCount: completedMap.get(u.id) ?? 0,
  }))

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const merged = { page: String(page), q: q ?? '', status: status ?? '', sort: sort ?? '', ...overrides }
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v)
    return `/admin/users?${params.toString()}`
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-white uppercase">Users</h1>
              <p style={{ color: '#525252' }} className="text-xs mt-1">{total} matching</p>
            </div>
          </div>

          {/* Filters */}
          <form method="get" className="flex flex-wrap gap-2 mb-5">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search email or name..."
              style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#fff' }}
              className="px-3 py-2 rounded-lg text-sm flex-1 min-w-48 focus:outline-none focus:border-amber-700 placeholder-neutral-600"
            />
            <select
              name="status"
              defaultValue={status ?? ''}
              style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#fff' }}
              className="px-3 py-2 rounded-lg text-sm focus:outline-none"
            >
              <option value="">All statuses</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
            </select>
            <select
              name="sort"
              defaultValue={sort ?? ''}
              style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#fff' }}
              className="px-3 py-2 rounded-lg text-sm focus:outline-none"
            >
              <option value="">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="xp">Most XP</option>
              <option value="streak">Longest streak</option>
            </select>
            <button
              type="submit"
              style={{ backgroundColor: '#f59e0b', color: '#000' }}
              className="px-4 py-2 rounded-lg text-sm font-bold"
            >
              Search
            </button>
            {(q || status || sort) && (
              <Link href="/admin/users" style={{ border: '1px solid #262626', color: '#737373' }} className="px-4 py-2 rounded-lg text-sm hover:text-white transition-colors">
                Clear
              </Link>
            )}
          </form>

          <BatchUsersTable users={serializedUsers} />

          {totalPages > 1 && (
            <div style={{ borderTop: '1px solid #1f1f1f', marginTop: '0' }} className="px-4 py-3 flex items-center justify-between">
              <p style={{ color: '#525252' }} className="text-xs">Page {page} of {totalPages} · {total} users</p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link href={buildUrl({ page: String(page - 1) })} style={{ border: '1px solid #262626', color: '#737373' }} className="text-xs px-3 py-1 rounded hover:text-white transition-colors">
                    ← Previous
                  </Link>
                )}
                {page < totalPages && (
                  <Link href={buildUrl({ page: String(page + 1) })} style={{ border: '1px solid #262626', color: '#737373' }} className="text-xs px-3 py-1 rounded hover:text-white transition-colors">
                    Next →
                  </Link>
                )}
              </div>
              </div>
            )}
        </main>
      </div>
    </div>
  )
}
