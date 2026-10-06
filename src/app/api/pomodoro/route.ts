import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.purchaseStatus !== 'PAID') {
      return NextResponse.json({ error: 'Payment required' }, { status: 403 })
    }

    const profile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: { pomodoroSessions: { increment: 1 } },
    })

    return NextResponse.json({ sessions: profile.pomodoroSessions })
  } catch (error) {
    console.error('Pomodoro POST error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
