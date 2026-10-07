import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { weeklyGoalDays: true, soloStyle: true, soloVibe: true, adaptivePath: true, leaderboardOptIn: true },
    })

    let prefs: Record<string, unknown> = {}
    try { prefs = profile?.adaptivePath ? JSON.parse(profile.adaptivePath) : {} } catch { prefs = {} }

    return NextResponse.json({
      weeklyGoalDays: profile?.weeklyGoalDays ?? 5,
      guitarType: profile?.soloStyle ?? '',
      preferredGenre: profile?.soloVibe ?? '',
      reminderTime: typeof prefs.reminderTime === 'string' ? prefs.reminderTime : '',
      publicProfile: typeof prefs.publicProfile === 'boolean' ? prefs.publicProfile : false,
      leaderboardOptIn: profile?.leaderboardOptIn ?? false,
    })
  } catch (error) {
    console.error('Preferences GET error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json() as Record<string, unknown>
    const updateData: Record<string, unknown> = {}

    if (typeof body.weeklyGoalDays === 'number') {
      updateData.weeklyGoalDays = Math.max(1, Math.min(7, body.weeklyGoalDays))
    }
    if (typeof body.leaderboardOptIn === 'boolean') {
      updateData.leaderboardOptIn = body.leaderboardOptIn
    }
    if (typeof body.guitarType === 'string') {
      updateData.soloStyle = body.guitarType
    }
    if (typeof body.preferredGenre === 'string') {
      updateData.soloVibe = body.preferredGenre
    }

    if (body.reminderTime !== undefined || typeof body.publicProfile === 'boolean') {
      const existing = await prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { adaptivePath: true },
      })
      let prefs: Record<string, unknown> = {}
      try { prefs = existing?.adaptivePath ? JSON.parse(existing.adaptivePath) : {} } catch { prefs = {} }
      if (typeof body.reminderTime === 'string') prefs.reminderTime = body.reminderTime
      if (typeof body.publicProfile === 'boolean') prefs.publicProfile = body.publicProfile
      updateData.adaptivePath = JSON.stringify(prefs)
    }

    if (Object.keys(updateData).length === 0) return NextResponse.json({ ok: true })

    await prisma.profile.update({ where: { userId: session.user.id }, data: updateData })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Preferences PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
  }
}
