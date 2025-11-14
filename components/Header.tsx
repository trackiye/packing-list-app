"use client";
import { Sparkles, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-black/70 backdrop-blur-xl shadow-2xl" : "bg-transparent"}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">PackMind</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/pricing" className="text-white/80 hover:text-white transition-colors">Pricing</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors">Dashboard</Link>
                <button onClick={() => signOut()} className="px-4 py-2 text-white/80 hover:text-white transition-colors">Sign Out</button>
              </>
            ) : (
              <Link href="/signin" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all">Sign In</Link>
            )}
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-white">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-white/10">
            <Link href="/pricing" className="block text-white/80 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="block text-white/80 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="block w-full text-left text-white/80 hover:text-white transition-colors">Sign Out</button>
              </>
            ) : (
              <Link href="/signin" className="block w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-center" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
