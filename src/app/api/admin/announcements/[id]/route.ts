import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Params { params: Promise<{ id: string }> }

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') return null
  return session
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json() as { active?: boolean }

  const announcement = await prisma.announcement.findUnique({ where: { id } })
  if (!announcement) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.announcement.update({
    where: { id },
    data: { active: body.active ?? !announcement.active },
  })

  return NextResponse.json({ announcement: updated })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  await prisma.announcement.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
