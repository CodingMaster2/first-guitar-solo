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
      instrument?: string
      experienceMonths?: number
      tabComfort?: number
      hasBasicChords?: boolean
      hasLearnedSolo?: boolean
      pickingLevel?: number
      hammerOnLevel?: number
      pullOffLevel?: number
      slideLevel?: number
      bendLevel?: number
      vibratoLevel?: number
      pentatonicLevel?: number
      styles?: string
      practiceMinutes?: number
    }

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        instrument: body.instrument,
        experienceMonths: body.experienceMonths,
        tabComfort: body.tabComfort,
        hasBasicChords: body.hasBasicChords,
        hasLearnedSolo: body.hasLearnedSolo,
        pickingLevel: body.pickingLevel,
        hammerOnLevel: body.hammerOnLevel,
        pullOffLevel: body.pullOffLevel,
        slideLevel: body.slideLevel,
        bendLevel: body.bendLevel,
        vibratoLevel: body.vibratoLevel,
        pentatonicLevel: body.pentatonicLevel,
        styles: body.styles,
        practiceMinutes: body.practiceMinutes,
        currentDay: 1,
      },
      create: {
        userId: session.user.id,
        instrument: body.instrument,
        experienceMonths: body.experienceMonths,
        tabComfort: body.tabComfort,
        hasBasicChords: body.hasBasicChords,
        hasLearnedSolo: body.hasLearnedSolo,
        pickingLevel: body.pickingLevel,
        hammerOnLevel: body.hammerOnLevel,
        pullOffLevel: body.pullOffLevel,
        slideLevel: body.slideLevel,
        bendLevel: body.bendLevel,
        vibratoLevel: body.vibratoLevel,
        pentatonicLevel: body.pentatonicLevel,
        styles: body.styles,
        practiceMinutes: body.practiceMinutes,
        currentDay: 1,
      },
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ error: 'Failed to save onboarding' }, { status: 500 })
  }
}
