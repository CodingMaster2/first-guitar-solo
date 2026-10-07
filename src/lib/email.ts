import { Resend } from 'resend'

const FROM_ADDRESS = process.env.NODE_ENV === 'production'
  ? 'noreply@firstguitarsolo.com'
  : 'onboarding@resend.dev'

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY is not set — emails will not be sent')
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}

function baseEmailHtml(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>First Guitar Solo</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <div style="display:inline-block;">
                <p style="margin:0;color:#f59e0b;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Sixth String Labs</p>
                <p style="margin:4px 0 0;color:#ffffff;font-size:20px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;">First Guitar Solo</p>
              </div>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background-color:#111111;border:1px solid #262626;border-radius:12px;padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;color:#525252;font-size:12px;">© ${new Date().getFullYear()} Sixth String Labs. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function btnLink(url: string, label: string): string {
  return `<a href="${url}" style="display:inline-block;background-color:#f59e0b;color:#000000;font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;text-decoration:none;padding:14px 32px;border-radius:8px;">${label}</a>`
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const resend = getResend()
  if (!resend) return

  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`
  const displayName = name || 'Guitarist'

  const html = baseEmailHtml(`
    <h1 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;">Welcome, ${displayName}! 🎸</h1>
    <p style="margin:0 0 24px;color:#f59e0b;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Your 30-day journey starts now</p>
    <p style="margin:0 0 16px;color:#d4d4d4;font-size:15px;line-height:1.6;">You're about to play your first guitar solo — for real. In 30 structured days you'll go from zero to performing a complete solo you built yourself.</p>
    <p style="margin:0 0 8px;color:#a3a3a3;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Here's what's waiting for you:</p>
    <ul style="margin:0 0 24px;padding-left:20px;color:#d4d4d4;font-size:14px;line-height:2;">
      <li>30 structured days — one technique at a time</li>
      <li>AI Guitar Coach available at any time</li>
      <li>A personalized solo generated just for you on Day 30</li>
    </ul>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td>${btnLink(dashboardUrl, 'Go to Dashboard')}</td></tr>
    </table>
    <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;">Questions? Hit reply — we read everything.</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: 'Welcome to First Guitar Solo 🎸',
      html,
    })
  } catch (err) {
    console.error('[email] sendWelcomeEmail failed:', err)
  }
}

export async function sendPurchaseConfirmationEmail(to: string, name: string): Promise<void> {
  const resend = getResend()
  if (!resend) return

  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`
  const displayName = name || 'Guitarist'

  const html = baseEmailHtml(`
    <h1 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;">You're in, ${displayName}!</h1>
    <p style="margin:0 0 24px;color:#f59e0b;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Purchase Confirmed — $25 one-time payment received</p>
    <p style="margin:0 0 16px;color:#d4d4d4;font-size:15px;line-height:1.6;">Your payment has been processed. No recurring charges — this is a one-time purchase and you have full lifetime access.</p>
    <p style="margin:0 0 8px;color:#a3a3a3;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">What's unlocked:</p>
    <ul style="margin:0 0 24px;padding-left:20px;color:#d4d4d4;font-size:14px;line-height:2;">
      <li>All 30 days of structured lessons</li>
      <li>AI Guitar Coach — ask anything, anytime</li>
      <li>Personalized solo generation on Day 30</li>
    </ul>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td>${btnLink(dashboardUrl, 'Start Learning')}</td></tr>
    </table>
    <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;">Keep this email as your receipt. Questions? Reply here.</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: "You're in! First Guitar Solo — Purchase Confirmed",
      html,
    })
  } catch (err) {
    console.error('[email] sendPurchaseConfirmationEmail failed:', err)
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  const resend = getResend()
  if (!resend) return

  const html = baseEmailHtml(`
    <h1 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;">Reset Your Password</h1>
    <p style="margin:0 0 24px;color:#d4d4d4;font-size:15px;line-height:1.6;">We received a request to reset the password for your First Guitar Solo account. Click the button below — this link expires in <strong style="color:#f59e0b;">1 hour</strong>.</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td>${btnLink(resetUrl, 'Reset Password')}</td></tr>
    </table>
    <p style="margin:0 0 16px;color:#737373;font-size:13px;line-height:1.6;">If the button doesn't work, copy and paste this URL into your browser:</p>
    <p style="margin:0 0 24px;color:#525252;font-size:12px;word-break:break-all;">${resetUrl}</p>
    <p style="margin:0;color:#737373;font-size:12px;line-height:1.6;">If you didn't request a password reset, you can safely ignore this email. Your password will not change.</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: 'Reset your First Guitar Solo password',
      html,
    })
  } catch (err) {
    console.error('[email] sendPasswordResetEmail failed:', err)
  }
}

export async function sendAdminEmail(
  to: string,
  subject: string,
  message: string,
): Promise<void> {
  const resend = getResend()
  if (!resend) return

  // Escape HTML entities and preserve line breaks
  const htmlMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br />')

  const html = baseEmailHtml(`
    <h1 style="margin:0 0 24px;color:#ffffff;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;">${subject}</h1>
    <div style="color:#d4d4d4;font-size:15px;line-height:1.7;">${htmlMessage}</div>
  `)

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    })
  } catch (err) {
    console.error(`[email] sendAdminEmail to ${to} failed:`, err)
  }
}

export async function sendPasswordChangedEmail(to: string): Promise<void> {
  const resend = getResend()
  if (!resend) return

  const supportUrl = `${process.env.NEXTAUTH_URL}/support`

  const html = baseEmailHtml(`
    <h1 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;">Password Changed</h1>
    <p style="margin:0 0 24px;color:#d4d4d4;font-size:15px;line-height:1.6;">Your First Guitar Solo password was successfully changed. If you made this change, no further action is needed.</p>
    <p style="margin:0 0 24px;color:#d4d4d4;font-size:15px;line-height:1.6;">If you did <strong style="color:#f59e0b;">not</strong> make this change, your account may be compromised. Please contact support immediately.</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td>${btnLink(supportUrl, 'Contact Support')}</td></tr>
    </table>
    <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;">This is an automated security notification.</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: 'Your password was changed — First Guitar Solo',
      html,
    })
  } catch (err) {
    console.error('[email] sendPasswordChangedEmail failed:', err)
  }
}

