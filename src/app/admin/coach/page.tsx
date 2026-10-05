import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ q?: string; user?: string; page?: string }>
}

export default async function AdminCoachPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const { q, user: userFilter, page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1'))
  const limit = 40
  const skip = (page - 1) * limit

  const where = {
    role: 'user' as const,
    ...(q ? { content: { contains: q, mode: 'insensitive' as const } } : {}),
    ...(userFilter ? { user: { email: { contains: userFilter, mode: 'insensitive' as const } } } : {}),
  }

  const [messages, total] = await Promise.all([
    prisma.coachMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { user: { select: { id: true, email: true, name: true } } },
    }),
    prisma.coachMessage.count({ where }),
  ])

  // Get top question topics by frequency — simple word frequency of unique non-trivial words
  const wordFreq: Record<string, number> = {}
  const stopWords = new Set(['the', 'a', 'an', 'is', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'but', 'i', 'my', 'it', 'do', 'how', 'what', 'can', 'me', 'that', 'this', 'with', 'be', 'are', 'was', 'im', "i'm", 'when', 'get', 'have', 'not', 'need', 'help'])
  for (const msg of messages) {
    const words = msg.content.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter((w) => w.length > 3 && !stopWords.has(w))
    for (const w of words) wordFreq[w] = (wordFreq[w] ?? 0) + 1
  }
  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)

  const totalPages = Math.ceil(total / limit)

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const merged = { q: q ?? '', user: userFilter ?? '', page: String(page), ...overrides }
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v)
    return `/admin/coach?${params.toString()}`
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-white uppercase">Coach Messages</h1>
              <p style={{ color: '#525252' }} className="text-xs mt-1">{total} questions from students</p>
            </div>
          </div>

          {/* Top words */}
          {topWords.length > 0 && (
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-4 mb-5">
              <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-3">Top Keywords</p>
              <div className="flex flex-wrap gap-2">
                {topWords.map(([word, count]) => (
                  <Link
                    key={word}
                    href={buildUrl({ q: word, page: '1' })}
                    style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', color: '#d4d4d4' }}
                    className="text-xs px-3 py-1 rounded-full hover:border-amber-700 hover:text-white transition-colors"
                  >
                    {word} <span style={{ color: '#525252' }}>×{count}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <form method="get" className="flex flex-wrap gap-2 mb-5">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search message content..."
              style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#fff' }}
              className="px-3 py-2 rounded-lg text-sm flex-1 min-w-48 focus:outline-none focus:border-amber-700 placeholder-neutral-600"
            />
            <input
              name="user"
              defaultValue={userFilter}
              placeholder="Filter by email..."
              style={{ backgroundColor: '#111111', border: '1px solid #262626', color: '#fff' }}
              className="px-3 py-2 rounded-lg text-sm w-48 focus:outline-none focus:border-amber-700 placeholder-neutral-600"
            />
            <button
              type="submit"
              style={{ backgroundColor: '#f59e0b', color: '#000' }}
              className="px-4 py-2 rounded-lg text-sm font-bold"
            >
              Search
            </button>
            {(q || userFilter) && (
              <Link href="/admin/coach" style={{ border: '1px solid #262626', color: '#737373' }} className="px-4 py-2 rounded-lg text-sm hover:text-white transition-colors">
                Clear
              </Link>
            )}
          </form>

          {/* Message list */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl overflow-hidden">
            {messages.length === 0 ? (
              <p style={{ color: '#525252' }} className="p-6 text-sm">No messages found.</p>
            ) : (
              <div className="divide-y" style={{ borderColor: '#161616' }}>
                {messages.map((msg) => (
                  <div key={msg.id} className="px-5 py-4 hover:bg-neutral-900 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Link
                            href={`/admin/users/${msg.user.id}`}
                            style={{ color: '#f59e0b' }}
                            className="text-xs font-medium hover:underline"
                          >
                            {msg.user.email}
                          </Link>
                          {msg.user.name && (
                            <span style={{ color: '#404040' }} className="text-xs">· {msg.user.name}</span>
                          )}
                        </div>
                        <p className="text-white text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p style={{ color: '#404040' }} className="text-xs whitespace-nowrap">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </p>
                        <p style={{ color: '#2a2a2a' }} className="text-xs">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div style={{ borderTop: '1px solid #1f1f1f' }} className="px-5 py-3 flex items-center justify-between">
                <p style={{ color: '#525252' }} className="text-xs">Page {page} of {totalPages} · {total} messages</p>
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
          </div>
        </main>
      </div>
    </div>
  )
}
