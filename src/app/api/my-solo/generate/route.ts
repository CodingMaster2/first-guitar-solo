import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const VALID_STYLES = ['blues', 'rock', 'metal', 'country', 'folk']
const VALID_VIBES = ['slow_melodic', 'fast_shreddy', 'mixed']

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.purchaseStatus !== 'PAID') {
      return NextResponse.json({ error: 'Payment required' }, { status: 403 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Solo generation is not configured.' }, { status: 503 })
    }

    const body = await req.json() as { style?: string; guitarHero?: string; vibe?: string }
    const { style, guitarHero, vibe } = body

    if (!style || !VALID_STYLES.includes(style)) {
      return NextResponse.json({ error: 'Invalid style. Must be one of: blues, rock, metal, country, folk' }, { status: 400 })
    }
    if (!vibe || !VALID_VIBES.includes(vibe)) {
      return NextResponse.json({ error: 'Invalid vibe. Must be one of: slow_melodic, fast_shreddy, mixed' }, { status: 400 })
    }

    const vibeDesc =
      vibe === 'slow_melodic'
        ? 'slow, expressive, lots of bends and vibrato'
        : vibe === 'fast_shreddy'
        ? 'fast runs, lots of hammer-ons and pull-offs'
        : 'balanced mix of fast and slow'

    const prompt = `You are a guitar tab composer. Generate a personalized 8-bar guitar solo.

Style: ${style} (influenced by ${guitarHero || 'classic rock guitarists'})
Vibe: ${vibeDesc}

STRICT REQUIREMENTS:
- Use ONLY the A minor pentatonic scale, primarily at the 5th position (frets 5-8)
- Include these techniques (they build throughout a 30-day course): single note picking, hammer-ons (h), pull-offs (p), slides (/), string bends (b), vibrato (~)
- Must include: at least 2 bends, 2 hammer-ons/pull-offs, 1 slide, 1 vibrato section
- Keep it musical — it should sound like a real ${style} guitar solo, not exercises
- Difficulty: intermediate beginner (achievable after 30 days of practice)
- Use standard 6-string ASCII tab format, 8 bars separated by |

Return ONLY the tab, in this exact format, nothing else before or after:
e|----------------------------------------------------------------|
B|----------------------------------------------------------------|
G|----------------------------------------------------------------|
D|----------------------------------------------------------------|
A|----------------------------------------------------------------|
E|----------------------------------------------------------------|

e|----------------------------------------------------------------|
B|----------------------------------------------------------------|
G|----------------------------------------------------------------|
D|----------------------------------------------------------------|
A|----------------------------------------------------------------|
E|----------------------------------------------------------------|`

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 1024,
      }),
    })

    if (!groqRes.ok) {
      const err = await groqRes.text()
      console.error('Groq error:', err)
      return NextResponse.json({ error: 'Solo generation failed' }, { status: 502 })
    }

    const groqData = await groqRes.json() as {
      choices: Array<{ message: { content: string } }>
    }

    const raw = groqData.choices[0]?.message?.content ?? ''

    // Extract only valid tab lines (lines starting with e|, B|, G|, D|, A|, or E|)
    const tabLines = raw.split('\n').filter((line) =>
      /^[eBGDAE]\|/.test(line.trim())
    )

    if (tabLines.length < 6) {
      console.error('Invalid tab response — too few string lines:', raw)
      return NextResponse.json({ error: 'Could not parse tab from AI response' }, { status: 502 })
    }

    const customSolo = tabLines.join('\n')

    await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        customSolo,
        soloStyle: style,
        guitarHero: guitarHero ?? null,
        soloVibe: vibe,
        soloGeneratedAt: new Date(),
      },
    })

    return NextResponse.json({ customSolo, soloStyle: style, guitarHero: guitarHero ?? null, soloVibe: vibe })
  } catch (error) {
    console.error('Solo generate error:', error)
    return NextResponse.json({ error: 'Failed to generate solo' }, { status: 500 })
  }
}
