import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [
      totalUsers,
      paidUsers,
      recentPractice,
      allProgress,
      recentFeedback,
      recentMessages,
      recentSignups,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { purchaseStatus: 'PAID' } }),
      prisma.practiceSession.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { userId: true },
      }),
      prisma.progress.findMany({ where: { completed: true }, select: { userId: true, day: true } }),
      prisma.feedback.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { email: true } } },
      }),
      prisma.coachMessage.findMany({
        where: { role: 'user' },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { content: true, createdAt: true },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          purchaseStatus: true,
          profile: { select: { currentDay: true, lastPracticeDate: true } },
        },
      }),
    ])

    const activeUserIds = new Set(recentPractice.map((p) => p.userId))
    const activeUsers = activeUserIds.size

    // Calculate average completion
    const userCompletionMap = new Map<string, Set<number>>()
    for (const p of allProgress) {
      if (!userCompletionMap.has(p.userId)) {
        userCompletionMap.set(p.userId, new Set())
      }
      userCompletionMap.get(p.userId)!.add(p.day)
    }
    const completionPercentages = Array.from(userCompletionMap.values()).map(
      (days) => (days.size / 30) * 100
    )
    const avgCompletion =
      completionPercentages.length > 0
        ? completionPercentages.reduce((a, b) => a + b, 0) / completionPercentages.length
        : 0

    // Lesson completion rates per day
    const dayCompletionCounts: Record<number, number> = {}
    for (const p of allProgress) {
      dayCompletionCounts[p.day] = (dayCompletionCounts[p.day] ?? 0) + 1
    }

    return NextResponse.json({
      totalUsers,
      paidUsers,
      activeUsers,
      avgCompletion: Math.round(avgCompletion),
      recentFeedback,
      recentMessages,
      recentSignups,
      dayCompletionCounts,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
