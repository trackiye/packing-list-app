// app/page.tsx - COMPACT MOBILE-OPTIMIZED VERSION WITH SMOOTH TRANSITIONS
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
  Waves,
  X,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import AffiliateSuggestionModal from "@/components/AffiliateSuggestionModal";
import {
  getProductSuggestions,
  PackingItemData,
  ASSOCIATE_ID,
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
  const resultsRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [packingItems, setPackingItems] = useState<PackingItem[] | null>(null);
  const [groupByCategory, setGroupByCategory] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

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

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (timeout) return;

      timeout = setTimeout(() => {
        const scrolled = window.scrollY;
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxScroll) * 100;

        setScrollY(scrolled);
        setScrollProgress(progress);

        timeout = null;
      }, 16);
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
    setIsTyping(false);
    const initialMessage: ConversationMessage = {
      role: "assistant",
      content:
        "Where are you headed? I need a destination to begin crafting your elite list.",
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

        // Close modal first with slight delay
        setTimeout(() => {
          setConversationMode(false);
        }, 300);

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

          // Smooth scroll to results
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 200);
        }, 1000);
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
      setIsTyping(false);
    }
  };

  const toggleItemChecked = (index: number) => {
    if (!packingItems) return;
    const updated = [...packingItems];
    updated[index].checked = !updated[index].checked;
    setPackingItems(updated);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
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
      return <FileText className="w-5 h-5" />;
    if (cat.includes("beach") || cat.includes("water"))
      return <Waves className="w-5 h-5" />;
    if (
      cat.includes("cloth") ||
      cat.includes("wear") ||
      cat.includes("footwear")
    )
      return <Shirt className="w-5 h-5" />;
    if (
      cat.includes("electronic") ||
      cat.includes("tech") ||
      cat.includes("gadget")
    )
      return <Bolt className="w-5 h-5" />;
    if (cat.includes("luggage") || cat.includes("bag"))
      return <ShoppingBag className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  const handleDelete = () => {
    setPackingItems(null);
    setConversationMode(false);
    setMessages([]);
    setExpandedCategories(new Set());
  };

  const handleShopClick = (item: PackingItem) => {
    const suggestions = getProductSuggestions(item.item_name);

    if (suggestions) {
      setSelectedItemData(suggestions);
      setShowAffiliateModal(true);
      trackAffiliateClick(item.item_name, "modal_opened");
    } else {
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

      <div className="relative min-h-screen dark-gradient overflow-hidden">
        {/* Background layers */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 mesh-gradient"
            style={{
              transform: `translateY(${scrollY * 0.05}px)`,
              opacity: Math.max(0.4, 1 - scrollProgress / 300),
              willChange: "transform, opacity",
            }}
          ></div>

          <div className="absolute inset-0">
            <div
              className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
              style={{
                transform: `translate(${scrollY * 0.03}px, ${
                  scrollY * 0.05
                }px)`,
                opacity: Math.max(0.3, 1 - scrollProgress / 300),
                willChange: "transform, opacity",
              }}
            ></div>
            <div
              className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
              style={{
                transform: `translate(${scrollY * -0.03}px, ${
                  scrollY * -0.05
                }px)`,
                opacity: Math.max(0.3, 1 - scrollProgress / 300),
                willChange: "transform, opacity",
              }}
            ></div>
          </div>
        </div>

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-transparent animate-in slide-in-from-top duration-500">
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
          {/* Hero Section */}
          {!packingItems && (
            <div
              className="text-center mb-12 max-w-4xl mx-auto w-full"
              style={{
                transform: `translateY(${scrollY * -0.05}px)`,
                opacity: Math.max(0, 1 - scrollY / 800),
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

              <button
                onClick={handleStartConversation}
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
          )}

          {/* COMPACT Results Section */}
          {packingItems && packingItems.length > 0 && (
            <div
              ref={resultsRef}
              className="w-full max-w-4xl animate-in slide-in-from-bottom-8 duration-500 mb-12"
            >
              {/* Action Buttons - Compact */}
              <div className="flex justify-between items-center gap-2 mb-4 flex-wrap">
                <button
                  onClick={() => setGroupByCategory(!groupByCategory)}
                  className="px-4 py-2 text-white glass-dark hover:glass-strong rounded-xl border border-white/20 transition-all text-sm font-semibold"
                >
                  {groupByCategory ? "Show All" : "By Category"}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-white glass-dark hover:glass-strong rounded-xl border border-white/20 transition-all"
                    title="Share"
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="p-2 text-white glass-dark hover:glass-strong rounded-xl border border-white/20 transition-all"
                    title="PDF"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={handleEmailList}
                    className="p-2 text-white glass-dark hover:glass-strong rounded-xl border border-white/20 transition-all"
                    title="Email"
                  >
                    <Mail size={18} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-white glass-dark hover:bg-red-500/40 rounded-xl border border-white/20 transition-all"
                    title="Clear"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Compact Packing List */}
              <div className="glass-strong-dark rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/20 max-h-[70vh] overflow-y-auto">
                {groupByCategory ? (
                  <div className="space-y-3">
                    {Object.entries(getGroupedItems()).map(
                      ([category, items]) => {
                        const isExpanded = expandedCategories.has(category);
                        const categoryChecked = items.filter(
                          (i) => i.checked
                        ).length;

                        return (
                          <div
                            key={category}
                            className="bg-white/5 rounded-xl overflow-hidden"
                          >
                            {/* Category Header - Collapsible */}
                            <button
                              onClick={() => toggleCategory(category)}
                              className="w-full flex items-center justify-between p-4 hover:bg-white/10 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white">
                                  {getCategoryIcon(category)}
                                </div>
                                <div className="text-left">
                                  <h3 className="font-bold text-white text-lg">
                                    {category}
                                  </h3>
                                  <p className="text-xs text-white/60">
                                    {categoryChecked}/{items.length} packed
                                  </p>
                                </div>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-white/70" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-white/70" />
                              )}
                            </button>

                            {/* Category Items - Collapsible */}
                            {isExpanded && (
                              <div className="p-2 space-y-2">
                                {items.map((item) => {
                                  const globalIndex = packingItems.findIndex(
                                    (i) => i === item
                                  );
                                  return (
                                    <div
                                      key={item.item_name + globalIndex}
                                      className={`bg-white/10 rounded-lg p-3 transition-all ${
                                        item.checked
                                          ? "opacity-70 bg-green-500/20"
                                          : ""
                                      }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <button
                                          onClick={() =>
                                            toggleItemChecked(globalIndex)
                                          }
                                          className="mt-1 w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center flex-shrink-0 hover:border-white transition-all"
                                        >
                                          {item.checked && (
                                            <Check className="w-4 h-4 text-green-400" />
                                          )}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-semibold text-white text-sm mb-1">
                                            {item.item_name}
                                          </h4>
                                          <p className="text-xs text-white/70 leading-relaxed">
                                            {item.description}
                                          </p>
                                        </div>

                                        <button
                                          onClick={() => handleShopClick(item)}
                                          className="flex-shrink-0 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full hover:scale-105 transition-all"
                                        >
                                          Shop
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {packingItems.map((item, index) => (
                      <div
                        key={item.item_name + index}
                        className={`bg-white/10 rounded-lg p-3 transition-all ${
                          item.checked ? "opacity-70 bg-green-500/20" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleItemChecked(index)}
                            className="mt-1 w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center flex-shrink-0 hover:border-white transition-all"
                          >
                            {item.checked && (
                              <Check className="w-4 h-4 text-green-400" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-sm mb-1">
                              {item.item_name}
                            </h4>
                            <p className="text-xs text-white/70 leading-relaxed mb-1">
                              {item.description}
                            </p>
                            <span className="inline-block text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
                              {item.category}
                            </span>
                          </div>

                          <button
                            onClick={() => handleShopClick(item)}
                            className="flex-shrink-0 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full hover:scale-105 transition-all"
                          >
                            Shop
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick action to continue conversation */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setConversationMode(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg inline-flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Modify List with AI
                </button>
              </div>
            </div>
          )}

          {/* Testimonials - Only show when no results */}
          {!packingItems && (
            <>
              <div
                className="mt-20 w-full max-w-5xl animate-in fade-in duration-700"
                style={{
                  transform: `translateY(${Math.max(
                    0,
                    (scrollY - 800) * -0.08
                  )}px)`,
                  opacity: Math.min(1, Math.max(0, (scrollY - 400) / 300)),
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

              <div
                className="mt-20 w-full max-w-4xl animate-in fade-in duration-700"
                style={{
                  transform: `translateY(${Math.max(
                    0,
                    (scrollY - 1200) * -0.06
                  )}px)`,
                  opacity: Math.min(1, Math.max(0, (scrollY - 800) / 300)),
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
                      <h3 className="font-bold text-white text-lg mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-white/90">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
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

        {/* Modals */}
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder:text-gray-500"
                style={{ color: "#111827" }}
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
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Email Your List
                </h3>
                <p className="text-gray-600">Access it anywhere, anytime</p>
              </div>
              <input
                type="text"
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white placeholder:text-gray-500"
                style={{ color: "#111827" }}
              />
              <input
                type="email"
                placeholder="Your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white placeholder:text-gray-500"
                style={{ color: "#111827" }}
              />
              <button
                onClick={handleConfirmEmail}
                disabled={emailSending}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition-all hover:scale-105"
              >
                {emailSending ? "Sending..." : "Send to My Email"}
              </button>
            </div>
          </div>
        )}

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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 bg-white placeholder:text-gray-500"
                style={{ color: "#111827" }}
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <button
                onClick={async () => {
                  if (
                    userEmail.trim() &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)
                  ) {
                    try {
                      const response = await fetch("/api/send-guide", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: userEmail }),
                      });

                      if (response.ok) {
                        trackEmailCapture(userEmail);
                        setEmailCaptured(true);
                        setShowEmailModal(false);
                        alert(
                          "✅ Success! Check your email for the Ultimate Packing Guide!"
                        );
                        setUserEmail("");
                      } else {
                        alert("Failed to send guide. Please try again.");
                      }
                    } catch (error) {
                      console.error("Guide send error:", error);
                      alert("Failed to send guide. Please try again.");
                    }
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

        {/* Conversation Modal - Smooth */}
        {conversationMode && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-black/50 backdrop-blur-3xl rounded-3xl shadow-3xl max-w-5xl w-full h-[85vh] flex flex-col animate-in slide-in-from-bottom-8 duration-500 border border-white/5 overflow-hidden">
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
                        msg.role === "user"
                          ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-pink-500/30"
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
                    className="flex-1 px-6 py-4 border-none rounded-2xl focus:ring-4 focus:ring-purple-400 focus:border-purple-400 disabled:opacity-50 transition-all text-lg bg-white/10 text-white/95 placeholder:text-white/60 shadow-inner shadow-black/30"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isTyping || !userInput.trim()}
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
