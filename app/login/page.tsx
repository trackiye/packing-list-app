"use client";

import { signIn } from "next-auth/react";
import { Sparkles, Mail } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-main flex items-center justify-center p-4">
      <div className="floating-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8 hover:scale-105 transition-transform">
          <Sparkles className="w-8 h-8 text-white" />
          <span className="text-2xl font-bold text-white">PackMind AI</span>
        </Link>

        <div className="card p-8 shadow-glow-purple">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-white/70 text-center mb-8">
            Sign in to access your packing lists
          </p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-medium mb-4"
          >
            <FcGoogle className="w-6 h-6" />
            Continue with Google
          </button>

          <div className="text-center">
            <p className="text-white/60 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="text-purple-300 hover:text-purple-200 font-semibold"
              >
                Sign up free
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/50 text-xs">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-purple-300 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-purple-300 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
