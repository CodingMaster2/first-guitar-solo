import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Simple in-memory rate limit: 3 submissions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    const body = await request.json() as {
      name?: string
      email?: string
      subject?: string
      message?: string
    }

    const { name, email, subject, message } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    if (!message || typeof message !== 'string' || message.trim().length < 20) {
      return NextResponse.json(
        { error: 'Message must be at least 20 characters' },
        { status: 400 },
      )
    }

    const safeName = name.trim()
    const safeEmail = email.trim()
    const safeSubject = subject && typeof subject === 'string' ? subject.trim() : 'Other'
    const safeMessage = message.trim()

    await resend.emails.send({
      from: 'First Guitar Solo <noreply@firstguitarsolo.com>',
      to: 'zacharyjoolee@gmail.com',
      replyTo: safeEmail,
      subject: `[First Guitar Solo Contact] ${safeSubject} — from ${safeName}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0a0a0a;color:#d4d4d4;">
          <h2 style="color:#f59e0b;margin:0 0 16px;">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#a3a3a3;width:80px;">Name</td><td style="padding:8px 0;color:#ffffff;">${safeName}</td></tr>
            <tr><td style="padding:8px 0;color:#a3a3a3;">Email</td><td style="padding:8px 0;color:#ffffff;">${safeEmail}</td></tr>
            <tr><td style="padding:8px 0;color:#a3a3a3;">Subject</td><td style="padding:8px 0;color:#ffffff;">${safeSubject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #262626;margin:16px 0;" />
          <p style="color:#a3a3a3;margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Message</p>
          <p style="color:#d4d4d4;white-space:pre-wrap;margin:0;">${safeMessage}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact POST error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
