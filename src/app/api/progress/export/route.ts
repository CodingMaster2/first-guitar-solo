import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const [progress, sessions, userAchievements] = await Promise.all([
    prisma.progress.findMany({
      where: { userId: session.user.id },
      orderBy: { day: 'asc' },
    }),
    prisma.practiceSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
    }),
  ])

  const achievements = userAchievements.map((ua) => ({
    key: ua.achievement.key,
    name: ua.achievement.name,
    description: ua.achievement.description,
    unlockedAt: ua.unlockedAt,
  }))

  return new Response(
    JSON.stringify(
      {
        user: { email: session.user.email, name: session.user.name },
        progress,
        sessions,
        achievements,
      },
      null,
      2
    ),
    {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="guitar-progress.json"',
      },
    }
  )
}
