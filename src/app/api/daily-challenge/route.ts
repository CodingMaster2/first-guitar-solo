import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isToday(date: Date | null | undefined): boolean {
  if (!date) return false
  const d = new Date(date)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } })
    if (!profile) return NextResponse.json({ error: 'No profile' }, { status: 404 })

    const completedToday = isToday(profile.lastDailyChallengeDate)
    return NextResponse.json({
      streak: profile.dailyChallengeStreak,
      lastDate: profile.lastDailyChallengeDate,
      completedToday,
    })
  } catch (error) {
    console.error('Daily challenge GET error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.purchaseStatus !== 'PAID') {
      return NextResponse.json({ error: 'Payment required' }, { status: 403 })
    }

    const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } })
    if (!profile) return NextResponse.json({ error: 'No profile' }, { status: 404 })

    if (isToday(profile.lastDailyChallengeDate)) {
      return NextResponse.json({ already: true, streak: profile.dailyChallengeStreak })
    }

    const newStreak = profile.dailyChallengeStreak + 1
    await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        dailyChallengeStreak: newStreak,
        lastDailyChallengeDate: new Date(),
        totalXP: { increment: 25 },
      },
    })

    return NextResponse.json({ success: true, streak: newStreak })
  } catch (error) {
    console.error('Daily challenge POST error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
