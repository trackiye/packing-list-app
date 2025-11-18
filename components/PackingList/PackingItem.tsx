"use client";

import React from "react";
import { Check, ShoppingBag } from "lucide-react";

interface PackingItemProps {
  item: {
    name: string;
    packed: boolean;
    note?: string;
  };
  category: string;
  itemIndex: number;
  onToggle: (category: string, itemIndex: number) => void;
  onShop: (itemName: string) => void;
}

export default function PackingItem({
  item,
  category,
  itemIndex,
  onToggle,
  onShop,
}: PackingItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => onToggle(category, itemIndex)}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
            item.packed
              ? "bg-green-500 border-green-500"
              : "border-white/30 hover:border-white/50"
          }`}
          aria-label={item.packed ? "Mark as unpacked" : "Mark as packed"}
        >
          {item.packed && <Check className="w-4 h-4 text-white" />}
        </button>

        <div className="flex-1">
          <div
            className={`text-white font-medium transition-all ${
              item.packed ? "line-through opacity-50" : ""
            }`}
          >
            {item.name}
          </div>
          {item.note && (
            <div className="text-white/50 text-sm mt-1">{item.note}</div>
          )}
        </div>
      </div>

      <button
        onClick={() => onShop(item.name)}
        className="ml-4 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-lg flex items-center gap-2 transition-all text-sm"
        aria-label={`Shop for ${item.name}`}
      >
        <ShoppingBag className="w-4 h-4" />
        <span className="hidden sm:inline">Shop</span>
      </button>
    </div>
  );
}
