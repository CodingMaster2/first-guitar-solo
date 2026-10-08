import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import FlagsList from './FlagsList'

export default async function AdminFlagsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') {
    return (
      <div
        style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}
        className="flex items-center justify-center"
      >
        <p style={{ color: '#fca5a5' }}>Access denied.</p>
      </div>
    )
  }

  const flags = await prisma.featureFlag.findMany({ orderBy: { key: 'asc' } })

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 min-w-0">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-6">
            Feature Flags
          </h1>
          <FlagsList initialFlags={flags} />
        </main>
      </div>
    </div>
  )
}
