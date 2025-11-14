// components/ConversionModals.tsx - FIXED: Added missing import
"use client";

import {
  X,
  Sparkles,
  Zap,
  Crown,
  Check,
  TrendingUp,
  Users,
  Clock,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getConversionJustification } from "@/lib/utils"; // ✅ ADDED THIS IMPORT

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: "soft" | "hard" | null;
  listsCreated: number;
  abTestVariant: "A" | "B";
}

export function SignUpConversionModal({
  isOpen,
  onClose,
  trigger,
  listsCreated,
  abTestVariant,
}: SignUpModalProps) {
  const [liveCounter, setLiveCounter] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchRealCounter = async () => {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setLiveCounter(data.usersToday || null);
        }
      } catch (error) {
        console.error("Failed to fetch counter:", error);
      }
    };
    fetchRealCounter();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && trigger === "soft") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, trigger, onClose]);

  if (!isOpen) return null;

  const isSoft = trigger === "soft";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 animate-fade-in"
        onClick={isSoft ? onClose : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-modal-title"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl"></div>

          {isSoft && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors z-10"
              aria-label="Close modal"
            >
              <X size={24} className="text-gray-600" />
            </button>
          )}

          <div className="relative p-8 sm:p-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  FREE
                </div>
              </div>
            </div>

            <h2
              id="signup-modal-title"
              className="text-3xl sm:text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              {isSoft
                ? abTestVariant === "A"
                  ? "🎯 Ready for More Lists?"
                  : "🔥 Secure Your Travel Streak!"
                : `🎉 Great Job Creating ${listsCreated} Lists! 🎊`}
            </h2>

            <p className="text-center text-gray-700 text-lg mb-6">
              {isSoft
                ? abTestVariant === "A"
                  ? "You're approaching your free limit. Sign in with Google to unlock unlimited lists!"
                  : "Unlock limitless packing lists, starting now. Sign in with Google to never lose access!"
                : "You've reached today's free limit. Sign in to keep packing smarter!"}
            </p>

            {liveCounter && liveCounter > 0 && (
              <div className="flex items-center justify-center gap-2 mb-8 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border border-green-200">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-800">
                  {liveCounter.toLocaleString()} travelers used Packmind today
                </span>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            )}

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                ✨ Sign In With Google (Always Free)
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: <Zap className="w-5 h-5 text-purple-600" />,
                    text: "Unlimited packing lists",
                    subtext: "No hidden limits or paywalls",
                  },
                  {
                    icon: <Check className="w-5 h-5 text-green-600" />,
                    text: "Save & sync across devices",
                    subtext: "Access from anywhere",
                  },
                  {
                    icon: <Users className="w-5 h-5 text-blue-600" />,
                    text: "Share with travel partners",
                    subtext: "Collaborate on trips",
                  },
                  {
                    icon: <Clock className="w-5 h-5 text-pink-600" />,
                    text: "Email lists to yourself",
                    subtext: "Offline access anytime",
                  },
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 animate-fade-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {benefit.text}
                      </p>
                      <p className="text-sm text-gray-600">{benefit.subtext}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              Continue with Google (Free)
            </button>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-4">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Secure sign-in</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-600" />
                <span>No credit card</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-600" />
                <span>5 seconds</span>
              </div>
            </div>

            {!isSoft && listsCreated > 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Your {listsCreated} lists are ready to save when you sign in
                </p>
              </div>
            )}

            <p className="text-xs text-gray-500 text-center mt-4">
              We respect your privacy. Your data is never sold to third parties.{" "}
              <a href="/privacy" className="underline hover:text-gray-700">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  listsCreated: number;
  timeSaved: number;
}

export function ProUpgradeModal({
  isOpen,
  onClose,
  listsCreated,
  timeSaved,
}: ProUpgradeModalProps) {
  // ✅ FIXED: Now properly imported
  const justificationText = getConversionJustification(listsCreated, timeSaved);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pro-modal-title"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 rounded-3xl shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            aria-label="Close modal"
          >
            <X size={24} className="text-white" />
          </button>

          <div className="relative p-8 sm:p-12 text-white">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Crown className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2
              id="pro-modal-title"
              className="text-3xl sm:text-4xl font-extrabold text-center mb-4"
            >
              You Love Packmind!
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <p className="text-4xl font-bold text-yellow-400">
                  {listsCreated}
                </p>
                <p className="text-sm text-white/80">Lists Created</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <p className="text-4xl font-bold text-green-400">
                  {timeSaved}m
                </p>
                <p className="text-sm text-white/80">Time Saved</p>
              </div>
            </div>

            <p className="text-center text-white/90 text-lg mb-8">
              <span
                dangerouslySetInnerHTML={{
                  __html: justificationText.replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>"
                  ),
                }}
              />
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <div className="space-y-4">
                {[
                  "📄 Beautiful printable PDFs",
                  "⚡ Priority AI (faster responses)",
                  "💾 Unlimited saved lists",
                  "🔗 Shareable links (never expire)",
                  "🎨 Advanced customization",
                  "🚀 Early access to new features",
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center transition-all">
                <div className="text-sm text-white/80 mb-1">Monthly</div>
                <div className="text-3xl font-bold mb-2">$4.99</div>
                <div className="text-sm text-white/60">Cancel anytime</div>
              </button>
              <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 rounded-2xl p-4 text-center transition-all relative">
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  SAVE $10
                </div>
                <div className="text-sm text-white/90 mb-1">Annual</div>
                <div className="text-3xl font-bold mb-2">$49</div>
                <div className="text-sm text-white/90">2 months free</div>
              </button>
            </div>

            <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-4 px-8 rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105">
              Upgrade to Pro - $4.99/month
            </button>

            <div className="flex items-center justify-center gap-4 text-sm text-white/70 mt-4">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>30-day guarantee</span>
              </div>
              <div className="h-4 w-px bg-white/30" />
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
