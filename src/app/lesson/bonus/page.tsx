import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BonusLessonClient from './BonusLessonClient'

export default async function BonusLessonPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.purchaseStatus !== 'PAID') redirect('/success?new=true')

  const [profile, completedCount] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: session.user.id } }),
    prisma.progress.count({ where: { userId: session.user.id, completed: true } }),
  ])

  if (!profile) redirect('/onboarding')

  // Only accessible if user has completed all 30 days
  if (completedCount < 30 && profile.currentDay < 30) {
    redirect('/dashboard?message=Complete+all+30+days+to+unlock+the+bonus+lesson')
  }

  const userName = session.user.name ?? 'Guitarist'

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1200 0%, #0f0800 100%)',
            border: '2px solid #f59e0b',
            borderRadius: 12,
            padding: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              color: '#f59e0b',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: 12,
            }}
          >
            &#127928; Secret Bonus &middot; Day 31
          </div>
          <h1
            style={{
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '2rem',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            The Graduation Solo
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '0.875rem', lineHeight: 1.6 }}>
            You&apos;ve made it through all 30 days. This is your graduation — a real, impressive-sounding solo
            that weaves together everything you&apos;ve learned. It&apos;s not a drill. It&apos;s the real thing.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: '#1a1200',
                border: '1px solid #78350f',
                color: '#f59e0b',
                fontSize: '0.75rem',
                padding: '4px 12px',
                borderRadius: 6,
                fontWeight: 700,
              }}
            >
              +100 XP
            </span>
            <span
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #262626',
                color: '#a3a3a3',
                fontSize: '0.75rem',
                padding: '4px 12px',
                borderRadius: 6,
              }}
            >
              15 min
            </span>
            <span
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #262626',
                color: '#a3a3a3',
                fontSize: '0.75rem',
                padding: '4px 12px',
                borderRadius: 6,
              }}
            >
              A Minor Pentatonic
            </span>
          </div>
        </div>

        {/* What you'll need */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #262626',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <h2 style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            What This Solo Uses
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
            {[
              'Picking',
              'Hammer-ons',
              'Pull-offs',
              'Slides',
              'String Bends',
              'Vibrato',
              'Pentatonic Scale',
              'Phrasing',
            ].map((tech) => (
              <div
                key={tech}
                style={{
                  backgroundColor: '#1a1200',
                  border: '1px solid #78350f',
                  borderRadius: 6,
                  padding: '6px 10px',
                  color: '#f59e0b',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                ✓ {tech}
              </div>
            ))}
          </div>
        </div>

        <BonusLessonClient userName={userName} />
      </main>
      <Footer />
    </div>
  )
}
