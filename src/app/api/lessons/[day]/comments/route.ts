import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Params { params: Promise<{ day: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { day: dayStr } = await params
    const day = parseInt(dayStr, 10)

    if (isNaN(day) || day < 1 || day > 30) {
      return NextResponse.json({ error: 'Invalid day' }, { status: 400 })
    }

    const comments = await prisma.lessonComment.findMany({
      where: { day },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(comments)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { day: dayStr } = await params
    const day = parseInt(dayStr, 10)

    if (isNaN(day) || day < 1 || day > 30) {
      return NextResponse.json({ error: 'Invalid day' }, { status: 400 })
    }

    const body = await req.json() as { content?: string }
    const { content } = body

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 })
    }
    if (content.trim().length > 2000) {
      return NextResponse.json({ error: 'Comment too long (max 2000 characters)' }, { status: 400 })
    }

    const comment = await prisma.lessonComment.create({
      data: { userId: session.user.id, day, content: content.trim() },
      include: { user: { select: { name: true } } },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { day: dayStr } = await params
    const day = parseInt(dayStr, 10)

    if (isNaN(day) || day < 1 || day > 30) {
      return NextResponse.json({ error: 'Invalid day' }, { status: 400 })
    }

    const body = await req.json() as { id?: string }
    const { id } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Comment id is required' }, { status: 400 })
    }

    const comment = await prisma.lessonComment.update({
      where: { id },
      data: { likes: { increment: 1 } },
    })

    return NextResponse.json(comment)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
