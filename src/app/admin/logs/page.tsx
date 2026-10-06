import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminLogsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1'))
  const limit = 25
  const skip = (page - 1) * limit

  const [logs, total] = await Promise.all([
    prisma.adminLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { admin: { select: { email: true } } },
    }),
    prisma.adminLog.count(),
  ])

  const totalPages = Math.ceil(total / limit)

  const actionColors: Record<string, string> = {
    'create-announcement': '#93c5fd',
    'create-coupon': '#fcd34d',
    'support-ticket-update': '#86efac',
    'update-user-notes': '#c4b5fd',
    'bulk-grant-access': '#86efac',
    'bulk-revoke-access': '#fca5a5',
    'grant-access': '#86efac',
    'revoke-access': '#fca5a5',
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <h1 className="text-2xl font-black text-white uppercase mb-1">Action Log</h1>
          <p style={{ color: '#525252' }} className="text-xs mb-6">{total} total entries</p>

          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1f1f1f', backgroundColor: '#0d0d0d' }}>
                    {['Admin', 'Action', 'Target', 'Details', 'Date'].map((h) => (
                      <th key={h} style={{ color: '#525252' }} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #161616' }} className="hover:bg-neutral-900 transition-colors">
                      <td className="px-4 py-3">
                        <p style={{ color: '#a3a3a3' }} className="text-xs">{log.admin.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          style={{ color: actionColors[log.action] ?? '#737373' }}
                          className="text-xs font-mono font-medium"
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {log.target ? (
                          <span style={{ color: '#525252' }} className="text-xs font-mono truncate block max-w-32">{log.target}</span>
                        ) : (
                          <span style={{ color: '#404040' }} className="text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {log.details ? (
                          <span style={{ color: '#737373' }} className="text-xs">{log.details}</span>
                        ) : (
                          <span style={{ color: '#404040' }} className="text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ color: '#404040' }} className="text-xs whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center">
                        <p style={{ color: '#525252' }} className="text-sm">No log entries yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ borderTop: '1px solid #1f1f1f' }} className="px-4 py-3 flex items-center justify-between">
                <p style={{ color: '#525252' }} className="text-xs">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Link href={`/admin/logs?page=${page - 1}`} style={{ border: '1px solid #262626', color: '#737373' }} className="text-xs px-3 py-1 rounded hover:text-white transition-colors">
                      ← Previous
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link href={`/admin/logs?page=${page + 1}`} style={{ border: '1px solid #262626', color: '#737373' }} className="text-xs px-3 py-1 rounded hover:text-white transition-colors">
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
