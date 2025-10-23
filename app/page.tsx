"use client";

import React, { useState, useEffect } from 'react';
import { ClipboardCopy, Trash2, Check } from "lucide-react";

export default function Home() {
  const [localInput, setLocalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalInput(e.target.value);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading) return;

    setIsLoading(true);
    setResultText('');
    setErrorText(null);
    setShowResult(true);
    setIsCopied(false);

    try {
      const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: localInput })
      });

      if (!response.ok) {
          let errorDetails = `API Error: ${response.status} ${response.statusText}`;
          try { const errorJson = await response.json(); errorDetails += ` - ${errorJson.error || 'No details'}`; }
          catch { errorDetails += ` - ${await response.text()}`; }
          throw new Error(errorDetails);
      }
      if (!response.body) { throw new Error("API Error: Response body empty."); }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setResultText((prev) => (prev ?? '') + chunk);
      }
      const finalChunk = decoder.decode();
      if (finalChunk) { setResultText((prev) => (prev ?? '') + finalChunk); }

    // --- ESLINT FIX HERE ---
    } catch (error: unknown) { // Changed 'any' to 'unknown'
      console.error("Fetch API Error:", error);
      // Type check error before accessing properties
      const message = error instanceof Error ? error.message : String(error);
      setErrorText(`Failed to get response: ${message}`);
      setResultText(null);
    // --- END FIX ---
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (resultText && !isCopied) {
      navigator.clipboard.writeText(resultText)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          console.error('Copy failed:', err);
          alert("Failed to copy.");
        });
    }
  };

  const handleDelete = () => { setShowResult(false); };

  useEffect(() => {
    if (isLoading) {
       setShowResult(true);
       setIsCopied(false);
    }
  }, [isLoading]);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Form Section */}
        <div className="text-center mb-12">
           <h1 className="text-5xl font-bold mb-4">Never forget anything again.</h1>
           <p className="text-lg text-gray-600 mb-8">
             Tell us about your trip...
           </p>
           <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
             <input
               type="text" value={localInput} onChange={handleLocalInputChange}
               placeholder="Type your trip details here..."
               className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
               disabled={isLoading} />
             <button
               type="submit" disabled={isLoading || !localInput.trim()}
               className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold rounded-lg transition-colors disabled:opacity-50">
               {isLoading ? "Generating..." : "Generate My List"}
             </button>
           </form>
        </div>

        {/* Results Section */}
        <div className="mt-8 w-full max-w-2xl">
          {errorText && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"> Error: {errorText} </div> )}
          {showResult && (resultText !== null || isLoading) && !errorText && (
            <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
              <div className="flex justify-end gap-2 mb-4">
                 <button onClick={handleCopy} disabled={!resultText || isCopied} title={isCopied ? "Copied!" : "Copy"} aria-label={isCopied ? "Copied!" : "Copy"} className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50">
                   {isCopied ? <Check size={20} className="text-green-600" /> : <ClipboardCopy size={20} />}
                 </button>
                 <button onClick={handleDelete} disabled={!resultText && !isLoading} title="Delete" aria-label="Delete" className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"> <Trash2 size={20} /> </button>
              </div>
              <div className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                {resultText ? resultText : (isLoading ? "Generating..." : "Your packing list...")}
              </div>
            </div>
          )}
          {!isLoading && !errorText && (resultText === null || !showResult) && (
             <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
               <p className="text-gray-500 text-center italic">
                 {showResult ? "Your packing list will appear here..." : "Result cleared."}
               </p>
             </div>
          )}
        </div>
      </div>
    </main>
  );
}