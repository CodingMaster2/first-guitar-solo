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

    const body = await req.json() as { soloId: string; public?: boolean }
    const { soloId, public: isPublic = false } = body

    const existing = await prisma.generatedSolo.findUnique({ where: { id: soloId } })
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const updated = await prisma.generatedSolo.update({
      where: { id: soloId },
      data: { public: isPublic },
    })

    return NextResponse.json({ success: true, solo: { ...updated, createdAt: updated.createdAt.toISOString() } })
  } catch (error) {
    console.error('Save solo error:', error)
    return NextResponse.json({ error: 'Failed to save solo' }, { status: 500 })
  }
}
