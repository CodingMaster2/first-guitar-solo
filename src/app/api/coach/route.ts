import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Anthropic from '@anthropic-ai/sdk'
import { LESSONS } from '@/lib/lessons'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const messages = await prisma.coachMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
      take: 20,
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Coach GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.purchaseStatus !== 'PAID') {
      return NextResponse.json({ error: 'Payment required' }, { status: 403 })
    }

    const body = await req.json() as { message: string }
    const { message } = body

    const [profile, progress] = await Promise.all([
      prisma.profile.findUnique({ where: { userId: session.user.id } }),
      prisma.progress.findMany({ where: { userId: session.user.id, completed: true } }),
    ])

    const currentDay = profile?.currentDay ?? 1
    const currentLesson = LESSONS.find((l) => l.day === currentDay)
    const completedDays = progress.map((p) => p.day)

    const weakAreas: string[] = []
    if (profile) {
      if ((profile.bendLevel ?? 5) <= 2) weakAreas.push('bending')
      if ((profile.vibratoLevel ?? 5) <= 2) weakAreas.push('vibrato')
      if ((profile.hammerOnLevel ?? 5) <= 2) weakAreas.push('hammer-ons')
      if ((profile.pullOffLevel ?? 5) <= 2) weakAreas.push('pull-offs')
      if ((profile.slideLevel ?? 5) <= 2) weakAreas.push('slides')
    }

    const systemPrompt = `You are the AI Guitar Coach for First Guitar Solo by Sixth String Labs. You are a knowledgeable, encouraging guitar teacher.

Student context:
- Current day: ${currentDay}/30
- Experience: ${profile?.experienceMonths ?? 'unknown'} months
- Instrument: ${profile?.instrument ?? 'unknown'}
- Practice time available: ${profile?.practiceMinutes ?? 'unknown'} minutes
- Weak areas: ${weakAreas.length > 0 ? weakAreas.join(', ') : 'none identified'}
- Completed days: ${completedDays.length > 0 ? completedDays.join(', ') : 'none yet'}
- Current lesson: ${currentLesson?.title ?? 'Day ' + currentDay}

Rules:
1. Give concise, actionable advice. Never write essays.
2. Always relate advice to where they are in the program.
3. If they're stuck, give a specific simplified exercise.
4. If they missed days, help them resume — never make them feel bad.
5. Do not claim the AI can hear their guitar or analyze their playing technically.
6. Be encouraging but honest. Don't give false praise.
7. Keep responses under 150 words unless a detailed explanation is genuinely needed.`

    // Get conversation history for context
    const recentMessages = await prisma.coachMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
      take: 18,
    })

    // Save user message
    await prisma.coachMessage.create({
      data: {
        userId: session.user.id,
        role: 'user',
        content: message,
      },
    })

    const anthropicMessages = recentMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))
    anthropicMessages.push({ role: 'user', content: message })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: systemPrompt,
      messages: anthropicMessages,
    })

    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : ''

    // Save assistant message
    await prisma.coachMessage.create({
      data: {
        userId: session.user.id,
        role: 'assistant',
        content: assistantMessage,
      },
    })

    // Return last 20 messages
    const allMessages = await prisma.coachMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
      take: 20,
    })

    return NextResponse.json({ messages: allMessages, reply: assistantMessage })
  } catch (error) {
    console.error('Coach POST error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
