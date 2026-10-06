import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { LESSONS } from '@/lib/lessons'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LessonClient from './LessonClient'

interface PageProps {
  params: Promise<{ day: string }>
}

export default async function LessonPage({ params }: PageProps) {
  const { day: dayParam } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.purchaseStatus !== 'PAID') redirect('/success?new=true')

  const day = parseInt(dayParam)
  if (isNaN(day) || day < 1 || day > 30) notFound()

  const lesson = LESSONS.find((l) => l.day === day)
  if (!lesson) notFound()

  const [profile, progress, audioAsset, completedCount] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.progress.findUnique({ where: { userId_day: { userId: session.user.id, day } } }),
    prisma.audioAsset.findFirst({
      where: { day, published: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.progress.count({ where: { userId: session.user.id, completed: true } }),
  ])

  if (!profile) redirect('/onboarding')

  const completionPct = (completedCount / 30) * 100

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <LessonClient
        lesson={lesson}
        existingProgress={progress ? {
          completed: progress.completed,
          difficulty: progress.difficulty,
          difficultAreas: progress.difficultAreas,
          rating: progress.rating,
          notes: progress.notes,
        } : null}
        audioUrl={audioAsset?.url ?? null}
        audioLabel={audioAsset?.label ?? null}
        currentDay={profile.currentDay}
        completionPct={completionPct}
        userId={session.user.id}
      />
      <Footer />
    </div>
  )
}
