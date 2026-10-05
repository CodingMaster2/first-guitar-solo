import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { LESSONS } from '@/lib/lessons'
import Navbar from '@/components/Navbar'
import CoachChat from '@/components/CoachChat'

export default async function CoachPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.purchaseStatus !== 'PAID') redirect('/success?new=true')

  const [profile, messages] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.coachMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
      take: 20,
    }),
  ])

  if (!profile) redirect('/onboarding')

  const currentDay = profile.currentDay
  const currentLesson = LESSONS.find((l) => l.day === currentDay)

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-0 sm:px-6 lg:px-8 flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
        <div style={{ borderBottom: '1px solid #262626' }} className="px-4 py-4">
          <h1 className="text-xl font-black text-white uppercase">AI Guitar Coach</h1>
          <p style={{ color: '#a3a3a3' }} className="text-xs mt-1">
            Powered by Claude AI &bull; Knows your current progress
          </p>
        </div>
        <div className="flex-1 overflow-hidden">
          <CoachChat
            initialMessages={messages.map(m => ({ ...m, createdAt: m.createdAt }))}
            currentDay={currentDay}
            lessonTitle={currentLesson?.title ?? `Day ${currentDay}`}
          />
        </div>
      </main>
    </div>
  )
}
