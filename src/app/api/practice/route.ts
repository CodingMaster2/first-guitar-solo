import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as { day: number; duration: number; difficulty?: string }

    const practiceSession = await prisma.practiceSession.create({
      data: {
        userId: session.user.id,
        day: body.day,
        duration: body.duration,
        difficulty: body.difficulty,
      },
    })

    return NextResponse.json({ success: true, practiceSession })
  } catch (error) {
    console.error('Practice POST error:', error)
    return NextResponse.json({ error: 'Failed to log practice' }, { status: 500 })
  }
}
