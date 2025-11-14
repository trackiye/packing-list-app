"use client";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface StickyProgressProps {
  totalItems: number;
  packedItems: number;
}

export default function StickyProgress({ totalItems, packedItems }: StickyProgressProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const percentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <div className="text-white">
                <span className="font-semibold">{packedItems}</span>
                <span className="text-white/70"> / {totalItems} items packed</span>
              </div>
            </div>
            <div className="text-white font-semibold">
              {percentage}%
            </div>
          </div>
          <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
