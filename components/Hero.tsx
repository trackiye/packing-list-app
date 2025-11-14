"use client";
import { Sparkles, Zap, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-white/90">Personalized for YOUR trip</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Never Forget Anything
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            On Your Next Trip
          </span>
        </h1>
        
        <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
          Smart packing lists based on your destination, weather, accommodation type, and activities. Because hotel trips need different items than camping.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => signIn("google")}
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
          >
            Start Packing Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => {
              const element = document.getElementById('features');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
          >
            See How It Works
          </button>
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-8 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Free forever</span>
          </div>
        </div>
      </div>
    </section>
  );
}
