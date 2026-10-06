import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')?.trim().toUpperCase()

  if (!code) {
    return NextResponse.json({ valid: false, error: 'No code provided' })
  }

  const coupon = await prisma.couponCode.findUnique({ where: { code } })

  if (!coupon || !coupon.active) {
    return NextResponse.json({ valid: false, error: 'Invalid or inactive coupon code' })
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return NextResponse.json({ valid: false, error: 'Coupon has expired' })
  }

  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json({ valid: false, error: 'Coupon usage limit reached' })
  }

  return NextResponse.json({ valid: true, discountPct: coupon.discountPct, code: coupon.code })
}
