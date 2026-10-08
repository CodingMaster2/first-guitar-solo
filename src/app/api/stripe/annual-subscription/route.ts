import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

export async function POST() {
  if (!process.env.STRIPE_ANNUAL_PRICE_ID) {
    return NextResponse.json({ error: 'Annual plan not configured' }, { status: 500 })
  }

  const session = await getServerSession(authOptions)
  const baseUrl =
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_ANNUAL_PRICE_ID, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?subscribed=annual`,
      cancel_url: `${baseUrl}/subscribe/annual`,
      customer_email: session?.user?.email ?? undefined,
      metadata: {
        userId: session?.user?.id ?? '',
        type: 'annual_subscription',
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Annual subscription checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
