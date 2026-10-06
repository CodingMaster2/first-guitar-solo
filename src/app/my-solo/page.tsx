import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GeneratorWrapper from './GeneratorWrapper'
import SoloDisplayClient from './SoloDisplayClient'

interface PageProps {
  searchParams: Promise<{ regen?: string }>
}

export default async function MySoloPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.purchaseStatus !== 'PAID') redirect('/success?new=true')

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      customSolo: true,
      soloStyle: true,
      guitarHero: true,
      soloVibe: true,
      soloCompleted: true,
      soloCompletedAt: true,
      graduateNote: true,
      currentDay: true,
    },
  })

  if (!profile) redirect('/onboarding')

  const params = await searchParams
  const forceRegen = params.regen === '1'
  const hasSolo = Boolean(profile.customSolo) && !forceRegen

  const userName = session.user.name ?? 'You'

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {hasSolo ? (
          <SoloDisplayClient
            customSolo={profile.customSolo!}
            soloStyle={profile.soloStyle ?? 'rock'}
            guitarHero={profile.guitarHero ?? null}
            soloVibe={profile.soloVibe ?? 'mixed'}
            userName={userName}
            currentDay={profile.currentDay}
            soloCompleted={profile.soloCompleted}
            soloCompletedAt={profile.soloCompletedAt ? profile.soloCompletedAt.toISOString() : null}
            graduateNote={profile.graduateNote ?? null}
          />
        ) : (
          <GeneratorWrapper />
        )}
      </main>
      <Footer />
    </div>
  )
}
