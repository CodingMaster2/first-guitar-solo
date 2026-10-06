import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referralCode: true, referralCount: true },
    })

    return NextResponse.json({
      code: user?.referralCode ?? null,
      count: user?.referralCount ?? 0,
    })
  } catch (error) {
    console.error('GET /api/referral error:', error)
    return NextResponse.json({ error: 'Failed to fetch referral data' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already has a code
    const existing = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referralCode: true, referralCount: true },
    })

    if (existing?.referralCode) {
      return NextResponse.json({
        code: existing.referralCode,
        count: existing.referralCount,
      })
    }

    // Generate a unique 6-char uppercase code
    let code: string
    let attempts = 0
    do {
      code = Math.random().toString(36).slice(2, 8).toUpperCase()
      attempts++
      if (attempts > 20) {
        return NextResponse.json({ error: 'Could not generate unique code' }, { status: 500 })
      }
    } while (
      await prisma.user.findUnique({ where: { referralCode: code } })
    )

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { referralCode: code },
      select: { referralCode: true, referralCount: true },
    })

    return NextResponse.json({
      code: updated.referralCode,
      count: updated.referralCount,
    })
  } catch (error) {
    console.error('POST /api/referral error:', error)
    return NextResponse.json({ error: 'Failed to generate referral code' }, { status: 500 })
  }
}
