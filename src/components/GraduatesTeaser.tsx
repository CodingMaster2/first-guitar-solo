import Link from 'next/link'
import { prisma } from '@/lib/prisma'

function styleBadgeColor(style: string | null | undefined): string {
  if (!style) return '#f59e0b'
  const s = style.toLowerCase()
  if (s.includes('blues')) return '#3b82f6'
  if (s.includes('rock')) return '#ef4444'
  if (s.includes('metal')) return '#a855f7'
  if (s.includes('country')) return '#f97316'
  if (s.includes('folk')) return '#22c55e'
  return '#f59e0b'
}

function firstTabLine(solo: string | null | undefined): string {
  if (!solo) return ''
  const lines = solo.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('e|') || trimmed.startsWith('e ')) {
      return trimmed.length > 38 ? trimmed.slice(0, 38) + '…' : trimmed
    }
  }
  // fallback: first non-empty line
  const first = lines.find((l) => l.trim().length > 0)
  if (!first) return ''
  const t = first.trim()
  return t.length > 38 ? t.slice(0, 38) + '…' : t
}

export default async function GraduatesTeaser() {
  const graduates = await prisma.profile.findMany({
    where: { soloCompleted: true },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { soloCompletedAt: 'desc' },
    take: 3,
  })

  if (graduates.length === 0) return null

  const divider = (
    <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.25), transparent)' }} />
  )

  return (
    <>
      {divider}
      <section style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #1a1a1a' }} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Decorative rule */}
          <div style={{ textAlign: 'center', color: '#262626', marginBottom: 24, fontFamily: 'monospace', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>

          <div style={{ color: '#f59e0b' }} className="text-xs font-bold uppercase tracking-widest mb-4 text-center">
            The Wall
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-4 text-center">
            Real Solos From Real Students
          </h2>
          <p style={{ color: '#a3a3a3' }} className="text-base mb-12 text-center max-w-xl mx-auto">
            Every one of them started where you are right now.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {graduates.map((g) => {
              const name = g.user?.name ?? 'Anonymous'
              const badgeColor = styleBadgeColor(g.soloStyle)
              const tabLine = firstTabLine(g.customSolo)
              const gradDate = g.soloCompletedAt
                ? new Date(g.soloCompletedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : null

              return (
                <div
                  key={g.id}
                  style={{
                    backgroundColor: '#0d0d0d',
                    border: '1px solid #1f1f1f',
                    borderRadius: 12,
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                  className="tilt-card"
                >
                  {/* Header */}
                  <div style={{ padding: '16px 16px 12px' }}>
                    <div className="flex items-start gap-2 mb-2">
                      <span style={{ fontSize: '1.1rem', lineHeight: 1, flexShrink: 0, marginTop: 1 }}>🎸</span>
                      <span className="text-white font-bold text-sm truncate">{name}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {g.soloStyle && (
                        <span
                          style={{
                            backgroundColor: `${badgeColor}18`,
                            color: badgeColor,
                            border: `1px solid ${badgeColor}40`,
                            borderRadius: 4,
                            padding: '2px 8px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                          }}
                        >
                          {g.soloStyle}
                        </span>
                      )}
                      {g.guitarHero && (
                        <span style={{ color: '#525252', fontSize: '0.7rem' }}>{g.guitarHero}</span>
                      )}
                    </div>
                  </div>

                  {/* Tab preview */}
                  {tabLine && (
                    <div
                      style={{
                        borderLeft: '4px solid #f59e0b',
                        margin: '0 16px 12px',
                        backgroundColor: '#111111',
                        borderRadius: '0 6px 6px 0',
                        padding: '8px 10px',
                      }}
                    >
                      <pre
                        style={{
                          fontFamily: '"Courier New", Courier, monospace',
                          fontSize: 11,
                          color: '#f59e0b',
                          margin: 0,
                          whiteSpace: 'pre',
                          overflow: 'hidden',
                          lineHeight: 1.5,
                        }}
                      >
                        {tabLine}
                      </pre>
                    </div>
                  )}

                  {/* Note + date */}
                  <div style={{ padding: '0 16px 14px' }}>
                    {g.graduateNote && (
                      <p
                        style={{ color: '#737373', fontSize: '0.72rem', fontStyle: 'italic', marginBottom: 8, lineHeight: 1.4 }}
                        className="line-clamp-2"
                      >
                        &ldquo;{g.graduateNote}&rdquo;
                      </p>
                    )}
                    {gradDate && (
                      <div className="flex justify-end">
                        <Link
                          href={`/solo/${g.userId}`}
                          style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 600 }}
                          className="hover:underline"
                        >
                          Graduated {gradDate} →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <Link
              href="/graduates"
              style={{ border: '1px solid #f59e0b', color: '#f59e0b', borderRadius: 8, padding: '10px 28px', fontSize: '0.85rem', fontWeight: 700 }}
              className="inline-block hover:opacity-80 transition-opacity uppercase tracking-wider"
            >
              See All Graduates →
            </Link>
          </div>

          <div style={{ textAlign: 'center', color: '#262626', marginTop: 24, fontFamily: 'monospace', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>
        </div>
      </section>
    </>
  )
}
