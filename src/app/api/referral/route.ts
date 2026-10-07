import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET — return the current user's referral link and count
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const baseUrl =
      process.env.NEXTAUTH_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referralCode: true, referralCount: true },
    })

    // Generate referralCode if missing
    if (!user?.referralCode) {
      const code = session.user.id.slice(-8).toUpperCase()
      await prisma.user.update({
        where: { id: session.user.id },
        data: { referralCode: code },
      })
      user = { referralCode: code, referralCount: user?.referralCount ?? 0 }
    }

    const link = `${baseUrl}/register?ref=${user.referralCode}`
    return NextResponse.json({ link, count: user.referralCount ?? 0 })
  } catch (error) {
    console.error('GET /api/referral error:', error)
    return NextResponse.json({ error: 'Failed to fetch referral data' }, { status: 500 })
  }
}

// POST — track a referral click (called from register page when ?ref= is in URL)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { referralCode } = body as { referralCode?: string }

    if (!referralCode) {
      return NextResponse.json({ error: 'referralCode is required' }, { status: 400 })
    }

    await prisma.user.update({
      where: { referralCode },
      data: { referralCount: { increment: 1 } },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/referral error:', error)
    return NextResponse.json({ error: 'Failed to track referral' }, { status: 500 })
  }
}
