'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink, ShoppingBag, Sparkles } from 'lucide-react';
import { generateAmazonLink } from '@/lib/amazon';

interface AmazonShoppingProps {
  itemName: string;
  onClose: () => void;
}

export default function AmazonShopping({ itemName, onClose }: AmazonShoppingProps) {
  const [amazonUrl, setAmazonUrl] = useState<string>('');

  useEffect(() => {
    // Generate Amazon affiliate link
    const url = generateAmazonLink(itemName);
    setAmazonUrl(url);
    
    console.log('🛍️ Amazon link generated:', url);
  }, [itemName]);

  const handleShopNow = () => {
    // Open Amazon in new tab
    window.open(amazonUrl, '_blank', 'noopener,noreferrer');
    
    // Track click (optional - for analytics)
    console.log('🎯 Amazon affiliate click:', itemName);
    
    // Close modal after a short delay
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative glass-strong rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-white/20 animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative p-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
              <ShoppingBag className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white text-center mb-2">
          Shop on Amazon
        </h3>

        <p className="text-white/80 text-center mb-1">
          Looking for:
        </p>
        
        <p className="text-xl font-semibold text-cyan-400 text-center mb-6">
          {itemName}
        </p>

        <div className="space-y-3 mb-6 bg-white/5 p-4 rounded-lg">
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span>Find the best deals on Amazon</span>
          </div>
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span>Prime shipping available</span>
          </div>
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span>Customer reviews & ratings</span>
          </div>
        </div>

        <button
          onClick={handleShopNow}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
        >
          <ExternalLink className="w-5 h-5" />
          Shop on Amazon
        </button>

        <p className="text-white/40 text-xs text-center mt-4">
          As an Amazon Associate, we earn from qualifying purchases
        </p>

        <button
          onClick={onClose}
          className="mt-3 text-white/60 hover:text-white text-sm w-full"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
