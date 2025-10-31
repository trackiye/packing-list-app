// app/terms/page.tsx
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Scale,
} from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen dark-gradient overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 mesh-gradient opacity-40"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
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
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 pulse-glow shadow-2xl">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl">
            Terms of Service
          </h1>
          <p className="text-xl text-white/80 mb-2">
            The boring but important stuff
          </p>
          <p className="text-sm text-white/60">
            Last updated: October 31, 2025
          </p>
        </div>

        {/* TL;DR Summary */}
        <div className="glass-strong-dark rounded-3xl p-8 mb-12 border-2 border-blue-500/30 shadow-2xl animate-in slide-in-from-bottom-4 duration-700 delay-200">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-blue-400" />
            TL;DR - The Quick Version
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white mb-1">
                    What You Can Do:
                  </h3>
                  <p className="text-white/80 text-sm">
                    Use our AI to create awesome packing lists, share them,
                    download PDFs, and shop recommended products.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white mb-1">It&apos;s Free:</h3>
                  <p className="text-white/80 text-sm">
                    100% free to use. We earn through affiliate commissions when
                    you shop (at no extra cost to you).
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white mb-1">
                    What You Can&apos;t Do:
                  </h3>
                  <p className="text-white/80 text-sm">
                    Abuse our service, hack our systems, or use bots. Be cool,
                    basically.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white mb-1">
                    Our AI Is Smart, But:
                  </h3>
                  <p className="text-white/80 text-sm">
                    Verify critical travel info yourself. We&apos;re guides, not
                    guarantors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section className="glass-dark rounded-3xl p-8 border border-white/20 shadow-xl animate-in slide-in-from-left-4 duration-500 hover:glass-strong transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  By Using Packmind, You Agree...
                </h2>
                <p className="text-white/90 mb-4">
                  Welcome! By accessing Packmind AI, you&apos;re agreeing to
                  these terms. If you don&apos;t agree, that&apos;s cool - but
                  you can&apos;t use our service.
                </p>
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl p-6 border border-blue-500/20">
                  <p className="text-white/90 text-sm">
                    <strong>Translation:</strong> These are the rules. They
                    protect both you and us. By clicking around, you&apos;re
                    saying &quot;I&apos;m good with this.&quot;
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="glass-dark rounded-3xl p-8 border border-white/20 shadow-xl animate-in slide-in-from-right-4 duration-500 delay-100 hover:glass-strong transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-purple-400">2</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  What We Provide
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border-l-4 border-purple-500">
                    <h3 className="font-bold text-white mb-2">
                      🤖 AI Packing Lists
                    </h3>
                    <p className="text-white/80 text-sm">
                      Personalized recommendations based on your trip
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border-l-4 border-pink-500">
                    <h3 className="font-bold text-white mb-2">
                      💡 Travel Tips
                    </h3>
                    <p className="text-white/80 text-sm">
                      Expert advice and packing strategies
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border-l-4 border-blue-500">
                    <h3 className="font-bold text-white mb-2">
                      🛍️ Product Recs
                    </h3>
                    <p className="text-white/80 text-sm">
                      Curated gear suggestions (affiliate links)
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border-l-4 border-green-500">
                    <h3 className="font-bold text-white mb-2">
                      📄 PDF Exports
                    </h3>
                    <p className="text-white/80 text-sm">
                      Download and print your lists
                    </p>
                  </div>
                </div>
                <div className="mt-4 bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                  <p className="text-white/90 text-sm">
                    ⚠️ <strong>Important:</strong> The service is provided
                    &quot;as is.&quot; We can modify, pause, or discontinue
                    features anytime without notice (we try not to though!).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="glass-dark rounded-3xl p-8 border border-white/20 shadow-xl animate-in slide-in-from-left-4 duration-500 delay-200 hover:glass-strong transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Your Responsibilities
                </h2>
                <p className="text-white/90 mb-4">
                  We trust you to be awesome. Here&apos;s what we need from you:
                </p>
                <div className="space-y-2">
                  {[
                    "✅ Give us accurate info about your trips",
                    "✅ Use the service legally and ethically",
                    "✅ Respect our intellectual property",
                    "✅ Keep your account secure",
                    "❌ Don&apos;t hack, spam, or abuse our systems",
                    "❌ Don&apos;t use bots or scrapers without permission",
                    "❌ Don&apos;t upload viruses or malicious code",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all"
                    >
                      <span className="text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 - AI Disclaimer */}
          <section className="glass-dark rounded-3xl p-8 border-2 border-yellow-500/30 shadow-xl animate-in slide-in-from-right-4 duration-500 delay-300 hover:glass-strong transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  ⚠️ Important AI Disclaimer
                </h2>
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/20">
                  <p className="text-white/90 mb-4 font-semibold text-lg">
                    Our AI is smart, but it&apos;s not perfect. You&apos;re
                    ultimately responsible for your travel decisions.
                  </p>
                  <div className="space-y-3 text-white/80 text-sm">
                    <p>
                      • <strong>Packing lists are suggestions,</strong> not
                      guarantees. Weather changes, regulations vary.
                    </p>
                    <p>
                      • <strong>Verify critical info</strong> like visa
                      requirements, health advisories, and safety conditions
                      with official sources.
                    </p>
                    <p>
                      • <strong>We&apos;re not liable</strong> for forgotten
                      items, missed flights, or travel mishaps.
                    </p>
                    <p>
                      • <strong>Use common sense.</strong> Going to Antarctica?
                      Probably pack more than the AI suggests. 😉
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 - Affiliate Disclosure */}
          <section className="glass-dark rounded-3xl p-8 border border-white/20 shadow-xl animate-in slide-in-from-left-4 duration-500 delay-400 hover:glass-strong transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-pink-400">💰</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  How We Make Money (Transparency FTW)
                </h2>
                <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl p-6 border border-pink-500/20">
                  <p className="text-white/90 mb-4">
                    <strong>Affiliate Marketing:</strong> When you click
                    &quot;Shop Now&quot; and buy something, we may earn a small
                    commission. This helps keep Packmind free!
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="font-bold text-white mb-2">
                        ✅ What This Means:
                      </h3>
                      <ul className="text-white/80 text-sm space-y-1">
                        <li>• No extra cost to you</li>
                        <li>• We curate quality products</li>
                        <li>• Totally optional - never required</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="font-bold text-white mb-2">
                        ❌ What We&apos;re NOT:
                      </h3>
                      <ul className="text-white/80 text-sm space-y-1">
                        <li>• Responsible for product quality</li>
                        <li>• Handling shipping/returns</li>
                        <li>• Guaranteeing availability/prices</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mt-4 italic">
                    As an Amazon Associate, we earn from qualifying purchases.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 - Liability */}
          <section className="glass-dark rounded-3xl p-8 border border-white/20 shadow-xl animate-in slide-in-from-right-4 duration-500 delay-500 hover:glass-strong transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  What We&apos;re NOT Responsible For
                </h2>
                <p className="text-white/90 mb-4">
                  We work hard to provide a great service, but legally, we need
                  to spell this out:
                </p>
                <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/20">
                  <div className="space-y-2 text-white/90 text-sm">
                    <p>
                      ❌ Lost luggage, missed flights, or forgotten passports
                    </p>
                    <p>
                      ❌ Third-party products you buy through affiliate links
                    </p>
                    <p>❌ Technical issues or service interruptions</p>
                    <p>❌ Indirect, incidental, or consequential damages</p>
                    <p>❌ Loss of profits, data, or use</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-red-500/20">
                    <p className="text-white/90 font-semibold">
                      Our total liability: Maximum of $100 or what you paid us
                      in the last year (whichever is greater).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7 - Intellectual Property */}
          <section className="glass-dark rounded-3xl p-8 border border-white/20 shadow-xl animate-in fade-in duration-500 delay-600 hover:glass-strong transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Intellectual Property
                </h2>
                <p className="text-white/90 mb-4">
                  Everything on Packmind (design, code, AI models, content,
                  logos) is ours. Protected by copyright and IP laws.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                    <h3 className="font-bold text-white mb-2">✅ You Can:</h3>
                    <ul className="text-white/80 text-sm space-y-1">
                      <li>• Use our service normally</li>
                      <li>• Share your packing lists</li>
                      <li>• Download your PDFs</li>
                    </ul>
                  </div>
                  <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                    <h3 className="font-bold text-white mb-2">
                      ❌ You Can&apos;t:
                    </h3>
                    <ul className="text-white/80 text-sm space-y-1">
                      <li>• Copy our code/design</li>
                      <li>• Resell our service</li>
                      <li>• Remove our branding</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8 - Termination */}
          <section className="glass-dark rounded-3xl p-8 border border-white/20 shadow-xl animate-in slide-in-from-bottom-4 duration-500 delay-700 hover:glass-strong transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-orange-400">⚡</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Account Termination
                </h2>
                <p className="text-white/90 mb-4">
                  We reserve the right to suspend or terminate access if you
                  violate these terms. No refunds (because it&apos;s free
                  anyway! 😄).
                </p>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/80 text-sm">
                    Don&apos;t worry - we&apos;re reasonable people. We only
                    terminate for serious violations like abuse, hacking, or
                    illegal activity.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Legal Boilerplate */}
        <div className="mt-12 glass-dark rounded-3xl p-8 border border-white/20 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">
            The Legal Stuff
          </h2>
          <div className="space-y-4 text-white/80 text-sm">
            <p>
              <strong>Governing Law:</strong> These terms are governed by U.S.
              law (New York). Disputes resolved in New York courts.
            </p>
            <p>
              <strong>Changes:</strong> We may update these terms. Continued use
              = acceptance of changes. Check back occasionally!
            </p>
            <p>
              <strong>Severability:</strong> If any part is unenforceable, the
              rest remains valid.
            </p>
            <p>
              <strong>Entire Agreement:</strong> These terms + our Privacy
              Policy = the complete agreement between us.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 glass-strong-dark rounded-3xl p-12 text-center border-2 border-blue-500/30 shadow-2xl animate-in zoom-in duration-700 delay-800">
          <h2 className="text-4xl font-bold text-white mb-4">
            Questions About These Terms?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            We&apos;re happy to clarify anything. No legalese, just straight
            talk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:legal@packmind.ai"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg inline-flex items-center justify-center gap-2"
            >
              <FileText className="w-6 h-6" />
              Email Legal Team
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
