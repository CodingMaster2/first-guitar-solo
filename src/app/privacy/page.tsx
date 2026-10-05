import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <Link href="/" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
            &#8592; Back
          </Link>
          <h1 className="text-4xl font-black uppercase mt-4 mb-2">Privacy Policy</h1>
          <p style={{ color: '#a3a3a3' }} className="text-sm">Last updated: October 2024</p>
        </div>

        <div className="space-y-8" style={{ color: '#a3a3a3' }}>
          <section>
            <h2 className="text-white font-bold text-lg mb-3">1. What We Collect</h2>
            <p className="text-sm leading-relaxed mb-3">
              When you create an account, we collect your email address, name (optional), and a hashed version of your password. We never store your password in plain text.
            </p>
            <p className="text-sm leading-relaxed mb-3">
              As you use the program, we collect: your progress data (completed lessons, practice sessions, self-assessments), your onboarding responses (instrument, experience level, technique ratings), messages to the AI Guitar Coach, and feedback you submit on lessons.
            </p>
            <p className="text-sm leading-relaxed">
              When you make a payment, Stripe processes your payment information. We receive confirmation of payment and a customer identifier from Stripe, but we never see or store your credit card details.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. How We Use Your Data</h2>
            <p className="text-sm leading-relaxed mb-3">
              Your data is used exclusively to operate the First Guitar Solo program:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc pl-4">
              <li>To authenticate your account and maintain your session</li>
              <li>To track and display your progress through the 30-day curriculum</li>
              <li>To provide the AI Guitar Coach with context about your learning (your current day, skill levels, and practice history)</li>
              <li>To verify your purchase status and provide access to the paid program</li>
              <li>To improve the program based on aggregate usage patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. Third Parties</h2>
            <p className="text-sm leading-relaxed mb-3">
              <strong className="text-white">Stripe:</strong> Handles all payment processing. Stripe operates under its own privacy policy. Your payment information goes directly to Stripe — we never receive or store your card details.
            </p>
            <p className="text-sm leading-relaxed mb-3">
              <strong className="text-white">Anthropic:</strong> Powers the AI Guitar Coach. Messages you send to the AI Coach are processed by Anthropic&apos;s API. Anthropic&apos;s privacy policy governs how they handle API requests.
            </p>
            <p className="text-sm leading-relaxed">
              We do not sell your data to any third party. We do not use your data for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">4. Data Storage</h2>
            <p className="text-sm leading-relaxed">
              Your data is stored securely in our database. We take reasonable technical measures to protect your information from unauthorized access, but no system is completely secure. We encourage you to use a unique password for this account.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">5. Data Deletion</h2>
            <p className="text-sm leading-relaxed">
              You may request deletion of your account and all associated data at any time by emailing{' '}
              <a href="mailto:support@sixthstringlabs.com" style={{ color: '#f59e0b' }} className="hover:underline">
                support@sixthstringlabs.com
              </a>
              . We will delete your data within 30 days of receiving your request.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">6. Cookies</h2>
            <p className="text-sm leading-relaxed">
              We use a session cookie to keep you logged in. No third-party tracking cookies or advertising cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">7. Contact</h2>
            <p className="text-sm leading-relaxed">
              Questions about this privacy policy:{' '}
              <a href="mailto:support@sixthstringlabs.com" style={{ color: '#f59e0b' }} className="hover:underline">
                support@sixthstringlabs.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
