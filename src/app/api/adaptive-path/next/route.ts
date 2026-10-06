import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getNextLessonInPath } from '@/lib/adaptivePath'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [profile, progress] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.progress.findMany({ where: { userId: session.user.id, completed: true } }),
  ])

  if (!profile || !profile.adaptivePath) {
    return NextResponse.json({ nextDay: null, lessonsRemaining: null, totalInPath: null })
  }

  const path = JSON.parse(profile.adaptivePath) as number[]
  const completedDays = progress.map((p) => p.day)
  const nextDay = getNextLessonInPath(path, completedDays)

  const completedSet = new Set(completedDays)
  const lessonsRemaining = path.filter((d) => !completedSet.has(d)).length

  return NextResponse.json({ nextDay, lessonsRemaining, totalInPath: path.length })
}
