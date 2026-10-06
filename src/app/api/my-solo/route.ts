import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const VALID_STYLES = ['blues', 'rock', 'metal', 'country', 'folk']
const VALID_VIBES = ['slow_melodic', 'fast_shreddy', 'mixed']

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: {
        soloStyle: true,
        guitarHero: true,
        soloVibe: true,
        customSolo: true,
        soloGeneratedAt: true,
        soloCompleted: true,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('my-solo GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch solo data' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json() as {
      soloStyle?: string
      guitarHero?: string
      soloVibe?: string
    }
    const { soloStyle, guitarHero, soloVibe } = body

    const updateData: { soloStyle?: string; guitarHero?: string | null; soloVibe?: string } = {}

    if (soloStyle !== undefined) {
      if (!VALID_STYLES.includes(soloStyle)) {
        return NextResponse.json({ error: 'Invalid style' }, { status: 400 })
      }
      updateData.soloStyle = soloStyle
    }
    if (guitarHero !== undefined) {
      updateData.guitarHero = guitarHero || null
    }
    if (soloVibe !== undefined) {
      if (!VALID_VIBES.includes(soloVibe)) {
        return NextResponse.json({ error: 'Invalid vibe' }, { status: 400 })
      }
      updateData.soloVibe = soloVibe
    }

    const profile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: updateData,
      select: {
        soloStyle: true,
        guitarHero: true,
        soloVibe: true,
        customSolo: true,
        soloGeneratedAt: true,
        soloCompleted: true,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('my-solo PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update solo preferences' }, { status: 500 })
  }
}
