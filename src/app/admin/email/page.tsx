import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import EmailComposerClient from './EmailComposerClient'

export default async function AdminEmailPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const [totalCount, paidCount, freeCount, churnCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { purchaseStatus: 'PAID' } }),
    prisma.user.count({ where: { purchaseStatus: { not: 'PAID' } } }),
    prisma.profile.count({
      where: {
        user: { purchaseStatus: 'PAID' },
        OR: [
          { lastPracticeDate: null },
          { lastPracticeDate: { lt: new Date(Date.now() - 7 * 86400000) } },
        ],
      },
    }),
  ])

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="mb-7">
            <h1 className="text-2xl font-black text-white uppercase">Email Composer</h1>
            <p style={{ color: '#525252' }} className="text-xs mt-1">
              Send bulk emails to user segments
            </p>
          </div>
          <EmailComposerClient
            totalCount={totalCount}
            paidCount={paidCount}
            freeCount={freeCount}
            churnCount={churnCount}
          />
        </main>
      </div>
    </div>
  )
}
