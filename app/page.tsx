"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ChatInterface from "@/components/Conversation/ChatInterface";
import PackingList from "@/components/PackingList";
import AmazonShopping from "@/components/AmazonShopping";
import StickyProgress from "@/components/StickyProgress";
import EmailCapture from "@/components/EmailCapture";
import Footer from "@/components/Footer";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [packingItems, setPackingItems] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [packedCount, setPackedCount] = useState(0);

  const handleGenerateList = async (message: string, context?: any) => {
    if (!session) {
      router.push("/api/auth/signin");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message,
          context: {
            trip: context?.initialTrip || message,
            accommodation: context?.accommodation,
            season: context?.season,
          }
        }),
      });

      const data = await response.json();
      setPackingItems(data);
      setPackedCount(0);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleItem = (category: string, itemIndex: number) => {
    setPackingItems((prev: any) => {
      const newItems = { ...prev };
      const item = newItems.categories[category][itemIndex];
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
    if (!packingItems) return 0;
    let total = 0;
    Object.values(packingItems.categories).forEach((items: any) => {
      total += items.length;
    });
    return total;
  };

  return (
    <>
      <Header />
      
      {packingItems && (
        <StickyProgress totalItems={getTotalItems()} packedItems={packedCount} />
      )}
      
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900" />
        <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        {!packingItems ? (
          <>
            <Hero />
            <div className="relative z-10 section-padding pb-20">
              <main className="max-w-4xl mx-auto">
                <ChatInterface
                  onGenerateList={handleGenerateList}
                  isGenerating={isGenerating}
                />
              </main>
            </div>
          </>
        ) : (
          <div className="relative z-10 section-padding pt-24">
            <main className="max-w-7xl mx-auto">
              <PackingList
                packingItems={packingItems}
                onToggleItem={handleToggleItem}
                onShopItem={(itemName) => setSelectedItem(itemName)}
              />
            </main>
          </div>
        )}

        <div className="relative z-10">
          <EmailCapture />
          <Footer />
        </div>
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
