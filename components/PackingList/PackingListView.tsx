// components/PackingList/PackingListView.tsx
"use client";

import React, { memo, useCallback, useMemo } from "react";
import {
  Trash2,
  Share2,
  Mail,
  Download,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  MapPin,
  Waves,
  Shirt,
  Bolt,
  ShoppingBag,
  FileText,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import PackingItem from "./PackingItem";

interface PackingItemType {
  item_name: string;
  description: string;
  category: string;
  checked: boolean;
}

interface PackingListViewProps {
  handleShare: () => void;
  handleDownloadPDF: () => void;
  handleEmailList: () => void;
  handleDelete: () => void;
  handleShopClick: (item: PackingItemType) => void;
  resultsRef: React.RefObject<HTMLDivElement | null>;
  progress?: number;
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("document") || cat.includes("security"))
    return <FileText className="w-5 h-5" />;
  if (cat.includes("beach") || cat.includes("water"))
    return <Waves className="w-5 h-5" />;
  if (cat.includes("cloth") || cat.includes("wear"))
    return <Shirt className="w-5 h-5" />;
  if (cat.includes("electronic") || cat.includes("tech"))
    return <Bolt className="w-5 h-5" />;
  if (cat.includes("luggage") || cat.includes("bag"))
    return <ShoppingBag className="w-5 h-5" />;
  return <MapPin className="w-5 h-5" />;
};

function PackingListView({
  handleShare,
  handleDownloadPDF,
  handleEmailList,
  handleDelete,
  handleShopClick,
  resultsRef,
  progress,
}: PackingListViewProps) {
  // HOOKS FIRST — THIS IS THE FIX
  const {
    packingItems,
    groupByCategory,
    setGroupByCategory,
    expandedCategories,
    toggleCategory,
    setConversationMode,
  } = useAppStore();

  // MEMOIZED CALCS — NOW SAFE
  const getProgress = useMemo(() => {
    if (!packingItems) return 0;
    const checked = packingItems.filter((item) => item.checked).length;
    return Math.round((checked / packingItems.length) * 100);
  }, [packingItems]);

  const getGroupedItems = useMemo(() => {
    if (!packingItems) return {};
    const grouped: Record<string, PackingItemType[]> = {};
    packingItems.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item as PackingItemType);
    });
    return grouped;
  }, [packingItems]);

  // EARLY RETURN — NOW SAFE (after hooks)
  if (!packingItems || packingItems.length === 0) return null;

  return (
    <div
      ref={resultsRef}
      className="w-full max-w-4xl mb-12 animate-fade-in"
      id="results-section"
    >
      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setGroupByCategory(!groupByCategory)}
          className="px-4 py-2.5 text-white glass-dark hover:glass-strong rounded-xl border border-white/10"
        >
          {groupByCategory ? "Show All" : "By Category"}
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 text-white glass-dark hover:glass-strong rounded-xl border border-white/10"
            title="Share"
          >
            <Share2 size={20} />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="p-2.5 text-white glass-dark hover:glass-strong rounded-xl border border-white/10"
            title="PDF"
          >
            <Download size={20} />
          </button>
          <button
            onClick={handleEmailList}
            className="p-2.5 text-white glass-dark hover:glass-strong rounded-xl border border-white/10"
            title="Email"
          >
            <Mail size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 text-white hover:bg-red-500/40 rounded-xl border border-white/10"
            title="Clear"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* List Display */}
      <div className="glass-strong-dark rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/10">
        {groupByCategory ? (
          <div className="space-y-3">
            {Object.entries(getGroupedItems).map(
              ([category, items], catIndex) => {
                const isExpanded = expandedCategories.has(category);
                const categoryChecked = items.filter((i) => i.checked).length;
                return (
                  <div
                    key={category}
                    className="bg-white/5 rounded-xl overflow-hidden scroll-reveal"
                    style={{ animationDelay: `${catIndex * 50}ms` }}
                  >
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                          {getCategoryIcon(category)}
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-white text-base sm:text-lg">
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
                    {isExpanded && (
                      <div className="p-2 space-y-2">
                        {items.map((item) => {
                          const globalIndex = packingItems.findIndex(
                            (i) => i === item
                          );
                          return (
                            <PackingItem
                              key={item.item_name + globalIndex}
                              item={item}
                              globalIndex={globalIndex}
                              handleShopClick={handleShopClick}
                            />
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
              <PackingItem
                key={item.item_name + index}
                item={item as PackingItemType}
                globalIndex={index}
                handleShopClick={handleShopClick}
              />
            ))}
          </div>
        )}
      </div>
      <div className="text-center mb-4">
        <span>{progress}% Packed</span>
      </div>
      {/* Modify List CTA */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setConversationMode(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg flex items-center gap-2 mx-auto"
        >
          <MessageSquare className="w-5 h-5" />
          Modify List with AI
        </button>
      </div>
    </div>
  );
}

export default memo(PackingListView);
