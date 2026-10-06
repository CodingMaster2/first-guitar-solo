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

  const coupon = await prisma.couponCode.findUnique({ where: { id } })
  if (!coupon) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.couponCode.update({
    where: { id },
    data: { active: body.active ?? !coupon.active },
  })

  return NextResponse.json({ coupon: updated })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const coupon = await prisma.couponCode.findUnique({ where: { id } })
  if (!coupon) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (coupon.usedCount > 0) {
    return NextResponse.json({ error: 'Cannot delete a coupon that has been used' }, { status: 400 })
  }

  await prisma.couponCode.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
