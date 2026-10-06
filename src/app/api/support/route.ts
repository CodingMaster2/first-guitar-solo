import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { subject?: string; message?: string; email?: string }
    const { subject, message, email } = body

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required.' },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)
    let userId: string

    if (session?.user?.id) {
      userId = session.user.id
    } else {
      // Guest submission — require email
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required when not logged in.' },
          { status: 400 }
        )
      }

      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        userId = existing.id
      } else {
        // Create a minimal guest user
        const hashedPw = await bcrypt.hash(Math.random().toString(36) + Date.now(), 10)
        const newUser = await prisma.user.create({
          data: {
            email,
            password: hashedPw,
            purchaseStatus: 'UNPAID',
          },
        })
        userId = newUser.id
      }
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        subject,
        message,
        status: 'open',
      },
    })

    return NextResponse.json({ success: true, ticketId: ticket.id })
  } catch (error) {
    console.error('[Support API]', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
