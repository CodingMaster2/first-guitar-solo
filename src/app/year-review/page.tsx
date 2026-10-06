import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import YearReviewClient from './YearReviewClient'

export const metadata: Metadata = {
  title: 'Your 2026 Guitar Journey — First Guitar Solo',
  description: 'See your year in review: how many days you practiced, lessons completed, XP earned, and more.',
  openGraph: {
    title: 'My 2026 Guitar Journey — First Guitar Solo',
    description: 'I spent this year learning guitar. Here are my stats.',
    url: 'https://firstguitarsolo.com/year-review',
  },
}

export default async function YearReviewPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login?callbackUrl=/year-review')
  }

  const userId = session.user.id
  const currentYear = new Date().getFullYear()
  const yearStart = new Date(`${currentYear}-01-01T00:00:00.000Z`)
  const yearEnd = new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)

  const [profile, progressThisYear, practiceThisYear, achievementsThisYear] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.progress.findMany({
      where: {
        userId,
        completed: true,
        completedAt: { gte: yearStart, lt: yearEnd },
      },
    }),
    prisma.practiceSession.findMany({
      where: {
        userId,
        createdAt: { gte: yearStart, lt: yearEnd },
      },
    }),
    prisma.userAchievement.findMany({
      where: {
        userId,
        unlockedAt: { gte: yearStart, lt: yearEnd },
      },
      include: { achievement: true },
    }),
  ])

  if (!profile && progressThisYear.length === 0) {
    redirect('/dashboard')
  }

  const totalPracticeMinutes = practiceThisYear.reduce((sum, s) => sum + s.duration, 0)
  const totalPracticeHours = Math.round(totalPracticeMinutes / 60)
  const lessonsCompleted = progressThisYear.length
  const achievementsUnlocked = achievementsThisYear.length
  const xpEarned = profile?.totalXP ?? 0
  const longestStreak = profile?.bestStreak ?? 0
  const daysPracticed = new Set(
    practiceThisYear.map((s) => s.createdAt.toISOString().slice(0, 10))
  ).size

  const stats = {
    year: currentYear,
    daysPracticed,
    totalPracticeHours,
    lessonsCompleted,
    longestStreak,
    xpEarned,
    achievementsUnlocked,
    userName: session.user.name ?? session.user.email,
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      <Navbar />
      <main id="main-content">
        <YearReviewClient stats={stats} />
      </main>
      <Footer />
    </div>
  )
}
