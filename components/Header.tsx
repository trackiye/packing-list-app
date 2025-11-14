"use client";

import { Sparkles, Settings, Menu, X } from "lucide-react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomepage = pathname === "/";

  return (
    <header 
      className={`fixed top-0 left-0 right-0 header-layered transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/40 backdrop-blur-xl border-b border-white/20 shadow-2xl' 
          : 'bg-white/5 backdrop-blur-lg border-b border-white/10'
      }`}
    >
      <div className="container-custom px-4 header-compact flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5 text-white" />
          <span className="text-lg font-bold text-white">PackMind AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          <Link href="/pricing" className="text-white/80 hover:text-white text-sm transition-colors hover-lift">
            Pricing
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-white/80 hover:text-white text-sm transition-colors">
                Dashboard
              </Link>
              <button onClick={() => signOut()} className="text-white/80 hover:text-white text-sm transition-colors">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white/80 hover:text-white text-sm transition-colors">
                Log In
              </Link>
              <button onClick={() => signIn("google")} className="btn-primary py-2 px-4 text-xs">
                Sign Up Free
              </button>
            </>
          )}
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className={`md:hidden border-t border-white/10 animate-fadeIn ${
          isScrolled ? 'bg-black/40 backdrop-blur-xl' : 'bg-white/5 backdrop-blur-lg'
        }`}>
          <nav className="container-custom px-4 py-4 space-y-3">
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block text-white/80 hover:text-white text-sm py-2">
              Pricing
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-white/80 hover:text-white text-sm py-2">
                  Dashboard
                </Link>
                <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="w-full text-left text-white/80 hover:text-white text-sm py-2">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-white/80 hover:text-white text-sm py-2">
                  Log In
                </Link>
                <button onClick={() => { signIn("google"); setMobileMenuOpen(false); }} className="w-full btn-primary py-2 text-sm">
                  Sign Up Free
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
