"use client";

import React, { useState, useEffect } from 'react';
import { ClipboardCopy, Trash2, Search, Cog, ListChecks, Download, Share2, Check, FileText, Edit, Sparkles, Plane, Globe } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

// --- Import external components and data logic ---
import LoadingAnimation from '../components/LoadingAnimation';
import { getLocalProductData } from '../data/affiliateProducts';
import EmailCaptureModal from '../components/EmailCaptureModal';
import ListEditor from '../components/ListEditor';
import { generatePDF } from '../utils/pdfExport';

interface PackingItem {
  item_name: string;
  description: string;
  category: string;
  checked?: boolean;
}

// --- Animation Variants ---
const fadeSlideInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const containerVariants = { 
  hidden: { opacity: 0 }, 
  visible: { 
    opacity: 1, 
    transition: { 
      delayChildren: 0.1, 
      staggerChildren: 0.06 
    } 
  } 
};

const itemVariants = { 
  hidden: { y: 30, opacity: 0, scale: 0.95 }, 
  visible: { 
    y: 0, 
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  } 
};

const heroVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function Home() {
  // --- State Variables ---
  const [localInput, setLocalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [packingItems, setPackingItems] = useState<PackingItem[] | null>(null);
  const [rawResultText, setRawResultText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [groupByCategory, setGroupByCategory] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [showListEditor, setShowListEditor] = useState(false);
  const [listsGenerated, setListsGenerated] = useState(0);

  // --- Load data from localStorage ---
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    
    const captured = localStorage.getItem('emailCaptured');
    if (captured === 'true') {
      setEmailCaptured(true);
    }

    const generated = localStorage.getItem('listsGenerated');
    if (generated) {
      setListsGenerated(parseInt(generated, 10));
    }
  }, []);

  // --- Exit intent detection ---
  useEffect(() => {
    if (emailCaptured) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && packingItems && packingItems.length > 0) {
        setShowEmailModal(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [emailCaptured, packingItems]);

  // --- Save search to recent searches ---
  const saveToRecentSearches = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // --- Handlers ---
  const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalInput(e.target.value);
  };

  const handleGenerateClick = async () => {
    if (!localInput.trim() || isLoading) return;
    
    // Track with Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'generate_list', {
        event_category: 'engagement',
        event_label: localInput,
      });
    }

    setIsLoading(true); 
    setPackingItems(null); 
    setRawResultText(null); 
    setErrorText(null); 
    setShowResult(true); 
    
    saveToRecentSearches(localInput);
    
    try {
      const response = await fetch('/api/generate', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ prompt: localInput }) 
      });
      
      if (!response.ok || !response.body) { 
        throw new Error(`API Error ${response.status}`); 
      }
      
      const fullResponseText = await response.text(); 
      setRawResultText(fullResponseText);

      try {
        const parsedItems: PackingItem[] = JSON.parse(fullResponseText); 
        if (!Array.isArray(parsedItems)) { 
          throw new Error("AI response not array."); 
        }
        const itemsWithChecked = parsedItems.map(item => ({ ...item, checked: false }));
        setPackingItems(itemsWithChecked);
        
        // Update lists generated count
        const newCount = listsGenerated + 1;
        setListsGenerated(newCount);
        localStorage.setItem('listsGenerated', newCount.toString());

        // Show email modal after 2nd list if not captured
        if (newCount === 2 && !emailCaptured) {
          setTimeout(() => setShowEmailModal(true), 3000);
        }
        
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'list_generated', {
            event_category: 'conversion',
            items_count: parsedItems.length,
          });
        }
        
        toast.success('Packing list generated!');
      } catch (parseError: unknown) {
        const message = parseError instanceof Error ? parseError.message : String(parseError); 
        setErrorText(`AI response not valid JSON: ${message}.`); 
        setPackingItems(null);
        toast.error('Failed to parse response');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error); 
      setErrorText(`Failed: ${message}`); 
      setPackingItems(null); 
      setRawResultText(null);
      toast.error('Failed to generate list');
    } finally { 
      setIsLoading(false); 
    }
  };

  const toggleItemChecked = (index: number) => {
    if (!packingItems) return;
    const updated = [...packingItems];
    updated[index].checked = !updated[index].checked;
    setPackingItems(updated);
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'item_checked', {
        event_category: 'engagement',
        checked: updated[index].checked,
      });
    }
  };

  const handleExportText = () => {
    if (!packingItems) return;
    
    const categories = groupByCategory ? 
      [...new Set(packingItems.map(item => item.category))] : ['All Items'];
    
    let text = `Packing List for: ${localInput}\n`;
    text += `Generated: ${new Date().toLocaleDateString()}\n`;
    text += '='.repeat(50) + '\n\n';
    
    categories.forEach(category => {
      const items = groupByCategory ? 
        packingItems.filter(item => item.category === category) : packingItems;
      
      if (items.length > 0) {
        text += `${category}:\n`;
        items.forEach(item => {
          text += `  ${item.checked ? '✓' : '☐'} ${item.item_name}\n`;
          text += `     ${item.description}\n`;
        });
        text += '\n';
      }
    });
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `packing-list-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('List exported!');
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'export_list', {
        event_category: 'engagement',
        format: 'text',
      });
    }
  };

  const handleExportPDF = async () => {
    if (!packingItems) return;

    try {
      toast.loading('Generating PDF...');
      await generatePDF(packingItems, localInput, 'detailed');
      toast.dismiss();
      toast.success('PDF downloaded!');

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'export_pdf', {
          event_category: 'engagement',
        });
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', error);
    }
  };

  const handleShare = async () => {
    if (!packingItems || !localInput) return;
    
    const shareText = `Check out my packing list for "${localInput}" created with Packmind AI!`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Packing List',
          text: shareText,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        .then(() => toast.success('Link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'));
    }
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share_list', {
        event_category: 'engagement',
      });
    }
  };

  const handleCopy = () => {
    if (rawResultText) {
      navigator.clipboard.writeText(rawResultText)
        .then(() => { toast.success('Copied to clipboard!'); })
        .catch(err => { toast.error('Failed to copy.'); });
    }
  };
  
  const handleDelete = () => { 
    setShowResult(false);
    toast.success('List cleared');
  };

  const handleEmailSubmit = async (email: string) => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          source: showEmailModal ? 'modal' : 'manual' 
        }),
      });

      if (response.ok) {
        setEmailCaptured(true);
        localStorage.setItem('emailCaptured', 'true');
      }
    } catch (error) {
      console.error('Email subscription error:', error);
    }
  };
  
  useEffect(() => { 
    if (isLoading) { setShowResult(true); } 
  }, [isLoading]);
  
  const setExampleInput = (example: string) => { setLocalInput(example); };

  const getGroupedItems = () => {
    if (!packingItems) return {};
    
    const grouped: Record<string, PackingItem[]> = {};
    packingItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  };

  const getProgress = () => {
    if (!packingItems) return 0;
    const checked = packingItems.filter(item => item.checked).length;
    return Math.round((checked / packingItems.length) * 100);
  };

  // --- JSX RETURN ---
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] animated-gradient overflow-hidden">
      {/* Floating orbs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl float-animation" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl float-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/30 rounded-full blur-3xl float-animation" style={{ animationDelay: '4s' }}></div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        trigger={listsGenerated >= 2 ? 'after_generation' : 'exit_intent'}
      />
      
      {/* Glass Header */}
      <header className="sticky top-0 z-50 w-full glass-strong border-b border-white/20 backdrop-blur-2xl">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
           <Link href="/" className="flex items-center gap-2 group">
             <Sparkles className="w-6 h-6 text-yellow-300 glow-pulse" />
             <span className="text-2xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
               Packmind AI
             </span>
           </Link>
           {packingItems && packingItems.length > 0 && (
             <motion.div 
               className="glass-dark px-6 py-2 rounded-full shadow-xl"
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ type: "spring", stiffness: 300, damping: 20 }}
             >
               <div className="flex items-center gap-3">
                 <div className="relative w-12 h-12">
                   <svg className="w-full h-full transform -rotate-90">
                     <circle
                       cx="24"
                       cy="24"
                       r="20"
                       stroke="rgba(255,255,255,0.2)"
                       strokeWidth="4"
                       fill="none"
                     />
                     <circle
                       cx="24"
                       cy="24"
                       r="20"
                       stroke="url(#gradient)"
                       strokeWidth="4"
                       fill="none"
                       strokeDasharray={`${2 * Math.PI * 20}`}
                       strokeDashoffset={`${2 * Math.PI * 20 * (1 - getProgress() / 100)}`}
                       className="transition-all duration-500"
                     />
                     <defs>
                       <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                         <stop offset="0%" stopColor="#3b82f6" />
                         <stop offset="100%" stopColor="#8b5cf6" />
                       </linearGradient>
                     </defs>
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-white text-xs font-bold">{getProgress()}%</span>
                   </div>
                 </div>
                 <span className="text-white font-bold">Packed</span>
               </div>
             </motion.div>
           )}
         </div>
      </header>

      {/* Main content */}
      <main className="relative flex flex-col items-center justify-start p-4 pt-12 sm:pt-20 overflow-x-hidden">

        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12 max-w-5xl mx-auto w-full"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
        >
           <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="mb-6 flex justify-center gap-4 flex-wrap"
           >
             <div className="glass px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
               <Globe className="w-5 h-5 text-blue-300" />
               <span className="text-white font-semibold text-sm">AI-Powered</span>
             </div>
             <div className="glass px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
               <Plane className="w-5 h-5 text-purple-300" />
               <span className="text-white font-semibold text-sm">Instant Results</span>
             </div>
             <div className="glass px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
               <Check className="w-5 h-5 text-green-300" />
               <span className="text-white font-semibold text-sm">100% Free</span>
             </div>
           </motion.div>

           <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight">
             <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl block">
               Pack Smart.
             </span>
             <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 bg-clip-text text-transparent drop-shadow-2xl block glow-pulse">
               Travel Light.
             </span>
           </h1>
           
           <p className="text-xl sm:text-2xl text-white/95 mb-12 drop-shadow-lg font-medium max-w-3xl mx-auto leading-relaxed">
             AI-powered packing lists in <span className="text-yellow-300 font-bold">seconds</span>. 
             Customized for your trip, weather-aware, and absolutely <span className="text-yellow-300 font-bold">free</span>.
           </p>
           
           {/* How it Works - Redesigned */}
           <motion.div 
             className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.5 }}
             variants={containerVariants}
           >
              <motion.div 
                className="glass-strong p-6 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300" 
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Search size={32} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Describe</h3>
                <p className="text-white/80 text-sm">Tell us about your trip destination and duration</p>
              </motion.div>
              
              <motion.div 
                className="glass-strong p-6 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300" 
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Cog size={32} className="text-white animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Generate</h3>
                <p className="text-white/80 text-sm">AI creates your perfect packing list instantly</p>
              </motion.div>
              
              <motion.div 
                className="glass-strong p-6 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300" 
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <ListChecks size={32} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Pack Smart</h3>
                <p className="text-white/80 text-sm">Check off items and export your list</p>
              </motion.div>
           </motion.div>
           
           {/* Input/Button Container - Redesigned */}
           <div className="flex flex-col gap-5 max-w-3xl mx-auto">
               <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                 <input
                   type="text"
                   value={localInput}
                   onChange={handleLocalInputChange}
                   placeholder="E.g., 5 days London business trip, Weekend camping in Yosemite..."
                   className="relative w-full px-8 py-6 text-lg bg-white/95 backdrop-blur-xl border-2 border-white/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-white shadow-2xl placeholder:text-gray-400 font-medium transition-all"
                   disabled={isLoading}
                   aria-label="Trip details input"
                   onKeyDown={(e) => { 
                     if (e.key === 'Enter' && !isLoading && localInput.trim()) { 
                       handleGenerateClick(); 
                     } 
                   }}
                 />
               </div>
               
               <motion.button
                 type="button"
                 onClick={handleGenerateClick}
                 disabled={isLoading || !localInput.trim()}
                 className="relative w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white py-6 sm:py-7 text-xl font-black rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-blue-500/50 hover:scale-[1.02] border-2 border-white/20 overflow-hidden group"
                 whileTap={{ scale: 0.98 }}
                 transition={{ type: "spring", stiffness: 400, damping: 17 }}
               >
                 <span className="relative z-10 flex items-center justify-center gap-3">
                   {isLoading ? (
                     <>
                       <Cog className="w-6 h-6 animate-spin" />
                       Generating Your Perfect List...
                     </>
                   ) : (
                     <>
                       <Sparkles className="w-6 h-6" />
                       Generate My Smart List
                       <Sparkles className="w-6 h-6" />
                     </>
                   )}
                 </span>
                 {!isLoading && localInput.trim() && (
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                 )}
               </motion.button>
           </div>
           
           {/* Recent Searches - Redesigned */}
           {recentSearches.length > 0 && !isLoading && (
             <motion.div 
               className="mt-6 text-sm"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
             >
               <span className="text-white/70 font-medium">Recent searches:</span>{" "}
               {recentSearches.slice(0, 3).map((search, idx) => (
                 <React.Fragment key={idx}>
                   <button 
                     type="button" 
                     onClick={() => setLocalInput(search)} 
                     className="glass-dark px-4 py-2 rounded-lg text-white font-semibold hover:scale-105 transition-transform inline-block mx-1 my-1"
                   > 
                     {search}
                   </button>
                 </React.Fragment>
               ))}
             </motion.div>
           )}
           
           {/* Examples - Redesigned */}
           <div className="mt-4 text-sm">
              <span className="text-white/70 font-medium">Try:</span>{" "}
              <button 
                type="button" 
                onClick={() => setExampleInput('Weekend beach trip to Miami')} 
                className="text-yellow-300 font-bold hover:text-yellow-100 underline decoration-2 underline-offset-4 transition-colors mx-2"
              > 
                Beach Weekend
              </button>
              <span className="text-white/50">or</span>
              <button 
                type="button" 
                onClick={() => setExampleInput('10 days in Italy, sightseeing')} 
                className="text-yellow-300 font-bold hover:text-yellow-100 underline decoration-2 underline-offset-4 transition-colors mx-2"
              > 
                Italy Adventure
              </button>
           </div>
        </motion.div>

        {/* Results Section */}
        <motion.div 
          className="mt-12 w-full max-w-7xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeSlideInVariants}
        >
          {errorText && ( 
            <motion.div 
              className="glass-dark border-2 border-red-400/50 text-white px-6 py-4 rounded-2xl mb-6 max-w-2xl mx-auto shadow-2xl" 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            > 
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <p className="font-bold mb-1">Oops! Something went wrong</p>
                  <p className="text-sm text-white/80">{errorText}</p>
                </div>
              </div>
            </motion.div> 
          )}

          <AnimatePresence>
            {showResult && !errorText && (isLoading || packingItems) && (
              <motion.div
                key="results-block-content"
                className="w-full"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                transition={{ duration: 0.3 }}
              >
                {/* Buttons Container - Redesigned */}
                <div className="flex justify-between items-center gap-3 mb-6 flex-wrap">
                  {packingItems && packingItems.length > 0 && (
                    <div className="flex gap-3 flex-wrap">
                      <button 
                        onClick={() => setGroupByCategory(!groupByCategory)}
                        className="glass-strong px-6 py-3 text-white hover:scale-105 rounded-xl border border-white/30 transition-all shadow-xl text-sm font-bold"
                      >
                        {groupByCategory ? '📋 Show All' : '🗂️ Group by Category'}
                      </button>
                      <button 
                        onClick={() => setShowListEditor(!showListEditor)}
                        className="glass-strong px-6 py-3 text-white hover:scale-105 rounded-xl border border-white/30 transition-all shadow-xl text-sm font-bold flex items-center gap-2"
                      >
                        <Edit size={18} />
                        {showListEditor ? 'Hide Editor' : 'Edit List'}
                      </button>
                    </div>
                  )}
                  
                  <div className="flex gap-3 ml-auto flex-wrap">
                    <button 
                      onClick={handleShare}
                      disabled={!packingItems}
                      title="Share list"
                      aria-label="Share list"
                      className="glass-strong p-3 text-white hover:scale-110 rounded-xl border border-white/30 disabled:opacity-50 transition-all shadow-xl"
                    > 
                      <Share2 size={20}/> 
                    </button>
                    <button 
                      onClick={handleExportPDF}
                      disabled={!packingItems}
                      title="Export as PDF"
                      aria-label="Export as PDF"
                      className="glass-strong p-3 text-white hover:scale-110 rounded-xl border border-white/30 disabled:opacity-50 transition-all shadow-xl"
                    >
                      <FileText size={20}/>
                    </button>
                    <button 
                      onClick={handleExportText}
                      disabled={!packingItems}
                      title="Export as text"
                      aria-label="Export as text"
                      className="glass-strong p-3 text-white hover:scale-110 rounded-xl border border-white/30 disabled:opacity-50 transition-all shadow-xl"
                    >
                      <Download size={20}/>
                    </button>
                    <button 
                      onClick={handleCopy} 
                      disabled={!rawResultText} 
                      title="Copy JSON" 
                      aria-label="Copy JSON" 
                      className="glass-strong p-3 text-white hover:scale-110 rounded-xl border border-white/30 disabled:opacity-50 transition-all shadow-xl"
                    > 
                      <ClipboardCopy size={20}/> 
                    </button>
                    <button 
                      onClick={handleDelete} 
                      disabled={!(isLoading || packingItems)} 
                      title="Delete" 
                      aria-label="Delete" 
                      className="glass-strong p-3 text-white hover:scale-110 rounded-xl border border-white/30 disabled:opacity-50 transition-all shadow-xl hover:bg-red-500/30"
                    > 
                      <Trash2 size={20}/> 
                    </button>
                  </div>
                </div>

                {/* List Editor */}
                {showListEditor && packingItems && (
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ListEditor items={packingItems} onItemsChange={setPackingItems} />
                  </motion.div>
                )}

                {/* Content Area */}
                <div className="glass-strong rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-white/30">
                   {isLoading && !packingItems && (
                     <LoadingAnimation />
                   )}

                   {!isLoading && packingItems && packingItems.length > 0 && (
                     <>
                       {groupByCategory ? (
                         <div className="space-y-12">
                           {Object.entries(getGroupedItems()).map(([category, items]) => (
                             <motion.div 
                               key={category}
                               initial={{ opacity: 0, y: 20 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ duration: 0.5 }}
                             >
                               <div className="flex items-center gap-4 mb-6">
                                 <div className="h-1 flex-grow bg-gradient-to-r from-transparent via-white/30 to-white/30 rounded"></div>
                                 <h2 className="text-3xl font-black text-white drop-shadow-lg">
                                   {category}
                                 </h2>
                                 <div className="h-1 flex-grow bg-gradient-to-r from-white/30 via-white/30 to-transparent rounded"></div>
                               </div>
                               <motion.div
                                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                 variants={containerVariants} 
                                 initial="hidden" 
                                 animate="visible"
                               >
                                 {items.map((item, index) => {
                                   const globalIndex = packingItems.findIndex(i => i === item);
                                   const productData = getLocalProductData(item.item_name); 
                                   const isAffiliate = productData.is_affiliate;
                                   
                                   return (
                                     <motion.div 
                                       key={item.item_name + index} 
                                       className={`border-2 rounded-2xl overflow-hidden shadow-2xl bg-white flex flex-col hover:shadow-blue-500/50 transition-all ${item.checked ? 'opacity-70 border-green-400 ring-4 ring-green-400/30' : 'border-white/50'}`}
                                       variants={itemVariants} 
                                       whileHover={{ scale: 1.05, y: -8 }} 
                                       transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                     >
                                       <div className="w-full h-56 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center relative overflow-hidden group">
                                         <a href={productData.product_link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                            <img 
                                              src={productData.image_link || "https://via.placeholder.com/400/e9d5ff/9333ea?text=Packmind"} 
                                              alt={item.item_name} 
                                              className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-500"
                                            />
                                         </a>
                                         {isAffiliate && (
                                             <span className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl">
                                                 Sponsored
                                             </span>
                                         )}
                                         <button
                                           onClick={() => toggleItemChecked(globalIndex)}
                                           className={`absolute top-3 left-3 w-10 h-10 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-2 ${item.checked ? 'bg-green-500 border-green-400' : 'bg-white border-white/50'}`}
                                           aria-label={`Mark ${item.item_name} as ${item.checked ? 'unpacked' : 'packed'}`}
                                         >
                                           {item.checked && <Check className="w-6 h-6 text-white font-bold" strokeWidth={3} />}
                                         </button>
                                       </div>
                                       <div className="p-6 flex flex-col flex-grow bg-gradient-to-br from-white to-gray-50">
                                         <a 
                                           href={productData.product_link} 
                                           target="_blank" 
                                           rel="noopener noreferrer" 
                                           className="text-gray-900 hover:text-purple-600 hover:underline text-xl font-black mb-3 transition-colors leading-tight"
                                         >
                                             {productData.product_title}
                                         </a>
                                         <p className="text-sm text-gray-600 flex-grow mb-4 leading-relaxed">{item.description}</p>
                                         <span className="inline-block text-xs font-bold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full self-start shadow-md">
                                           {item.category}
                                         </span>
                                       </div>
                                     </motion.div>
                                   );
                                 })}
                               </motion.div>
                             </motion.div>
                           ))}
                         </div>
                       ) : (
                         <motion.div
                           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                           variants={containerVariants} 
                           initial="hidden" 
                           animate="visible"
                         >
                           {packingItems.map((item, index) => {
                             const productData = getLocalProductData(item.item_name); 
                             const isAffiliate = productData.is_affiliate;
                             
                             return (
                               <motion.div 
                                 key={item.item_name + index} 
                                 className={`border-2 rounded-2xl overflow-hidden shadow-2xl bg-white flex flex-col hover:shadow-blue-500/50 transition-all ${item.checked ? 'opacity-70 border-green-400 ring-4 ring-green-400/30' : 'border-white/50'}`}
                                 variants={itemVariants}
                                 whileHover={{ scale: 1.05, y: -8 }} 
                                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
                               >
                                 <div className="w-full h-56 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center relative overflow-hidden group">
                                   <a href={productData.product_link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                      <img 
                                        src={productData.image_link || "https://via.placeholder.com/400/e9d5ff/9333ea?text=Packmind"} 
                                        alt={item.item_name} 
                                        className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-500"
                                      />
                                   </a>
                                   {isAffiliate && (
                                       <span className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl">
                                           Sponsored
                                       </span>
                                   )}
                                   <button
                                     onClick={() => toggleItemChecked(index)}
                                     className={`absolute top-3 left-3 w-10 h-10 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-2 ${item.checked ? 'bg-green-500 border-green-400' : 'bg-white border-white/50'}`}
                                     aria-label={`Mark ${item.item_name} as ${item.checked ? 'unpacked' : 'packed'}`}
                                   >
                                     {item.checked && <Check className="w-6 h-6 text-white font-bold" strokeWidth={3} />}
                                   </button>
                                 </div>
                                 <div className="p-6 flex flex-col flex-grow bg-gradient-to-br from-white to-gray-50">
                                   <a 
                                     href={productData.product_link} 
                                     target="_blank" 
                                     rel="noopener noreferrer" 
                                     className="text-gray-900 hover:text-purple-600 hover:underline text-xl font-black mb-3 transition-colors leading-tight"
                                   >
                                       {productData.product_title}
                                   </a>
                                   <p className="text-sm text-gray-600 flex-grow mb-4 leading-relaxed">{item.description}</p>
                                   <span className="inline-block text-xs font-bold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full self-start shadow-md">
                                     {item.category}
                                   </span>
                                 </div>
                               </motion.div>
                             );
                           })}
                         </motion.div>
                       )}
                     </>
                   )}
                   
                   {!isLoading && packingItems && packingItems.length === 0 && (
                      <p className="text-white text-center italic text-lg">No packing items generated for this trip.</p>
                   )}
                </div>
              </motion.div>
            )}

            {!isLoading && !errorText && (!showResult || !packingItems) && (
               <motion.div
                 key="placeholder-block"
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
               >
                 <div className="glass-strong rounded-3xl p-12 shadow-2xl max-w-2xl mx-auto border-2 border-white/30">
                   <p className="text-white text-center text-lg font-medium">
                     {showResult ? "✨ Your packing list will appear here..." : "🗑️ Result cleared."}
                   </p>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
          
        </motion.div>
      </main>
      
      {/* Footer with CTA - Redesigned */}
      <footer className="mt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            className="glass-strong rounded-3xl p-10 sm:p-12 border-2 border-white/30 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 drop-shadow-lg text-center">
                {emailCaptured ? '🎉 Love Packmind AI?' : '✨ Ready for Perfect Packing?'}
              </h2>
              <p className="text-white/90 mb-8 text-lg sm:text-xl drop-shadow-md text-center max-w-2xl mx-auto leading-relaxed">
                {emailCaptured 
                  ? "Share it with your travel buddies and help them pack smarter too!"
                  : "Join thousands of smart travelers and never forget essentials again!"
                }
              </p>
              <div className="flex justify-center">
                {emailCaptured ? (
                  <button
                    onClick={handleShare}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl flex items-center gap-3"
                  >
                    <Share2 className="w-6 h-6" />
                    Share Packmind AI
                  </button>
                ) : (
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl flex items-center gap-3"
                  >
                    <Sparkles className="w-6 h-6" />
                    Get Free Packing Guide
                  </button>
                )}
              </div>
            </div>
          </motion.div>
          
          <div className="mt-10 text-center">
            <p className="text-white/60 text-sm font-medium">© 2025 Packmind AI</p>
            <p className="text-white/40 text-xs mt-2">Made with ❤️ for travelers worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
}