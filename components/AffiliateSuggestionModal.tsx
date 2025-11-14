"use client";

import { X, ExternalLink, Shield, TrendingUp, Award } from "lucide-react";
import { trackAffiliateClick } from "@/components/Analytics";

interface ProductOption {
  id: string;
  name: string;
  priceEstimate: string;
  affiliateUrl: string;
  imageUrl: string;
  valueProposition: string;
}

interface PackingItemData {
  itemName: string;
  category: string;
  budgetOption: ProductOption;
  midRangeOption: ProductOption;
  premiumOption: ProductOption;
}

interface AffiliateSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemData: PackingItemData | null;
}

export default function AffiliateSuggestionModal({
  isOpen,
  onClose,
  itemData,
}: AffiliateSuggestionModalProps) {
  if (!isOpen || !itemData) return null;

  const handleLinkClick = (url: string, tier: string, name: string) => {
    trackAffiliateClick(name, url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getTierIcon = (tier: "budget" | "midrange" | "premium") => {
    switch (tier) {
      case "budget":
        return <Shield className="w-5 h-5 text-green-600" />;
      case "midrange":
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case "premium":
        return <Award className="w-5 h-5 text-purple-600" />;
    }
  };

  const getTierBadge = (tier: "budget" | "midrange" | "premium") => {
    switch (tier) {
      case "budget":
        return "bg-green-100 text-green-700 border-green-200";
      case "midrange":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "premium":
        return "bg-purple-100 text-purple-700 border-purple-200";
    }
  };

  const getTierAccent = (tier: "budget" | "midrange" | "premium") => {
    switch (tier) {
      case "budget":
        return "from-green-500 to-emerald-600";
      case "midrange":
        return "from-blue-500 to-indigo-600";
      case "premium":
        return "from-purple-500 to-pink-600";
    }
  };

  const renderProductCard = (
    option: ProductOption,
    tier: "budget" | "midrange" | "premium",
    featured: boolean = false
  ) => (
    <div
      className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
        featured ? "ring-2 ring-blue-500 scale-105 z-10" : "hover:scale-105"
      }`}
    >
      {featured && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg shadow-md z-20">
          MOST POPULAR
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {getTierIcon(tier)}
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${getTierBadge(
              tier
            )}`}
          >
            {tier.toUpperCase()}
          </span>
        </div>

        <div className="flex justify-center mb-4">
          <img
            src={option.imageUrl}
            alt={option.name}
            className="w-32 h-32 object-contain rounded-lg shadow-sm"
          />
        </div>

        <div className="text-center mb-3">
          <p className="text-sm font-semibold text-gray-600">
            {option.valueProposition}
          </p>
        </div>

        <h3 className="text-lg font-bold text-gray-900 text-center mb-2 min-h-[3rem] flex items-center justify-center">
          {option.name}
        </h3>

        <div className="text-center mb-5">
          <p className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            {option.priceEstimate}
          </p>
          <p className="text-xs text-gray-500 mt-1">Estimated Price Range</p>
        </div>

        <button
          onClick={() =>
            handleLinkClick(option.affiliateUrl, tier, option.name)
          }
          className={`w-full bg-gradient-to-r ${getTierAccent(
            tier
          )} text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group`}
        >
          <span>View on Store</span>
          <ExternalLink
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Shield size={14} />
            <span>Secure</span>
          </div>
          <div className="h-3 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <span>Fast Shipping</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 rounded-t-3xl z-30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Shop {itemData.itemName}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {itemData.category} • Curated options for every budget
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-6 lg:p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {renderProductCard(itemData.budgetOption, "budget")}
              {renderProductCard(itemData.midRangeOption, "midrange", true)}
              {renderProductCard(itemData.premiumOption, "premium")}
            </div>

            <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                ✨ Why Shop Through Packmind?
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Verified Quality
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Hand-picked by travelers
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Best Value
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Price-performance optimized
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Award className="w-6 h-6 text-pink-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Travel-Tested
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Real feedback from users
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                <strong className="text-gray-800">Transparency Notice:</strong>{" "}
                We may earn a small commission from purchases made through these
                links at no extra cost to you. This helps us keep Packmind free
                and improve our recommendations. Thank you for your support! 🙏
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
