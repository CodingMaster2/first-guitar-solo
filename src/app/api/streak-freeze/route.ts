import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Simplified: restore streak by 1 day and deduct a freeze
    if (profile.streakFreezes > 0 && profile.streak === 0) {
      const updated = await prisma.profile.update({
        where: { userId: session.user.id },
        data: { streak: 1, streakFreezes: { decrement: 1 } },
      })
      return NextResponse.json({ ok: true, freezesRemaining: updated.streakFreezes })
    }

    return NextResponse.json({ ok: false, reason: 'No freeze needed or no freezes left' })
  } catch (error) {
    console.error('Streak freeze error:', error)
    return NextResponse.json({ error: 'Failed to apply freeze' }, { status: 500 })
  }
}
