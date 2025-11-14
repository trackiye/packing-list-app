"use client";
import { useState } from "react";
import { Mail, Sparkles, CheckCircle2 } from "lucide-react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/30" />
      
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-white/90">Stay Updated</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Get Packing Tips & Updates
        </h2>
        <p className="text-xl text-white/70 mb-8">
          Join travelers getting smarter about packing. No spam, just useful tips.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
            disabled={status === "loading" || status === "success"}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {status === "loading" && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {status === "success" && <CheckCircle2 className="w-5 h-5" />}
            {status === "idle" && <Mail className="w-5 h-5" />}
            {status === "success" ? "Subscribed!" : "Subscribe"}
          </button>
        </form>

        {status === "error" && (
          <p className="mt-4 text-red-400 text-sm">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  );
}
