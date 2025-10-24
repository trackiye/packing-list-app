"use client";

import React, { useState, useEffect } from 'react';
import { ClipboardCopy, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

// Define item structure
interface PackingItem {
  item_name: string;
  description: string;
  category: string;
}

export default function Home() {
  // State variables
  const [localInput, setLocalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [packingItems, setPackingItems] = useState<PackingItem[] | null>(null);
  const [rawResultText, setRawResultText] = useState<string | null>(null); // Keep for copy
  const [errorText, setErrorText] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // Input handler
  const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalInput(e.target.value);
  };

  // Form submission handler (fetches data)
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading) return;
    setIsLoading(true);
    setPackingItems(null); // Clear items to trigger animations if showing
    setRawResultText(null);
    setErrorText(null);
    setShowResult(true);
    setIsCopied(false);
    try {
      const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: localInput })
      });
      if (!response.ok || !response.body) { throw new Error("API request failed"); }
      const fullResponseText = await response.text();
      setRawResultText(fullResponseText);
      try {
        const parsedItems: PackingItem[] = JSON.parse(fullResponseText);
        if (!Array.isArray(parsedItems)) { throw new Error("AI response not JSON array."); }
        setPackingItems(parsedItems);
      } catch (parseError: unknown) {
        const message = parseError instanceof Error ? parseError.message : String(parseError);
        setErrorText(`AI response not valid JSON: ${message}.`);
        setPackingItems(null);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorText(`Failed: ${message}`);
      setPackingItems(null);
      setRawResultText(null);
    } finally { setIsLoading(false); }
  };

  // Copy handler
  const handleCopy = () => {
    if (rawResultText && !isCopied) {
      navigator.clipboard.writeText(rawResultText).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(err => { console.error('Copy failed:', err); alert("Failed copy."); });
    }
  };

  // Delete (hide) handler
  const handleDelete = () => { setShowResult(false); };

  // Effect to manage state resets
  useEffect(() => { if (isLoading) { setShowResult(true); setIsCopied(false); } }, [isLoading]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.1, staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // --- JSX STRUCTURE STARTS HERE ---
  return (
    <div className="relative min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <a href="/" className="text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors">
            Packmind AI
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center justify-start p-4 pt-10 sm:pt-16">
        <div className="w-full max-w-4xl"> {/* Wider container */}

          {/* Form Section */}
          <div className="text-center mb-12 max-w-2xl mx-auto">
             <h1 className="text-4xl sm:text-5xl font-bold mb-4">Never forget anything again.</h1>
             <p className="text-lg text-gray-600 mb-8"> Tell us about your trip... </p>
             {/* Form Tag */}
             <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
                 {/* Input Tag */}
                 <input
                   type="text"
                   value={localInput}
                   onChange={handleLocalInputChange}
                   placeholder="Type your trip details here..."
                   className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                   disabled={isLoading}
                   aria-label="Trip details input"
                 />
                 {/* Button Tag */}
                 <button
                   type="submit"
                   disabled={isLoading || !localInput.trim()}
                   className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 sm:py-6 text-lg font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                   {isLoading ? "Generating..." : "Generate My List"}
                 </button>
             </form>
          </div>

          {/* Results Section */}
          <div className="mt-8 w-full">
            {/* Error Display */}
             {errorText && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto"> Error: {errorText} </div> )}

            {/* Result Display Area - Using AnimatePresence */}
            <AnimatePresence>
             {showResult && (packingItems || isLoading) && !errorText && (
               <motion.div // Wrap results container for exit animation
                 key="results-container" // Key for AnimatePresence
                 className="w-full"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.3 }}
               >
                 <div className="flex justify-end gap-2 mb-4 max-w-2xl mx-auto"> {/* Buttons */}
                   <button onClick={handleCopy} disabled={!rawResultText || isCopied} title={isCopied ? "Copied!" : "Copy JSON"} aria-label={isCopied ? "Copied!" : "Copy JSON"} className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"> {isCopied ? <Check size={20}/> : <ClipboardCopy size={20}/>} </button>
                   <button onClick={handleDelete} disabled={(!packingItems && !isLoading)} title="Delete" aria-label="Delete" className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"> <Trash2 size={20}/> </button>
                 </div>

                 {/* Grid Layout */}
                 {isLoading && !packingItems && ( <p className="text-gray-500 text-center italic max-w-2xl mx-auto">Generating...</p> )}
                 {packingItems && (
                   <motion.div // Grid container with animation variants
                     className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
                     variants={containerVariants}
                     initial="hidden"
                     animate="visible"
                   >
                     {packingItems.map((item, index) => (
                       <motion.div // Each card with animation variants
                         key={item.item_name + index} // Use a more stable key
                         className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white flex flex-col"
                         variants={itemVariants}
                       >
                         {/* Image Placeholder */}
                         <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                           <span>Image Placeholder</span>
                         </div>
                         {/* Text Content */}
                         <div className="p-4 flex flex-col flex-grow">
                           <h3 className="font-semibold text-base text-gray-800 mb-1">{item.item_name}</h3>
                           <p className="text-sm text-gray-600 flex-grow mb-2">{item.description}</p>
                           <a href="#" onClick={(e)=>e.preventDefault()} className="text-purple-600 hover:underline text-sm mt-auto pt-2 block">
                             View Product (Link coming soon)
                           </a>
                         </div>
                       </motion.div> // End Item Card motion.div
                     ))}
                   </motion.div> // End Grid container motion.div
                 )}
               </motion.div> // End results container motion.div
             )}
            </AnimatePresence> {/* End AnimatePresence */}

            {/* Placeholder */}
             {!isLoading && !errorText && (!packingItems || !showResult) && (
               <div className="bg-gray-100 rounded-lg p-6 shadow-sm max-w-2xl mx-auto">
                 <p className="text-gray-500 text-center italic">
                   {showResult ? "Your packing list..." : "Result cleared."}
                 </p>
               </div>
             )}
          </div> {/* End Results section div */}
        </div> {/* End max-w-4xl div */}
      </main> {/* End main */}
    </div> // End relative div
  ); // End return
} // End Home function