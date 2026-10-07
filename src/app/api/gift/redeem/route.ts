import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to redeem a gift code' },
        { status: 401 },
      )
    }

    const body = await req.json()
    const { code } = body as { code?: string }

    if (!code) {
      return NextResponse.json({ error: 'Gift code is required' }, { status: 400 })
    }

    const giftCode = await prisma.giftCode.findUnique({ where: { code } })

    if (!giftCode) {
      return NextResponse.json({ error: 'Gift code not found' }, { status: 404 })
    }

    if (giftCode.redeemed) {
      return NextResponse.json(
        { error: 'This gift code has already been redeemed' },
        { status: 409 },
      )
    }

    // Mark redeemed
    await prisma.giftCode.update({
      where: { id: giftCode.id },
      data: {
        redeemed: true,
        redeemedAt: new Date(),
        redeemedById: session.user.id,
      },
    })

    // Grant access
    await prisma.user.update({
      where: { id: session.user.id },
      data: { purchaseStatus: 'PAID' },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Gift redeem error:', error)
    return NextResponse.json({ error: 'Failed to redeem gift code' }, { status: 500 })
  }
}
