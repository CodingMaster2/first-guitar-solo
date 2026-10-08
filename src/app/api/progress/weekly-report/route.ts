import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function letterGrade(pct: number): string {
  if (pct >= 0.85) return 'A'
  if (pct >= 0.7) return 'B'
  if (pct >= 0.5) return 'C'
  return 'D'
}

function getInsight(grades: { consistency: string; time: string; lessons: string; streak: string }): string {
  const { consistency, time, lessons, streak } = grades
  if (consistency === 'A' && (time === 'A' || time === 'B')) {
    return "Excellent week! You were consistent and put in quality practice time. Keep up this momentum."
  }
  if (consistency === 'A' && (time === 'C' || time === 'D')) {
    return "You showed up every day this week — great consistency! Try extending your sessions to 30 minutes tomorrow."
  }
  if ((consistency === 'C' || consistency === 'D') && (time === 'A' || time === 'B')) {
    return "Your practice sessions were solid when you played. Try adding more days — even 10 minutes counts."
  }
  if (lessons === 'A' || lessons === 'B') {
    return "You made strong progress on lessons this week. Keep the streak alive for even better results!"
  }
  if (streak === 'A' || streak === 'B') {
    return "Your streak is holding strong! Consistency is the secret weapon of great guitarists."
  }
  return "Every practice session brings you closer to your first solo. Show up tomorrow and keep building."
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const weekAgo = new Date(Date.now() - 7 * 86400000)

    const [sessions, completedThisWeek, currentProfile] = await Promise.all([
      prisma.practiceSession.findMany({
        where: { userId, createdAt: { gte: weekAgo } },
      }),
      prisma.progress.findMany({
        where: { userId, completedAt: { gte: weekAgo }, completed: true },
      }),
      prisma.profile.findUnique({ where: { userId } }),
    ])

    // Consistency: distinct days practiced out of 7
    const daySet = new Set(
      sessions.map((s) => new Date(s.createdAt).toDateString())
    )
    completedThisWeek.forEach((p) => {
      if (p.completedAt) daySet.add(new Date(p.completedAt).toDateString())
    })
    const daysPracticed = daySet.size
    const consistencyPct = daysPracticed / 7

    // Quantity: total minutes (target = 7 * 20 = 140 min/week)
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)
    const timePct = Math.min(1, totalMinutes / 140)

    // Progress: lessons completed (target = 5 per week)
    const lessonsCompleted = completedThisWeek.length
    const lessonsPct = Math.min(1, lessonsCompleted / 5)

    // Streak maintenance: current streak / 7 (capped at 1)
    const streak = currentProfile?.streak ?? 0
    const streakPct = Math.min(1, streak / 7)

    const grades = {
      consistency: letterGrade(consistencyPct),
      time: letterGrade(timePct),
      lessons: letterGrade(lessonsPct),
      streak: letterGrade(streakPct),
    }

    const insight = getInsight(grades)

    // Week date range
    const now = new Date()
    const startOfWeek = new Date(weekAgo)

    return NextResponse.json({
      grades,
      stats: {
        daysPracticed,
        totalMinutes,
        lessonsCompleted,
        streak,
      },
      insight,
      weekStart: startOfWeek.toISOString(),
      weekEnd: now.toISOString(),
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
