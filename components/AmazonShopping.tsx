"use client";
import { ShoppingBag, ExternalLink } from "lucide-react";

interface AmazonShoppingProps {
  itemName: string;
  onClose: () => void;
}

const AMAZON_TAG = "packmindai-20";

export default function AmazonShopping({ itemName, onClose }: AmazonShoppingProps) {
  const options = [
    { title: "Budget", desc: "Under $50", icon: "💰", url: `https://www.amazon.com/s?k=${encodeURIComponent(itemName + " budget")}&tag=${AMAZON_TAG}` },
    { title: "Mid-Range", desc: "$50-150", icon: "⭐", url: `https://www.amazon.com/s?k=${encodeURIComponent(itemName)}&tag=${AMAZON_TAG}` },
    { title: "Premium", desc: "$150+", icon: "👑", url: `https://www.amazon.com/s?k=${encodeURIComponent(itemName + " premium")}&tag=${AMAZON_TAG}` }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="glass-strong rounded-2xl p-6 max-w-2xl w-full">
        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">Shop: {itemName}</h3>
          </div>
          <button onClick={onClose} className="text-white text-2xl">×</button>
        </div>
        <div className="grid gap-4">
          {options.map((opt) => (
            <button
              key={opt.title}
              onClick={() => { window.open(opt.url, '_blank'); onClose(); }}
              className="glass-medium p-4 rounded-xl hover:bg-white/15 text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{opt.icon}</div>
                <div>
                  <h4 className="text-white font-semibold">{opt.title}</h4>
                  <p className="text-white/60 text-sm">{opt.desc}</p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
        <p className="text-white/50 text-xs text-center mt-4">
          As an Amazon Associate, we earn from qualifying purchases
        </p>
      </div>
    </div>
  );
}
