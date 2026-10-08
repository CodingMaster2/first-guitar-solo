import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const solos = await prisma.generatedSolo.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({
      solos: solos.map(s => ({ ...s, createdAt: s.createdAt.toISOString() })),
    })
  } catch (error) {
    console.error('My solos GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch solos' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const soloId = searchParams.get('id')
    if (!soloId) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const existing = await prisma.generatedSolo.findUnique({ where: { id: soloId } })
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.generatedSolo.delete({ where: { id: soloId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('My solos DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete solo' }, { status: 500 })
  }
}
