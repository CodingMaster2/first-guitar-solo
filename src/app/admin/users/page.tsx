import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const { page: pageParam } = await searchParams
  const page = parseInt(pageParam ?? '1')
  const limit = 20
  const skip = (page - 1) * limit

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        purchaseStatus: true,
        role: true,
        profile: {
          select: { currentDay: true, lastPracticeDate: true, streak: true, totalXP: true },
        },
        _count: { select: { progress: true } },
      },
    }),
    prisma.user.count(),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black text-white uppercase">Users</h1>
            <p style={{ color: '#a3a3a3' }} className="text-sm">{total} total</p>
          </div>

          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #262626', backgroundColor: '#1a1a1a' }}>
                    {['Email', 'Name', 'Joined', 'Status', 'Day', 'XP', 'Streak', 'Last Active'].map((h) => (
                      <th key={h} style={{ color: '#a3a3a3' }} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #1a1a1a' }} className="hover:bg-stone-900 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white text-xs">{user.email}</p>
                        {user.role === 'ADMIN' && (
                          <span style={{ color: '#f59e0b' }} className="text-xs">ADMIN</span>
                        )}
                      </td>
                      <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-xs">{user.name ?? '—'}</td>
                      <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span
                          style={{
                            backgroundColor: user.purchaseStatus === 'PAID' ? '#052e16' : '#1a1a1a',
                            color: user.purchaseStatus === 'PAID' ? '#86efac' : '#a3a3a3',
                            border: `1px solid ${user.purchaseStatus === 'PAID' ? '#166534' : '#262626'}`,
                          }}
                          className="text-xs px-2 py-0.5 rounded"
                        >
                          {user.purchaseStatus}
                        </span>
                      </td>
                      <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-xs">
                        {user.profile?.currentDay ?? '—'}
                      </td>
                      <td style={{ color: '#f59e0b' }} className="px-4 py-3 text-xs">
                        {user.profile?.totalXP ?? '—'}
                      </td>
                      <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-xs">
                        {user.profile?.streak ?? '—'}
                      </td>
                      <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-xs">
                        {user.profile?.lastPracticeDate
                          ? new Date(user.profile.lastPracticeDate).toLocaleDateString()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ borderTop: '1px solid #262626' }} className="px-4 py-3 flex items-center justify-between">
                <p style={{ color: '#a3a3a3' }} className="text-xs">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <a
                      href={`/admin/users?page=${page - 1}`}
                      style={{ border: '1px solid #262626', color: '#a3a3a3' }}
                      className="text-xs px-3 py-1 rounded hover:text-white transition-colors"
                    >
                      Previous
                    </a>
                  )}
                  {page < totalPages && (
                    <a
                      href={`/admin/users?page=${page + 1}`}
                      style={{ border: '1px solid #262626', color: '#a3a3a3' }}
                      className="text-xs px-3 py-1 rounded hover:text-white transition-colors"
                    >
                      Next
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
