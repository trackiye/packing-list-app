"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Background from "@/components/Background";
import ChatInterface from "@/components/Conversation/ChatInterface";
import PackingList from "@/components/PackingList";
import AmazonShopping from "@/components/AmazonShopping";
import StickyProgress from "@/components/StickyProgress";
import EmailCapture from "@/components/EmailCapture";
import Footer from "@/components/Footer";
import GenerationAnimation from "@/components/GenerationAnimation";

export default function Home() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [packingItems, setPackingItems] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [packedCount, setPackedCount] = useState(0);

  const handleGenerateList = async (message: string, context?: any) => {
    setIsGenerating(true);
    setDataReady(false);
    setPackingItems(null);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context }),
      });

      const data = await response.json();
      
      setDataReady(true);
      
      setTimeout(() => {
        setPackingItems(data);
        setPackedCount(0);
        setIsGenerating(false);
        setDataReady(false);
      }, 800);
      
    } catch (error) {
      console.error("Error:", error);
      setIsGenerating(false);
      setDataReady(false);
    }
  };

  const handleToggleItem = (category: string, itemIndex: number) => {
    setPackingItems((prev: any) => {
      if (!prev?.categories?.[category]) {
        console.error("Category not found:", category);
        return prev;
      }
      
      const newItems = JSON.parse(JSON.stringify(prev));
      const item = newItems.categories[category][itemIndex];
      
      if (!item) {
        console.error("Item not found:", category, itemIndex);
        return prev;
      }
      
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

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 -z-10" />
      <Background />
      
      <Header />
      
      {packingItems && (
        <StickyProgress totalItems={getTotalItems()} packedItems={packedCount} />
      )}
      
      {isGenerating && <GenerationAnimation onComplete={dataReady} />}
      
      {/* Main content - no top padding so hero goes full height */}
      <div className="min-h-screen">
        {!packingItems ? (
          <>
            <Hero />
            <div className="section-padding pb-20">
              <main className="max-w-4xl mx-auto">
                <ChatInterface
                  onGenerateList={handleGenerateList}
                  isGenerating={isGenerating}
                />
              </main>
            </div>
          </>
        ) : (
          <div className="section-padding pt-24">
            <main className="max-w-7xl mx-auto">
              <PackingList
                packingItems={packingItems}
                onToggleItem={handleToggleItem}
                onShopItem={(itemName) => setSelectedItem(itemName)}
              />
            </main>
          </div>
        )}

        <EmailCapture />
        <Footer />
      </div>

      {selectedItem && (
        <AmazonShopping
          itemName={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}
