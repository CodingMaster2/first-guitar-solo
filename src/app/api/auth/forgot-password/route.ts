import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()
const MAX_REQUESTS = 3
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

function checkRateLimit(email: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(email)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(email, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (entry.count >= MAX_REQUESTS) {
    return false
  }

  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string }
    const email = (body.email ?? '').toLowerCase().trim()

    if (!email) {
      // Still return success — don't hint about missing fields
      return NextResponse.json({ success: true })
    }

    if (!checkRateLimit(email)) {
      // Return success anyway — don't reveal rate limiting to potential attackers
      return NextResponse.json({ success: true })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      // Delete any existing unused tokens for this user
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, used: false },
      })

      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
          used: false,
        },
      })

      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`

      try {
        await sendPasswordResetEmail(email, resetUrl)
      } catch (emailErr) {
        console.error('[forgot-password] email send failed:', emailErr)
      }
    }

    // Always return success — never reveal whether the email exists
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[forgot-password] error:', error)
    return NextResponse.json({ success: true }) // Don't leak errors
  }
}
