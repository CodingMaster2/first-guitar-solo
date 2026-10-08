import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import BatchUsersTable from './BatchUsersTable'
import UserFilters from './UserFilters'

interface PageProps {
  searchParams: Promise<{ page?: string; q?: string; status?: string; sort?: string; activity?: string }>
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const { page: pageParam, q, status, sort, activity } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1'))
  const limit = 25
  const skip = (page - 1) * limit

  const now = new Date()
  const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(now.getDate() - 7)
  const twoDaysAgo = new Date(now); twoDaysAgo.setDate(now.getDate() - 2)
  const fiveDaysAgo = new Date(now); fiveDaysAgo.setDate(now.getDate() - 5)

  // Build where clause using AND to avoid OR key conflicts
  const andFilters: Prisma.UserWhereInput[] = []

  if (q) {
    andFilters.push({
      OR: [
        { email: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ],
    })
  }

  if (status === 'PAID') {
    andFilters.push({ purchaseStatus: 'PAID' })
  } else if (status === 'FREE') {
    andFilters.push({ purchaseStatus: 'UNPAID' })
  }

  if (activity === 'active') {
    andFilters.push({ profile: { lastPracticeDate: { gte: sevenDaysAgo } } })
  } else if (activity === 'inactive') {
    andFilters.push({ profile: { lastPracticeDate: { lt: sevenDaysAgo } } })
  } else if (activity === 'never') {
    andFilters.push({
      OR: [
        { profile: { is: null } },
        { profile: { lastPracticeDate: null } },
      ],
    })
  } else if (activity === 'at-risk') {
    andFilters.push({
      profile: { lastPracticeDate: { gte: fiveDaysAgo, lt: twoDaysAgo } },
    })
  } else if (activity === 'churned') {
    andFilters.push({
      OR: [
        { profile: { lastPracticeDate: { lt: fiveDaysAgo } } },
      ],
    })
  }

  const where: Prisma.UserWhereInput = andFilters.length > 0 ? { AND: andFilters } : {}

  const orderBy: Prisma.UserOrderByWithRelationInput =
    sort === 'xp' ? { profile: { totalXP: 'desc' } } :
    sort === 'streak' ? { profile: { streak: 'desc' } } :
    sort === 'oldest' ? { createdAt: 'asc' } :
    { createdAt: 'desc' }

  const [users, total, paidCount, freeCount] = await Promise.all([
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
        utmSource: true,
        profile: { select: { currentDay: true, lastPracticeDate: true, streak: true, totalXP: true, bestStreak: true } },
        _count: { select: { progress: true } },
      },
    }),
    prisma.user.count({ where }),
    prisma.user.count({ where: { ...where, purchaseStatus: 'PAID' } }),
    prisma.user.count({ where: { ...where, purchaseStatus: 'UNPAID' } }),
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

  // Avg current day across the current page
  const avgCurrentDay = serializedUsers.length > 0
    ? Math.round(serializedUsers.reduce((s, u) => s + (u.profile?.currentDay ?? 1), 0) / serializedUsers.length)
    : 0

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const merged = {
      page: String(page),
      q: q ?? '',
      status: status ?? '',
      sort: sort ?? '',
      activity: activity ?? '',
      ...overrides,
    }
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
            <a
              href="/api/admin/users/export"
              download
              style={{
                backgroundColor: '#111111',
                border: '1px solid #262626',
                color: '#a3a3a3',
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: '0.75rem',
                textDecoration: 'none',
              }}
            >
              ⬇ Export CSV
            </a>
          </div>

          {/* Filters */}
          <UserFilters />

          {/* Summary stats bar */}
          <div
            className="flex flex-wrap gap-4 px-4 py-3 rounded-lg mb-4"
            style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
          >
            <div>
              <span style={{ color: '#525252' }} className="text-xs">Total results </span>
              <span className="text-white text-xs font-bold">{total}</span>
            </div>
            <div style={{ color: '#404040' }} className="text-xs">·</div>
            <div>
              <span style={{ color: '#525252' }} className="text-xs">Paid </span>
              <span style={{ color: '#86efac' }} className="text-xs font-bold">{paidCount}</span>
            </div>
            <div style={{ color: '#404040' }} className="text-xs">·</div>
            <div>
              <span style={{ color: '#525252' }} className="text-xs">Free </span>
              <span style={{ color: '#737373' }} className="text-xs font-bold">{freeCount}</span>
            </div>
            <div style={{ color: '#404040' }} className="text-xs">·</div>
            <div>
              <span style={{ color: '#525252' }} className="text-xs">Avg day (page) </span>
              <span style={{ color: '#f59e0b' }} className="text-xs font-bold">{avgCurrentDay}</span>
            </div>
          </div>

          {/* Empty state */}
          {total === 0 ? (
            <div
              className="rounded-xl p-12 text-center"
              style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
            >
              <p className="text-white font-bold mb-2">No users match these filters</p>
              <p style={{ color: '#525252' }} className="text-sm mb-4">
                Try adjusting the search term, status, or activity filter.
              </p>
              <Link
                href="/admin/users"
                style={{ backgroundColor: '#f59e0b', color: '#000' }}
                className="inline-block px-4 py-2 rounded-lg text-sm font-bold hover:opacity-80 transition-opacity"
              >
                Clear filters
              </Link>
            </div>
          ) : (
            <BatchUsersTable users={serializedUsers} />
          )}

          {totalPages > 1 && (
            <div style={{ borderTop: '1px solid #1f1f1f', marginTop: '0' }} className="px-4 py-3 flex items-center justify-between">
              <p style={{ color: '#525252' }} className="text-xs">Page {page} of {totalPages} · {total} users</p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={buildUrl({ page: String(page - 1) })}
                    style={{ border: '1px solid #262626', color: '#737373' }}
                    className="text-xs px-3 py-1 rounded hover:text-white transition-colors"
                  >
                    ← Previous
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={buildUrl({ page: String(page + 1) })}
                    style={{ border: '1px solid #262626', color: '#737373' }}
                    className="text-xs px-3 py-1 rounded hover:text-white transition-colors"
                  >
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
