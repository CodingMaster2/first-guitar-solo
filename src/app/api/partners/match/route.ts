import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id

  // Check if user already has an active partner
  const existing = await prisma.accountabilityPartner.findFirst({
    where: {
      OR: [{ userId }, { partnerId: userId }],
      status: 'active',
    },
  })
  if (existing) {
    return NextResponse.json({ error: 'You already have an active partner' }, { status: 400 })
  }

  // Get requester's profile
  const myProfile = await prisma.profile.findUnique({ where: { userId } })
  if (!myProfile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const myDay = myProfile.currentDay

  // Get users who already have a partner (active)
  const usersWithPartners = await prisma.accountabilityPartner.findMany({
    where: { status: 'active' },
    select: { userId: true, partnerId: true },
  })
  const excludedIds = new Set<string>([userId])
  for (const r of usersWithPartners) {
    excludedIds.add(r.userId)
    excludedIds.add(r.partnerId)
  }

  // Find the best match: PAID, within ±5 days, no existing partner, not self
  const candidates = await prisma.user.findMany({
    where: {
      purchaseStatus: 'PAID',
      id: { notIn: Array.from(excludedIds) },
    },
    include: {
      profile: { select: { currentDay: true } },
    },
  })

  const filtered = candidates.filter((c) => c.profile !== null)
  filtered.sort((a, b) => {
    const aDiff = Math.abs((a.profile?.currentDay ?? 0) - myDay)
    const bDiff = Math.abs((b.profile?.currentDay ?? 0) - myDay)
    return aDiff - bDiff
  })

  const match = filtered.find((c) => Math.abs((c.profile?.currentDay ?? 0) - myDay) <= 5)

  if (!match) {
    // No match found — create pending self-request placeholder so we can show "looking"
    await prisma.accountabilityPartner.upsert({
      where: { userId_partnerId: { userId, partnerId: userId } },
      create: { userId, partnerId: userId, status: 'pending' },
      update: { status: 'pending' },
    })
    return NextResponse.json({ pending: true })
  }

  // Create the match (both directions)
  await prisma.$transaction([
    prisma.accountabilityPartner.upsert({
      where: { userId_partnerId: { userId, partnerId: match.id } },
      create: { userId, partnerId: match.id, status: 'active' },
      update: { status: 'active' },
    }),
    prisma.accountabilityPartner.upsert({
      where: { userId_partnerId: { userId: match.id, partnerId: userId } },
      create: { userId: match.id, partnerId: userId, status: 'active' },
      update: { status: 'active' },
    }),
  ])

  return NextResponse.json({ matched: true, partnerId: match.id })
}
