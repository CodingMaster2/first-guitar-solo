import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const flags = await prisma.featureFlag.findMany({ orderBy: { key: 'asc' } })
  return NextResponse.json(flags)
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { key, enabled = false, rollout = 100 } = body

  if (!key || typeof key !== 'string' || !key.trim()) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 })
  }

  try {
    const flag = await prisma.featureFlag.create({
      data: {
        key: key.trim(),
        enabled: Boolean(enabled),
        rollout: Number(rollout),
      },
    })
    return NextResponse.json(flag, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Key already exists' }, { status: 409 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { id?: string; enabled?: boolean; rollout?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  const { id, enabled, rollout } = body

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const data: { enabled?: boolean; rollout?: number } = {}
  if (typeof enabled === 'boolean') data.enabled = enabled
  if (typeof rollout === 'number') data.rollout = rollout

  try {
    const flag = await prisma.featureFlag.update({ where: { id }, data })
    return NextResponse.json(flag)
  } catch {
    return NextResponse.json({ error: 'Flag not found or update failed' }, { status: 404 })
  }
}
