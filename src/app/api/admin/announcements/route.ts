import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') return null
  return session
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const activeOnly = searchParams.get('active') === 'true'

  // Active-only requests are public (used by AnnouncementBanner for all users)
  // Full listing requires admin
  if (!activeOnly) {
    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const announcements = await prisma.announcement.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ announcements })
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json() as { title: string; message: string; type?: string; active?: boolean }
  const { title, message, type = 'info', active = true } = body

  if (!title?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Title and message are required' }, { status: 400 })
  }

  const announcement = await prisma.announcement.create({
    data: { title: title.trim(), message: message.trim(), type, active },
  })

  await prisma.adminLog.create({
    data: {
      adminId: session.user.id,
      action: 'create-announcement',
      target: announcement.id,
      details: `Created announcement: ${title}`,
    },
  })

  return NextResponse.json({ announcement }, { status: 201 })
}
