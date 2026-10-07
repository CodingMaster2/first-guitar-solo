import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SECRET_ACHIEVEMENTS = [
  { key: 'night_owl', name: 'Night Owl', description: 'Practice after 11pm', icon: '🦉', xpReward: 50 },
  { key: 'early_bird', name: 'Early Bird', description: 'Practice before 7am', icon: '🌅', xpReward: 50 },
  { key: 'marathon', name: 'Marathon', description: 'Single session 45+ minutes', icon: '⏱️', xpReward: 75 },
  { key: 'speed_demon', name: 'Speed Demon', description: 'Complete a lesson in under 10 minutes', icon: '⚡', xpReward: 40 },
  { key: 'comeback_kid', name: 'Comeback Kid', description: 'Return after 7+ days away', icon: '🔄', xpReward: 60 },
  { key: 'perfectionist', name: 'Perfectionist', description: 'Get 5-star rating on 5 lessons', icon: '⭐', xpReward: 100 },
]

export default async function TrophyRoomPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const userId = session.user.id

  const [allAchievements, userAchievements] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { name: 'asc' } }),
    prisma.userAchievement.findMany({ where: { userId }, include: { achievement: true } }),
  ])

  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId))
  const unlockedKeys = new Set(userAchievements.map((ua) => ua.achievement.key))
  const totalUnlockedXP = userAchievements.reduce((sum, ua) => sum + ua.achievement.xpReward, 0)

  const unlockedSecrets = SECRET_ACHIEVEMENTS.filter((s) => unlockedKeys.has(s.key))

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 900, lineHeight: 1.1 }}>
            🏆 Trophy Room
          </h1>
          <p style={{ color: '#737373', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Your achievements and badges
          </p>
        </div>

        {/* Stats bar */}
        <div
          style={{
            backgroundColor: '#111111',
            border: '1px solid #262626',
            borderRadius: '0.75rem',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p style={{ color: '#f59e0b', fontSize: '1.75rem', fontWeight: 900, lineHeight: 1 }}>
              {userAchievements.length}
              <span style={{ color: '#525252', fontSize: '1rem' }}> / {allAchievements.length}</span>
            </p>
            <p style={{ color: '#a3a3a3', fontSize: '0.75rem', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Achievements Unlocked
            </p>
          </div>
          <div style={{ borderLeft: '1px solid #262626', paddingLeft: '2rem' }}>
            <p style={{ color: '#f59e0b', fontSize: '1.75rem', fontWeight: 900, lineHeight: 1 }}>
              {totalUnlockedXP.toLocaleString()}
            </p>
            <p style={{ color: '#a3a3a3', fontSize: '0.75rem', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              XP from Achievements
            </p>
          </div>
          <div style={{ borderLeft: '1px solid #262626', paddingLeft: '2rem' }}>
            <p style={{ color: '#f59e0b', fontSize: '1.75rem', fontWeight: 900, lineHeight: 1 }}>
              {unlockedSecrets.length}
              <span style={{ color: '#525252', fontSize: '1rem' }}> / {SECRET_ACHIEVEMENTS.length}</span>
            </p>
            <p style={{ color: '#a3a3a3', fontSize: '0.75rem', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Secret Achievements
            </p>
          </div>
        </div>

        {/* Achievements grid */}
        {allAchievements.length === 0 ? (
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderRadius: '0.75rem',
              padding: '3rem',
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            <p style={{ color: '#525252', fontSize: '0.875rem' }}>No achievements configured yet. Complete lessons to earn them!</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}
          >
            {allAchievements.map((achievement) => {
              const ua = userAchievements.find((u) => u.achievementId === achievement.id)
              const unlocked = unlockedIds.has(achievement.id)
              return (
                <div
                  key={achievement.id}
                  style={{
                    backgroundColor: '#111111',
                    border: `1px solid ${unlocked ? '#f59e0b' : '#262626'}`,
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    opacity: unlocked ? 1 : 0.6,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {unlocked && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
                      }}
                    />
                  )}
                  {/* Badge icon */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '0.5rem',
                      backgroundColor: unlocked ? 'rgba(245,158,11,0.15)' : '#1a1a1a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.75rem',
                      fontSize: '1.5rem',
                      filter: unlocked ? 'none' : 'grayscale(1)',
                    }}
                  >
                    {achievement.key.slice(0, 1).toUpperCase()}
                  </div>
                  <p style={{ color: unlocked ? '#ffffff' : '#737373', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {achievement.name}
                  </p>
                  <p style={{ color: '#525252', fontSize: '0.75rem', marginBottom: '0.75rem', minHeight: '2rem' }}>
                    {unlocked ? achievement.description : '???'}
                  </p>
                  {/* XP pill */}
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: unlocked ? 'rgba(245,158,11,0.15)' : '#1a1a1a',
                      color: unlocked ? '#f59e0b' : '#525252',
                      border: `1px solid ${unlocked ? 'rgba(245,158,11,0.3)' : '#262626'}`,
                      borderRadius: 100,
                      padding: '2px 10px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    +{achievement.xpReward} XP
                  </span>
                  {unlocked && ua && (
                    <p style={{ color: '#525252', fontSize: '0.65rem', marginTop: '0.5rem' }}>
                      Unlocked {new Date(ua.unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Secret Achievements */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '0.02em' }}>
            🔒 Secret Achievements
          </h2>
          <p style={{ color: '#525252', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
            These are discovered through hidden actions in the app.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {SECRET_ACHIEVEMENTS.map((secret) => {
              const unlocked = unlockedKeys.has(secret.key)
              return (
                <div
                  key={secret.key}
                  style={{
                    backgroundColor: '#111111',
                    border: `1px solid ${unlocked ? '#f59e0b' : '#262626'}`,
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    opacity: unlocked ? 1 : 0.5,
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      marginBottom: '0.75rem',
                      filter: unlocked ? 'none' : 'grayscale(1) brightness(0.4)',
                    }}
                  >
                    {unlocked ? secret.icon : '❓'}
                  </div>
                  <p style={{ color: unlocked ? '#ffffff' : '#737373', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {unlocked ? secret.name : '???'}
                  </p>
                  <p style={{ color: '#525252', fontSize: '0.75rem', marginBottom: '0.75rem', minHeight: '2rem' }}>
                    {unlocked ? secret.description : '???'}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: unlocked ? 'rgba(245,158,11,0.15)' : '#1a1a1a',
                      color: unlocked ? '#f59e0b' : '#525252',
                      border: `1px solid ${unlocked ? 'rgba(245,158,11,0.3)' : '#262626'}`,
                      borderRadius: 100,
                      padding: '2px 10px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    {unlocked ? `+${secret.xpReward} XP` : '? XP'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
