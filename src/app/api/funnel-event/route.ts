import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      event?: unknown
      page?: unknown
      utmSource?: unknown
      utmMedium?: unknown
      utmCampaign?: unknown
      metadata?: unknown
    }
    const { event, page, utmSource, utmMedium, utmCampaign, metadata } = body

    if (!event || typeof event !== 'string') {
      return NextResponse.json({ error: 'event required' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)

    await prisma.funnelEvent.create({
      data: {
        userId: session?.user?.id ?? null,
        event,
        page: typeof page === 'string' ? page : null,
        utmSource: typeof utmSource === 'string' ? utmSource : null,
        utmMedium: typeof utmMedium === 'string' ? utmMedium : null,
        utmCampaign: typeof utmCampaign === 'string' ? utmCampaign : null,
        metadata: metadata != null ? JSON.stringify(metadata) : null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true }) // silently fail — never break the user's page
  }
}
