// app/page.tsx - ELITE WORLD-CLASS VERSION (Denser Card Layout)
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Share2,
  Check,
  FileText,
  Star,
  Zap,
  Send,
  Mail,
  Download,
  Loader2,
  MapPin,
  Shirt,
  Zap as Bolt,
  ShoppingBag,
  Camera,
  Battery,
  Headphones,
  Plug,
  Sun,
  Waves,
  X,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Sparkles, // Using Sparkles for the AI
  ArrowRight,
  Globe, // New Icon for general trip
} from "lucide-react";
import AffiliateSuggestionModal from "@/components/AffiliateSuggestionModal";
import {
  getProductSuggestions,
  PackingItemData,
  ASSOCIATE_ID, // Your affiliate ID is imported here
} from "@/data/affiliateProducts";
import {
  Analytics,
  trackListGeneration,
  trackPDFDownload,
  trackEmailCapture,
  trackShareClick,
  trackAffiliateClick,
} from "@/components/Analytics";

interface PackingItem {
  item_name: string;
  description: string;
  category: string;
  checked?: boolean;
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

export default function PackmindAI() {
  const [conversationMode, setConversationMode] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [packingItems, setPackingItems] = useState<PackingItem[] | null>(null);
  const [groupByCategory, setGroupByCategory] = useState(true);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [liveCounter, setLiveCounter] = useState(12487);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [selectedItemData, setSelectedItemData] =
    useState<PackingItemData | null>(null);

  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showEmailListModal, setShowEmailListModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [shareLink, setShareLink] = useState("");

  // Elite parallax with sophisticated depth - NOW WITH THROTTLING
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (timeout) return; // Ignore scroll events if a timeout is already pending

      timeout = setTimeout(() => {
        const scrolled = window.scrollY;
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxScroll) * 100;

        // Only update state if necessary to avoid re-renders
        setScrollY(scrolled);
        setScrollProgress(progress);

        timeout = null; // Reset the timeout
      }, 16); // Throttle to roughly 60 FPS (16ms)
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter((prev) => prev + Math.floor(Math.random() * 3));
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartConversation = () => {
    setConversationMode(true);
    // FIX: Explicitly set isTyping to false when conversation starts
    setIsTyping(false);
    const initialMessage: ConversationMessage = {
      role: "assistant",
      // REMOVED EMOJI - Using descriptive text
      content: "Where are you headed? I need a destination to begin crafting your elite list.", 
      suggestions: [
        "Beach vacation in Bali",
        "Business trip to NYC",
        "Backpacking Europe",
        "Weekend camping trip",
      ],
    };
    setMessages([initialMessage]);
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || userInput.trim();
    if (!textToSend || isTyping) return;

    const userMessage: ConversationMessage = {
      role: "user",
      content: textToSend,
    };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsTyping(true);

    const history = messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");
    const fullContext = `${history}\nUser: ${textToSend}`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: fullContext,
          packingItems: packingItems,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage: ConversationMessage = {
        role: "assistant",
        content: data.message,
        suggestions: data.suggestions || [],
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (data.packingList && data.packingList.length > 0) {
        setIsGenerating(true);

        setTimeout(() => {
          const itemsWithChecked = data.packingList.map(
            (item: PackingItem) => ({
              ...item,
              checked: false,
            })
          );
          setPackingItems(itemsWithChecked);
          setIsGenerating(false);

          trackListGeneration(textToSend, data.packingList.length);

          setTimeout(() => {
            const resultsSection = document.getElementById("results-section");
            if (resultsSection) {
              resultsSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
              setTimeout(() => {
                setConversationMode(false);
              }, 800);
            }
          }, 500);
        }, 1500);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ConversationMessage = {
        role: "assistant",
        content: "Hmm, something went wrong. Let's try that again!",
        suggestions: ["Restart conversation"],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // CRITICAL: Ensure typing is disabled after the API call finishes (success or failure)
      setIsTyping(false);
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
    const checked = packingItems.filter((item) => item.checked).length;
    return Math.round((checked / packingItems.length) * 100);
  };

  const getGroupedItems = () => {
    if (!packingItems) return {};
    const grouped: Record<string, PackingItem[]> = {};
    packingItems.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    return grouped;
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("document") || cat.includes("security"))
      return <FileText className="w-6 h-6" />;
    if (cat.includes("beach") || cat.includes("water"))
      return <Waves className="w-6 h-6" />;
    if (
      cat.includes("cloth") ||
      cat.includes("wear") ||
      cat.includes("footwear")
    )
      return <Shirt className="w-6 h-6" />;
    if (
      cat.includes("electronic") ||
      cat.includes("tech") ||
      cat.includes("gadget")
    )
      return <Bolt className="w-6 h-6" />;
    if (cat.includes("luggage") || cat.includes("bag"))
      return <ShoppingBag className="w-6 h-6" />;
    return <MapPin className="w-6 h-6" />;
  };

  const getItemIcon = (itemName: string) => {
    const name = itemName.toLowerCase();
    if (name.includes("passport") || name.includes("document"))
      return <FileText className="w-16 h-16 text-purple-600" />;
    if (name.includes("sun"))
      return <Sun className="w-16 h-16 text-yellow-500" />;
    if (name.includes("swim") || name.includes("beach"))
      return <Waves className="w-16 h-16 text-blue-500" />;
    if (name.includes("adapter") || name.includes("plug"))
      return <Plug className="w-16 h-16 text-green-600" />;
    if (name.includes("phone") || name.includes("camera"))
      return <Camera className="w-16 h-16 text-gray-700" />;
    if (name.includes("charger") || name.includes("battery"))
      return <Battery className="w-16 h-16 text-orange-600" />;
    if (name.includes("headphone") || name.includes("audio"))
      return <Headphones className="w-16 h-16 text-indigo-600" />;
    if (name.includes("shirt") || name.includes("cloth"))
      return <Shirt className="w-16 h-16 text-pink-600" />;
    return <ShoppingBag className="w-16 h-16 text-gray-600" />;
  };

  const handleDelete = () => {
    setPackingItems(null);
    setConversationMode(false);
    setMessages([]);
  };

  const handleShopClick = (item: PackingItem) => {
    // A. Attempt to find a curated suggestion set (Budget/Mid/Premium tiers)
    const suggestions = getProductSuggestions(item.item_name);

    if (suggestions) {
      // B. CURATED MATCH: Open the Affiliate Modal for tier selection
      setSelectedItemData(suggestions);
      setShowAffiliateModal(true);
      trackAffiliateClick(item.item_name, "modal_opened");
    } else {
      // C. NO CURATED MATCH: Fallback to a dynamic Amazon search URL with affiliate tag
      const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(
        item.item_name
      )}&tag=${ASSOCIATE_ID}`;
      
      window.open(searchUrl, "_blank", "noopener,noreferrer");
      trackAffiliateClick(item.item_name, searchUrl);
    }
  };

  const handleDownloadPDF = () => setShowPDFModal(true);

  const handleConfirmPDF = async () => {
    if (!userName.trim() || !packingItems) {
      alert("Please enter your name");
      return;
    }
    setPdfGenerating(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: packingItems,
          userName: userName,
          tripDetails: "Your personalized packing list",
        }),
      });

      if (!response.ok) throw new Error("PDF generation failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PackMind-${userName}-${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      trackPDFDownload(packingItems.length);
      setShowPDFModal(false);
      setUserName("");
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleEmailList = () => setShowEmailListModal(true);

  const handleConfirmEmail = async () => {
    if (!userEmail.trim() || !userName.trim() || !packingItems) {
      alert("Please enter your name and email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      alert("Please enter a valid email");
      return;
    }

    setEmailSending(true);
    try {
      const saveResponse = await fetch("/api/save-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packingList: packingItems, tripContext: {} }),
      });
      const saveResult = await saveResponse.json();
      if (!saveResponse.ok) throw new Error(saveResult.error);

      const listUrl = `${
        process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
      }/list/${saveResult.listId}`;

      const emailResponse = await fetch("/api/email-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, name: userName, listUrl }),
      });

      if (!emailResponse.ok) throw new Error("Email failed");

      trackEmailCapture(userEmail);
      alert("✅ Packing list sent to your email!");
      setEmailCaptured(true);
      setShowEmailListModal(false);
      setUserEmail("");
      setUserName("");
    } catch (error) {
      console.error("Email error:", error);
      alert("Failed to send email. Make sure RESEND_API_KEY is configured.");
    } finally {
      setEmailSending(false);
    }
  };

  const handleShare = async () => {
    if (!packingItems) {
      alert("Please generate a list first");
      return;
    }

    try {
      const response = await fetch("/api/save-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packingList: packingItems, tripContext: {} }),
      });

      if (!response.ok) throw new Error("Failed to generate share link");

      const { listId } = await response.json();
      const shareUrl = `${
        process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
      }/list/${listId}`;

      setShareLink(shareUrl);
      setShowShareModal(true);
      navigator.clipboard.writeText(shareUrl);
      trackShareClick("generated");
      alert("✅ Share link copied!");
    } catch (error) {
      console.error("Share error:", error);
      alert("Failed to generate share link");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    trackShareClick("copy_link");
    alert("✅ Link copied!");
  };

  const handleTwitterShare = () => {
    trackShareClick("twitter");
    window.open(
      `https://twitter.com/intent/tweet?text=Check out my personalized packing list!&url=${encodeURIComponent(
        shareLink
      )}`,
      "_blank"
    );
  };

  const handleFacebookShare = () => {
    trackShareClick("facebook");
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareLink
      )}`,
      "_blank"
    );
  };

  return (
    <>
      <Analytics />

      {/* Main Container uses dynamic dark-gradient class */}
      <div className="relative min-h-screen dark-gradient overflow-hidden">
        
        {/* Elite Multi-Layer Parallax Background - CRITICAL FIX: Changed 'absolute' to 'fixed' */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Base gradient layer */}
          <div 
            className="absolute inset-0 mesh-gradient"
            // Use subtle parallax on fixed background (0.05)
            style={{ 
              transform: `translateY(${scrollY * 0.05}px)`, 
              opacity: Math.max(0.4, 1 - scrollProgress / 300),
              willChange: 'transform, opacity'
            }}
          ></div>
          
          {/* Floating orbs - Layer 1 (Slowest) */}
          <div className="absolute inset-0">
            <div 
              className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
              style={{ 
                transform: `translate(${scrollY * 0.03}px, ${scrollY * 0.05}px)`, // Reduced speed
                opacity: Math.max(0.3, 1 - scrollProgress / 300),
                willChange: 'transform, opacity'
              }}
            ></div>
            <div
              className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
              style={{ 
                transform: `translate(${scrollY * -0.03}px, ${scrollY * -0.05}px)`, // Reduced speed
                opacity: Math.max(0.3, 1 - scrollProgress / 300),
                willChange: 'transform, opacity'
              }}
            ></div>
          </div>
          
          {/* Floating orbs - Layer 2 (Medium speed) */}
          <div className="absolute inset-0">
            <div
              className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl"
              style={{ 
                transform: `translate(${scrollY * -0.04}px, ${scrollY * 0.08}px)`, // Reduced speed
                opacity: Math.max(0.2, 1 - scrollProgress / 300),
                willChange: 'transform, opacity'
              }}
            ></div>
            <div
              className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl"
              style={{ 
                transform: `translate(${scrollY * 0.04}px, ${scrollY * -0.07}px)`, // Reduced speed
                opacity: Math.max(0.2, 1 - scrollProgress / 300),
                willChange: 'transform, opacity'
              }}
            ></div>
          </div>

          {/* Floating orbs - Layer 3 (Fastest) */}
          <div className="absolute inset-0">
            <div
              className="absolute top-1/2 left-1/2 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl"
              style={{ 
                transform: `translate(${scrollY * -0.05}px, ${scrollY * 0.1}px)`, // Reduced speed
                opacity: Math.max(0.15, 1 - scrollProgress / 300),
                willChange: 'transform, opacity'
              }}
            ></div>
          </div>
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
              <button
                onClick={() => setShowEmailModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Get Free Packing Guide
                </h3>
                <p className="text-gray-600">Ultimate checklist + pro tips</p>
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 transition-all"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <button
                onClick={() => {
                  if (
                    userEmail.trim() &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)
                  ) {
                    trackEmailCapture(userEmail);
                    setEmailCaptured(true);
                    setShowEmailModal(false);
                    alert("Thanks! Check your email.");
                    setUserEmail("");
                  } else {
                    alert("Please enter a valid email");
                  }
                }}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105"
              >
                Send Me The Guide →
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        )}

        {/* Header - Clean Glass with No Background Color */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-transparent  animate-in slide-in-from-top duration-500">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg pulse-glow"></div>
              <span className="text-xl font-bold text-white drop-shadow-lg">
                Packmind AI
              </span>
            </div>
            {packingItems && packingItems.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm text-white/90 drop-shadow">
                  <span className="font-semibold">
                    {packingItems.filter((i) => i.checked).length}/
                    {packingItems.length} items
                  </span>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg pulse-glow">
                  {getProgress()}% Packed ✓
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="h-16"></div>

        {/* Main Content */}
        <main className="relative z-10 flex flex-col items-center justify-start p-4 pt-8 sm:pt-12">
          {/* Hero Section with Elite Parallax - REFINED MOVEMENT & FADE */}
          <div 
            className="text-center mb-12 max-w-4xl mx-auto w-full"
            style={{ 
              transform: `translateY(${scrollY * -0.05}px)`, 
              opacity: Math.max(0, 1 - scrollY / 800) 
            }}
          >
            <div className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20 text-white animate-in slide-in-from-top-4 duration-700">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>
                {liveCounter.toLocaleString()}+ travelers packed today
              </span>
            </div>

            <h1 
              className="text-5xl sm:text-7xl font-extrabold mb-6 text-white drop-shadow-2xl leading-tight animate-in slide-in-from-bottom-8 duration-700 delay-100"
              style={{ 
                transform: `translateY(${scrollY * -0.03}px)`,
              }}
            >
              Pack Perfect.
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                Travel Stress-Free.
              </span>
            </h1>

            <p 
              className="text-xl sm:text-2xl text-white/95 mb-8 drop-shadow-lg max-w-2xl mx-auto font-medium animate-in slide-in-from-bottom-8 duration-700 delay-200"
              style={{ 
                transform: `translateY(${scrollY * -0.02}px)`,
              }}
            >
              AI creates your{" "}
              <span className="text-purple-300 font-bold">
                perfect packing list
              </span>{" "}
              in 30 seconds.
            </p>

            <div 
              className="flex items-center justify-center gap-2 mb-10 animate-in fade-in duration-700 delay-300"
              style={{ 
                transform: `translateY(${scrollY * -0.01}px)`,
              }}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-yellow-400 text-yellow-400 drop-shadow-lg glow-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <span className="text-white font-semibold drop-shadow">
                4.9/5 from 2,341 travelers
              </span>
            </div>

            {/* Elite CTA Button - Single Icon with Glow */}
            <button
              onClick={handleStartConversation}
              // The elite-cta class uses the RESTORED, stronger glow defined in globals.css
              className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 text-2xl font-bold rounded-2xl transition-all shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 animate-in zoom-in duration-700 delay-400 elite-cta"
              style={{ 
                transform: `translateY(${scrollY * 0}px)`,
              }}
            >
              <span className="relative z-10 flex items-center gap-3 justify-center">
                <Sparkles className="w-8 h-8" />
                Start Packing with AI
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <p className="mt-6 text-white/90 text-lg font-medium flex flex-wrap items-center justify-center gap-4 animate-in fade-in duration-700 delay-500">
              <span className="glass-dark px-4 py-2 rounded-full border border-white/20">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Chat naturally
              </span>
              <span className="glass-dark px-4 py-2 rounded-full border border-white/20">
                <Zap className="w-4 h-4 inline mr-2" />
                Instant results
              </span>
              <span className="glass-dark px-4 py-2 rounded-full border border-white/20">
                <CheckCircle2 className="w-4 h-4 inline mr-2" />
                100% customized
              </span>
            </p>
          </div>

          {/* Results Section */}
          <div id="results-section" className="mt-8 w-full max-w-6xl">
            {packingItems && packingItems.length > 0 && (
              <div className="w-full animate-in slide-in-from-bottom-8 duration-500">
                {/* Action Buttons */}
                <div className="flex justify-between items-center gap-2 mb-6 max-w-4xl mx-auto flex-wrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGroupByCategory(!groupByCategory)}
                      className="px-5 py-2.5 text-white glass-dark hover:glass-strong rounded-xl border border-white/20 transition-all shadow-lg text-sm font-semibold hover:scale-105"
                    >
                      {groupByCategory ? "Show All" : "Group by Category"}
                    </button>
                  </div>

                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={handleShare}
                      title="Share list"
                      className="p-3 text-white glass-dark hover:glass-strong rounded-xl border border-white/20 transition-all shadow-lg hover:scale-110"
                    >
                      <Share2 size={20} />
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      title="Download PDF"
                      className="p-3 text-white glass-dark hover:glass-strong rounded-xl border border-white/20 transition-all shadow-lg hover:scale-110"
                    >
                      <Download size={20} />
                    </button>
                    <button
                      onClick={handleEmailList}
                      title="Email list"
                      className="p-3 text-white glass-dark hover:glass-strong rounded-xl border border-white/20 transition-all shadow-lg hover:scale-110"
                    >
                      <Mail size={20} />
                    </button>
                    <button
                      onClick={handleDelete}
                      title="Clear list"
                      className="p-3 text-white glass-dark hover:bg-red-500/40 rounded-xl border border-white/20 transition-all shadow-lg hover:scale-110"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Packing List - Grouped View (Changed grid-cols-3 to grid-cols-4 and h-56 to h-48) */}
                <div className="glass-strong-dark rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20">
                  {groupByCategory ? (
                    <div className="space-y-10">
                      {Object.entries(getGroupedItems()).map(
                        ([category, items], catIdx) => (
                          <div
                            key={category}
                            className="animate-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${catIdx * 0.1}s` }}
                          >
                            <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg hover:rotate-12 transition-transform pulse-glow text-white">
                                {getCategoryIcon(category)}
                              </div>
                              {category}
                            </h2>
                            {/* Denser Grid: sm:grid-cols-2 lg:grid-cols-4 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> 
                              {items.map((item) => {
                                const globalIndex = packingItems.findIndex(
                                  (i) => i === item
                                );
                                return (
                                  <div
                                    key={item.item_name + globalIndex}
                                    className={`group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                                      item.checked
                                        ? "ring-4 ring-green-500 opacity-90"
                                        : ""
                                    }`}
                                  >
                                    {/* Reduced Height: h-56 to h-48 */}
                                    <div className="relative h-48 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 overflow-hidden">
                                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-400/30 group-hover:scale-110 transition-transform duration-500"></div>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="transform group-hover:scale-125 transition-transform duration-300 filter drop-shadow-lg">
                                          {getItemIcon(item.item_name)}
                                        </div>
                                      </div>
                                      <button
                                        onClick={() =>
                                          toggleItemChecked(globalIndex)
                                        }
                                        className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-125 transition-all z-10 border-2 border-purple-200 pulse-glow"
                                      >
                                        {item.checked && (
                                          <Check className="w-7 h-7 text-green-600 animate-bounce" />
                                        )}
                                      </button>
                                    </div>
                                    <div className="p-4"> {/* Reduced padding: p-6 to p-4 */}
                                      <h3 className="font-bold text-lg mb-1 text-gray-900 group-hover:text-purple-600 transition-colors">
                                        {item.item_name}
                                      </h3>
                                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                                        {item.description}
                                      </p>
                                      <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <span className="inline-block text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                                          {item.category}
                                        </span>
                                        <button
                                          onClick={() => handleShopClick(item)}
                                          className="flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 rounded-full hover:shadow-lg hover:scale-110 transition-all pulse-glow"
                                        >
                                          Shop Now
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    // Packing List - Ungrouped View (Changed grid-cols-3 to grid-cols-4 and h-56 to h-48)
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"> 
                      {packingItems.map((item, index) => (
                        <div
                          key={item.item_name + index}
                          className={`group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                            item.checked
                              ? "ring-4 ring-green-500 opacity-90"
                              : ""
                          }`}
                        >
                          {/* Reduced Height: h-56 to h-48 */}
                          <div className="relative h-48 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-400/30 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="transform group-hover:scale-125 transition-transform duration-300 filter drop-shadow-lg">
                                {getItemIcon(item.item_name)}
                              </div>
                            </div>
                            <button
                              onClick={() => toggleItemChecked(index)}
                              className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-125 transition-all z-10 border-2 border-purple-200"
                            >
                              {item.checked && (
                                <Check className="w-7 h-7 text-green-600 animate-bounce" />
                              )}
                            </button>
                          </div>
                          <div className="p-4"> {/* Reduced padding: p-6 to p-4 */}
                            <h3 className="font-bold text-lg mb-1 text-gray-900 group-hover:text-purple-600 transition-colors">
                              {item.item_name}
                            </h3>
                            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="inline-block text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                                {item.category}
                              </span>
                              <button
                                onClick={() => handleShopClick(item)}
                                className="flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 rounded-full hover:shadow-lg hover:scale-110 transition-all"
                              >
                                Shop Now
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Testimonials with Parallax */}
          <div 
            className="mt-20 w-full max-w-5xl animate-in fade-in duration-700"
            style={{ 
              transform: `translateY(${Math.max(0, (scrollY - 800) * -0.08)}px)`,
              opacity: Math.min(1, Math.max(0, (scrollY - 400) / 300))
            }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 drop-shadow-lg">
              Loved by Travelers Worldwide
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Sarah M.",
                  location: "New York",
                  text: "The AI chat was so intuitive! It knew exactly what I needed for my beach trip.",
                  rating: 5,
                },
                {
                  name: "James K.",
                  location: "London",
                  text: "Quick replies made it so easy. Had my packing list in under a minute!",
                  rating: 5,
                },
                {
                  name: "Maria G.",
                  location: "Barcelona",
                  text: "Love how it adapts to my needs. Asked for 'more minimal' and it adjusted perfectly!",
                  rating: 5,
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ with Parallax */}
          <div 
            className="mt-20 w-full max-w-4xl animate-in fade-in duration-700"
            style={{ 
              transform: `translateY(${Math.max(0, (scrollY - 1200) * -0.06)}px)`,
              opacity: Math.min(1, Math.max(0, (scrollY - 800) / 300))
            }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 drop-shadow-lg">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How does the AI chat work?",
                  a: "Just chat naturally about your trip! Tell us where you're going, what you'll do, and how long you'll be there. Our AI asks clarifying questions and creates a personalized packing list based on your conversation.",
                },
                {
                  q: "Is Packmind AI really free?",
                  a: "Yes! 100% free, no credit card required, no hidden fees. We make money through affiliate commissions when you shop for recommended items.",
                },
                {
                  q: "Can I modify my list after it's generated?",
                  a: "Absolutely! Just keep chatting. Say things like 'add more warm clothes' or 'make it more minimal' and the AI will adjust your list accordingly.",
                },
                {
                  q: "What about the 'Shop Now' buttons?",
                  a: "We've curated high-quality product recommendations in Budget, Mid-Range, and Premium tiers. Click 'Shop Now' to see options that fit your budget. We earn a small commission if you purchase (at no extra cost to you).",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="glass-dark hover:glass-strong rounded-xl p-6 border border-white/20 transition-all hover:scale-102 animate-in slide-in-from-left-4"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <h3 className="font-bold text-white text-lg mb-2">{faq.q}</h3>
                  <p className="text-white/90">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 mt-24 pb-12 animate-in fade-in duration-700">
          <div className="max-w-4xl mx-auto px-4">
            <div className="glass-strong-dark rounded-2xl p-10 border-2 border-white/20 shadow-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-lg text-center">
                {emailCaptured
                  ? "You're All Set!"
                  : "Never Forget Essentials Again"}
              </h2>
              <p className="text-white/95 mb-6 text-lg text-center max-w-2xl mx-auto">
                {emailCaptured
                  ? "Share Packmind AI with your travel buddies so they never forget essentials!"
                  : "Join 12,000+ smart travelers. Get our Ultimate Packing Guide + exclusive tips (Worth $29 - FREE today!)"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {emailCaptured ? (
                  <>
                    <button
                      onClick={handleShare}
                      className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                      Share With Friends
                    </button>
                    <button
                      onClick={handleStartConversation}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl hover:scale-105"
                    >
                      Create Another List
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 mx-auto pulse-glow"
                  >
                    <Zap className="w-6 h-6" />
                    Get My Free Packing Guide
                  </button>
                )}
              </div>
            </div>

            <div className="mt-10 text-center text-white/80 text-sm space-y-3">
              <p className="font-medium text-lg">
                © 2025 Packmind AI. Made with care for travelers.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <a
                  href="/privacy"
                  className="hover:text-white transition-colors hover:scale-110"
                >
                  Privacy Policy
                </a>
                <span>•</span>
                <a
                  href="/terms"
                  className="hover:text-white transition-colors hover:scale-110"
                >
                  Terms of Service
                </a>
                <span>•</span>
                <a
                  href="/contact"
                  className="hover:text-white transition-colors hover:scale-110"
                >
                  Contact Us
                </a>
              </div>
              <p className="text-xs text-white/60 mt-4">
                As an Amazon Associate, we earn from qualifying purchases at no
                extra cost to you.
              </p>
            </div>
          </div>
        </footer>

        {/* ============================================ */}
        {/* MODALS - All Code Restored */}
        {/* ============================================ */}
        <AffiliateSuggestionModal
          isOpen={showAffiliateModal}
          onClose={() => {
            setShowAffiliateModal(false);
            setSelectedItemData(null);
          }}
          itemData={selectedItemData}
        />

        {showPDFModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
              <button
                onClick={() => setShowPDFModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Download PDF
                </h3>
                <p className="text-gray-600">
                  Beautiful printable packing list
                </p>
              </div>
              <input
                type="text"
                placeholder="Your name (for PDF header)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleConfirmPDF}
                disabled={pdfGenerating}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all hover:scale-105"
              >
                {pdfGenerating ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>
        )}

        {showEmailListModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
              <button
                onClick={() => setShowEmailListModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Email Your List
                </h3>
                <p className="text-gray-600">Access anywhere, anytime</p>
              </div>
              <input
                type="text"
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                placeholder="Your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleConfirmEmail}
                disabled={emailSending}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-all hover:scale-105"
              >
                {emailSending ? "Sending..." : "Send to Email"}
              </button>
            </div>
          </div>
        )}

        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Share Your List
                </h3>
                <p className="text-gray-600">
                  Send to friends or save for later
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4 break-all text-sm text-gray-700 border">
                {shareLink}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105"
                >
                  Copy
                </button>
                <button
                  onClick={handleTwitterShare}
                  className="px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all hover:scale-110"
                >
                  Twitter
                </button>
                <button
                  onClick={handleFacebookShare}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-110"
                >
                  Facebook
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Elite Conversation Modal - RE-ENGINEERED FOR MINIMALISM */}
        {conversationMode && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Modal Container: Minimalist Glass Frame */}
            <div className="bg-black/50 backdrop-blur-3xl rounded-3xl shadow-3xl max-w-5xl w-full h-[85vh] flex flex-col animate-in slide-in-from-bottom-8 duration-500 border border-white/5 overflow-hidden">
              
              {/* Elite Header - NO BORDER/BACKGROUND */}
              <div className="relative p-6 bg-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg pulse-glow">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        AI Packing Strategist
                      </h2>
                      <p className="text-sm text-white/70 flex items-center gap-2">
                        {/* ICON for Status/Live */}
                        <Globe className="w-3 h-3" />
                        Online & ready to craft your list
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setConversationMode(false)}
                    className="text-white/50 hover:text-white transition-all hover:scale-110 p-2 rounded-xl"
                  >
                    <X size={28} />
                  </button>
                </div>
              </div>

              {/* Chat Messages Area - Clean, Subtle Background */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-white/5">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    } animate-in slide-in-from-bottom-2 duration-300`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-3 flex-shrink-0 shadow-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-3xl px-6 py-4 transition-all ${
                        // USER BUBBLE (Gradient)
                        msg.role === "user"
                          ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-pink-500/30"
                          // AI BUBBLE (Clean Transparent Black)
                          : "bg-white/10 text-white/95 shadow-lg shadow-black/30"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                      {msg.role === "assistant" &&
                        msg.suggestions &&
                        msg.suggestions.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {msg.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(suggestion)}
                                disabled={isTyping}
                                // SUGGESTION BUTTONS (Minimalist Glass Dark) - Added Sparkles icon
                                className="group px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium text-white/90 border border-white/5 transition-all disabled:opacity-50 hover:scale-[1.03] shadow-md flex items-center gap-2"
                              >
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                {suggestion}
                                <ArrowRight className="w-3 h-3 text-purple-400 group-hover:translate-x-1 transition-transform" />
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center ml-3 flex-shrink-0 shadow-lg text-white font-bold text-lg">
                        U
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start animate-in fade-in duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-3 flex-shrink-0 shadow-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    {/* TYPING INDICATOR (Cleaner, Lighter) */}
                    <div className="bg-white/10 rounded-3xl px-6 py-4 shadow-md">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.15s" }}
                        ></div>
                        <div
                          className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.3s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <div className="flex justify-center animate-in fade-in duration-300 my-8">
                    <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 shadow-xl max-w-md w-full border border-white/10">
                      <div className="text-center">
                        <Loader2 className="w-14 h-14 text-purple-400 animate-spin mx-auto mb-4" />
                        <p className="font-bold text-white text-xl mb-3">
                          Crafting your personalized list...
                        </p>
                        <div className="space-y-2 text-sm text-white/80">
                          <p className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            Analyzing your elite trip details
                          </p>
                          <p className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                            Optimizing for maximum efficiency
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Elite Input Area - MINIMALIST AND CLEAN */}
              <div className="p-6 bg-black/40 backdrop-blur-lg border-t border-white/10">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Describe your trip..."
                    disabled={isTyping}
                    // INPUT FIELD (Clean, minimal, transparent look)
                    className="flex-1 px-6 py-4 border-none rounded-2xl focus:ring-4 focus:ring-purple-400 focus:border-purple-400 disabled:opacity-50 transition-all text-lg bg-white/10 text-white/95 placeholder:text-white/60 shadow-inner shadow-black/30"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isTyping || !userInput.trim()}
                    // The elite-cta class uses the RESTORED, stronger glow defined in globals.css
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 elite-cta"
                  >
                    <Send size={22} />
                    Send
                  </button>
                </div>
                <p className="text-xs text-white/70 text-center mt-3">
                  Press Enter to send • Be specific for best results
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}