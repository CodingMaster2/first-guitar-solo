import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const coupons = await prisma.couponCode.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { redemptions: true } } },
  })
  return NextResponse.json({ coupons })
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json() as {
    code?: string
    discountPct: number
    usageLimit?: number
    expiresAt?: string
  }

  const code = (body.code?.trim().toUpperCase()) || generateCode()
  const discountPct = Number(body.discountPct)

  if (!discountPct || discountPct < 1 || discountPct > 100) {
    return NextResponse.json({ error: 'Discount must be 1–100' }, { status: 400 })
  }

  const existing = await prisma.couponCode.findUnique({ where: { code } })
  if (existing) {
    return NextResponse.json({ error: 'Code already exists' }, { status: 409 })
  }

  const coupon = await prisma.couponCode.create({
    data: {
      code,
      discountPct,
      usageLimit: body.usageLimit ?? null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      active: true,
    },
  })

  await prisma.adminLog.create({
    data: {
      adminId: session.user.id,
      action: 'create-coupon',
      target: coupon.id,
      details: `Created coupon ${code} (${discountPct}% off)`,
    },
  })

  return NextResponse.json({ coupon }, { status: 201 })
}

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}
