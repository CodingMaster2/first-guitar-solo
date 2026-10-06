import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const STALE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile?.weeklyPlan) {
      return NextResponse.json({ plan: null, stale: false, generatedAt: null })
    }

    const stale =
      !profile.weeklyPlanGeneratedAt ||
      Date.now() - profile.weeklyPlanGeneratedAt.getTime() > STALE_MS

    return NextResponse.json({
      plan: JSON.parse(profile.weeklyPlan),
      stale,
      generatedAt: profile.weeklyPlanGeneratedAt,
    })
  } catch (error) {
    console.error('Practice plan GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch practice plan' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [profile, recentSessions, hardLessons] = await Promise.all([
      prisma.profile.findUnique({ where: { userId: session.user.id } }),
      prisma.practiceSession.findMany({
        where: { userId: session.user.id, createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.progress.findMany({
        where: {
          userId: session.user.id,
          completed: true,
          OR: [{ difficulty: 'struggled' }, { rating: { lte: 2 } }],
        },
        orderBy: { day: 'asc' },
        take: 5,
      }),
    ])

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const recentDays = new Set(
      recentSessions.map((s) => new Date(s.createdAt).toDateString())
    ).size

    const weakAreas = hardLessons.map((p) => `Day ${p.day}`)

    const prompt = `Generate a 7-day guitar practice plan for a student.
Context:
- Currently on Day ${profile.currentDay} of 30
- Available practice time: ${profile.practiceMinutes ?? 20} minutes per day
- Weak areas (lessons rated hard): ${weakAreas.length > 0 ? weakAreas.join(', ') : 'none identified yet'}
- Recent practice: ${recentDays} days practiced in the last 7 days
- Current streak: ${profile.streak} days

Return ONLY a JSON array of 7 objects, one per day (Mon-Sun), like:
[{"day":"Monday","focus":"Day 12 bends review","duration":20,"type":"review","tip":"..."},...]
Each object must have: day (Mon-Sun), focus (what to practice), duration (minutes), type (new|review|rest), tip (one sentence advice).
Return NOTHING except the JSON array.`

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!groqRes.ok) {
      const err = await groqRes.text()
      console.error('Groq error:', err)
      return NextResponse.json({ error: 'AI generation failed' }, { status: 502 })
    }

    const groqData = await groqRes.json() as {
      choices: Array<{ message: { content: string } }>
    }

    const raw = groqData.choices[0]?.message?.content ?? ''

    // Extract JSON array from the response (model sometimes adds prose)
    const match = raw.match(/\[[\s\S]*\]/)
    if (!match) {
      console.error('Could not parse Groq response:', raw)
      return NextResponse.json({ error: 'Could not parse AI response' }, { status: 502 })
    }

    let plan: unknown
    try {
      plan = JSON.parse(match[0])
    } catch {
      console.error('JSON parse failed:', match[0])
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 502 })
    }

    const generatedAt = new Date()

    await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        weeklyPlan: JSON.stringify(plan),
        weeklyPlanGeneratedAt: generatedAt,
      },
    })

    return NextResponse.json({ plan, stale: false, generatedAt })
  } catch (error) {
    console.error('Practice plan POST error:', error)
    return NextResponse.json({ error: 'Failed to generate practice plan' }, { status: 500 })
  }
}
