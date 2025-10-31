// app/privacy/page.tsx
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Globe2,
} from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen dark-gradient overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 mesh-gradient opacity-40"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-all hover:scale-105 glass-dark px-4 py-2 rounded-full"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Hero Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 pulse-glow shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl">
            Privacy Policy
          </h1>
          <p className="text-xl text-white/80 mb-2">
            Your trust is our priority
          </p>
          <p className="text-sm text-white/60">
            Last updated: October 31, 2025
          </p>
        </div>

        {/* Quick Summary */}
        <div className="glass-strong-dark rounded-3xl p-8 mb-12 border-2 border-purple-500/30 shadow-2xl animate-in slide-in-from-bottom-4 duration-700 delay-200">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Eye className="w-8 h-8 text-purple-400" />
            Quick Summary
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 hover:scale-105 transition-all">
              <Lock className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-bold text-white mb-2">
                We Don&apos;t Sell Data
              </h3>
              <p className="text-white/80 text-sm">
                Your information is never sold to third parties. Period.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 hover:scale-105 transition-all">
              <UserCheck className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-bold text-white mb-2">
                You&apos;re In Control
              </h3>
              <p className="text-white/80 text-sm">
                Request your data, delete it anytime, no questions asked.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 hover:scale-105 transition-all">
              <Database className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Minimal Collection</h3>
              <p className="text-white/80 text-sm">
                We only collect what&apos;s essential to serve you better.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section className="glass-dark rounded-3xl p-8 border border-white/20 shadow-xl animate-in slide-in-from-left-4 duration-500 hover:glass-strong transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-purple-400">1</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  What We Collect
                </h2>
                <div className="space-y-4 text-white/90">
                  <div className="bg-white/5 rounded-xl p-4 border-l-4 border-purple-500">
                    <h3 className="font-bold text-white mb-2">
                      📧 Information You Give Us:
                    </h3>
                    <ul className="space-y-1 ml-4 text-sm">
                      <li>• Email address (for packing guides and updates)</li>
                      <li>• Name (optional, makes things personal)</li>
                      <li>
                        • Trip details (so our AI can help you pack smart)
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border-l-4 border-pink-500">
                    <h3 className="font-bold text-white mb-2">
                      🔍 Automatically Collected:
                    </h3>
                    <ul className="space-y-1 ml-4 text-sm">
                      <li>
                        • How you use our site (clicks, features, pages visited)
                      </li>
                      <li>• Device info (browser, OS - helps us fix bugs)</li>
                      <li>
                        • Cookies (to remember you and improve experience)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="glass-dark rounded-3xl p-8 border border-white/20 shadow-xl animate-in slide-in-from-right-4 duration-500 delay-100 hover:glass-strong transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-pink-400">2</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  How We Use It
                </h2>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-white/10">
                  <ul className="space-y-3 text-white/90">
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <span>
                        Generate your perfect, personalized packing lists
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <span>Send you that awesome Ultimate Packing Guide</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <span>
                        Make our AI smarter (better recommendations for
                        everyone)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <span>Fix bugs and optimize the experience</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <span>
                        Share travel tips and updates (no spam, we promise)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="glass-dark rounded-3xl p-8 border border-white/20 shadow-xl animate-in slide-in-from-left-4 duration-500 delay-200 hover:glass-strong transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-blue-400">3</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Who We Share With
                </h2>
                <div className="bg-red-500/10 rounded-2xl p-6 border-2 border-red-500/30 mb-4">
                  <p className="text-white font-bold text-xl text-center">
                    🚫 We NEVER sell your data. Ever.
                  </p>
                </div>
                <p className="text-white/90 mb-4">
                  We only share with trusted partners who help us serve you:
                </p>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="font-bold text-white mb-2">
                      🛠️ Service Providers:
                    </h3>
                    <p className="text-white/80 text-sm">
                      Email delivery (Resend), analytics (Google), hosting
                      (Vercel)
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="font-bold text-white mb-2">
                      🛍️ Affiliate Partners:
                    </h3>
                    <p className="text-white/80 text-sm">
                      When you click &quot;Shop Now&quot;, you go to Amazon or
                      other retailers
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="font-bold text-white mb-2">
                      ⚖️ Legal Requirements:
                    </h3>
                    <p className="text-white/80 text-sm">
                      Only if required by law or to protect our rights
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="glass-dark rounded-3xl p-8 border border-white/20 shadow-xl animate-in slide-in-from-right-4 duration-500 delay-300 hover:glass-strong transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-green-400">4</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Your Rights
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                    <h3 className="font-bold text-white mb-2">
                      📥 Access Your Data
                    </h3>
                    <p className="text-white/80 text-sm">
                      See everything we have about you
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-500/20">
                    <h3 className="font-bold text-white mb-2">✏️ Correct It</h3>
                    <p className="text-white/80 text-sm">
                      Fix any inaccurate info
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-xl p-4 border border-red-500/20">
                    <h3 className="font-bold text-white mb-2">🗑️ Delete It</h3>
                    <p className="text-white/80 text-sm">
                      Request complete removal
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                    <h3 className="font-bold text-white mb-2">📧 Opt-Out</h3>
                    <p className="text-white/80 text-sm">
                      Stop marketing emails anytime
                    </p>
                  </div>
                </div>
                <div className="mt-6 bg-white/10 rounded-xl p-4 border-2 border-purple-500/30">
                  <p className="text-white text-center">
                    📬 To exercise any of these rights, email us:{" "}
                    <a
                      href="mailto:privacy@packmind.ai"
                      className="text-purple-400 hover:text-purple-300 font-bold underline"
                    >
                      privacy@packmind.ai
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="glass-dark rounded-3xl p-8 border border-white/20 shadow-xl animate-in slide-in-from-bottom-4 duration-500 delay-400 hover:glass-strong transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Data Security
                </h2>
                <p className="text-white/90 mb-4">
                  We take security seriously. Your data is protected with:
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🔒</div>
                    <h3 className="font-bold text-white text-sm">Encryption</h3>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🛡️</div>
                    <h3 className="font-bold text-white text-sm">
                      Secure Hosting
                    </h3>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🔐</div>
                    <h3 className="font-bold text-white text-sm">
                      Regular Audits
                    </h3>
                  </div>
                </div>
                <p className="text-white/70 text-sm mt-4 text-center italic">
                  No system is 100% secure, but we do everything possible to
                  protect your data.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="glass-dark rounded-3xl p-8 border border-white/20 shadow-xl animate-in fade-in duration-500 delay-500 hover:glass-strong transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Globe2 className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  More Important Stuff
                </h2>
                <div className="space-y-4 text-white/90">
                  <div>
                    <h3 className="font-bold text-white mb-2">
                      👶 Children&apos;s Privacy
                    </h3>
                    <p className="text-sm">
                      Our service is for ages 13+. We don&apos;t knowingly
                      collect data from kids.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">
                      🌍 International Users
                    </h3>
                    <p className="text-sm">
                      Your data may be processed in different countries. We
                      ensure proper protections.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">
                      🔄 Policy Changes
                    </h3>
                    <p className="text-sm">
                      We&apos;ll update this page and notify you of major
                      changes. Check back occasionally!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 glass-strong-dark rounded-3xl p-12 text-center border-2 border-purple-500/30 shadow-2xl animate-in zoom-in duration-700 delay-600">
          <h2 className="text-4xl font-bold text-white mb-4">
            Questions About Privacy?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            We&apos;re here to help. Seriously, ask us anything.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:privacy@packmind.ai"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg inline-flex items-center justify-center gap-2"
            >
              <Shield className="w-6 h-6" />
              Email Privacy Team
            </a>
            <Link
              href="/contact"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all border border-white/20"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
