import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

export async function POST() {
  try {
    if (!process.env.STRIPE_MONTHLY_PRICE_ID) {
      return NextResponse.json(
        {
          error:
            'Monthly subscription not configured yet. Set STRIPE_MONTHLY_PRICE_ID in env.',
        },
        { status: 503 },
      )
    }

    const session = await getServerSession(authOptions)
    const baseUrl =
      process.env.NEXTAUTH_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_MONTHLY_PRICE_ID, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?subscribed=1`,
      cancel_url: `${baseUrl}/subscribe`,
      customer_email: session?.user?.email ?? undefined,
      metadata: {
        userId: session?.user?.id ?? '',
        type: 'subscription',
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Subscription checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription checkout' },
      { status: 500 },
    )
  }
}
