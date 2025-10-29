"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, Search, Cog, ListChecks, Share2, Check, FileText, Star, Users, Zap } from "lucide-react";
import AffiliateSuggestionModal from '@/components/AffiliateSuggestionModal';
import { getProductSuggestions, PackingItemData, ASSOCIATE_ID } from '@/data/affiliateProducts';

interface PackingItem {
  item_name: string;
  description: string;
  category: string;
  checked?: boolean;
}

export default function PackmindAI() {
  const [localInput, setLocalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [packingItems, setPackingItems] = useState<PackingItem[] | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(true);
  const [groupByCategory, setGroupByCategory] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [listsGenerated, setListsGenerated] = useState(0);
  const [liveCounter, setLiveCounter] = useState(12487);
  
  // NEW: Affiliate modal state
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [selectedItemForShopping, setSelectedItemForShopping] = useState<PackingItem | null>(null);

  // Simulate live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter(prev => prev + Math.floor(Math.random() * 3));
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateClick = async () => {
    if (!localInput.trim() || isLoading) return;
    
    setIsLoading(true);
    setPackingItems(null);
    setErrorText(null);
    setShowResult(true);
    
    try {
      // Simulated data for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockItems: PackingItem[] = [
        { item_name: "Passport", description: "Valid for 6+ months", category: "Travel Documents", checked: false },
        { item_name: "Sunscreen", description: "SPF 50+ waterproof", category: "Beach Essentials", checked: false },
        { item_name: "Swimsuit", description: "Quick-dry material", category: "Clothing", checked: false },
        { item_name: "Travel Adapter", description: "Universal plug", category: "Electronics", checked: false },
        { item_name: "First Aid Kit", description: "Basic medications", category: "Health", checked: false },
        { item_name: "Beach Towel", description: "Lightweight microfiber", category: "Beach Essentials", checked: false },
      ];
      
      setPackingItems(mockItems);
      const newCount = listsGenerated + 1;
      setListsGenerated(newCount);
      
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
      
    } catch (error) {
      setErrorText(`Failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItemChecked = (index: number) => {
    if (!packingItems) return;
    const updated = [...packingItems];
    updated[index].checked = !updated[index].checked;
    setPackingItems(updated);
  };

  const getProgress = () => {
    if (!packingItems) return 0;
    const checked = packingItems.filter(item => item.checked).length;
    return Math.round((checked / packingItems.length) * 100);
  };

  const getGroupedItems = () => {
    if (!packingItems) return {};
    const grouped: Record<string, PackingItem[]> = {};
    packingItems.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    return grouped;
  };

  const handleDelete = () => {
    setShowResult(false);
    setPackingItems(null);
  };

  // NEW: Generate mock product data for affiliate modal
  const generateMockProductData = (item: PackingItem) => {
    return {
      itemName: item.item_name,
      category: item.category,
      budgetOption: {
        id: `${item.item_name}-budget`,
        name: `Budget ${item.item_name}`,
        priceEstimate: "$25 - $45",
        affiliateUrl: "https://amazon.com",
        imagePlaceholderUrl: "https://placehold.co/150x150/A5B4FC/FFFFFF?text=Budget",
        valueProposition: "Great Value | Reliable Quality",
      },
      midRangeOption: {
        id: `${item.item_name}-mid`,
        name: `Premium ${item.item_name}`,
        priceEstimate: "$60 - $90",
        affiliateUrl: "https://amazon.com",
        imagePlaceholderUrl: "https://placehold.co/150x150/4F46E5/FFFFFF?text=Mid-Range",
        valueProposition: "Best Seller | Balanced Performance",
      },
      premiumOption: {
        id: `${item.item_name}-premium`,
        name: `Luxury ${item.item_name}`,
        priceEstimate: "$120 - $180",
        affiliateUrl: "https://amazon.com",
        imagePlaceholderUrl: "https://placehold.co/150x150/1D4ED8/FFFFFF?text=Premium",
        valueProposition: "Top Quality | Long-lasting",
      },
    };
  };

  // NEW: Handle shop button click
  const handleShopClick = (item: PackingItem) => {
    setSelectedItemForShopping(item);
    setShowAffiliateModal(true);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Email Capture Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Wait! Before You Go...</h3>
              <p className="text-gray-600">Get our Ultimate Packing Checklist PDF + Pro Tips (Free!)</p>
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button 
              onClick={() => {
                setEmailCaptured(true);
                setShowEmailModal(false);
              }}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Send Me The Free Guide →
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      )}

      {/* Header - MADE STICKY */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-lg shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-800">Packmind AI</span>
          </div>
          {packingItems && packingItems.length > 0 && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              {getProgress()}% Packed ✓
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-start p-4 pt-8 sm:pt-12">

        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl mx-auto w-full">
          
          {/* Live Activity Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <Users className="w-4 h-4" />
            <span>{liveCounter.toLocaleString()}+ travelers trust Packmind AI</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 text-white drop-shadow-2xl leading-tight">
            Pack Perfect.<br />Travel Stress-Free.
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/95 mb-6 drop-shadow-lg max-w-2xl mx-auto font-medium">
            AI-powered packing lists in <span className="text-yellow-300 font-bold">30 seconds</span>. Customized for your trip, weather-aware, and absolutely free.
          </p>

          {/* Social Proof Stars */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-white font-semibold">4.9/5 from 2,341 travelers</span>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center gap-8 mb-10 text-white/90 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-300" />
              <span className="font-medium">Trusted by 12K+ travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-300" />
              <span className="font-medium">100% Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-300" />
              <span className="font-medium">Instant Results</span>
            </div>
          </div>

          {/* How It Works */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12">
            <div className="flex items-center gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs text-white/70 font-semibold">STEP 1</div>
                <div className="text-sm text-white font-bold">Describe Your Trip</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Cog className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs text-white/70 font-semibold">STEP 2</div>
                <div className="text-sm text-white font-bold">AI Analyzes</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-lg hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0">
                <ListChecks className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs text-white/70 font-semibold">STEP 3</div>
                <div className="text-sm text-white font-bold">Get Smart List!</div>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder="E.g., 5 days in Bali, beach vacation with kids"
              className="w-full px-6 py-5 text-lg bg-white/95 backdrop-blur-md border-2 border-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-white/50 shadow-2xl placeholder:text-gray-500"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading && localInput.trim()) {
                  handleGenerateClick();
                }
              }}
            />
            <button
              type="button"
              onClick={handleGenerateClick}
              disabled={isLoading || !localInput.trim()}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-5 text-xl font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98] border-2 border-white/30"
            >
              {isLoading ? "✨ Creating Your List..." : "Create My Free List →"}
            </button>
          </div>

          {/* Examples */}
          <div className="mt-6 text-sm text-white/90 drop-shadow-md">
            <span className="font-semibold">Try:</span>{" "}
            <button 
              type="button"
              onClick={() => setLocalInput('Weekend beach trip to Miami')}
              className="underline hover:text-white font-semibold mx-1 hover:scale-105 inline-block transition-transform"
            >
              Weekend beach trip
            </button>
            {" • "}
            <button 
              type="button"
              onClick={() => setLocalInput('10 days in Italy, sightseeing')}
              className="underline hover:text-white font-semibold mx-1 hover:scale-105 inline-block transition-transform"
            >
              10 days in Italy
            </button>
            {" • "}
            <button 
              type="button"
              onClick={() => setLocalInput('Business trip to London, 3 days')}
              className="underline hover:text-white font-semibold mx-1 hover:scale-105 inline-block transition-transform"
            >
              Business trip
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div id="results-section" className="mt-8 w-full max-w-6xl">
          {errorText && (
            <div className="bg-red-500/90 backdrop-blur-md border border-red-300/50 text-white px-6 py-4 rounded-xl mb-4 max-w-2xl mx-auto shadow-xl">
              <strong>Error:</strong> {errorText}
            </div>
          )}

          {showResult && !errorText && (isLoading || packingItems) && (
            <div className="w-full">
              {/* Action Buttons */}
              {packingItems && packingItems.length > 0 && (
                <div className="flex justify-between items-center gap-2 mb-6 max-w-4xl mx-auto flex-wrap">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setGroupByCategory(!groupByCategory)}
                      className="px-5 py-2.5 text-white bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl border border-white/30 transition-all shadow-lg text-sm font-semibold"
                    >
                      {groupByCategory ? '📋 Show All' : '📁 Group by Category'}
                    </button>
                  </div>
                  
                  <div className="flex gap-2 ml-auto">
                    <button 
                      onClick={() => alert('Share functionality')}
                      title="Share list"
                      className="p-3 text-white bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl border border-white/30 transition-all shadow-lg hover:scale-110"
                    >
                      <Share2 size={20}/>
                    </button>
                    <button 
                      onClick={() => alert('Export functionality')}
                      title="Export as PDF"
                      className="p-3 text-white bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl border border-white/30 transition-all shadow-lg hover:scale-110"
                    >
                      <FileText size={20}/>
                    </button>
                    <button 
                      onClick={handleDelete}
                      title="Clear list"
                      className="p-3 text-white bg-white/20 backdrop-blur-md hover:bg-red-500/40 rounded-xl border border-white/30 transition-all shadow-lg hover:scale-110"
                    >
                      <Trash2 size={20}/>
                    </button>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/30">
                {isLoading && !packingItems && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                    <p className="text-white text-lg font-semibold">Analyzing your trip...</p>
                    <p className="text-white/70 text-sm">Finding perfect items for you</p>
                  </div>
                )}

                {!isLoading && packingItems && packingItems.length > 0 && (
                  <>
                    {groupByCategory ? (
                      <div className="space-y-10">
                        {Object.entries(getGroupedItems()).map(([category, items]) => (
                          <div key={category}>
                            <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg flex items-center gap-3">
                              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                {category.includes('Document') ? '📄' : category.includes('Beach') ? '🏖️' : category.includes('Cloth') ? '👕' : category.includes('Electronic') ? '🔌' : '💼'}
                              </div>
                              {category}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {items.map((item, index) => {
                                const globalIndex = packingItems.findIndex(i => i === item);
                                return (
                                  <div 
                                    key={item.item_name + index}
                                    className={`group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ${item.checked ? 'ring-4 ring-green-500 opacity-75' : ''}`}
                                  >
                                    <div className="relative h-56 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 group-hover:scale-110 transition-transform duration-500"></div>
                                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                                        {item.item_name.toLowerCase().includes('passport') ? '🛂' : 
                                         item.item_name.toLowerCase().includes('sun') ? '☀️' :
                                         item.item_name.toLowerCase().includes('swim') ? '🩱' :
                                         item.item_name.toLowerCase().includes('adapter') ? '🔌' :
                                         item.item_name.toLowerCase().includes('aid') ? '🏥' : '🎒'}
                                      </div>
                                      <button
                                        onClick={() => toggleItemChecked(globalIndex)}
                                        className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-10"
                                      >
                                        {item.checked && <Check className="w-6 h-6 text-green-600" />}
                                      </button>
                                    </div>
                                    <div className="p-6">
                                      <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
                                        {item.item_name}
                                      </h3>
                                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                                      
                                      {/* NEW: Category badge and Shop button */}
                                      <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <span className="inline-block text-xs font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
                                          {item.category}
                                        </span>
                                        
                                        <button
                                          onClick={() => handleShopClick(item)}
                                          className="flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all"
                                        >
                                          🛒 Shop Now
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packingItems.map((item, index) => (
                          <div 
                            key={item.item_name + index}
                            className={`group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ${item.checked ? 'ring-4 ring-green-500 opacity-75' : ''}`}
                          >
                            <div className="relative h-56 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 group-hover:scale-110 transition-transform duration-500"></div>
                              <div className="absolute inset-0 flex items-center justify-center text-6xl">
                                {item.item_name.toLowerCase().includes('passport') ? '🛂' : 
                                 item.item_name.toLowerCase().includes('sun') ? '☀️' :
                                 item.item_name.toLowerCase().includes('swim') ? '🩱' :
                                 item.item_name.toLowerCase().includes('adapter') ? '🔌' :
                                 item.item_name.toLowerCase().includes('aid') ? '🏥' : '🎒'}
                              </div>
                              <button
                                onClick={() => toggleItemChecked(index)}
                                className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-10"
                              >
                                {item.checked && <Check className="w-6 h-6 text-green-600" />}
                              </button>
                            </div>
                            <div className="p-6">
                              <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
                                {item.item_name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                              
                              {/* NEW: Category badge and Shop button */}
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="inline-block text-xs font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
                                  {item.category}
                                </span>
                                
                                <button
                                  onClick={() => handleShopClick(item)}
                                  className="flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all"
                                >
                                  🛒 Shop Now
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {!isLoading && (!packingItems || packingItems.length === 0) && showResult && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">✈️</div>
                    <p className="text-white text-xl italic">Your packing list will appear here...</p>
                    <p className="text-white/70 mt-2">Enter your trip details above to get started!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Comparison Section */}
        <div className="mt-20 w-full max-w-5xl">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 sm:p-12 border border-white/30 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 drop-shadow-lg">
              Traditional Packing vs. Packmind AI
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white/70 mb-4 text-center">Old Way 😩</h3>
                <ul className="space-y-3 text-white">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>2-3 hours making lists</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>Generic, one-size-fits-all</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>Always forget essentials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>Buy forgotten items at airport</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-400/20 to-blue-400/20 backdrop-blur-sm rounded-xl p-6 border-2 border-green-400/30 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Packmind Way 🎉</h3>
                <ul className="space-y-3 text-white">
                  <li className="flex items-start gap-3">
                    <span className="text-green-300 font-bold">✓</span>
                    <span><strong>30 seconds</strong> to perfect list</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-300 font-bold">✓</span>
                    <span><strong>Personalized</strong> for YOUR trip</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-300 font-bold">✓</span>
                    <span><strong>Never miss</strong> a thing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-300 font-bold">✓</span>
                    <span><strong>Save money</strong> &amp; stress</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20 w-full max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 drop-shadow-lg">
            Loved by Travelers Worldwide 🌎
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Sarah M.", location: "New York", text: "Saved me hours! Never packing without this again. The list was spot-on for my Bali trip.", rating: 5 },
              { name: "James K.", location: "London", text: "As a frequent business traveler, this is a game-changer. I don't forget my chargers anymore!", rating: 5 },
              { name: "Maria G.", location: "Barcelona", text: "Used it for our family vacation. It even reminded us about kids' essentials we forgot!", rating: 5 },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-transform">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 w-full max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 drop-shadow-lg">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              { q: "Is Packmind AI really free?", a: "Yes! 100% free, no credit card required, no hidden fees. We believe everyone deserves stress-free travel." },
              { q: "How does the AI work?", a: "Our AI analyzes millions of successful trips to create personalized packing lists based on your destination, duration, activities, and season." },
              { q: "Can I save my lists?", a: "Currently you can export your lists as PDF or text. We're working on user accounts to save unlimited lists!" },
              { q: "Do you share my data?", a: "Never. Your trip details are private and used only to generate your packing list." },
            ].map((faq, i) => (
              <div key={i} className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30 hover:bg-white/30 transition-all">
                <h3 className="font-bold text-white text-lg mb-2">{faq.q}</h3>
                <p className="text-white/90">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer CTA */}
      <footer className="relative z-10 mt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-md rounded-2xl p-10 border-2 border-white/40 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-lg text-center">
              {emailCaptured ? "Share the Love! 💜" : "Ready to Pack Smarter?"}
            </h2>
            <p className="text-white/95 mb-6 text-lg text-center max-w-2xl mx-auto">
              {emailCaptured 
                ? "Help your friends travel stress-free. Share Packmind AI and never let them forget essentials again!"
                : "Join 12,000+ smart travelers. Get exclusive packing tips and never forget anything again!"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {emailCaptured ? (
                <button
                  onClick={() => alert('Share functionality')}
                  className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  📤 Share Packmind AI
                </button>
              ) : (
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  🎁 Get Free Packing Guide
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-10 text-center text-white/80 text-sm space-y-2">
            <p className="font-medium">© 2025 Packmind AI. Made with ❤️ for travelers.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <span>•</span>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <span>•</span>
              <button className="hover:text-white transition-colors">Contact Us</button>
            </div>
          </div>
        </div>
      </footer>

      {/* NEW: Affiliate Modal */}
      <AffiliateSuggestionModal
        isOpen={showAffiliateModal}
        onClose={() => {
          setShowAffiliateModal(false);
          setSelectedItemForShopping(null);
        }}
        itemData={selectedItemForShopping ? generateMockProductData(selectedItemForShopping) : null}
      />
    </div>
  );
}