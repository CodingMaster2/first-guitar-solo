import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id

  const partnership = await prisma.accountabilityPartner.findFirst({
    where: {
      OR: [{ userId }, { partnerId: userId }],
      status: 'active',
    },
  })

  if (!partnership) {
    // Check for pending requests sent TO this user
    const pendingRequests = await prisma.accountabilityPartner.findMany({
      where: { partnerId: userId, status: 'pending' },
      include: { user: { select: { id: true, name: true, email: true } } },
    })
    return NextResponse.json({ partner: null, pendingRequests })
  }

  // Determine which side we are
  const partnerId = partnership.userId === userId ? partnership.partnerId : partnership.userId
  const partnerUser = await prisma.user.findUnique({
    where: { id: partnerId },
    select: {
      id: true,
      name: true,
      email: true,
      profile: {
        select: {
          streak: true,
          lastPracticeDate: true,
          currentDay: true,
        },
      },
    },
  })

  return NextResponse.json({
    partner: partnerUser,
    partnershipId: partnership.id,
    connectedAt: partnership.createdAt,
    pendingRequests: [],
  })
}
