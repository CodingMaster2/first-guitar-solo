import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { LESSONS } from '@/lib/lessons'

export default async function AdminContentPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/dashboard')

  const weekColors: Record<number, string> = {
    1: '#1e3a5f',
    2: '#3d2a00',
    3: '#052e16',
    4: '#2d1b69',
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <h1 className="text-2xl font-black text-white uppercase mb-1">Lesson Content</h1>
          <p style={{ color: '#525252' }} className="text-xs mb-6">View and reference all 30 lesson days</p>

          <div style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }} className="rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1f1f1f', backgroundColor: '#0d0d0d' }}>
                    {['Day', 'Week', 'Title', 'Duration', 'XP', 'Techniques', 'Edit'].map((h) => (
                      <th key={h} style={{ color: '#525252' }} className="text-left px-4 py-3 text-xs uppercase tracking-wider font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LESSONS.map((lesson) => {
                    const weekBg = weekColors[lesson.week] ?? '#1a1a1a'
                    return (
                      <tr key={lesson.day} style={{ borderBottom: '1px solid #161616' }} className="hover:bg-neutral-900 transition-colors">
                        <td className="px-4 py-3">
                          <span style={{ color: '#f59e0b' }} className="text-sm font-bold">{lesson.day}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            style={{ backgroundColor: weekBg, color: '#e5e5e5', fontSize: '0.65rem' }}
                            className="px-2 py-0.5 rounded font-medium"
                          >
                            W{lesson.week}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-white text-xs font-medium">{lesson.title}</p>
                          <p style={{ color: '#525252' }} className="text-xs">{lesson.subtitle}</p>
                        </td>
                        <td style={{ color: '#a3a3a3' }} className="px-4 py-3 text-xs whitespace-nowrap">
                          {lesson.duration} min
                        </td>
                        <td style={{ color: '#f59e0b' }} className="px-4 py-3 text-xs font-bold">
                          +{lesson.xpReward}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {lesson.techniques.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                style={{ backgroundColor: '#1a1a1a', color: '#737373', border: '1px solid #262626' }}
                                className="text-xs px-1.5 py-0.5 rounded"
                              >
                                {t}
                              </span>
                            ))}
                            {lesson.techniques.length > 3 && (
                              <span style={{ color: '#404040' }} className="text-xs">+{lesson.techniques.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/content/${lesson.day}`}
                            style={{ color: '#f59e0b' }}
                            className="text-xs font-medium hover:underline"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
