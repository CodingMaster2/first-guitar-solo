import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string }
    const email = body.email?.trim()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    await prisma.funnelEvent.create({
      data: {
        event: 'discord-waitlist',
        metadata: JSON.stringify({ email }),
        page: '/discord',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST /api/waitlist error:', error)
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 })
  }
}
