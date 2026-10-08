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
    include: {
      profile: {
        select: { currentDay: true, totalXP: true, streak: true, soloCompleted: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const headers = [
    'id',
    'email',
    'name',
    'purchaseStatus',
    'currentDay',
    'totalXP',
    'streak',
    'soloCompleted',
    'createdAt',
  ]
  const rows = users.map((u) =>
    [
      u.id,
      u.email,
      u.name ?? '',
      u.purchaseStatus,
      u.profile?.currentDay ?? 0,
      u.profile?.totalXP ?? 0,
      u.profile?.streak ?? 0,
      u.profile?.soloCompleted ? 'yes' : 'no',
      u.createdAt.toISOString(),
    ].join(','),
  )
  const csv = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="users-export.csv"',
    },
  })
}
