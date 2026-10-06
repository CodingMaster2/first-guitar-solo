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
  const body = await req.json() as { adminNotes?: string; tags?: string }

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updateData: { adminNotes?: string; tags?: string } = {}
  if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes
  if (body.tags !== undefined) updateData.tags = body.tags

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, adminNotes: true, tags: true },
  })

  await prisma.adminLog.create({
    data: {
      adminId: session.user.id,
      action: 'update-user-notes',
      target: id,
      details: 'Updated admin notes/tags',
    },
  })

  return NextResponse.json({ user: updated })
}
