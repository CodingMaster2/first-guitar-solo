import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.purchaseStatus !== 'PAID') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    await prisma.$transaction([
      prisma.progress.deleteMany({ where: { userId: session.user.id } }),
      prisma.practiceSession.deleteMany({ where: { userId: session.user.id } }),
      prisma.userAchievement.deleteMany({ where: { userId: session.user.id } }),
      prisma.coachMessage.deleteMany({ where: { userId: session.user.id } }),
      prisma.profile.update({
        where: { userId: session.user.id },
        data: { currentDay: 1, totalXP: 0, streak: 0, lastPracticeDate: null },
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Progress reset error:', error)
    return NextResponse.json({ error: 'Failed to reset progress' }, { status: 500 })
  }
}
