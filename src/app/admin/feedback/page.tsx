import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'

interface PageProps {
  searchParams: Promise<{ day?: string; rating?: string }>
}

export default async function AdminFeedbackPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const { day: dayParam, rating: ratingParam } = await searchParams
  const dayFilter = dayParam ? parseInt(dayParam) : undefined
  const ratingFilter = ratingParam ? parseInt(ratingParam) : undefined

  const feedback = await prisma.feedback.findMany({
    where: {
      ...(dayFilter ? { day: dayFilter } : {}),
      ...(ratingFilter ? { rating: ratingFilter } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { user: { select: { email: true } } },
  })

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <h1 className="text-2xl font-black text-white uppercase mb-6">Feedback</h1>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <form method="get" className="flex gap-3">
              <input
                name="day"
                type="number"
                defaultValue={dayFilter}
                placeholder="Filter by day"
                min="1"
                max="30"
                style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#ffffff' }}
                className="px-3 py-2 rounded-lg text-sm w-32 focus:outline-none placeholder-gray-600"
              />
              <select
                name="rating"
                defaultValue={ratingFilter}
                style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#ffffff' }}
                className="px-3 py-2 rounded-lg text-sm focus:outline-none"
              >
                <option value="">All ratings</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r} star{r !== 1 ? 's' : ''}</option>
                ))}
              </select>
              <button
                type="submit"
                style={{ backgroundColor: '#f59e0b', color: '#000' }}
                className="px-4 py-2 rounded-lg text-sm font-bold"
              >
                Filter
              </button>
              {(dayFilter || ratingFilter) && (
                <a
                  href="/admin/feedback"
                  style={{ border: '1px solid #262626', color: '#a3a3a3' }}
                  className="px-4 py-2 rounded-lg text-sm hover:text-white transition-colors"
                >
                  Clear
                </a>
              )}
            </form>
          </div>

          <div style={{ backgroundColor: '#111111', border: '1px solid #262626' }} className="rounded-xl overflow-hidden">
            {feedback.length === 0 ? (
              <p style={{ color: '#a3a3a3' }} className="p-6 text-sm">No feedback yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #262626', backgroundColor: '#1a1a1a' }}>
                      {['User', 'Day', 'Rating', 'Comment', 'Date'].map((h) => (
                        <th key={h} style={{ color: '#a3a3a3' }} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {feedback.map((f) => (
                      <tr key={f.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                        <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-xs">{f.user.email}</td>
                        <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-xs">{f.day ?? '—'}</td>
                        <td className="px-4 py-3">
                          {f.rating ? (
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <span key={n} style={{ color: n <= f.rating! ? '#f59e0b' : '#262626' }} className="text-sm">
                                  &#9733;
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: '#a3a3a3' }} className="text-xs">—</span>
                          )}
                        </td>
                        <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-xs max-w-xs">
                          <span className="line-clamp-2">{f.comment ?? '—'}</span>
                        </td>
                        <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-xs whitespace-nowrap">
                          {new Date(f.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
