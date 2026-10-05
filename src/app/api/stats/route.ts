import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.user.count({ where: { purchaseStatus: 'PAID' } })
    return NextResponse.json({ userCount: count })
  } catch {
    return NextResponse.json({ userCount: 0 })
  }
}
