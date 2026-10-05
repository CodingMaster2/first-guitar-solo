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

    const body = await req.json() as {
      day?: number
      rating?: number
      comment?: string
      type?: string
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: session.user.id,
        day: body.day,
        rating: body.rating,
        comment: body.comment,
        type: body.type,
      },
    })

    return NextResponse.json({ success: true, feedback })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
  }
}
