"use client";

import Link from "next/link";
import Header from "@/components/Header";
import BeautifulFooter from "@/components/BeautifulFooter";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          
          <div className="card p-8 space-y-6 animate-fadeIn hover-lift">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Data We Collect</h2>
              <p className="text-white/80 leading-relaxed mb-3">
                When you use PackMind AI, we collect:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Google account information (name, email) when you sign in</li>
                <li>Packing lists you create</li>
                <li>Usage analytics (anonymous)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">How We Use Your Data</h2>
              <p className="text-white/80 leading-relaxed">
                We use your data to provide and improve our service. We never sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Data Storage</h2>
              <p className="text-white/80 leading-relaxed">
                Your data is stored securely. We use industry-standard encryption and security practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Cookies</h2>
              <p className="text-white/80 leading-relaxed">
                We use cookies for authentication and analytics. You can disable cookies in your browser, but some features may not work.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Your Rights</h2>
              <p className="text-white/80 leading-relaxed">
                You have the right to access, modify, or delete your data. Contact us to exercise these rights.
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
