import { prisma } from '@/lib/prisma'
import {
  sendInactivityEmail,
  sendStreakMilestoneEmail,
  sendHalfwayEmail,
  sendGraduationEmail,
  sendWeeklyDigestEmail,
} from '@/lib/email'

export async function processDailyEmails(): Promise<{ processed: number }> {
  const now = new Date()
  const users = await prisma.user.findMany({
    where: { purchaseStatus: 'PAID' },
    include: { profile: true },
  })

  for (const user of users) {
    if (!user.profile) continue
    const profile = user.profile
    const lastPractice = profile.lastPracticeDate

    // Skip if no last practice (never started)
    if (!lastPractice) continue

    const daysSinceLastPractice = Math.floor(
      (now.getTime() - lastPractice.getTime()) / 86400000,
    )
    const streak = profile.streak
    const currentDay = profile.currentDay

    // Inactivity email: exactly 2 days since last practice
    if (daysSinceLastPractice === 2) {
      await sendInactivityEmail(
        { email: user.email, name: user.name },
        daysSinceLastPractice,
        currentDay,
      )
    }

    // Streak milestones: 7, 14, 21 days — check if streak just hit a milestone today
    if ([7, 14, 21].includes(streak) && daysSinceLastPractice === 0) {
      await sendStreakMilestoneEmail({ email: user.email, name: user.name }, streak)
    }

    // Halfway email: currentDay just hit 15
    if (currentDay === 15 && daysSinceLastPractice === 0) {
      await sendHalfwayEmail({ email: user.email, name: user.name })
    }

    // Graduation: currentDay === 30 and completed today
    if (currentDay === 30 && daysSinceLastPractice === 0) {
      const day30Done = await prisma.progress.findFirst({
        where: { userId: user.id, day: 30, completed: true },
      })
      if (day30Done) {
        await sendGraduationEmail({ email: user.email, name: user.name })
      }
    }

    // Weekly digest: send every Sunday (dayOfWeek === 0)
    if (now.getDay() === 0) {
      const weekAgo = new Date(now.getTime() - 7 * 86400000)
      const sessions = await prisma.practiceSession.findMany({
        where: { userId: user.id, createdAt: { gte: weekAgo } },
      })
      const completedThisWeek = await prisma.progress.count({
        where: { userId: user.id, completedAt: { gte: weekAgo }, completed: true },
      })
      if (sessions.length > 0) {
        await sendWeeklyDigestEmail(
          { email: user.email, name: user.name },
          {
            lessonsCompleted: completedThisWeek,
            xpEarned: sessions.length * 50,
            streak,
            currentDay,
          },
        )
      }
    }
  }

  return { processed: users.length }
}
