import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<unknown> }

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') return null
  return session
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params as { id: string }
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      progress: { orderBy: { day: 'asc' } },
      practiceSessions: { orderBy: { createdAt: 'desc' }, take: 20 },
      userAchievements: { include: { achievement: true }, orderBy: { unlockedAt: 'desc' } },
      coachMessages: { orderBy: { createdAt: 'desc' }, take: 30 },
      feedback: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // Never expose password
  const { password: _pw, ...safe } = user
  return NextResponse.json({ user: safe })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params as { id: string }
  const body = await req.json() as { action: string }

  try {
    switch (body.action) {
      case 'grant-access':
        await prisma.user.update({ where: { id }, data: { purchaseStatus: 'PAID' } })
        break
      case 'revoke-access':
        await prisma.user.update({ where: { id }, data: { purchaseStatus: 'UNPAID' } })
        break
      case 'add-freeze':
        await prisma.profile.updateMany({ where: { userId: id }, data: { streakFreezes: { increment: 1 } } })
        break
      case 'reset-progress':
        await prisma.$transaction([
          prisma.progress.deleteMany({ where: { userId: id } }),
          prisma.practiceSession.deleteMany({ where: { userId: id } }),
          prisma.userAchievement.deleteMany({ where: { userId: id } }),
          prisma.profile.updateMany({
            where: { userId: id },
            data: { currentDay: 1, totalXP: 0, streak: 0, bestStreak: 0, lastPracticeDate: null },
          }),
        ])
        break
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Admin user patch error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params as { id: string }
  if (id === session.user.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  try {
    await prisma.$transaction([
      prisma.userAchievement.deleteMany({ where: { userId: id } }),
      prisma.coachMessage.deleteMany({ where: { userId: id } }),
      prisma.practiceSession.deleteMany({ where: { userId: id } }),
      prisma.progress.deleteMany({ where: { userId: id } }),
      prisma.feedback.deleteMany({ where: { userId: id } }),
      prisma.profile.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ])
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Admin delete user error:', err)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
