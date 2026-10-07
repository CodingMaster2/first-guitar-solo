import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: 'desc' },
  })

  const rows: string[][] = [
    ['ID', 'Email', 'Name', 'Status', 'Current Day', 'XP', 'Streak', 'UTM Source', 'UTM Medium', 'Created', 'Last Practice'],
    ...users.map((u) => [
      u.id,
      u.email,
      u.name ?? '',
      u.purchaseStatus,
      String(u.profile?.currentDay ?? 1),
      String(u.profile?.totalXP ?? 0),
      String(u.profile?.streak ?? 0),
      u.utmSource ?? '',
      u.utmMedium ?? '',
      u.createdAt.toISOString(),
      u.profile?.lastPracticeDate?.toISOString() ?? '',
    ]),
  ]

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="users-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
