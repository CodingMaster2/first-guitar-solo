import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') return null
  return session
}

function escapeCSV(value: string | null | undefined): string {
  if (value == null) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  if (type === 'users') {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        purchaseStatus: true,
        createdAt: true,
        tags: true,
        profile: {
          select: { currentDay: true, totalXP: true, streak: true },
        },
      },
    })

    const header = 'id,email,name,purchaseStatus,currentDay,totalXP,streak,tags,createdAt\n'
    const rows = users.map((u) =>
      [
        escapeCSV(u.id),
        escapeCSV(u.email),
        escapeCSV(u.name),
        escapeCSV(u.purchaseStatus),
        escapeCSV(String(u.profile?.currentDay ?? '')),
        escapeCSV(String(u.profile?.totalXP ?? '')),
        escapeCSV(String(u.profile?.streak ?? '')),
        escapeCSV(u.tags),
        escapeCSV(u.createdAt.toISOString()),
      ].join(',')
    )

    const csv = header + rows.join('\n')
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=users.csv',
      },
    })
  }

  if (type === 'feedback') {
    const feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } },
    })

    const header = 'userId,email,day,rating,comment,type,createdAt\n'
    const rows = feedback.map((f) =>
      [
        escapeCSV(f.userId),
        escapeCSV(f.user.email),
        escapeCSV(f.day != null ? String(f.day) : ''),
        escapeCSV(f.rating != null ? String(f.rating) : ''),
        escapeCSV(f.comment),
        escapeCSV(f.type),
        escapeCSV(f.createdAt.toISOString()),
      ].join(',')
    )

    const csv = header + rows.join('\n')
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=feedback.csv',
      },
    })
  }

  return NextResponse.json({ error: 'type must be "users" or "feedback"' }, { status: 400 })
}
