import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await req.json() as { name: string; startDate: string }
  const { name, startDate } = body
  if (!name || !startDate) {
    return NextResponse.json({ error: 'name and startDate are required' }, { status: 400 })
  }
  const cohort = await prisma.cohort.create({ data: { name, startDate: new Date(startDate) } })
  return NextResponse.json(cohort)
}
