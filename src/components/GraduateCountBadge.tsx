import { prisma } from '@/lib/prisma'

export default async function GraduateCountBadge() {
  const count = await prisma.profile.count({ where: { soloCompleted: true } })
  if (count === 0) return null

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#1a1000',
        color: '#f59e0b',
        border: '1px solid rgba(245,158,11,0.35)',
        borderRadius: 9999,
        padding: '6px 16px',
        fontSize: '0.8rem',
        fontWeight: 700,
        marginBottom: 16,
      }}
    >
      🎸 {count} student{count !== 1 ? 's' : ''} have played their first solo
    </div>
  )
}
