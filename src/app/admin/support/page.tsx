import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import SupportTicketList from './SupportTicketList'

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function SupportPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const { status } = await searchParams

  const tickets = await prisma.supportTicket.findMany({
    where: status && status !== 'all' ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { email: true, name: true } } },
  })

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto max-w-5xl">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-black text-white uppercase">Support Inbox</h1>
          </div>
          <p style={{ color: '#525252' }} className="text-xs mb-5">
            {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} {status && status !== 'all' ? `· ${status}` : ''}
          </p>

          {/* Status filter */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {(['all', 'open', 'resolved', 'closed'] as const).map((s) => (
              <a
                key={s}
                href={`/admin/support${s !== 'all' ? `?status=${s}` : ''}`}
                style={{
                  backgroundColor: (status ?? 'all') === s ? '#1a1a1a' : 'transparent',
                  border: `1px solid ${(status ?? 'all') === s ? '#f59e0b' : '#262626'}`,
                  color: (status ?? 'all') === s ? '#f59e0b' : '#737373',
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize hover:text-white transition-colors"
              >
                {s}
              </a>
            ))}
          </div>

          <SupportTicketList tickets={tickets.map((t) => ({
            id: t.id,
            subject: t.subject,
            message: t.message,
            status: t.status,
            reply: t.reply,
            repliedAt: t.repliedAt ? t.repliedAt.toISOString() : null,
            createdAt: t.createdAt.toISOString(),
            user: t.user,
          }))} />
        </main>
      </div>
    </div>
  )
}
