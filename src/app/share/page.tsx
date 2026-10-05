import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShareCard from './ShareCard'

export default async function SharePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.purchaseStatus !== 'PAID') redirect('/dashboard')

  // Check Day 30 completion
  const day30 = await prisma.progress.findUnique({
    where: { userId_day: { userId: session.user.id, day: 30 } },
  })

  if (!day30?.completed) redirect('/dashboard')

  const completedAt = day30.completedAt ?? new Date()

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      <Navbar />
      <ShareCard
        name={session.user.name ?? 'Guitarist'}
        completedAt={completedAt.toISOString()}
      />
      <Footer />
    </div>
  )
}
