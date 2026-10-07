import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fromName, fromEmail, toEmail, message } = body as {
      fromName?: string
      fromEmail?: string
      toEmail?: string
      message?: string
    }

    if (!fromName || !fromEmail) {
      return NextResponse.json(
        { error: 'fromName and fromEmail are required' },
        { status: 400 },
      )
    }

    // Generate unique gift code
    const giftCode = 'GIFT-' + Math.random().toString(36).slice(2, 8).toUpperCase()

    const baseUrl =
      process.env.NEXTAUTH_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    // Create gift code record in DB
    const giftCodeRecord = await prisma.giftCode.create({
      data: {
        code: giftCode,
        fromName,
        fromEmail,
        toEmail: toEmail || null,
        message: message || null,
      },
    })

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 2500,
            product_data: { name: 'First Guitar Solo — Gift' },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/gift/success?code=${giftCode}`,
      cancel_url: `${baseUrl}/gift`,
      metadata: { giftCodeId: giftCodeRecord.id, type: 'gift' },
      customer_email: fromEmail,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Gift purchase error:', error)
    return NextResponse.json({ error: 'Failed to create gift checkout' }, { status: 500 })
  }
}
