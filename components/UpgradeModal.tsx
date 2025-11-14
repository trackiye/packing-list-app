"use client";
import { Crown, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpgradeModalProps {
  feature: string;
  onClose: () => void;
}

export default function UpgradeModal({ feature, onClose }: UpgradeModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-strong rounded-2xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
            <Crown className="w-12 h-12 text-white" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white text-center mb-2">
          Upgrade to Pro
        </h3>
        
        <p className="text-white/70 text-center mb-6">
          {feature} is a premium feature. Upgrade to Pro to unlock unlimited generations, save lists, and more!
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-sm">Unlimited AI generations</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-2 h-2 rounded-full bg-pink-400" />
            <span className="text-sm">Save & organize lists</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-sm">PDF export & email</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-2 h-2 rounded-full bg-pink-400" />
            <span className="text-sm">Priority support</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/pricing")}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          Upgrade to Pro - $15/month
        </button>

        <p className="text-white/40 text-xs text-center mt-4">
          No commitment • Cancel anytime
        </p>
      </div>
    </div>
  );
}
