import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<unknown> }

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') return null
  return session
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params as { id: string }
  const body = await req.json() as { status?: string; reply?: string }

  const ticket = await prisma.supportTicket.findUnique({ where: { id } })
  if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updateData: { status?: string; reply?: string; repliedAt?: Date } = {}
  if (body.status) updateData.status = body.status
  if (body.reply !== undefined) {
    updateData.reply = body.reply
    updateData.repliedAt = new Date()
  }

  const updated = await prisma.supportTicket.update({
    where: { id },
    data: updateData,
  })

  await prisma.adminLog.create({
    data: {
      adminId: session.user.id,
      action: 'support-ticket-update',
      target: id,
      details: `Status: ${updated.status}${body.reply ? ', replied' : ''}`,
    },
  })

  return NextResponse.json({ ticket: updated })
}
