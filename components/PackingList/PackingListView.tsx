"use client";

import React, { useState, useRef } from "react";
import PackingItem from "./PackingItem";

interface PackingListViewProps {
  packingItems: {
    categories: {
      [key: string]: Array<{ name: string; packed: boolean; note?: string }>;
    };
  };
  onToggleItem: (category: string, itemIndex: number) => void;
  onShopItem: (itemName: string) => void;
}

export default function PackingListView({
  packingItems,
  onToggleItem,
  onShopItem,
}: PackingListViewProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(packingItems.categories))
  );

  const resultsRef = useRef<HTMLDivElement>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  if (!packingItems?.categories || Object.keys(packingItems.categories).length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 text-lg">No items in your packing list yet.</p>
      </div>
    );
  }

  return (
    <div
      ref={resultsRef}
      className="w-full max-w-4xl mb-12 animate-fade-in"
      id="results-section"
    >
      <div className="space-y-6">
        {Object.entries(packingItems.categories).map(([category, items]) => {
          const isExpanded = expandedCategories.has(category);
          const packedCount = items.filter((item) => item.packed).length;
          const totalCount = items.length;

          return (
            <div
              key={category}
              className="glass-medium rounded-2xl overflow-hidden hover-lift"
            >
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-6 py-4 flex items-center justify-between text-left bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/10 hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-white capitalize">
                    {category}
                  </h3>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/70">
                    {packedCount}/{totalCount}
                  </span>
                </div>
                <svg
                  className={`w-6 h-6 text-white transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isExpanded && (
                <div className="p-6 space-y-3">
                  {items.map((item, idx) => (
                    <PackingItem
                      key={`${category}-${idx}`}
                      item={item}
                      category={category}
                      itemIndex={idx}
                      onToggle={onToggleItem}
                      onShop={onShopItem}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
