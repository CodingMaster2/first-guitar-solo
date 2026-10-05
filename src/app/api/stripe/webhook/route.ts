import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { ACHIEVEMENTS } from '@/lib/achievements'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? '')
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { metadata?: { userId?: string }; customer?: string }
    const userId = session.metadata?.userId

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          purchaseStatus: 'PAID',
          stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
        },
      })

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
    }
  }

  return NextResponse.json({ received: true })
}
