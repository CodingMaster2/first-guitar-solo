import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <Link href="/" style={{ color: '#a3a3a3' }} className="text-sm hover:text-white transition-colors">
            &#8592; Back
          </Link>
          <h1 className="text-4xl font-black uppercase mt-4 mb-2">Terms of Service</h1>
          <p style={{ color: '#a3a3a3' }} className="text-sm">Last updated: October 2024</p>
        </div>

        <div className="space-y-8" style={{ color: '#a3a3a3' }}>
          <section>
            <h2 className="text-white font-bold text-lg mb-3">1. Product Description</h2>
            <p className="text-sm leading-relaxed">
              First Guitar Solo is a 30-day online guitar learning program developed and operated by Sixth String Labs. The program provides structured curriculum, an AI Guitar Coach, and progress tracking tools to help intermediate beginner guitarists learn to perform a complete guitar solo.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. Payment Terms</h2>
            <p className="text-sm leading-relaxed mb-3">
              Access to the full program requires a one-time payment of $25.00 USD. Payment is processed securely through Stripe. By completing payment, you receive lifetime access to the program for your individual use.
            </p>
            <p className="text-sm leading-relaxed">
              Your account and access are personal and non-transferable. You may not share your account credentials or provide access to the program to others.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. Refund Policy</h2>
            <p className="text-sm leading-relaxed mb-3">
              <strong className="text-white">30-day money-back guarantee.</strong> If you complete the program and are not satisfied, email{' '}
              <a href="mailto:support@sixthstringlabs.com" style={{ color: '#f59e0b' }} className="hover:underline">
                support@sixthstringlabs.com
              </a>{' '}
              within 30 days of your original purchase date to request a full refund.
            </p>
            <p className="text-sm leading-relaxed">
              Refunds are processed within 5-10 business days. After 30 days from the purchase date, refunds are at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">4. User Responsibilities</h2>
            <p className="text-sm leading-relaxed mb-3">
              You are responsible for maintaining the security of your account credentials. You agree to provide accurate information when creating your account.
            </p>
            <p className="text-sm leading-relaxed">
              The program is intended for individual use only. You may not distribute, resell, or share access to the program content.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">5. Prohibited Uses</h2>
            <ul className="text-sm leading-relaxed space-y-2 list-disc pl-4">
              <li>Sharing your account with others</li>
              <li>Attempting to copy, scrape, or redistribute program content</li>
              <li>Using the platform for any unlawful purpose</li>
              <li>Attempting to gain unauthorized access to other users&apos; accounts or our systems</li>
              <li>Harassing or abusing the AI Coach system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">6. AI Guitar Coach Disclaimer</h2>
            <p className="text-sm leading-relaxed">
              The AI Guitar Coach is powered by Anthropic&apos;s Claude API and provides general educational advice based on your reported progress. It cannot hear your guitar, observe your technique, or diagnose playing issues with technical precision. The AI Coach&apos;s advice should be treated as general educational guidance, not as a replacement for in-person instruction from a qualified guitar teacher.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">7. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed mb-3">
              Sixth String Labs provides this program on an &quot;as is&quot; basis. We make no warranties that the program will meet your specific learning objectives or that the AI Coach will provide advice suitable for your particular situation.
            </p>
            <p className="text-sm leading-relaxed">
              Our liability for any claim arising from your use of this program is limited to the amount you paid for access. We are not liable for indirect, incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">8. Intellectual Property</h2>
            <p className="text-sm leading-relaxed">
              All program content, including the solo, curriculum materials, and AI Coach system, is owned by Sixth String Labs. By purchasing access, you receive a personal, non-exclusive license to use the content for your own learning. You may not distribute, reproduce, or create derivative works from the content.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">9. Changes to Terms</h2>
            <p className="text-sm leading-relaxed">
              We may update these terms from time to time. Continued use of the program after changes are posted constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">10. Contact</h2>
            <p className="text-sm leading-relaxed">
              Questions about these terms:{' '}
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
