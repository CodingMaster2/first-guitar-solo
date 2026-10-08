import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [profile, user] = await Promise.all([
      prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { avatarUrl: true, leaderboardOptIn: true },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { stripeCustomerId: true },
      }),
    ])
    return NextResponse.json({
      avatarUrl: profile?.avatarUrl ?? null,
      leaderboardOptIn: profile?.leaderboardOptIn ?? false,
      hasStripeCustomer: !!user?.stripeCustomerId,
    })
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as {
      name?: string
      currentPassword?: string
      newPassword?: string
      avatarUrl?: string | null
      leaderboardOptIn?: boolean
    }

    const updateData: { name?: string; password?: string } = {}
    const profileUpdateData: { avatarUrl?: string | null; leaderboardOptIn?: boolean } = {}

    if (typeof body.name === 'string') {
      const trimmed = body.name.trim()
      if (trimmed.length > 50) {
        return NextResponse.json({ error: 'Name too long (max 50 chars)' }, { status: 400 })
      }
      updateData.name = trimmed || undefined
    }

    if (body.avatarUrl !== undefined) {
      profileUpdateData.avatarUrl = typeof body.avatarUrl === 'string' ? (body.avatarUrl.trim() || null) : null
    }

    if (typeof body.leaderboardOptIn === 'boolean') {
      profileUpdateData.leaderboardOptIn = body.leaderboardOptIn
    }

    if (body.currentPassword && body.newPassword) {
      if (body.newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
      }

      const user = await prisma.user.findUnique({ where: { id: session.user.id } })
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const valid = await bcrypt.compare(body.currentPassword, user.password)
      if (!valid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }

      updateData.password = await bcrypt.hash(body.newPassword, 12)
    }

    const hasUserUpdate = Object.keys(updateData).length > 0
    const hasProfileUpdate = Object.keys(profileUpdateData).length > 0

    if (!hasUserUpdate && !hasProfileUpdate) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    if (hasUserUpdate) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: updateData,
      })
    }

    if (hasProfileUpdate) {
      await prisma.profile.updateMany({
        where: { userId: session.user.id },
        data: profileUpdateData,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Settings PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
