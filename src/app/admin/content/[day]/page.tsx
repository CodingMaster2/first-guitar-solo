import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { LESSONS } from '@/lib/lessons'
import ContentCopyButtons from './ContentCopyButtons'

interface PageProps {
  params: Promise<{ day: string }>
}

export default async function LessonContentPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const { day: dayParam } = await params
  const day = parseInt(dayParam)
  if (isNaN(day) || day < 1 || day > 30) notFound()

  const lesson = LESSONS.find((l) => l.day === day)
  if (!lesson) notFound()

  const audioAssets = await prisma.audioAsset.findMany({
    where: { day },
    orderBy: { section: 'asc' },
  })

  const fields = [
    { key: 'title', label: 'Title', value: lesson.title },
    { key: 'subtitle', label: 'Subtitle', value: lesson.subtitle },
    { key: 'why', label: 'Why', value: lesson.why },
    { key: 'warmup', label: 'Warmup', value: lesson.warmup },
    { key: 'mainContent', label: 'Main Content', value: lesson.mainContent },
    { key: 'exercise', label: 'Exercise', value: lesson.exercise },
    { key: 'selfCheck', label: 'Self Check', value: lesson.selfCheck },
  ]

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-5">
            <Link href="/admin/content" style={{ color: '#525252' }} className="text-xs hover:text-white transition-colors">Content</Link>
            <span style={{ color: '#404040' }} className="text-xs">›</span>
            <span style={{ color: '#a3a3a3' }} className="text-xs">Day {day}</span>
          </div>

          <div className="flex items-center gap-3 mb-1">
            <span style={{ color: '#f59e0b' }} className="text-2xl font-black">{day}</span>
            <h1 className="text-2xl font-black text-white">{lesson.title}</h1>
          </div>
          <p style={{ color: '#737373' }} className="text-sm mb-1">{lesson.subtitle}</p>
          <div className="flex items-center gap-3 mb-6">
            <span style={{ color: '#525252' }} className="text-xs">{lesson.duration} min</span>
            <span style={{ color: '#f59e0b' }} className="text-xs font-bold">+{lesson.xpReward} XP</span>
            <span style={{ color: '#525252' }} className="text-xs">Week {lesson.week}</span>
          </div>

          {/* Techniques */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-4 mb-4">
            <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-2">Techniques</p>
            <div className="flex flex-wrap gap-2">
              {lesson.techniques.map((t) => (
                <span
                  key={t}
                  style={{ backgroundColor: '#1a1a1a', color: '#a3a3a3', border: '1px solid #262626' }}
                  className="text-xs px-2 py-1 rounded"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Content fields with copy buttons */}
          <ContentCopyButtons fields={fields} />

          {/* Common mistakes */}
          {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-4 mb-4">
              <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-2">Common Mistakes</p>
              <ul className="space-y-1">
                {lesson.commonMistakes.map((m, i) => (
                  <li key={i} style={{ color: '#fca5a5' }} className="text-xs">• {m}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Bonus content */}
          {lesson.bonusContent && (
            <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-4 mb-4">
              <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-2">Bonus Content</p>
              <p style={{ color: '#d4d4d4' }} className="text-xs">{lesson.bonusContent}</p>
            </div>
          )}

          {/* Audio Assets */}
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl p-4 mb-4">
            <p style={{ color: '#525252' }} className="text-xs uppercase tracking-wider mb-2">Audio Assets ({audioAssets.length})</p>
            {audioAssets.length === 0 ? (
              <p style={{ color: '#404040' }} className="text-xs">No audio assets uploaded for this day.</p>
            ) : (
              <div className="space-y-2">
                {audioAssets.map((a) => (
                  <div key={a.id} style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a' }} className="rounded-lg p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white text-xs font-medium">{a.label}</p>
                      <p style={{ color: '#525252' }} className="text-xs">{a.type}{a.section ? ` · Section ${a.section}` : ''}{a.speed ? ` · ${a.speed}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          backgroundColor: a.published ? '#052e16' : '#1a1a1a',
                          color: a.published ? '#86efac' : '#525252',
                        }}
                        className="text-xs px-2 py-0.5 rounded"
                      >
                        {a.published ? 'Published' : 'Draft'}
                      </span>
                      <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ color: '#f59e0b' }} className="text-xs hover:underline">
                        Open ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            {day > 1 ? (
              <Link href={`/admin/content/${day - 1}`} style={{ border: '1px solid #262626', color: '#737373' }} className="text-xs px-3 py-2 rounded hover:text-white transition-colors">
                ← Day {day - 1}
              </Link>
            ) : <span />}
            {day < 30 && (
              <Link href={`/admin/content/${day + 1}`} style={{ border: '1px solid #262626', color: '#737373' }} className="text-xs px-3 py-2 rounded hover:text-white transition-colors">
                Day {day + 1} →
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
