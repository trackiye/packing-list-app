"use client";

import React, { useState, useEffect } from 'react';
import { ClipboardCopy, Trash2, Search, Cog, ListChecks, Download, Share2, Check, FileText, Edit } from "lucide-react";
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
      delayChildren: 0.2, 
      staggerChildren: 0.08 
    } 
  } 
};

const itemVariants = { 
  hidden: { y: 30, opacity: 0 }, 
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
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
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 animated-gradient">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        trigger={listsGenerated >= 2 ? 'after_generation' : 'exit_intent'}
      />
      
      {/* Glass Header */}
      <header className="sticky top-0 z-10 w-full bg-white/75 backdrop-blur-lg shadow-sm border-b border-white/20">
         <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
           <Link href="/" className="text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors">
             Packmind AI
           </Link>
           {packingItems && packingItems.length > 0 && (
             <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
               {getProgress()}% Packed
             </div>
           )}
         </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center justify-start p-4 pt-10 sm:pt-16 overflow-x-hidden">

        {/* Form Section */}
        <div className="text-center mb-10 max-w-2xl mx-auto w-full">
           <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-white drop-shadow-lg">
             Pack Smart. Travel Light. <span className="text-yellow-300">Never Forget</span>.
           </h1>
           <p className="text-xl text-white/95 mb-8 drop-shadow-md">
             AI-powered packing lists in seconds. Customized for your trip, weather-aware, and absolutely free.
           </p>
           
           {/* Social Proof */}
           <div className="flex justify-center gap-6 mb-8 text-white/90 text-sm flex-wrap">
             <div className="flex items-center gap-2">
               <Check className="w-5 h-5 text-green-300" />
               <span>Trusted by travelers</span>
             </div>
             <div className="flex items-center gap-2">
               <Check className="w-5 h-5 text-green-300" />
               <span>100% Free</span>
             </div>
             <div className="flex items-center gap-2">
               <Check className="w-5 h-5 text-green-300" />
               <span>Instant Results</span>
             </div>
           </div>
           
           {/* How it Works */}
           <motion.div 
             className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-12"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.5 }}
             variants={containerVariants}
           >
              <motion.div 
                className="flex items-center gap-3 p-3 bg-white/20 backdrop-blur-md rounded-lg border border-white/30" 
                variants={itemVariants}
              >
                <Search size={32} className="text-white flex-shrink-0" />
                <span className="text-sm text-white font-medium text-left">1. Describe your trip</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 p-3 bg-white/20 backdrop-blur-md rounded-lg border border-white/30" 
                variants={itemVariants}
              >
                <Cog size={32} className="text-white flex-shrink-0" />
                <span className="text-sm text-white font-medium text-left">2. Click Generate</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 p-3 bg-white/20 backdrop-blur-md rounded-lg border border-white/30" 
                variants={itemVariants}
              >
                <ListChecks size={32} className="text-white flex-shrink-0" />
                <span className="text-sm text-white font-medium text-left">3. Get your smart list!</span>
              </motion.div>
           </motion.div>
           
           {/* Input/Button Container */}
           <div className="flex flex-col gap-4">
               <input
                 type="text"
                 value={localInput}
                 onChange={handleLocalInputChange}
                 placeholder="E.g., 5 days London business, Weekend camping trip"
                 className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-md border border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/80 shadow-lg placeholder:text-gray-500"
                 disabled={isLoading}
                 aria-label="Trip details input"
                 onKeyDown={(e) => { 
                   if (e.key === 'Enter' && !isLoading && localInput.trim()) { 
                     handleGenerateClick(); 
                   } 
                 }}
               />
               <motion.button
                 type="button"
                 onClick={handleGenerateClick}
                 disabled={isLoading || !localInput.trim()}
                 className={`w-full bg-white/90 backdrop-blur-md hover:bg-white text-purple-600 py-4 sm:py-6 text-lg font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl border border-white/50 ${!isLoading && localInput.trim() ? 'pulse-glow' : ''}`}
                 whileTap={{ scale: 0.97 }}
                 transition={{ type: "spring", stiffness: 400, damping: 17 }}
               >
                 {isLoading ? "Generating..." : "Generate My List"}
               </motion.button>
           </div>
           
           {/* Recent Searches */}
           {recentSearches.length > 0 && !isLoading && (
             <div className="mt-4 text-sm text-white/80 drop-shadow-md">
               <span className="font-semibold">Recent:</span>{" "}
               {recentSearches.slice(0, 3).map((search, idx) => (
                 <React.Fragment key={idx}>
                   <button 
                     type="button" 
                     onClick={() => setLocalInput(search)} 
                     className="underline hover:text-white focus:outline-none font-medium mx-1"
                   > 
                     {search}
                   </button>
                   {idx < Math.min(recentSearches.length, 3) - 1 && " • "}
                 </React.Fragment>
               ))}
             </div>
           )}
           
           {/* Examples */}
           <div className="mt-4 text-sm text-white/80 drop-shadow-md">
              Try:{" "}
              <button 
                type="button" 
                onClick={() => setExampleInput('Weekend beach trip to Miami')} 
                className="underline hover:text-white focus:outline-none font-semibold"
              > 
                Weekend beach trip 
              </button>{" "}
              or{" "}
              <button 
                type="button" 
                onClick={() => setExampleInput('10 days in Italy, sightseeing')} 
                className="underline hover:text-white focus:outline-none font-semibold"
              > 
                10 days in Italy 
              </button>
           </div>
        </div>

        {/* Results Section */}
        <motion.div 
          className="mt-8 w-full max-w-5xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeSlideInVariants}
        >
          {errorText && ( 
            <div className="bg-red-500/90 backdrop-blur-md border border-red-300/50 text-white px-4 py-3 rounded-lg mb-4 max-w-2xl mx-auto shadow-lg"> 
              Error: {errorText} 
            </div> 
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
                {/* Buttons Container */}
                <div className="flex justify-between items-center gap-2 mb-4 flex-wrap">
                  {packingItems && packingItems.length > 0 && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setGroupByCategory(!groupByCategory)}
                        className="px-4 py-2 text-white bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-lg border border-white/30 transition-all shadow-lg text-sm font-medium"
                      >
                        {groupByCategory ? 'Show All' : 'Group by Category'}
                      </button>
                      <button 
                        onClick={() => setShowListEditor(!showListEditor)}
                        className="px-4 py-2 text-white bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-lg border border-white/30 transition-all shadow-lg text-sm font-medium flex items-center gap-2"
                      >
                        <Edit size={16} />
                        {showListEditor ? 'Hide Editor' : 'Edit List'}
                      </button>
                    </div>
                  )}
                  
                  <div className="flex gap-2 ml-auto">
                    <button 
                      onClick={handleShare}
                      disabled={!packingItems}
                      title="Share list"
                      aria-label="Share list"
                      className="p-2 text-white bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-lg border border-white/30 disabled:opacity-50 transition-all shadow-lg"
                    > 
                      <Share2 size={20}/> 
                    </button>
                    <button 
                      onClick={handleExportPDF}
                      disabled={!packingItems}
                      title="Export as PDF"
                      aria-label="Export as PDF"
                      className="p-2 text-white bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-lg border border-white/30 disabled:opacity-50 transition-all shadow-lg"
                    >
                      <FileText size={20}/>
                    </button>
                    <button 
                      onClick={handleExportText}
                      disabled={!packingItems}
                      title="Export as text"
                      aria-label="Export as text"
                      className="p-2 text-white bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-lg border border-white/30 disabled:opacity-50 transition-all shadow-lg"
                    >
                      <Download size={20}/>
                    </button>
                    <button 
                      onClick={handleCopy} 
                      disabled={!rawResultText} 
                      title="Copy JSON" 
                      aria-label="Copy JSON" 
                      className="p-2 text-white bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-lg border border-white/30 disabled:opacity-50 transition-all shadow-lg"
                    > 
                      <ClipboardCopy size={20}/> 
                    </button>
                    <button 
                      onClick={handleDelete} 
                      disabled={!(isLoading || packingItems)} 
                      title="Delete" 
                      aria-label="Delete" 
                      className="p-2 text-white bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-lg border border-white/30 disabled:opacity-50 transition-all shadow-lg"
                    > 
                      <Trash2 size={20}/> 
                    </button>
                  </div>
                </div>

                {/* List Editor */}
                {showListEditor && packingItems && (
                  <div className="mb-4">
                    <ListEditor items={packingItems} onItemsChange={setPackingItems} />
                  </div>
                )}

                {/* Content Area */}
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl border border-white/30">
                   {isLoading && !packingItems && (
                     <LoadingAnimation />
                   )}

                   {!isLoading && packingItems && packingItems.length > 0 && (
                     <>
                       {groupByCategory ? (
                         <div className="space-y-8">
                           {Object.entries(getGroupedItems()).map(([category, items]) => (
                             <div key={category}>
                               <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
                                 {category}
                               </h2>
                               <motion.div
                                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
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
                                       className={`border rounded-xl overflow-hidden shadow-lg bg-white flex flex-col hover:shadow-2xl transition-all ${item.checked ? 'opacity-60 border-green-500 border-2' : 'border-gray-200'}`}
                                       variants={itemVariants} 
                                       whileHover={{ scale: 1.03, y: -2 }} 
                                       transition={{ type: "spring", stiffness: 300, damping: 20 }}
>
                                     
                                       <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden group">
                                         <a href={productData.product_link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                            <img 
                                              src={productData.image_link || "https://via.placeholder.com/300/e9d5ff/9333ea?text=Packmind"} 
                                              alt={item.item_name} 
                                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                         </a>
                                         {isAffiliate && (
                                             <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                 Ad
                                             </span>
                                         )}
                                         <button
                                           onClick={() => toggleItemChecked(globalIndex)}
                                           className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                                           aria-label={`Mark ${item.item_name} as ${item.checked ? 'unpacked' : 'packed'}`}
                                         >
                                           {item.checked && <Check className="w-5 h-5 text-green-600" />}
                                         </button>
                                       </div>
                                       <div className="p-5 flex flex-col flex-grow">
                                         <a 
                                           href={productData.product_link} 
                                           target="_blank" 
                                           rel="noopener noreferrer" 
                                           className="text-gray-900 hover:text-purple-600 hover:underline text-lg font-bold mb-2 transition-colors"
                                         >
                                             {productData.product_title}
                                         </a>
                                         <p className="text-sm text-gray-600 flex-grow mb-3">{item.description}</p>
                                         <span className="inline-block text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full self-start">
                                           {item.category}
                                         </span>
                                       </div>
                                     </motion.div>
                                   );
                                 })}
                               </motion.div>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <motion.div
                           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
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
                                 className={`border rounded-xl overflow-hidden shadow-lg bg-white flex flex-col hover:shadow-2xl transition-all ${item.checked ? 'opacity-60 border-green-500 border-2' : 'border-gray-200'}`}
                                 variants={itemVariants}
                                 whileHover={{ scale: 1.03, y: -2 }} 
                                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
>
<div className="w-full h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden group"><a href={productData.product_link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                  <img 
                                    src={productData.image_link || "https://via.placeholder.com/300/e9d5ff/9333ea?text=Packmind"} 
                                    alt={item.item_name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                               </a>
                               {isAffiliate && (
                                   <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                       Ad
                                   </span>
                               )}
                               <button
                                 onClick={() => toggleItemChecked(index)}
                                 className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                                 aria-label={`Mark ${item.item_name} as ${item.checked ? 'unpacked' : 'packed'}`}
                               >
                                 {item.checked && <Check className="w-5 h-5 text-green-600" />}
                               </button>
                             </div>
                             <div className="p-5 flex flex-col flex-grow">
                               <a 
                                 href={productData.product_link} 
                                 target="_blank" 
                                 rel="noopener noreferrer" 
                                 className="text-gray-900 hover:text-purple-600 hover:underline text-lg font-bold mb-2 transition-colors"
                               >
                                   {productData.product_title}
                               </a>
                               <p className="text-sm text-gray-600 flex-grow mb-3">{item.description}</p>
                               <span className="inline-block text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full self-start">
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
                  <p className="text-white text-center italic">No packing items generated for this trip.</p>
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
             <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 shadow-xl max-w-2xl mx-auto border border-white/30">
               <p className="text-white text-center italic">
                 {showResult ? "Your packing list will appear here..." : "Result cleared."}
               </p>
             </div>
           </motion.div>
        )}
      </AnimatePresence>
      
    </motion.div>
  </main>
  
  {/* Footer with CTA */}
  <footer className="mt-20 pb-10 text-center">
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 border border-white/30 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 drop-shadow-lg">
          Love Packmind AI?
        </h2>
        <p className="text-white/90 mb-6 text-lg drop-shadow-md">
          {emailCaptured 
            ? "Share it with your travel buddies and never forget anything again!"
            : "Join our community and get exclusive packing tips!"
          }
        </p>
        {emailCaptured ? (
          <button
            onClick={handleShare}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
          >
            Share Packmind AI
          </button>
        ) : (
          <button
            onClick={() => setShowEmailModal(true)}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl"
          >
            Get Free Packing Guide
          </button>
        )}
      </div>
      
      <div className="mt-8 text-white/70 text-sm">
        <p>© 2025 Packmind AI. Made with ❤️ for travelers.</p>
      </div>
    </div>
  </footer>
</div>
);
}