"use client";
import { Sparkles, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent" />
      <div className="relative max-w-5xl mx-auto text-center z-[60]">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-white/90">Try it free - No sign up required</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Never Forget Anything<br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">On Your Next Trip</span>
        </h1>
        <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
          Smart packing lists based on your destination, weather, accommodation type, and activities. Because hotel trips need different items than camping.
        </p>
        <div className="flex items-center justify-center gap-8 text-white/60 text-sm">
          <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-purple-400" /><span>No credit card</span></div>
          <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-pink-400" /><span>Free forever</span></div>
        </div>
      </div>
    </section>
  );
}