export async function sendDayCheckInEmail(
  user: { email: string; name: string | null },
  day: number,
  streak: number,
): Promise<void> {
  const resend = getResend()
  if (!resend) return

  const practiceUrl = `${process.env.NEXTAUTH_URL}/lesson/${day}`
  const displayName = user.name || 'Guitarist'

  const html = baseEmailHtml(`
    <h1 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;">Day ${day} Check-In 🎸</h1>
    <p style="margin:0 0 24px;color:#f59e0b;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">${streak}-Day Streak</p>
    <p style="margin:0 0 16px;color:#d4d4d4;font-size:15px;line-height:1.6;">Hey ${displayName}, you've been at it for ${day} days. Your ${streak}-day streak is looking great — keep that momentum going.</p>
    <p style="margin:0 0 24px;color:#d4d4d4;font-size:15px;line-height:1.6;">Every day you practice, your fingers get a little faster and your ear gets a little sharper. Today's session is waiting.</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td>${btnLink(practiceUrl, 'Continue Practice')}</td></tr>
    </table>
    <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;">Keep it up — you're building a habit that lasts.</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: user.email,
      replyTo: FROM_ADDRESS,
      subject: `Day ${day} check-in — keep your ${streak}-day streak alive 🎸`,
      html,
    })
  } catch (err) {
    console.warn('[email] sendDayCheckInEmail failed:', err)
  }
}

export async function sendInactivityEmail(
  user: { email: string; name: string | null },
  daysMissed: number,
  currentDay: number,
): Promise<void> {
  const resend = getResend()
  if (!resend) return

  const resumeUrl = `${process.env.NEXTAUTH_URL}/lesson/${currentDay}`
  const displayName = user.name || 'Guitarist'

  const html = baseEmailHtml(`
    <h1 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;">Your Guitar is Waiting</h1>
    <p style="margin:0 0 24px;color:#f59e0b;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">${daysMissed} days since your last practice</p>
    <p style="margin:0 0 16px;color:#d4d4d4;font-size:15px;line-height:1.6;">Hey ${displayName}, life gets busy. That's completely okay.</p>
    <p style="margin:0 0 16px;color:#d4d4d4;font-size:15px;line-height:1.6;">But your guitar misses you. You were on Day ${currentDay} — and you were making real progress. It only takes 2 minutes to get back in the groove and remember why you started.</p>
    <p style="margin:0 0 24px;color:#d4d4d4;font-size:15px;line-height:1.6;">No pressure. No guilt. Just a reminder that Day ${currentDay} is still here waiting for you.</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td>${btnLink(resumeUrl, `Resume Day ${currentDay}`)}</td></tr>
    </table>
    <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;">You've already done the hardest part — you started.</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: user.email,
      replyTo: FROM_ADDRESS,
      subject: `Your guitar is waiting (${daysMissed} days since your last practice)`,
      html,
    })
  } catch (err) {
    console.warn('[email] sendInactivityEmail failed:', err)
  }
}

