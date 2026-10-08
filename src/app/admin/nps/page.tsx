import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminSidebar from '@/components/AdminSidebar'
import Navbar from '@/components/Navbar'

export default async function AdminNpsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'ADMIN') {
    return (
      <div
        style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}
        className="flex items-center justify-center"
      >
        <p style={{ color: '#fca5a5' }}>Access denied.</p>
      </div>
    )
  }

  const surveys = await prisma.npsSurvey.findMany({
    include: { user: { select: { email: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const total = surveys.length
  const promoters = surveys.filter((s) => s.score >= 9).length
  const passives = surveys.filter((s) => s.score >= 7 && s.score <= 8).length
  const detractors = surveys.filter((s) => s.score <= 6).length
  const npsScore =
    total > 0 ? Math.round((promoters / total - detractors / total) * 100) : 0

  const npsColor =
    npsScore > 50 ? '#4ade80' : npsScore > 0 ? '#f59e0b' : '#f87171'
  const promoterPct = total > 0 ? (promoters / total) * 100 : 0
  const passivePct = total > 0 ? (passives / total) * 100 : 0
  const detractorPct = total > 0 ? (detractors / total) * 100 : 0

  const scoreColor = (score: number) =>
    score >= 9 ? '#4ade80' : score >= 7 ? '#f59e0b' : '#f87171'

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 min-w-0">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-6">
            NPS Surveys
          </h1>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: 'NPS Score', value: npsScore, color: npsColor },
              { label: 'Total Responses', value: total, color: '#d4d4d4' },
              { label: 'Promoters (9–10)', value: promoters, color: '#4ade80' },
              { label: 'Passives (7–8)', value: passives, color: '#f59e0b' },
              { label: 'Detractors (0–6)', value: detractors, color: '#f87171' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: '#111111',
                  border: '1px solid #1f1f1f',
                  borderRadius: '8px',
                  padding: '1rem',
                }}
              >
                <p
                  style={{
                    color: stat.color,
                    fontSize: '1.75rem',
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ color: '#737373', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Distribution bar */}
          {total > 0 && (
            <div
              style={{
                backgroundColor: '#111111',
                border: '1px solid #1f1f1f',
                borderRadius: '8px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <p
                style={{
                  color: '#a3a3a3',
                  fontSize: '0.75rem',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Score Distribution
              </p>
              <div
                style={{
                  display: 'flex',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  height: '24px',
                }}
              >
                {detractorPct > 0 && (
                  <div
                    style={{
                      width: `${detractorPct}%`,
                      backgroundColor: '#7f1d1d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ color: '#fca5a5', fontSize: '0.65rem', fontWeight: 700 }}>
                      {Math.round(detractorPct)}%
                    </span>
                  </div>
                )}
                {passivePct > 0 && (
                  <div
                    style={{
                      width: `${passivePct}%`,
                      backgroundColor: '#78350f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ color: '#fde68a', fontSize: '0.65rem', fontWeight: 700 }}>
                      {Math.round(passivePct)}%
                    </span>
                  </div>
                )}
                {promoterPct > 0 && (
                  <div
                    style={{
                      width: `${promoterPct}%`,
                      backgroundColor: '#14532d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ color: '#4ade80', fontSize: '0.65rem', fontWeight: 700 }}>
                      {Math.round(promoterPct)}%
                    </span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem' }}>
                {[
                  { label: 'Detractors', color: '#f87171' },
                  { label: 'Passives', color: '#f59e0b' },
                  { label: 'Promoters', color: '#4ade80' },
                ].map((l) => (
                  <div
                    key={l.label}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: l.color,
                      }}
                    />
                    <span style={{ color: '#737373', fontSize: '0.7rem' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responses table */}
          <div
            style={{
              backgroundColor: '#111111',
              border: '1px solid #1f1f1f',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1f1f1f' }}>
                    {['User', 'Score', 'Comment', 'Date'].map((h) => (
                      <th
                        key={h}
                        style={{
                          color: '#525252',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {surveys.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          color: '#525252',
                          fontSize: '0.875rem',
                          padding: '2rem',
                          textAlign: 'center',
                        }}
                      >
                        No survey responses yet.
                      </td>
                    </tr>
                  )}
                  {surveys.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <p style={{ color: '#d4d4d4', fontSize: '0.8rem', fontWeight: 500 }}>
                          {s.user.name ?? '—'}
                        </p>
                        <p style={{ color: '#525252', fontSize: '0.7rem' }}>{s.user.email}</p>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span
                          style={{
                            backgroundColor:
                              s.score >= 9
                                ? '#14532d'
                                : s.score >= 7
                                  ? '#78350f'
                                  : '#7f1d1d',
                            color: scoreColor(s.score),
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {s.score}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '0.75rem 1rem',
                          color: '#a3a3a3',
                          fontSize: '0.8rem',
                          maxWidth: '300px',
                        }}
                      >
                        {s.comment ? (
                          s.comment.length > 80 ? (
                            s.comment.slice(0, 80) + '…'
                          ) : (
                            s.comment
                          )
                        ) : (
                          <span style={{ color: '#404040' }}>—</span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: '0.75rem 1rem',
                          color: '#525252',
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {new Date(s.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
