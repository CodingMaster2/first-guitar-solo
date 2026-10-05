import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const assets = await prisma.audioAsset.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ assets })
  } catch (error) {
    console.error('Admin upload GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json() as {
      type: string
      label: string
      url: string
      day?: number
      section?: number
      speed?: string
      published?: boolean
    }

    const asset = await prisma.audioAsset.create({
      data: {
        type: body.type,
        label: body.label,
        url: body.url,
        day: body.day,
        section: body.section,
        speed: body.speed,
        published: body.published ?? false,
      },
    })

    return NextResponse.json({ success: true, asset })
  } catch (error) {
    console.error('Admin upload POST error:', error)
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    await prisma.audioAsset.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin upload DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 })
  }
}
