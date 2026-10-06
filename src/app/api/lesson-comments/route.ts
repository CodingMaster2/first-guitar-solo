import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const dayParam = searchParams.get('day')
    const day = dayParam ? parseInt(dayParam, 10) : null

    if (!day || isNaN(day) || day < 1 || day > 30) {
      return NextResponse.json({ error: 'Invalid day' }, { status: 400 })
    }

    const comments = await prisma.lessonComment.findMany({
      where: { day },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(comments)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as { day?: number; content?: string }
    const { day, content } = body

    if (!day || isNaN(day) || day < 1 || day > 30) {
      return NextResponse.json({ error: 'Invalid day' }, { status: 400 })
    }
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 })
    }
    if (content.trim().length > 2000) {
      return NextResponse.json({ error: 'Comment too long (max 2000 characters)' }, { status: 400 })
    }

    const comment = await prisma.lessonComment.create({
      data: {
        userId: session.user.id,
        day,
        content: content.trim(),
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
