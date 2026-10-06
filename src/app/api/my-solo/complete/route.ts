import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const XP_AWARD = 500

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.purchaseStatus !== 'PAID') {
      return NextResponse.json({ error: 'Payment required' }, { status: 403 })
    }

    const body = await req.json() as { graduateNote?: string }
    const { graduateNote } = body

    await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        soloCompleted: true,
        soloCompletedAt: new Date(),
        graduateNote: graduateNote ?? null,
        totalXP: { increment: XP_AWARD },
      },
    })

    return NextResponse.json({ success: true, xpAwarded: XP_AWARD })
  } catch (error) {
    console.error('solo complete error:', error)
    return NextResponse.json({ error: 'Failed to mark solo as completed' }, { status: 500 })
  }
}
