// components/PackingList/PackingItem.tsx
"use client";

import React, { memo, useCallback } from "react";
import {
  Check,
  MapPin,
  Waves,
  Shirt,
  Bolt,
  ShoppingBag,
  FileText,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
// NOTE: Assuming cn utility is provided in lib/utils (Standard practice in Next.js/shadcn)

// Fallback cn implementation if you don't have lib/utils yet:
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

interface PackingItemProps {
  item: {
    item_name: string;
    description: string;
    category: string;
    checked: boolean;
  };
  globalIndex: number;
  handleShopClick: (item: any) => void;
}

function PackingItem({ item, globalIndex, handleShopClick }: PackingItemProps) {
  const { toggleItemChecked } = useAppStore();

  const handleCheck = useCallback(() => {
    toggleItemChecked(globalIndex);
  }, [globalIndex, toggleItemChecked]);

  // Use cn for cleaner conditional styling
  const itemClasses = cn(
    "flex items-start gap-3 transition-all",
    item.checked ? "opacity-70" : "opacity-100"
  );

  // Need to ensure the category badge logic is accessible for rendering
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

  return (
    <div
      className={`bg-white/10 rounded-lg p-3 sm:p-4 transition-all ${
        item.checked ? "bg-green-500/20" : ""
      }`}
    >
      <div className={itemClasses}>
        <button
          onClick={handleCheck}
          className="mt-0.5 w-7 h-7 rounded-full border-2 border-white/40 flex items-center justify-center flex-shrink-0 hover:border-white transition-all touch-manipulation active:scale-90"
          aria-label={`Mark ${item.item_name} as ${
            item.checked ? "unpacked" : "packed"
          }`}
        >
          {item.checked && <Check className="w-5 h-5 text-green-400" />}
        </button>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm sm:text-base mb-1">
            {item.item_name}
          </h4>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-1.5">
            {item.description}
          </p>
          <span className="inline-block text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
            {item.category}
          </span>
        </div>

        <button
          onClick={() => handleShopClick(item)}
          className="flex-shrink-0 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full hover:scale-105 transition-all touch-manipulation active:scale-95"
          aria-label={`Shop for ${item.item_name}`}
        >
          Shop
        </button>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders (Performance Optimization)
export default memo(PackingItem);
