import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string }
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Try to find the user by email — Feedback requires a userId
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (user) {
      // User exists — save as a lead feedback entry
      await prisma.feedback.create({
        data: {
          userId: user.id,
          type: 'lead',
          comment: email,
        },
      })
    }
    // If no user found, we still return ok — the email is stored in localStorage on the client

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/try-signup error:', error)
    // Return ok anyway — the email is stored in localStorage
    return NextResponse.json({ ok: true })
  }
}
