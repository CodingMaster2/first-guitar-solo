import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LESSONS } from '@/lib/lessons'
import { calculateNextReview } from '@/lib/sm2'

// GET /api/review — lessons due for review today
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()

    const dueReviews = await prisma.progress.findMany({
      where: {
        userId: session.user.id,
        completed: true,
        nextReviewAt: { lte: now },
      },
      orderBy: { nextReviewAt: 'asc' },
      take: 5,
    })

    // Find the next upcoming review (for "next review in X days" display)
    const upcoming = await prisma.progress.findFirst({
      where: {
        userId: session.user.id,
        completed: true,
        nextReviewAt: { gt: now },
      },
      orderBy: { nextReviewAt: 'asc' },
    })

    const nextReviewDays = upcoming?.nextReviewAt
      ? Math.ceil(
          (upcoming.nextReviewAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )
      : null

    const withTitles = dueReviews.map((p) => {
      const lesson = LESSONS.find((l) => l.day === p.day)
      return {
        day: p.day,
        title: lesson?.title ?? `Day ${p.day}`,
        nextReviewAt: p.nextReviewAt,
        reviewCount: p.reviewCount,
      }
    })

    return NextResponse.json({ due: withTitles, nextReviewDays })
  } catch (error) {
    console.error('Review GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST /api/review — submit a review result
// Body: { day: number, quality: number (0-5) }
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as { day: number; quality: number }
    const { day, quality } = body

    if (typeof day !== 'number' || typeof quality !== 'number') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    const existing = await prisma.progress.findUnique({
      where: { userId_day: { userId: session.user.id, day } },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 })
    }

    const updated = calculateNextReview(
      {
        easeFactor: existing.easeFactor,
        reviewCount: existing.reviewCount,
        nextReviewAt: existing.nextReviewAt ?? new Date(),
      },
      quality
    )

    await prisma.progress.update({
      where: { userId_day: { userId: session.user.id, day } },
      data: {
        nextReviewAt: updated.nextReviewAt,
        reviewCount: updated.reviewCount,
        easeFactor: updated.easeFactor,
      },
    })

    // Award 10 XP for completing a review
    await prisma.profile.update({
      where: { userId: session.user.id },
      data: { totalXP: { increment: 10 } },
    })

    return NextResponse.json({
      success: true,
      xpEarned: 10,
      nextReviewAt: updated.nextReviewAt,
      reviewCount: updated.reviewCount,
    })
  } catch (error) {
    console.error('Review POST error:', error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
