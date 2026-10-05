import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.coachMessage.deleteMany({ where: { userId: session.user.id } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Coach clear error:', error)
    return NextResponse.json({ error: 'Failed to clear conversation' }, { status: 500 })
  }
}
