"use client";
import { ShoppingBag, Sparkles } from "lucide-react";

interface AmazonShoppingProps {
  itemName: string;
  onClose: () => void;
}

export default function AmazonShopping({ itemName, onClose }: AmazonShoppingProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-strong rounded-2xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-purple-600/20 rounded-full">
            <ShoppingBag className="w-12 h-12 text-purple-400" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2">Shopping Coming Soon!</h3>
        <p className="text-white/70 mb-2">
          We're building an amazing shopping experience for <span className="text-purple-400 font-semibold">{itemName}</span>
        </p>
        
        <div className="flex items-center justify-center gap-2 text-white/50 text-sm mb-6">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Get notified when we launch</span>
        </div>
        
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
        >
          Got It
        </button>
      </div>
    </div>
  );
}
