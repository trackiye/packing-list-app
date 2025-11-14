"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ChatInterface from "@/components/Conversation/ChatInterface";
import TestimonialsFAQ from "@/components/TestimonialsFAQ";
import PaywallModal from "@/components/PaywallModal";
import BeautifulFooter from "@/components/BeautifulFooter";
import Header from "@/components/Header";
import { Analytics } from "@/components/Analytics";
import { Loader2, Download, Share2, CheckCircle, Circle, ShoppingBag, Save, Crown } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface PackingItem {
  name: string;
  category: string;
  checked?: boolean;
}

const FREE_LIMIT = 3;

export default function Home() {
  const { data: session } = useSession();
  const [packingItems, setPackingItems] = useState<PackingItem[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tripContext, setTripContext] = useState("");
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Free");

  useEffect(() => {
    if (!session) {
      const stored = localStorage.getItem("usage_count");
      setUsageCount(stored ? parseInt(stored) : 0);
    }
    const plan = localStorage.getItem("user_plan") || "Free";
    setCurrentPlan(plan);
  }, [session]);

  const handleGenerateList = async (userMessage: string) => {
    if (!session && usageCount >= FREE_LIMIT) {
      setShowPaywall(true);
      return;
    }

    setIsGenerating(true);
    setTripContext(userMessage);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: userMessage }] }),
      });

      if (!response.ok) throw new Error("Failed");

      const data = await response.json();
      const items = parsePackingList(data.message);
      
      setPackingItems(items);
      toast.success("✨ Your list is ready!");

      if (!session) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem("usage_count", newCount.toString());
        
        if (newCount >= FREE_LIMIT) {
          setTimeout(() => setShowPaywall(true), 2000);
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setPackingItems([
        { name: "Passport", category: "Documents" },
        { name: "Phone charger", category: "Electronics" },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const parsePackingList = (text: string): PackingItem[] => {
    const lines = text.split("\n").filter(l => l.trim());
    const items: PackingItem[] = [];
    let category = "Essentials";

    for (const line of lines) {
      if (line.includes("**") || line.includes("##")) {
        category = line.replace(/[*#]/g, "").trim();
      } else if (line.match(/^[-*]\s/)) {
        const name = line.replace(/^[-*]\s/, "").trim();
        if (name) items.push({ name, category, checked: false });
      }
    }
    return items.length ? items : [{ name: text, category: "Essentials", checked: false }];
  };

  const toggleItem = (idx: number) => {
    if (!packingItems) return;
    const updated = [...packingItems];
    updated[idx].checked = !updated[idx].checked;
    setPackingItems(updated);
  };

  const handleSaveList = () => {
    if (!session) {
      toast.error("Sign in to save lists!");
      return;
    }

    if (!packingItems) return;

    const savedLists = JSON.parse(localStorage.getItem("saved_lists") || "[]");
    const packedCount = packingItems.filter(item => item.checked).length;
    
    const newList = {
      id: Date.now().toString(),
      title: tripContext.substring(0, 50) || "My Packing List",
      items: packingItems.length,
      packed: packedCount,
      createdAt: new Date().toISOString(),
      data: packingItems,
    };

    savedLists.push(newList);
    localStorage.setItem("saved_lists", JSON.stringify(savedLists));
    toast.success("✅ List saved!");
  };

  const handleDownload = () => {
    if (currentPlan === "Free") {
      toast.error("PDF export is a Pro feature!");
      setTimeout(() => window.location.href = "/pricing", 1500);
      return;
    }
    toast.success("Downloading PDF...");
  };

  const handleShare = () => {
    if (currentPlan === "Free") {
      toast.error("Sharing is a Pro feature!");
      setTimeout(() => window.location.href = "/pricing", 1500);
      return;
    }
    toast.success("Share link copied!");
  };

  const grouped = packingItems?.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PackingItem[]>);

  const packedCount = packingItems?.filter(item => item.checked).length || 0;
  const totalCount = packingItems?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-main">
      <div className="floating-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Analytics />
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} count={usageCount} />
      <Header />

      <div className="h-14" />

      {/* Hero section */}
      {!packingItems && (
        <div className="hero-section">
          <main className="relative z-10 section-padding">
            <div className="text-center mb-16 max-w-4xl mx-auto animate-fadeIn">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Pack <span className="gradient-text">Smart</span>, Travel <span className="gradient-text">Light</span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-4">
                AI creates your perfect packing list in 30 seconds
              </p>
              <p className="text-lg text-white/70 mb-8">
                No more forgotten chargers. No more overpacking. Just smart, personalized lists.
              </p>
              {!session && (
                <p className="text-white/50 text-sm">
                  Start free: {usageCount}/{FREE_LIMIT} generations today • <Link href="/pricing" className="text-purple-300 hover:text-purple-200 underline">See plans</Link>
                </p>
              )}
            </div>

            <div className="max-w-4xl mx-auto">
              <ChatInterface onGenerateList={handleGenerateList} isGenerating={isGenerating} />
            </div>
          </main>
        </div>
      )}

      {/* Content section */}
      <div className="content-section">
        <main className="relative z-10 section-padding">
          {packingItems && (
            <div className="max-w-4xl mx-auto">
              <ChatInterface onGenerateList={handleGenerateList} isGenerating={isGenerating} />
            </div>
          )}

          {isGenerating && (
            <div className="mt-12 max-w-4xl mx-auto card p-8 animate-fadeIn hover-lift">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span className="text-white text-lg">Creating your <span className="gradient-text">perfect</span> list...</span>
              </div>
              <div className="space-y-3">
                {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />)}
              </div>
            </div>
          )}

          {packingItems && !isGenerating && (
            <div className="mt-12 max-w-4xl mx-auto card p-6 sm:p-8 shadow-glow-purple animate-fadeIn hover-lift">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Your <span className="gradient-text">Packing List</span>
                </h2>
                <div className="flex gap-2">
                  <button onClick={handleSaveList} className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 hover-lift">
                    <Save className="w-3.5 h-3.5" />
                    Save
                  </button>
                  <button onClick={handleShare} className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 relative hover-lift">
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                    {currentPlan === "Free" && <Crown className="w-2.5 h-2.5 text-yellow-400 absolute -top-1 -right-1" />}
                  </button>
                  <button onClick={handleDownload} className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 relative hover-lift">
                    <Download className="w-3.5 h-3.5" />
                    PDF
                    {currentPlan === "Free" && <Crown className="w-2.5 h-2.5 text-yellow-400 absolute -top-1 -right-1" />}
                  </button>
                </div>
              </div>

              <p className="text-white/70 mb-4 text-sm">
                For: <span className="text-white font-medium">{tripContext}</span>
              </p>

              <div className="mb-6 bg-white/5 rounded-xl p-4 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm">Packing Progress</span>
                  <span className="text-white text-lg font-bold gradient-text">{progressPercent}%</span>
                </div>
                <div className="progress-bar mb-2">
                  <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="text-white/60 text-xs">
                  {packedCount} of {totalCount} items packed
                </p>
              </div>

              <div className="space-y-6">
                {grouped && Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat}>
                    <h3 className="text-base font-semibold text-white mb-3">
                      {cat} <span className="text-white/50 text-sm">({items.length})</span>
                    </h3>
                    <ul className="space-y-2">
                      {items.map((item, idx) => {
                        const globalIdx = packingItems.indexOf(item);
                        return (
                          <li key={globalIdx} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group hover-lift">
                            <button onClick={() => toggleItem(globalIdx)} className="flex-shrink-0 transition-transform hover:scale-110">
                              {item.checked ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <Circle className="w-5 h-5 text-white/30 group-hover:text-white/50" />
                              )}
                            </button>
                            <span className={`flex-1 text-white/90 text-sm transition-all ${item.checked ? "line-through opacity-60" : ""}`}>
                              {item.name}
                            </span>
                            <button 
                              onClick={() => toast.success("Shopping coming soon!")} 
                              className="px-2.5 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-xs flex items-center gap-1 transition-all hover:scale-105 opacity-0 group-hover:opacity-100 shadow-soft"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Shop</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!packingItems && <TestimonialsFAQ />}
        </main>
      </div>

      <BeautifulFooter />
    </div>
  );
}
