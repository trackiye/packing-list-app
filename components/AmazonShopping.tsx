"use client";
import { ShoppingBag, ExternalLink, DollarSign, Star, Crown } from "lucide-react";

interface AmazonShoppingProps {
  itemName: string;
  onClose: () => void;
}

const AMAZON_TAG = "packmindai-20";

export default function AmazonShopping({ itemName, onClose }: AmazonShoppingProps) {
  const tiers = [
    {
      title: "Budget Friendly",
      desc: "Under $50",
      icon: DollarSign,
      color: "from-green-600 to-emerald-600",
      search: `${itemName} budget affordable`,
    },
    {
      title: "Mid-Range",
      desc: "$50 - $150",
      icon: Star,
      color: "from-blue-600 to-indigo-600",
      search: itemName,
    },
    {
      title: "Premium",
      desc: "$150+",
      icon: Crown,
      color: "from-purple-600 to-pink-600",
      search: `${itemName} premium best`,
    },
  ];

  const handleShop = (searchQuery: string) => {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}&tag=${AMAZON_TAG}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-strong rounded-2xl p-6 max-w-2xl w-full animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Shop: {itemName}</h3>
              <p className="text-white/60 text-sm">Choose your budget tier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-3xl leading-none hover:rotate-90 transition-transform"
          >
            ×
          </button>
        </div>
        
        <div className="grid gap-4">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <button
                key={tier.title}
                onClick={() => handleShop(tier.search)}
                className="glass-medium p-5 rounded-xl hover:bg-white/15 text-left flex items-center justify-between group transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-gradient-to-br ${tier.color} rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">{tier.title}</h4>
                    <p className="text-white/60 text-sm">{tier.desc}</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-purple-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            );
          })}
        </div>
        
        <p className="text-white/40 text-xs text-center mt-6">
          As an Amazon Associate, we earn from qualifying purchases
        </p>
      </div>
    </div>
  );
}
