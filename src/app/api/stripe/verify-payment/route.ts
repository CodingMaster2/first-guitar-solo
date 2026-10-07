import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { ACHIEVEMENTS } from '@/lib/achievements'
import { sendPurchaseConfirmationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as { sessionId: string }
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)

    // Verify this session belongs to the current user
    if (checkoutSession.metadata?.userId !== session.user.id) {
      return NextResponse.json({ error: 'Session mismatch' }, { status: 403 })
    }

    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json({ paid: false })
    }

    // Mark user as paid
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        purchaseStatus: 'PAID',
        stripeCustomerId: typeof checkoutSession.customer === 'string' ? checkoutSession.customer : undefined,
      },
    })

    // Send purchase confirmation email
    try {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } })
      if (user) {
        await sendPurchaseConfirmationEmail(user.email, user.name ?? '')
      }
    } catch (emailErr) {
      console.error('[verify-payment] confirmation email failed:', emailErr)
    }

    // Seed achievements if empty
    const achievementCount = await prisma.achievement.count()
    if (achievementCount === 0) {
      for (const a of ACHIEVEMENTS) {
        await prisma.achievement.upsert({
          where: { key: a.key },
          update: {},
          create: { key: a.key, name: a.name, description: a.description, xpReward: a.xpReward },
        })
      }
    }

    return NextResponse.json({ paid: true })
  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}