export async function sendStreakMilestoneEmail(
  user: { email: string; name: string | null },
  streak: number,
): Promise<void> {
  const resend = getResend()
  if (!resend) return

  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`
  const displayName = user.name || 'Guitarist'

  const html = baseEmailHtml(`
    <h1 style="margin:0 0 8px;color:#ffffff;font-size:48px;font-weight:900;text-align:center;">🔥</h1>
    <h2 style="margin:0 0 8px;color:#f59e0b;font-size:36px;font-weight:900;text-align:center;letter-spacing:0.05em;">${streak} Days</h2>
    <p style="margin:0 0 24px;color:#ffffff;font-size:18px;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:0.1em;">Streak Milestone!</p>
    <p style="margin:0 0 16px;color:#d4d4d4;font-size:15px;line-height:1.6;">Hey ${displayName}, you've hit a ${streak}-day streak — that puts you in the top 10% of students who stick with it.</p>
    <p style="margin:0 0 16px;color:#d4d4d4;font-size:15px;line-height:1.6;">Studies show that ${streak} days of consistent practice rewires your muscle memory in a permanent way. The patterns your fingers are building right now? They don't go away.</p>
    <p style="margin:0 0 24px;color:#d4d4d4;font-size:15px;line-height:1.6;">Keep this streak alive. You're building something real.</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td>${btnLink(dashboardUrl, 'View Your Progress')}</td></tr>
    </table>
    <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;">Most people quit before ${streak} days. You didn't.</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: user.email,
      replyTo: FROM_ADDRESS,
      subject: `🔥 ${streak}-day streak! You're in the top 10% of students`,
      html,
    })
  } catch (err) {
    console.warn('[email] sendStreakMilestoneEmail failed:', err)
  }
}

export async function sendHalfwayEmail(
  user: { email: string; name: string | null },
): Promise<void> {
  const resend = getResend()
  if (!resend) return

  const day16Url = `${process.env.NEXTAUTH_URL}/lesson/16`
  const displayName = user.name || 'Guitarist'

  const html = baseEmailHtml(`
    <h1 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;">Halfway There 🎸</h1>
    <p style="margin:0 0 24px;color:#f59e0b;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Day 15 Complete</p>
    <p style="margin:0 0 16px;color:#d4d4d4;font-size:15px;line-height:1.6;">Hey ${displayName}, you've done something most beginners never do — you stuck with it for 15 days.</p>
    <p style="margin:0 0 16px;color:#d4d4d4;font-size:15px;line-height:1.6;">The techniques you've been drilling are starting to click. The second half is where it all comes together — you'll hear yourself actually playing, not just practicing.</p>
    <p style="margin:0 0 24px;color:#d4d4d4;font-size:15px;line-height:1.6;">The solo is within reach. Day 16 is ready for you.</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td>${btnLink(day16Url, 'Continue to Day 16')}</td></tr>
    </table>
    <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;">15 down. 15 to go. You've got this.</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: user.email,
      replyTo: FROM_ADDRESS,
      subject: `You're halfway there — Day 15 complete 🎸`,
      html,
    })
  } catch (err) {
    console.warn('[email] sendHalfwayEmail failed:', err)
  }
}

