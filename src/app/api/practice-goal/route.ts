import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as { goalDays: number }
    const { goalDays } = body

    if (typeof goalDays !== 'number' || goalDays < 1 || goalDays > 7) {
      return NextResponse.json({ error: 'goalDays must be between 1 and 7' }, { status: 400 })
    }

    await prisma.profile.update({ where: { userId: session.user.id }, data: { weeklyGoalDays: goalDays } })

    return NextResponse.json({ ok: true, weeklyGoalDays: goalDays })
  } catch (error) {
    console.error('Practice goal error:', error)
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 })
  }
}
