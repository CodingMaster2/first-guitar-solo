import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateAdaptivePath } from '@/lib/adaptivePath'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json({ path: null })

  if (!profile.adaptivePath) return NextResponse.json({ path: null })

  const path = JSON.parse(profile.adaptivePath) as number[]
  return NextResponse.json({ path })
}

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const path = generateAdaptivePath({
    experienceMonths: profile.experienceMonths,
    tabComfort: profile.tabComfort,
    pickingLevel: profile.pickingLevel,
    hammerOnLevel: profile.hammerOnLevel,
    pentatonicLevel: profile.pentatonicLevel,
    bendLevel: profile.bendLevel,
  })

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: { adaptivePath: JSON.stringify(path) },
  })

  return NextResponse.json({ path })
}
