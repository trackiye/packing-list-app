"use client";
import { signIn } from "next-auth/react";
import { Sparkles, Chrome } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-20" />
      
      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <span className="text-3xl font-bold text-white">PackMind</span>
        </Link>

        <div className="glass-strong rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h1>
          <p className="text-white/70 text-center mb-8">
            Sign in to save your packing lists and access them anywhere
          </p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-xl"
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="text-white/50 text-sm text-center mt-6">
            By continuing, you agree to our Terms and Privacy Policy
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
