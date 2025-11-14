"use client";

import Link from "next/link";
import Header from "@/components/Header";
import BeautifulFooter from "@/components/BeautifulFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="floating-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Header />
      <div className="h-14" />

      <main className="relative z-10 container-custom px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 animate-fadeIn">
            Terms of Service
          </h1>
          
          <div className="card p-8 space-y-6 animate-fadeIn hover-lift">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">1. Service Description</h2>
              <p className="text-white/80 leading-relaxed">
                PackMind AI provides AI-powered packing list generation services. Our service is free to use with Google authentication.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">2. User Accounts</h2>
              <p className="text-white/80 leading-relaxed">
                You can use PackMind AI without an account (3 free lists) or sign in with Google for unlimited access. You're responsible for maintaining the security of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">3. Acceptable Use</h2>
              <p className="text-white/80 leading-relaxed">
                You agree to use PackMind AI only for lawful purposes. Don't abuse, harass, threaten, or violate the legal rights of others.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">4. Affiliate Disclosure</h2>
              <p className="text-white/80 leading-relaxed">
                PackMind AI earns commissions through affiliate links. When you purchase through our shopping links, we may receive a commission at no extra cost to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">5. Limitation of Liability</h2>
              <p className="text-white/80 leading-relaxed">
                PackMind AI is provided "as is" without warranties. We're not liable for any damages arising from your use of our service. Always verify packing lists for your specific needs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">6. Changes to Terms</h2>
              <p className="text-white/80 leading-relaxed">
                We may update these terms. Continued use of PackMind AI after changes constitutes acceptance of new terms.
              </p>
            </section>

            <p className="text-white/60 text-sm pt-6 border-t border-white/10">
              Last updated: November 2025
            </p>
          </div>
        </div>
      </main>

      <BeautifulFooter />
    </div>
  );
}
