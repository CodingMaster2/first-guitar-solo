import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PartnerPageClient from './PartnerPageClient'

export const metadata = {
  title: 'Accountability Partner | First Guitar Solo',
}

export default async function PartnersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.purchaseStatus !== 'PAID') redirect('/success?new=true')

  const userId = session.user.id

  const [partnership, pendingRequests] = await Promise.all([
    prisma.accountabilityPartner.findFirst({
      where: {
        OR: [{ userId }, { partnerId: userId }],
        status: 'active',
      },
    }),
    prisma.accountabilityPartner.findMany({
      where: { partnerId: userId, status: 'pending', NOT: { userId } },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
  ])

  let partnerData: {
    id: string
    name: string | null
    email: string
    streak: number
    lastPracticeDate: Date | null
    currentDay: number
  } | null = null

  let partnershipId: string | null = null
  let connectedAt: Date | null = null

  if (partnership) {
    const partnerId = partnership.userId === userId ? partnership.partnerId : partnership.userId
    partnershipId = partnership.id
    connectedAt = partnership.createdAt

    const partnerUser = await prisma.user.findUnique({
      where: { id: partnerId },
      select: {
        id: true,
        name: true,
        email: true,
        profile: { select: { streak: true, lastPracticeDate: true, currentDay: true } },
      },
    })

    if (partnerUser) {
      partnerData = {
        id: partnerUser.id,
        name: partnerUser.name,
        email: partnerUser.email,
        streak: partnerUser.profile?.streak ?? 0,
        lastPracticeDate: partnerUser.profile?.lastPracticeDate ?? null,
        currentDay: partnerUser.profile?.currentDay ?? 1,
      }
    }
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-black text-white uppercase mb-2">Accountability Partner</h1>
        <p style={{ color: '#737373' }} className="text-sm mb-8">
          When your partner practices, you are 3x more likely to practice too.
        </p>

        <PartnerPageClient
          hasPartner={!!partnerData}
          partner={partnerData ? {
            ...partnerData,
            lastPracticeDate: partnerData.lastPracticeDate?.toISOString() ?? null,
            connectedAt: connectedAt?.toISOString() ?? null,
          } : null}
          partnershipId={partnershipId}
          pendingRequests={pendingRequests.map((r) => ({
            id: r.id,
            userId: r.userId,
            name: r.user.name,
            email: r.user.email,
          }))}
        />
      </main>
      <Footer />
    </div>
  )
}
