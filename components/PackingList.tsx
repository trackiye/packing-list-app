"use client";
import { useState } from "react";
import { Check, ShoppingBag, Download, Mail, Save, Share2 } from "lucide-react";
import { useSession } from "next-auth/react";
import UpgradeModal from "./UpgradeModal";

interface PackingListProps {
  packingItems: any;
  onToggleItem: (category: string, itemIndex: number) => void;
  onShopItem: (itemName: string) => void;
}

export default function PackingList({ packingItems, onToggleItem, onShopItem }: PackingListProps) {
  const { data: session } = useSession();
  const [showUpgrade, setShowUpgrade] = useState<string | null>(null);
  const userTier = "free";

  const handlePremiumFeature = (feature: string) => {
    if (userTier === "free") {
      setShowUpgrade(feature);
    } else {
      console.log(`Using ${feature}`);
    }
  };

  if (!packingItems?.categories) return null;

  return (
    <>
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">Your Packing List</h2>
          <p className="text-white/70">{packingItems.tripSummary || "Everything you need for your trip"}</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={() => handlePremiumFeature("Save List")}
            className="flex items-center gap-2 px-4 py-2 glass-medium hover:bg-white/15 text-white rounded-lg transition-all"
          >
            <Save className="w-4 h-4" />
            Save List
          </button>
          <button
            onClick={() => handlePremiumFeature("Download PDF")}
            className="flex items-center gap-2 px-4 py-2 glass-medium hover:bg-white/15 text-white rounded-lg transition-all"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={() => handlePremiumFeature("Email List")}
            className="flex items-center gap-2 px-4 py-2 glass-medium hover:bg-white/15 text-white rounded-lg transition-all"
          >
            <Mail className="w-4 h-4" />
            Email List
          </button>
          <button
            onClick={() => handlePremiumFeature("Share List")}
            className="flex items-center gap-2 px-4 py-2 glass-medium hover:bg-white/15 text-white rounded-lg transition-all"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {Object.entries(packingItems.categories).map(([category, items]: [string, any]) => (
          <div key={category} className="glass-medium rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4 capitalize">{category}</h3>
            <div className="space-y-3">
              {items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => onToggleItem(category, idx)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        item.packed
                          ? "bg-green-500 border-green-500"
                          : "border-white/30 hover:border-white/50"
                      }`}
                    >
                      {item.packed && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <div className="flex-1">
                      <div className={`text-white font-medium ${item.packed ? "line-through opacity-50" : ""}`}>
                        {item.name}
                      </div>
                      {item.note && (
                        <div className="text-white/50 text-sm mt-1">{item.note}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onShopItem(item.name)}
                    className="ml-4 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-lg flex items-center gap-2 transition-all text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Shop
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showUpgrade && (
        <UpgradeModal
          feature={showUpgrade}
          onClose={() => setShowUpgrade(null)}
        />
      )}
    </>
  );
}
