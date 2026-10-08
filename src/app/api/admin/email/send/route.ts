import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = (await req.json()) as {
    segment: unknown
    subject: unknown
    body: unknown
  }
  const { segment, subject, body: emailBody } = body

  if (!segment || !['paid', 'unpaid', 'inactive'].includes(segment as string)) {
    return NextResponse.json(
      { error: 'segment must be "paid", "unpaid", or "inactive"' },
      { status: 400 },
    )
  }
  if (typeof subject !== 'string' || !subject.trim()) {
    return NextResponse.json({ error: 'subject is required' }, { status: 400 })
  }
  if (typeof emailBody !== 'string' || !emailBody.trim()) {
    return NextResponse.json({ error: 'body is required' }, { status: 400 })
  }

  let users: Array<{ email: string; name: string | null }>

  if (segment === 'paid') {
    users = await prisma.user.findMany({
      where: { purchaseStatus: 'PAID' },
      select: { email: true, name: true },
    })
  } else if (segment === 'unpaid') {
    users = await prisma.user.findMany({
      where: { purchaseStatus: 'UNPAID' },
      select: { email: true, name: true },
    })
  } else {
    // inactive: paid users with lastPracticeDate older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000)
    users = await prisma.user.findMany({
      where: {
        purchaseStatus: 'PAID',
        profile: { lastPracticeDate: { lt: sevenDaysAgo } },
      },
      select: { email: true, name: true },
    })
  }

  console.log('[ADMIN EMAIL]', segment, subject, users.length, 'recipients')

  return NextResponse.json({
    success: true,
    recipientCount: users.length,
    preview: {
      subject,
      to: users.slice(0, 3).map((u) => u.email),
      body: emailBody.slice(0, 200),
    },
    note: 'Email sending is logged only — connect Resend in production',
  })
}
