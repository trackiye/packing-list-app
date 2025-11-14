'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Review {
  name: string;
  city: string;
  text: string;
}

interface FAQ {
  q: string;
  a: string;
}

export default function Home() {
  const router = useRouter();

  const reviews: Review[] = [
    { name: 'Sarah M.', city: 'New York', text: 'The AI chat was so intuitive! It knew exactly what I needed for my beach trip.' },
    { name: 'James K.', city: 'London', text: 'Quick replies made it so easy. Had my packing list in under a minute!' },
    { name: 'Maria G.', city: 'Barcelona', text: 'Love how it adapts to my needs. Asked for "more minimal" and it adjusted perfectly!' },
  ];

  const faqs: FAQ[] = [
    { q: 'How does the AI chat work?', a: 'Just chat naturally about your trip! Our AI asks clarifying questions and creates a personalized packing list.' },
    { q: 'Is Packmind AI really free?', a: 'Yes! 100% free. We earn a small affiliate commission only when you buy a recommended item (at no extra cost to you).' },
    { q: 'Can I modify my list?', a: 'Yes! Keep chatting – say "add warm clothes" or "make it minimal" and the AI adjusts instantly.' },
    { q: 'What about "Shop Now" buttons?', a: 'We curate high-quality product recommendations in Budget, Mid-Range, and Premium tiers.' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col items-center justify-center p-4 md:p-6">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-center leading-tight">
        Stop Forgetting Essentials.
        <span className="block text-purple-300 mt-2">Secure Your Trip.</span>
      </h1>

      <p className="max-w-2xl text-center text-lg md:text-xl mb-8 px-4">
        AI eliminates packing anxiety. Tell us where you’re going, what you’ll do, and how long – get a 100% personalized list instantly.
      </p>

      <button
        onClick={() => router.push('/chat')}
        className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 shadow-lg"
      >
        Start Chat – It’s Free
      </button>

      <section className="mt-12 md:mt-16 w-full max-w-4xl px-4">
        <h2 className="text-2xl font-semibold text-center mb-6">What travelers are saying</h2>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-4 md:p-6 border border-white/20">
              <p className="italic mb-2 text-sm md:text-base">"{r.text}"</p>
              <p className="font-medium text-sm md:text-base">{r.name}</p>
              <p className="text-xs md:text-sm opacity-75">{r.city}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 md:mt-16 w-full max-w-4xl px-4">
        <h2 className="text-2xl font-semibold text-center mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-white/5 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition">
              <summary className="font-medium text-sm md:text-base marker:text-purple-400">{faq.q}</summary>
              <p className="mt-2 text-sm opacity-90">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mt-12 md:mt-20 text-center text-sm opacity-70 py-8">
        © 2025 Packmind AI. Made with care for travelers.<br />
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-2">
          <Link href="/privacy" className="underline hover:text-purple-300">Privacy</Link>
          <Link href="/terms" className="underline hover:text-purple-300">Terms</Link>
          <Link href="/contact" className="underline hover:text-purple-300">Contact</Link>
        </div>
      </footer>
    </main>
  );
}
