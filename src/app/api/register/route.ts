import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      email: string
      password: string
      name?: string
      website?: string
      promoCode?: string
      utmSource?: string
      utmMedium?: string
      utmCampaign?: string
    }
    const { email, password, name, website, promoCode, utmSource, utmMedium, utmCampaign } = body

    // Honeypot — real users leave this empty; non-empty means bot
    if (website) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name ?? null,
      },
    })

    try {
      await sendWelcomeEmail(email, name ?? '')
    } catch (emailErr) {
      console.error('[register] welcome email failed:', emailErr)
    }

    try {
      await prisma.funnelEvent.create({
        data: { userId: user.id, event: 'register' },
      })
    } catch (funnelErr) {
      console.error('[register] funnel event failed:', funnelErr)
    }

    if (utmSource || utmMedium || utmCampaign) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            utmSource: utmSource ?? null,
            utmMedium: utmMedium ?? null,
            utmCampaign: utmCampaign ?? null,
          },
        })
      } catch (utmErr) {
        console.error('[register] utm update failed:', utmErr)
      }
    }

    // Promo code handling
    let promoValid = false
    if (promoCode) {
      try {
        const coupon = await prisma.couponCode.findFirst({
          where: { code: promoCode.toUpperCase(), active: true },
        })
        if (coupon) {
          const notExpired = !coupon.expiresAt || coupon.expiresAt > new Date()
          const underLimit = !coupon.usageLimit || coupon.usedCount < coupon.usageLimit
          if (notExpired && underLimit) {
            console.log('[REGISTER] Promo code applied:', coupon.code, coupon.discountPct, '% off')
            promoValid = true
          }
        }
      } catch (promoErr) {
        console.error('[register] promo code lookup failed:', promoErr)
      }
    }

    return NextResponse.json({ success: true, userId: user.id, promoValid })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
