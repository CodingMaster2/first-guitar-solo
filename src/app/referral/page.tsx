import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ReferralClient from './ReferralClient'

export const metadata = { title: 'Refer a Friend — First Guitar Solo' }

export default async function ReferralPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referralCode: true, referralCount: true },
  })

  const code = user?.referralCode ?? null
  const count = user?.referralCount ?? 0

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase text-white">
            Refer a <span style={{ color: '#f59e0b' }}>Friend</span>
          </h1>
          <p style={{ color: '#a3a3a3' }} className="text-sm mt-2 leading-relaxed">
            Share First Guitar Solo with fellow guitarists. When someone signs up with your code, they get a discount and you get credit.
          </p>
        </div>

        <div
          style={{ backgroundColor: '#111111', border: '1px solid #262626' }}
          className="rounded-2xl p-6 mb-6"
        >
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
            Your Referral Code
          </h2>
          <ReferralClient initialCode={code} initialCount={count} />
        </div>

        {/* How it works */}
        <div
          style={{ backgroundColor: '#111111', border: '1px solid #1f1f1f' }}
          className="rounded-xl p-6"
        >
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
            How It Works
          </h2>
          <div className="space-y-4">
            {[
              { num: '1', title: 'Get your code', desc: 'Generate a unique 6-character code above.' },
              { num: '2', title: 'Share it', desc: 'Send it to anyone who wants to learn lead guitar.' },
              { num: '3', title: 'They sign up', desc: 'They enter your code at checkout to get a discount.' },
              { num: '4', title: 'You get credit', desc: 'Your referral count grows and we track your impact.' },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-4">
                <div
                  style={{
                    backgroundColor: '#1a0f00',
                    border: '1px solid #78350f',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: '#f59e0b', fontWeight: 900, fontSize: '0.75rem' }}>{step.num}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{step.title}</p>
                  <p style={{ color: '#525252' }} className="text-xs mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
