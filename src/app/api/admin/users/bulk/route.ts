import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') return null
  return session
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json() as { ids: string[]; action: string }
  const { ids, action } = body

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids must be a non-empty array' }, { status: 400 })
  }

  try {
    switch (action) {
      case 'grant-access':
        await prisma.user.updateMany({
          where: { id: { in: ids } },
          data: { purchaseStatus: 'PAID' },
        })
        break
      case 'revoke-access':
        await prisma.user.updateMany({
          where: { id: { in: ids } },
          data: { purchaseStatus: 'UNPAID' },
        })
        break
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    // Log each action
    await prisma.adminLog.createMany({
      data: ids.map((userId) => ({
        adminId: session.user.id,
        action: `bulk-${action}`,
        target: userId,
        details: `Bulk action: ${action}`,
      })),
    })

    return NextResponse.json({ ok: true, affected: ids.length })
  } catch (err) {
    console.error('Bulk action error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
