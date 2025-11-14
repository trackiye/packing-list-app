"use client";

import { signIn } from "next-auth/react";
import { X, Crown } from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
}

export default function PaywallModal({ isOpen, onClose, count }: PaywallModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl max-w-md w-full p-8 relative border-2 border-white/20">
          <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              You've Used {count} Free Lists!
            </h2>
            <p className="text-white/80 mb-6">
              Sign in to unlock unlimited packing lists
            </p>

            <div className="space-y-3 mb-6 text-left">
              <div className="flex gap-2 text-white/90">
                <span>✨</span>
                <span>Unlimited lists</span>
              </div>
              <div className="flex gap-2 text-white/90">
                <span>💾</span>
                <span>Save & share lists</span>
              </div>
              <div className="flex gap-2 text-white/90">
                <span>🎯</span>
                <span>100% free forever</span>
              </div>
            </div>

            <button
              onClick={() => signIn("google")}
              className="w-full bg-white text-purple-900 font-bold py-4 rounded-xl hover:bg-gray-100 transition-all"
            >
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
