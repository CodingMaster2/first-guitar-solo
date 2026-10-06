import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LESSONS } from '@/lib/lessons'
import { ACHIEVEMENTS } from '@/lib/achievements'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [profile, progress, achievements, practiceSessions] = await Promise.all([
      prisma.profile.findUnique({ where: { userId: session.user.id } }),
      prisma.progress.findMany({ where: { userId: session.user.id }, orderBy: { day: 'asc' } }),
      prisma.userAchievement.findMany({
        where: { userId: session.user.id },
        include: { achievement: true },
      }),
      prisma.practiceSession.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

    return NextResponse.json({ profile, progress, achievements, practiceSessions })
  } catch (error) {
    console.error('Progress GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.purchaseStatus !== 'PAID') {
      return NextResponse.json({ error: 'Payment required' }, { status: 403 })
    }

    const body = await req.json() as { day: number; notes: string }
    const { day, notes } = body

    await prisma.progress.upsert({
      where: { userId_day: { userId: session.user.id, day } },
      update: { notes },
      create: { userId: session.user.id, day, completed: false, notes },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Progress PATCH error:', error)
    return NextResponse.json({ error: 'Failed to save notes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.purchaseStatus !== 'PAID') {
      return NextResponse.json({ error: 'Payment required' }, { status: 403 })
    }

    const body = await req.json() as {
      day: number
      difficulty?: string
      difficultAreas?: string
      rating?: number
      notes?: string
    }

    const { day, difficulty, difficultAreas, rating, notes } = body

    // Get lesson XP reward (with weekend multiplier)
    const lesson = LESSONS.find((l) => l.day === day)
    // Day 31 is the secret bonus lesson — awards 100 XP
    const baseXP = day > 30 ? 100 : (lesson?.xpReward ?? 50)
    const dayOfWeek = new Date().getDay() // 0=Sun, 5=Fri, 6=Sat
    const weekendMultiplier = [0, 5, 6].includes(dayOfWeek) ? 1.5 : 1
    const xpReward = Math.round(baseXP * weekendMultiplier)

    // Get existing progress
    const existingProgress = await prisma.progress.findUnique({
      where: { userId_day: { userId: session.user.id, day } },
    })

    if (existingProgress?.completed) {
      return NextResponse.json({ message: 'Already completed', alreadyCompleted: true })
    }

    // Compute tomorrow for spaced repetition initialization
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    // Mark day complete and initialize SM-2 schedule
    await prisma.progress.upsert({
      where: { userId_day: { userId: session.user.id, day } },
      update: {
        completed: true,
        completedAt: new Date(),
        difficulty,
        difficultAreas,
        rating,
        notes,
        nextReviewAt: tomorrow,
        reviewCount: 0,
        easeFactor: 2.5,
      },
      create: {
        userId: session.user.id,
        day,
        completed: true,
        completedAt: new Date(),
        difficulty,
        difficultAreas,
        rating,
        notes,
        nextReviewAt: tomorrow,
        reviewCount: 0,
        easeFactor: 2.5,
      },
    })

    // Update profile XP, streak, currentDay
    const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const now = new Date()
    const lastPractice = profile.lastPracticeDate
    let newStreak = profile.streak

    if (lastPractice) {
      const daysSince = Math.floor((now.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24))
      if (daysSince === 1) {
        newStreak = profile.streak + 1
      } else if (daysSince > 1) {
        newStreak = 1
      }
    } else {
      newStreak = 1
    }

    const newCurrentDay = Math.max(profile.currentDay, day + 1)
    const totalXPBefore = profile.totalXP
    const newTotalXP = profile.totalXP + xpReward
    const newBestStreak = Math.max(profile.bestStreak, newStreak)

    await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        totalXP: newTotalXP,
        streak: newStreak,
        bestStreak: newBestStreak,
        lastPracticeDate: now,
        currentDay: newCurrentDay > 30 ? 30 : newCurrentDay,
      },
    })

    // Seed achievements if they haven't been created yet
    const achievementCount = await prisma.achievement.count()
    if (achievementCount === 0) {
      for (const a of ACHIEVEMENTS) {
        await prisma.achievement.upsert({
          where: { key: a.key },
          update: {},
          create: { key: a.key, name: a.name, description: a.description, xpReward: a.xpReward },
        })
      }
    }

    // Check and award achievements
    const newAchievements: string[] = []
    const allProgress = await prisma.progress.findMany({
      where: { userId: session.user.id, completed: true },
    })
    const completedDays = allProgress.map((p) => p.day)
    const existingAchievements = await prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      include: { achievement: true },
    })
    const earnedKeys = new Set(existingAchievements.map((ua) => ua.achievement.key))

    const checkAchievement = async (key: string) => {
      if (earnedKeys.has(key)) return
      const achievement = await prisma.achievement.findUnique({ where: { key } })
      if (!achievement) return
      await prisma.userAchievement.create({
        data: { userId: session.user.id, achievementId: achievement.id },
      })
      await prisma.profile.update({
        where: { userId: session.user.id },
        data: { totalXP: { increment: achievement.xpReward } },
      })
      newAchievements.push(achievement.name)
    }

    if (completedDays.length >= 1) await checkAchievement('first_lesson')
    if (newStreak >= 3) await checkAchievement('streak_3')
    if (newStreak >= 7) await checkAchievement('streak_7')
    if ([1, 2, 3, 4, 5, 6, 7].every((d) => completedDays.includes(d))) await checkAchievement('week_1')
    if ([8, 9, 10, 11, 12, 13, 14].every((d) => completedDays.includes(d))) await checkAchievement('week_2')
    if ([15, 16, 17, 18].every((d) => completedDays.includes(d))) await checkAchievement('solo_section_1')
    if ([15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29].every((d) => completedDays.includes(d)))
      await checkAchievement('solo_complete')
    if (completedDays.includes(30)) await checkAchievement('first_solo')

    return NextResponse.json({ success: true, xpEarned: xpReward, newAchievements, totalXPBefore, totalXPAfter: newTotalXP, weekendMultiplier })
  } catch (error) {
    console.error('Progress POST error:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
