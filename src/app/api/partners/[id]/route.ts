import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type RouteContext = { params: Promise<unknown> }

export async function DELETE(_req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params as { id: string }
  const userId = session.user.id

  // Find the partnership record
  const partnership = await prisma.accountabilityPartner.findFirst({
    where: {
      id,
      OR: [{ userId }, { partnerId: userId }],
    },
  })

  if (!partnership) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const otherId = partnership.userId === userId ? partnership.partnerId : partnership.userId

  // Set both sides to inactive
  await prisma.accountabilityPartner.updateMany({
    where: {
      OR: [
        { userId, partnerId: otherId },
        { userId: otherId, partnerId: userId },
      ],
    },
    data: { status: 'inactive' },
  })

  return NextResponse.json({ ok: true })
}
