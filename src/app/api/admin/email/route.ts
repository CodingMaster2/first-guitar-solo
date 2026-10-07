import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendAdminEmail } from '@/lib/email'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') return null
  return session
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = (await req.json()) as {
    segment: 'all' | 'paid' | 'free' | 'churn'
    subject: string
    message: string
  }
  const { segment, subject, message } = body

  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: 'Subject and message are required' },
      { status: 400 },
    )
  }

  try {
    let users: Array<{ email: string }>

    if (segment === 'all') {
      users = await prisma.user.findMany({ select: { email: true } })
    } else if (segment === 'paid') {
      users = await prisma.user.findMany({
        where: { purchaseStatus: 'PAID' },
        select: { email: true },
      })
    } else if (segment === 'free') {
      users = await prisma.user.findMany({
        where: { purchaseStatus: { not: 'PAID' } },
        select: { email: true },
      })
    } else if (segment === 'churn') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000)
      const profiles = await prisma.profile.findMany({
        where: {
          user: { purchaseStatus: 'PAID' },
          OR: [
            { lastPracticeDate: null },
            { lastPracticeDate: { lt: sevenDaysAgo } },
          ],
        },
        select: { user: { select: { email: true } } },
      })
      users = profiles.map((p) => ({ email: p.user.email }))
    } else {
      return NextResponse.json({ error: 'Invalid segment' }, { status: 400 })
    }

    // Send in batches of 50
    const BATCH_SIZE = 50
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE)
      await Promise.all(batch.map((u) => sendAdminEmail(u.email, subject, message)))
    }

    // Log to AdminLog
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        action: 'bulk-email',
        details: JSON.stringify({ segment, subject, count: users.length }),
      },
    })

    return NextResponse.json({ sent: users.length })
  } catch (err) {
    console.error('[admin/email] Error:', err)
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 })
  }
}
