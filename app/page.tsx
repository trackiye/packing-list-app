"use client";

import React, { useState, useEffect } from 'react';
import { ClipboardCopy, Trash2, Search, Cog, ListChecks } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

// --- Import external components and data logic ---
import LoadingAnimation from '../components/LoadingAnimation';
import { getLocalProductData } from '../data/affiliateProducts';

interface PackingItem {
  item_name: string;
  description: string;
  category: string;
}

// --- Animation Variants ---
const scrollFadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};
const containerVariants = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { delayChildren: 0.1, staggerChildren: 0.05 } } 
};
const itemVariants = { 
  hidden: { y: 20, opacity: 0 }, 
  visible: { y: 0, opacity: 1 } 
};

export default function Home() {
  // --- State Variables ---
  const [localInput, setLocalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [packingItems, setPackingItems] = useState<PackingItem[] | null>(null);
  const [rawResultText, setRawResultText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(true);

  // --- Handlers ---
  const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalInput(e.target.value);
  };

  const handleGenerateClick = async () => {
    console.log("handleGenerateClick called");
    if (!localInput.trim() || isLoading) return;
    setIsLoading(true); 
    setPackingItems(null); 
    setRawResultText(null); 
    setErrorText(null); 
    setShowResult(true); 
    console.log("Submitting prompt:", localInput);
    
    try {
      const response = await fetch('/api/generate', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ prompt: localInput }) 
      });
      console.log("Fetch response:", { status: response.status, ok: response.ok });
      if (!response.ok || !response.body) { 
        throw new Error(`API Error ${response.status}`); 
      }
      
      const fullResponseText = await response.text(); 
      setRawResultText(fullResponseText);
      console.log("Raw Response:", fullResponseText.substring(0, 100) + "...");

      try {
        console.log("Attempting JSON parse..."); 
        const parsedItems: PackingItem[] = JSON.parse(fullResponseText); 
        console.log("Parse successful:", parsedItems);
        if (!Array.isArray(parsedItems)) { 
          console.error("Not array"); 
          throw new Error("AI response not array."); 
        }
        setPackingItems(parsedItems);
      } catch (parseError: unknown) {
        const message = parseError instanceof Error ? parseError.message : String(parseError); 
        console.error("!!! JSON Parse Error:", parseError); 
        setErrorText(`AI response not valid JSON: ${message}.`); 
        setPackingItems(null);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error); 
      console.error("!!! Fetch Error:", error); 
      setErrorText(`Failed: ${message}`); 
      setPackingItems(null); 
      setRawResultText(null);
    } finally { 
      setIsLoading(false); 
      console.log("Generation finished."); 
    }
  };

  const handleCopy = () => {
    if (rawResultText) {
      navigator.clipboard.writeText(rawResultText)
        .then(() => { toast.success('Copied!'); })
        .catch(err => { console.error('Copy failed:', err); toast.error('Failed copy.'); });
    }
  };
  
  const handleDelete = () => { setShowResult(false); };
  
  useEffect(() => { 
    if (isLoading) { setShowResult(true); } 
  }, [isLoading]);
  
  const setExampleInput = (example: string) => { setLocalInput(example); };

  // --- JSX RETURN ---
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 animated-gradient">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Glass Header */}
      <header className="sticky top-0 z-10 w-full bg-white/75 backdrop-blur-lg shadow-sm border-b border-white/20">
         <div className="max-w-4xl mx-auto px-4 py-3">
           <Link href="/" className="text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors">
             Packmind AI
           </Link>
         </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center justify-start p-4 pt-10 sm:pt-16 overflow-x-hidden">

        {/* Form Section - Glass Effect */}
        <div className="text-center mb-10 max-w-2xl mx-auto w-full">
           <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white drop-shadow-lg">
             Never forget anything again.
           </h1>
           <p className="text-lg text-white/90 mb-6 drop-shadow-md">
             Get a personalized packing list generated by AI. Just describe your trip below.
           </p>
           
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
                <span className="text-sm text-white font-medium text-left">1. Describe your trip.</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 p-3 bg-white/20 backdrop-blur-md rounded-lg border border-white/30" 
                variants={itemVariants}
              >
                <Cog size={32} className="text-white flex-shrink-0" />
                <span className="text-sm text-white font-medium text-left">2. Click Generate.</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 p-3 bg-white/20 backdrop-blur-md rounded-lg border border-white/30" 
                variants={itemVariants}
              >
                <ListChecks size={32} className="text-white flex-shrink-0" />
                <span className="text-sm text-white font-medium text-left">3. Get your smart list!</span>
              </motion.div>
           </motion.div>
           
           {/* Input/Button Container - Glass Effect */}
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
                 className="w-full bg-white/90 backdrop-blur-md hover:bg-white text-purple-600 py-4 sm:py-6 text-lg font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl pulse-glow border border-white/50"
                 whileTap={{ scale: 0.97 }}
                 transition={{ type: "spring", stiffness: 400, damping: 17 }}
               >
                 {isLoading ? "Generating..." : "Generate My List"}
               </motion.button>
           </div>
           
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
          variants={scrollFadeInVariants}
        >
          {/* Error Display */}
          {errorText && ( 
            <div className="bg-red-500/90 backdrop-blur-md border border-red-300/50 text-white px-4 py-3 rounded-lg mb-4 max-w-2xl mx-auto shadow-lg"> 
              Error: {errorText} 
            </div> 
          )}

          {/* Result Display Area */}
          <AnimatePresence>
            {/* Results Block */}
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
                <div className="flex justify-end gap-2 mb-4 max-w-2xl mx-auto">
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

                {/* Content Area - Glass Effect */}
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-xl border border-white/30">
                   {/* Loading Animation */}
                   {isLoading && !packingItems && (
                     <LoadingAnimation />
                   )}

                   {/* Grid Layout */}
                   {!isLoading && packingItems && packingItems.length > 0 && (
                     <motion.div
                       className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
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
                           className="border border-white/40 rounded-lg overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm flex flex-col hover:shadow-2xl transition-shadow" 
                           variants={itemVariants} 
                           whileHover={{ scale: 1.03, y: -2 }} 
                           transition={{ type: "spring", stiffness: 300, damping: 20 }} 
                         >
                           {/* Image */}
                           <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400 relative">
                             <a href={productData.product_link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                <img 
                                  src={productData.image_link || "https://via.placeholder.com/150/d3d3d3/808080?text=Packmind"} 
                                  alt={item.item_name} 
                                  className="w-full h-full object-cover"
                                />
                             </a>
                             {/* Affiliate Badge */}
                             {isAffiliate && (
                                 <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full opacity-90 shadow-md">
                                     Affiliate Link
                                 </span>
                             )}
                           </div>
                           {/* Text Content */}
                           <div className="p-4 flex flex-col flex-grow">
                             <a 
                               href={productData.product_link} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className="text-purple-600 hover:text-purple-700 hover:underline text-base font-semibold mb-1"
                             >
                                 {productData.product_title}
                             </a>
                             <p className="text-sm text-gray-600 flex-grow mb-2">{item.description}</p>
                           </div>
                         </motion.div>
                       );
                      })}
                     </motion.div>
                   )}
                   
                   {/* Empty Array */}
                   {!isLoading && packingItems && packingItems.length === 0 && (
                      <p className="text-white text-center italic">No packing items generated for this trip.</p>
                   )}
                </div>
              </motion.div>
            )}

            {/* Placeholder Block */}
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
    </div>
  );
}