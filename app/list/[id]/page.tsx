'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { Check, ShoppingBag, Download, Mail, Save, Share2, Home, Loader2, Chrome, Lock, Sparkles } from 'lucide-react';
import Background from '@/components/Background';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmailCapture from '@/components/EmailCapture';
import StickyProgress from '@/components/StickyProgress';
import AmazonShopping from '@/components/AmazonShopping';
import UpgradeModal from '@/components/UpgradeModal';
import PaywallModal from '@/components/PaywallModal';

const MAX_FREE_LISTS = 3;

export default function ListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [listData, setListData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [packingItems, setPackingItems] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [packedCount, setPackedCount] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const isPro = session?.user?.isPro || false;
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const fetchList = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const contentParam = urlParams.get('content');
        
        if (contentParam) {
          const decoded = decodeURIComponent(contentParam);
          const tripName = urlParams.get('tripName') || 'Your Packing List';
          const destination = urlParams.get('destination') || '';
          const duration = urlParams.get('duration') || '';
          const listsUsed = parseInt(urlParams.get('listsUsed') || '0');
          const userIsPro = urlParams.get('isPro') === 'true';
          
          const categories = parseContentToCategories(decoded);
          const tripSummary = generateTripSummary(decoded, destination, duration);
          
          setPackingItems({
            categories,
            tripSummary
          });
          
          setListData({
            id,
            content: decoded,
            tripName,
            destination,
            duration,
            listsUsed,
            isPro: userIsPro
          });

          // Check if we should show paywall AFTER they sign in
          if (isAuthenticated && !userIsPro && listsUsed >= MAX_FREE_LISTS) {
            setShowPaywall(true);
          }
        } else {
          const response = await fetch(`/api/lists/${id}`);
          if (!response.ok) throw new Error('List not found');
          const data = await response.json();
          setListData(data);
          setPackingItems(data.categories ? { categories: data.categories } : null);
        }
      } catch (err) {
        console.error('Failed to load list:', err);
        setError('Could not load your packing list.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchList();
  }, [id, isAuthenticated]);

  const generateTripSummary = (content: string, destination: string, duration: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const summaryLine = lines.find(line => 
      !line.startsWith('##') && 
      !line.startsWith('**') && 
      !line.startsWith('-') && 
      !line.startsWith('*') &&
      !line.match(/^\d+\./) &&
      line.length > 20 &&
      line.length < 200
    );
    
    if (summaryLine) {
      return summaryLine.trim();
    }
    
    if (destination && duration) {
      return `Everything you need for your ${duration}-day trip to ${destination}`;
    }
    return "Everything you need for your trip";
  };

  const parseContentToCategories = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const categories: any = {};
    let currentCategory = 'Items';
    
    lines.forEach((line) => {
      line = line.trim();
      if (!line) return;
      
      if (line.startsWith('##') || line.startsWith('**') || /^[A-Z][^a-z]*:$/.test(line)) {
        currentCategory = line
          .replace(/^##\s*/, '')
          .replace(/^\*\*/, '')
          .replace(/\*\*$/, '')
          .replace(/:$/, '')
          .trim();
        if (!categories[currentCategory]) {
          categories[currentCategory] = [];
        }
      } else if (/^[-•*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
        const item = line
          .replace(/^[-•*]\s+/, '')
          .replace(/^\d+\.\s+/, '')
          .trim();
        if (item) {
          if (!categories[currentCategory]) {
            categories[currentCategory] = [];
          }
          categories[currentCategory].push({
            name: item,
            packed: false
          });
        }
      }
    });
    
    return categories;
  };

  const handleToggleItem = (category: string, itemIndex: number) => {
    if (!isAuthenticated) return;
    
    setPackingItems((prev: any) => {
      if (!prev?.categories?.[category]) return prev;
      const newItems = JSON.parse(JSON.stringify(prev));
      const item = newItems.categories[category][itemIndex];
      if (!item) return prev;
      
      item.packed = !item.packed;
      
      let count = 0;
      Object.values(newItems.categories).forEach((items: any) => {
        items.forEach((item: any) => {
          if (item.packed) count++;
        });
      });
      setPackedCount(count);
      
      return newItems;
    });
  };

  const getTotalItems = () => {
    if (!packingItems?.categories) return 0;
    let total = 0;
    Object.values(packingItems.categories).forEach((items: any) => {
      total += items.length;
    });
    return total;
  };

  const handlePremiumFeature = (feature: string) => {
    if (!isAuthenticated) return;
    
    if (!isPro) {
      setShowUpgrade(feature);
      return;
    }

    switch(feature) {
      case 'Download PDF':
        const element = document.createElement('a');
        const file = new Blob([listData?.content || ''], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${listData?.tripName?.replace(/\s/g, '-') || 'packing-list'}.txt`;
        element.click();
        break;
      case 'Email List':
        alert('Email feature coming soon!');
        break;
      case 'Save List':
        alert('Save feature coming soon!');
        break;
      case 'Share List':
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
        break;
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 -z-10" />
        <Background />
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto text-cyan-400 mb-4 glow-purple-strong" />
            <p className="text-xl text-white font-semibold">Loading your packing list...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !packingItems) {
    return (
      <>
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 -z-10" />
        <Background />
        <Header />
        <div className="min-h-screen flex items-center justify-center section-padding pt-24">
          <div className="text-center max-w-md glass-strong p-8 rounded-3xl">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-white mb-2">Oops! List Not Found</h2>
            <p className="text-white/70 mb-6">{error || 'This list may have expired.'}</p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Create New List
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 -z-10" />
      <Background />
      <Header />
      
      <StickyProgress totalItems={getTotalItems()} packedItems={packedCount} />

      {/* Sign-In Wall (shows when not authenticated) */}
      {!isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto glass-strong rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 border-white/20 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                  <Lock className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            <h3 className="text-3xl font-bold text-white text-center mb-3">
              Your List is Ready! 🎉
            </h3>
            
            <p className="text-white/80 text-center mb-6 text-lg">
              Sign in with Google to unlock your personalized packing list
            </p>

            <button
              onClick={() => signIn("google", { callbackUrl: window.location.href })}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-xl"
            >
              <Chrome className="w-6 h-6" />
              Continue with Google
            </button>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>3 free packing lists</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Save className="w-5 h-5 text-pink-400" />
                <span>Save & access from anywhere</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Share2 className="w-5 h-5 text-cyan-400" />
                <span>Share with travel partners</span>
              </div>
            </div>

            <p className="text-white/40 text-xs text-center mt-6">
              Free forever • No credit card required
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen section-padding pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">{listData?.tripName || 'Your Packing List'}</h2>
            <p className="text-white/70 text-lg">{packingItems.tripSummary}</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <button
              onClick={() => handlePremiumFeature("Save List")}
              className={`flex items-center gap-2 px-4 py-2 glass-medium hover:bg-white/15 text-white rounded-lg transition-all ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isAuthenticated}
            >
              <Save className="w-4 h-4" />
              Save List
            </button>
            <button
              onClick={() => handlePremiumFeature("Download PDF")}
              className={`flex items-center gap-2 px-4 py-2 glass-medium hover:bg-white/15 text-white rounded-lg transition-all ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isAuthenticated}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={() => handlePremiumFeature("Email List")}
              className={`flex items-center gap-2 px-4 py-2 glass-medium hover:bg-white/15 text-white rounded-lg transition-all ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isAuthenticated}
            >
              <Mail className="w-4 h-4" />
              Email List
            </button>
            <button
              onClick={() => handlePremiumFeature("Share List")}
              className={`flex items-center gap-2 px-4 py-2 glass-medium hover:bg-white/15 text-white rounded-lg transition-all ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isAuthenticated}
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 glass-medium hover:bg-white/15 text-white rounded-lg transition-all"
            >
              <Home className="w-4 h-4" />
              New List
            </button>
          </div>

          <div className={`space-y-8 transition-all duration-500 ${!isAuthenticated ? 'blur-md select-none pointer-events-none' : ''}`}>
            {Object.entries(packingItems.categories).map(([category, items]: [string, any]) => (
              <div key={category} className="glass-medium rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4 capitalize">{category}</h3>
                <div className="space-y-3">
                  {items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => handleToggleItem(category, idx)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            item.packed
                              ? "bg-green-500 border-green-500"
                              : "border-white/30 hover:border-white/50"
                          }`}
                        >
                          {item.packed && <Check className="w-4 h-4 text-white" />}
                        </button>
                        <div className="flex-1">
                          <div className={`text-white font-medium ${item.packed ? "line-through opacity-50" : ""}`}>
                            {item.name}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => isAuthenticated && setSelectedItem(item.name)}
                        className="ml-4 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-lg flex items-center gap-2 transition-all text-sm"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Shop
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EmailCapture />
      <Footer />

      {selectedItem && isAuthenticated && (
        <AmazonShopping
          itemName={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {showUpgrade && (
        <UpgradeModal
          feature={showUpgrade}
          onClose={() => setShowUpgrade(null)}
        />
      )}

      {/* Paywall Modal - Shows AFTER sign-in if limit reached */}
      {showPaywall && isAuthenticated && (
        <PaywallModal
          listsUsed={listData?.listsUsed || MAX_FREE_LISTS}
          maxFreeLists={MAX_FREE_LISTS}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </>
  );
}
