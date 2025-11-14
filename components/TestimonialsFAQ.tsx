"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does the AI chat work?",
    answer: "Just describe your trip naturally. Tell us where you're going, what you'll do, and how long. Our AI creates a comprehensive packing list instantly.",
  },
  {
    question: "Is this really free?",
    answer: "Yes! 100% free. No credit card. We earn through affiliate commissions when you shop (at no extra cost to you).",
  },
  {
    question: "Can I modify my list?",
    answer: "Absolutely! Keep chatting to refine. Say 'add warm clothes' or 'make it minimal' and we'll adjust.",
  },
  {
    question: "What's the free tier limit?",
    answer: "You get 3 free packing lists. Sign in with Google for unlimited lists - still 100% free!",
  },
];

export default function TestimonialsFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 space-y-12">
      <section>
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Why PackMind?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { value: "30s", label: "Average generation time" },
            { value: "100%", label: "Free forever" },
            { value: "AI", label: "GPT-4 powered" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transition-all duration-300 hover:scale-105 hover:bg-white/15"
            >
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <p className="text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          FAQ
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden transition-all hover:border-white/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-all"
              >
                <span className="text-white font-semibold">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-white transition-transform duration-300 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === idx ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-4">
                  <p className="text-white/80 text-sm">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
