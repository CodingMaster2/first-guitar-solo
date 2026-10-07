import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendPasswordChangedEmail } from '@/lib/email'

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json({ valid: false, reason: 'No token provided.' })
    }

    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!record) {
      return NextResponse.json({ valid: false, reason: 'This reset link is invalid.' })
    }

    if (record.used) {
      return NextResponse.json({ valid: false, reason: 'This reset link has already been used.' })
    }

    if (new Date() > record.expiresAt) {
      return NextResponse.json({ valid: false, reason: 'This reset link has expired. Please request a new one.' })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('[reset-password GET] error:', error)
    return NextResponse.json({ valid: false, reason: 'Failed to validate reset link.' })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { token?: string; password?: string }
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!record) {
      return NextResponse.json({ error: 'This reset link is invalid.' }, { status: 400 })
    }

    if (record.used) {
      return NextResponse.json({ error: 'This reset link has already been used.' }, { status: 400 })
    }

    if (new Date() > record.expiresAt) {
      return NextResponse.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { used: true },
      }),
    ])

    try {
      await sendPasswordChangedEmail(record.user.email)
    } catch (emailErr) {
      console.error('[reset-password POST] confirmation email failed:', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[reset-password POST] error:', error)
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 })
  }
}
