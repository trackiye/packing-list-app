"use client";

import { useState } from "react";
import { Zap, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function BeautifulFooter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success("✅ " + data.message);
        setEmail("");
        
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative z-10 mt-20">
      {/* Email capture section */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="card p-8 sm:p-12 text-center glow-purple">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Never Forget <span className="gradient-text">Essentials</span>
          </h2>
          <p className="text-white/80 text-lg mb-6">
            Get our free Ultimate Packing Guide + exclusive travel tips
          </p>

          {isSuccess ? (
            <div className="max-w-md mx-auto bg-green-500/20 border border-green-500/50 rounded-xl p-6 animate-fadeIn">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-white font-semibold mb-2">Check your email!</p>
              <p className="text-white/70 text-sm">
                Your Ultimate Packing Guide is on its way
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isSubmitting}
                  className="flex-1 px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="px-8 py-4 bg-white text-purple-900 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-purple-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Get Free Guide
                    </>
                  )}
                </button>
              </div>
              <p className="text-white/50 text-xs mt-3">
                Join 12,000+ travelers. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Footer links */}
      <div className="border-t border-white/10 py-8">
        <div className="container-custom px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-white/60">
              © 2025 PackMind AI
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-white/70 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/pricing" className="text-white/70 hover:text-white transition-colors">
                Pricing
              </Link>
            </div>
          </div>
          <p className="text-white/40 text-xs text-center mt-4">
            We earn from qualifying purchases at no extra cost to you
          </p>
        </div>
      </div>
    </footer>
  );
}
