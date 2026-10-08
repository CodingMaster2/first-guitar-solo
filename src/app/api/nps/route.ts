import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const npsSchema = z.object({
  score: z.number().int().min(0).max(10),
  comment: z.string().max(1000).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Check if user already submitted
    const existing = await prisma.npsSurvey.findUnique({ where: { userId } })
    if (existing) {
      return NextResponse.json({ alreadySubmitted: true })
    }

    let rawBody: unknown
    try {
      rawBody = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    const npsParsed = npsSchema.safeParse(rawBody)
    if (!npsParsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: z.flattenError(npsParsed.error) },
        { status: 400 },
      )
    }
    const { score, comment } = npsParsed.data

    await prisma.npsSurvey.create({
      data: {
        userId,
        score,
        comment: comment?.trim() || null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
