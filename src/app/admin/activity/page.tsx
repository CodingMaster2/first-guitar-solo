import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

type ActivityEvent = {
  type: 'signup' | 'purchase' | 'lesson' | 'coach' | 'ticket'
  userId: string
  userEmail: string
  description: string
  timestamp: Date
  link?: string
}

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (seconds < 60) return `${seconds}s ago`
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'yesterday'
  return `${days}d ago`
}

const DOT_COLORS: Record<ActivityEvent['type'], string> = {
  signup: '#3b82f6',
  purchase: '#22c55e',
  lesson: '#f59e0b',
  coach: '#a855f7',
  ticket: '#ef4444',
}

const BADGE_LABELS: Record<ActivityEvent['type'], string> = {
  signup: 'SIGNUP',
  purchase: 'PAID',
  lesson: 'LESSON',
  coach: 'AI',
  ticket: 'TICKET',
}

const BADGE_BG: Record<ActivityEvent['type'], string> = {
  signup: '#0c1a3a',
  purchase: '#052e16',
  lesson: '#1a1200',
  coach: '#1e0a2e',
  ticket: '#1a0000',
}

export default async function AdminActivityPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const [
    recentSignups,
    recentPurchases,
    recentProgress,
    recentCoachMessages,
    recentTickets,
  ] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: {
        id: true,
        email: true,
        name: true,
        purchaseStatus: true,
        createdAt: true,
      },
    }),
    prisma.user.findMany({
      where: { purchaseStatus: 'PAID' },
      orderBy: { updatedAt: 'desc' },
      take: 20,
      select: { id: true, email: true, updatedAt: true },
    }),
    prisma.progress.findMany({
      where: { completed: true },
      orderBy: { completedAt: 'desc' },
      take: 40,
      select: {
        day: true,
        completedAt: true,
        userId: true,
        difficulty: true,
        rating: true,
        user: { select: { email: true, id: true } },
      },
    }),
    prisma.coachMessage.findMany({
      where: { role: 'user' },
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: { user: { select: { email: true, id: true } } },
    }),
    prisma.supportTicket.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { user: { select: { email: true, id: true } } },
    }),
  ])

  const events: ActivityEvent[] = []

  for (const u of recentSignups) {
    events.push({
      type: 'signup',
      userId: u.id,
      userEmail: u.email,
      description: `${u.email} signed up${u.name ? ` as ${u.name}` : ''}`,
      timestamp: u.createdAt,
      link: `/admin/users/${u.id}`,
    })
  }

  for (const u of recentPurchases) {
    events.push({
      type: 'purchase',
      userId: u.id,
      userEmail: u.email,
      description: `${u.email} became a paid member`,
      timestamp: u.updatedAt,
      link: `/admin/users/${u.id}`,
    })
  }

  for (const p of recentProgress) {
    if (!p.completedAt) continue
    const stars =
      p.rating !== null && p.rating !== undefined
        ? ' ' + '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating)
        : ''
    const diffText = p.difficulty ? ` (${p.difficulty})` : ''
    events.push({
      type: 'lesson',
      userId: p.user.id,
      userEmail: p.user.email,
      description: `${p.user.email} completed Day ${p.day}${stars}${diffText}`,
      timestamp: p.completedAt,
      link: `/admin/users/${p.user.id}`,
    })
  }

  for (const m of recentCoachMessages) {
    const preview =
      m.content.length > 70 ? m.content.slice(0, 70) + '…' : m.content
    events.push({
      type: 'coach',
      userId: m.user.id,
      userEmail: m.user.email,
      description: `${m.user.email} asked: “${preview}”`,
      timestamp: m.createdAt,
      link: `/admin/users/${m.user.id}`,
    })
  }

  for (const t of recentTickets) {
    events.push({
      type: 'ticket',
      userId: t.user.id,
      userEmail: t.user.email,
      description: `${t.user.email} opened ticket: ${t.subject}`,
      timestamp: t.createdAt,
      link: `/admin/support`,
    })
  }

  events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  const feed = events.slice(0, 100)

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      {/* Auto-refresh every 60s */}
      <meta httpEquiv="refresh" content="60" />
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="mb-7">
            <h1 className="text-2xl font-black text-white uppercase">Activity Feed</h1>
            <p style={{ color: '#525252' }} className="text-xs mt-1">
              Last 100 events across the platform · auto-refreshes every 60s
            </p>
          </div>

          <div
            style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
            className="rounded-xl overflow-hidden"
          >
            {feed.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p style={{ color: '#525252' }} className="text-sm">
                  No activity yet.
                </p>
              </div>
            ) : (
              <div>
                {feed.map((event, i) => (
                  <div
                    key={i}
                    style={{
                      borderBottom:
                        i < feed.length - 1 ? '1px solid #161616' : 'none',
                      padding: '12px 20px',
                    }}
                    className="flex items-start gap-3 hover:bg-neutral-900 transition-colors"
                  >
                    {/* Dot */}
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: DOT_COLORS[event.type],
                        flexShrink: 0,
                        marginTop: 6,
                      }}
                    />

                    {/* Badge */}
                    <div style={{ flexShrink: 0 }}>
                      <span
                        style={{
                          backgroundColor: BADGE_BG[event.type],
                          color: DOT_COLORS[event.type],
                          border: `1px solid ${DOT_COLORS[event.type]}40`,
                          borderRadius: 4,
                          padding: '2px 6px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                        }}
                      >
                        {BADGE_LABELS[event.type]}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="flex-1 min-w-0">
                      {event.link ? (
                        <Link
                          href={event.link}
                          style={{ color: '#d4d4d4', fontSize: '0.8rem', lineHeight: 1.4 }}
                          className="hover:text-white transition-colors"
                        >
                          {event.description}
                        </Link>
                      ) : (
                        <p
                          style={{ color: '#d4d4d4', fontSize: '0.8rem', lineHeight: 1.4 }}
                        >
                          {event.description}
                        </p>
                      )}
                    </div>

                    {/* Timestamp */}
                    <span
                      style={{
                        color: '#525252',
                        fontSize: '0.7rem',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {relativeTime(event.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