export async function sendGraduationEmail(
  user: { email: string; name: string | null },
): Promise<void> {
  const resend = getResend()
  if (!resend) return

  const baseUrl = process.env.NEXTAUTH_URL ?? ''
  const certificateUrl = `${baseUrl}/solo/${encodeURIComponent(user.email)}`
  const upsellUrl = `${baseUrl}/upsell`
  const displayName = user.name || 'Guitarist'

  const html = baseEmailHtml(`
    <h1 style="margin:0 0 8px;color:#f59e0b;font-size:36px;font-weight:900;text-align:center;letter-spacing:0.05em;">🎸</h1>
    <h2 style="margin:0 0 8px;color:#ffffff;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;text-align:center;">You Did It.</h2>
    <p style="margin:0 0 24px;color:#f59e0b;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-align:center;">30 Days Complete</p>
    <p style="margin:0 0 16px;color:#d4d4d4;font-size:15px;line-height:1.6;">Hey ${displayName}, you just completed your first guitar solo.</p>
    <p style="margin:0 0 16px;color:#d4d4d4;font-size:15px;line-height:1.6;">That's not nothing. Most people who pick up a guitar put it down after a few weeks. You didn't. You showed up for 30 days and built something real from scratch.</p>
    <p style="margin:0 0 24px;color:#d4d4d4;font-size:15px;line-height:1.6;">Your guitar journey is just beginning. View your certificate — then, when you're ready, take on the next challenge.</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr><td>${btnLink(certificateUrl, 'View Your Certificate')}</td></tr>
    </table>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td><a href="${upsellUrl}" style="display:inline-block;background-color:transparent;color:#f59e0b;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;text-decoration:underline;padding:8px 0;">Explore Advanced Solo 2 →</a></td></tr>
    </table>
    <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;">We're proud of you. Seriously.</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: user.email,
      replyTo: FROM_ADDRESS,
      subject: `You did it. Your guitar journey is just beginning.`,
      html,
    })
  } catch (err) {
    console.warn('[email] sendGraduationEmail failed:', err)
  }
}

export async function sendWeeklyDigestEmail(
  user: { email: string; name: string | null },
  stats: { lessonsCompleted: number; xpEarned: number; streak: number; currentDay: number },
): Promise<void> {
  const resend = getResend()
  if (!resend) return

  const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`
  const displayName = user.name || 'Guitarist'

  const html = baseEmailHtml(`
    <h1 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;">Your Week in Review 🎸</h1>
    <p style="margin:0 0 24px;color:#f59e0b;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Week ending ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
    <p style="margin:0 0 24px;color:#d4d4d4;font-size:15px;line-height:1.6;">Hey ${displayName}, here's what you accomplished this week:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="background-color:#1a1a1a;border:1px solid #262626;border-radius:8px;padding:16px;text-align:center;width:25%;">
          <p style="margin:0 0 4px;color:#f59e0b;font-size:28px;font-weight:900;">${stats.lessonsCompleted}</p>
          <p style="margin:0;color:#a3a3a3;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Lessons</p>
        </td>
        <td style="width:8px;"></td>
        <td style="background-color:#1a1a1a;border:1px solid #262626;border-radius:8px;padding:16px;text-align:center;width:25%;">
          <p style="margin:0 0 4px;color:#f59e0b;font-size:28px;font-weight:900;">${stats.xpEarned}</p>
          <p style="margin:0;color:#a3a3a3;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">XP Earned</p>
        </td>
        <td style="width:8px;"></td>
        <td style="background-color:#1a1a1a;border:1px solid #262626;border-radius:8px;padding:16px;text-align:center;width:25%;">
          <p style="margin:0 0 4px;color:#f59e0b;font-size:28px;font-weight:900;">${stats.streak}</p>
          <p style="margin:0;color:#a3a3a3;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Day Streak</p>
        </td>
        <td style="width:8px;"></td>
        <td style="background-color:#1a1a1a;border:1px solid #262626;border-radius:8px;padding:16px;text-align:center;width:25%;">
          <p style="margin:0 0 4px;color:#f59e0b;font-size:28px;font-weight:900;">${stats.currentDay}</p>
          <p style="margin:0;color:#a3a3a3;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Current Day</p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 24px;color:#d4d4d4;font-size:15px;line-height:1.6;">Every week you practice is a week you're becoming the guitarist you want to be. Keep showing up.</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td>${btnLink(dashboardUrl, 'Continue Learning')}</td></tr>
    </table>
    <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;">See you next week.</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: user.email,
      replyTo: FROM_ADDRESS,
      subject: `Your week in review — ${stats.lessonsCompleted} lessons, ${stats.xpEarned} XP earned 🎸`,
      html,
    })
  } catch (err) {
    console.warn('[email] sendWeeklyDigestEmail failed:', err)
  }
}
