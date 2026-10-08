import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Groq from 'groq-sdk'
import { z } from 'zod'

const workshopSchema = z.object({
  style: z.string().min(1).max(100),
  key: z.string().min(1).max(10),
  mood: z.string().min(1).max(50),
  difficulty: z.enum(['beginner', 'intermediate']),
  bars: z.number().int().min(8).max(24),
})

interface RateLimitEntry {
  count: number
  resetAt: number
}

const soloRateLimitMap = new Map<string, RateLimitEntry>()
const SOLO_MAX_PER_DAY = 5
const SOLO_WINDOW_MS = 24 * 60 * 60 * 1000

function checkSoloRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = soloRateLimitMap.get(userId)

  if (!entry || now > entry.resetAt) {
    soloRateLimitMap.set(userId, { count: 1, resetAt: now + SOLO_WINDOW_MS })
    return true
  }

  if (entry.count >= SOLO_MAX_PER_DAY) {
    return false
  }

  entry.count++
  return true
}

interface GroqSoloSection {
  name: string
  bars: string
  description: string
  technique: string
  tip: string
}

interface GroqSoloResponse {
  title: string
  bpm: number
  tabContent: string
  sections: GroqSoloSection[]
  techniques: string[]
  practiceGuide: string
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!checkSoloRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: 'Daily limit reached. You can generate up to 5 solos per day.' },
        { status: 429 }
      )
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 503 })
    }

    let rawBody: unknown
    try {
      rawBody = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    const workshopParsed = workshopSchema.safeParse(rawBody)
    if (!workshopParsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: z.flattenError(workshopParsed.error) },
        { status: 400 },
      )
    }
    const { style, key, mood, difficulty, bars } = workshopParsed.data

    const systemPrompt = `You are a professional guitar teacher creating tablature for students.
You must output ONLY valid JSON, no markdown, no explanation outside the JSON.
The JSON must match this exact structure:
{
  "title": "descriptive title for this solo",
  "bpm": number between 60-100 for beginner, 80-120 for intermediate,
  "tabContent": "the full guitar tablature as a string using standard ASCII tab format. Use exactly 6 lines labeled e|, B|, G|, D|, A|, E| (high to low). Each measure separated by |. Use standard notation: h=hammer-on, p=pull-off, b=bend, r=release, /=slide up, \\\\=slide down, ~=vibrato. Make it ${bars} bars long.",
  "sections": [
    {
      "name": "Section name (e.g. Opening Lick)",
      "bars": "1-4",
      "description": "What happens here and why",
      "technique": "primary technique",
      "tip": "specific practice tip for this section"
    }
  ],
  "techniques": ["array", "of", "technique", "names"],
  "practiceGuide": "2-3 paragraph practice guide. Start slow. How to approach each section. Common mistakes to avoid."
}`

    const userPrompt = `Create a ${bars}-bar guitar solo with these specifications:
- Style/influence: ${style} (play in the style of this guitarist)
- Key: ${key}
- Mood/feel: ${mood}
- Difficulty: ${difficulty}
- Length: ${bars} bars

Make it sound authentic to ${style}'s playing style. Include characteristic techniques they're known for.
The solo should be genuinely playable and musically interesting.`

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    async function callGroq(): Promise<string> {
      const completion = await groq.chat.completions.create({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })
      return completion.choices[0].message.content ?? ''
    }

    function extractJson(raw: string): string {
      const match = raw.match(/\{[\s\S]*\}/)
      return match ? match[0] : raw
    }

    let raw = extractJson(await callGroq())

    let parsed: GroqSoloResponse
    try {
      parsed = JSON.parse(raw) as GroqSoloResponse
    } catch {
      // Retry once
      raw = extractJson(await callGroq())
      parsed = JSON.parse(raw) as GroqSoloResponse
    }

    const solo = await prisma.generatedSolo.create({
      data: {
        userId: session.user.id,
        title: parsed.title,
        style,
        key,
        mood,
        difficulty,
        bars,
        bpm: parsed.bpm,
        tabContent: parsed.tabContent,
        sections: JSON.stringify(parsed.sections),
        techniques: JSON.stringify(parsed.techniques),
        practiceGuide: parsed.practiceGuide,
        public: false,
      },
    })

    return NextResponse.json({
      ...solo,
      createdAt: solo.createdAt.toISOString(),
      sections: parsed.sections,
      techniques: parsed.techniques,
    })
  } catch (error) {
    console.error('Generate solo error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Generation failed: ${message}` }, { status: 500 })
  }
}
