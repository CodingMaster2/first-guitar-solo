import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/review/schedule — initialize SM-2 card for a completed lesson
// Body: { day: number }
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as { day: number }
    const { day } = body

    if (typeof day !== 'number') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    await prisma.progress.update({
      where: { userId_day: { userId: session.user.id, day } },
      data: {
        nextReviewAt: tomorrow,
        reviewCount: 0,
        easeFactor: 2.5,
      },
    })

    return NextResponse.json({ success: true, nextReviewAt: tomorrow })
  } catch (error) {
    console.error('Review schedule POST error:', error)
    return NextResponse.json({ error: 'Failed to schedule review' }, { status: 500 })
  }
}
