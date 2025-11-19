'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Chrome, Sparkles, CheckCircle, Loader2 } from 'lucide-react';

interface PaywallModalProps {
  listsUsed: number;
  maxFreeLists: number;
  onClose: () => void;
}

export default function PaywallModal({ listsUsed, maxFreeLists, onClose }: PaywallModalProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    if (!session) {
      signIn('google');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting checkout...');
      
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'lifetime' }),
      });

      console.log('Checkout response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      console.log('Checkout data:', data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative glass-strong rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-white/20 animate-in fade-in zoom-in-95 duration-300">
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h3 className="text-3xl font-bold text-white text-center mb-2">
          You've Hit Your Limit
        </h3>

        <p className="text-white/70 text-center mb-2">
          You've used all {maxFreeLists} free packing lists
        </p>

        <p className="text-white text-center text-lg mb-6">
          Unlock unlimited lists for a <span className="font-bold text-cyan-400">one-time $19</span>
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-white/90">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span>Unlimited AI-powered packing lists</span>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span>Save & access from any device</span>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span>Download as PDF</span>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span>Email lists to yourself</span>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span>Share with travel partners</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        <button
          onClick={handleUpgrade}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Processing...
            </>
          ) : session ? (
            <>Upgrade for $19</>
          ) : (
            <>
              <Chrome className="w-6 h-6" />
              Sign in to Upgrade
            </>
          )}
        </button>

        <p className="text-white/40 text-xs text-center mt-4">
          One-time payment • No subscription • Lifetime access
        </p>

        <button
          onClick={onClose}
          className="mt-4 text-white/60 hover:text-white text-sm w-full"
        >
          Go back and view my lists
        </button>
      </div>
    </div>
  );
}
