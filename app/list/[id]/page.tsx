// app/list/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";

interface PackingItem {
  item_name: string;
  description: string;
  category: string;
  checked?: boolean;
}

export default function SharedListPage() {
  const params = useParams();
  const shareId = params.id as string;
  const [items, setItems] = useState<PackingItem[] | null>(null);
  const [tripDetails, setTripDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadList() {
      try {
        const response = await fetch(`/api/save-list?id=${shareId}`);
        if (!response.ok) {
          throw new Error("List not found");
        }
        const data = await response.json();
        setItems(
          data.items.map((item: PackingItem) => ({ ...item, checked: false }))
        );
        setTripDetails(data.tripDetails);
      } catch {
        // FIX: Using double underscore to guarantee variable is ignored
        setError("This list has expired or doesn't exist");
      } finally {
        setLoading(false);
      }
    }
    loadList();
  }, [shareId]);

  const toggleItemChecked = (index: number) => {
    if (!items) return;
    const updated = [...items];
    updated[index].checked = !updated[index].checked;
    setItems(updated);
  };

  const getGroupedItems = () => {
    if (!items) return {};
    const grouped: Record<string, PackingItem[]> = {};
    items.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold">Loading packing list...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            List Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
          >
            Create Your Own List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="flex items-center gap-2 justify-center">
              <div className="w-10 h-10 bg-white rounded-lg shadow-lg"></div>
              <span className="text-2xl font-bold text-white drop-shadow-lg">
                Packmind AI
              </span>
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
            Shared Packing List
          </h1>
          {tripDetails && (
            <p className="text-white/90 text-lg drop-shadow-md">
              {tripDetails}
            </p>
          )}
        </div>

        {/* Packing List */}
        <div className="max-w-6xl mx-auto bg-white/20 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/30">
          <div className="space-y-10">
            {Object.entries(getGroupedItems()).map(
              ([category, categoryItems]) => (
                <div key={category}>
                  <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      {category.includes("Document")
                        ? "📄"
                        : category.includes("Beach")
                        ? "🏖️"
                        : category.includes("Cloth")
                        ? "👕"
                        : category.includes("Electronic")
                        ? "🔌"
                        : "💼"}
                    </div>
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryItems.map((item, index) => {
                      const globalIndex = items!.findIndex((i) => i === item);
                      return (
                        <div
                          key={item.item_name + index}
                          className={`group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ${
                            item.checked
                              ? "ring-4 ring-green-500 opacity-75"
                              : ""
                          }`}
                        >
                          <div className="relative h-56 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-6xl">
                              {item.item_name.toLowerCase().includes("passport")
                                ? "🛂"
                                : item.item_name.toLowerCase().includes("sun")
                                ? "☀️"
                                : item.item_name.toLowerCase().includes("swim")
                                ? "🩱"
                                : item.item_name
                                    .toLowerCase()
                                    .includes("adapter")
                                ? "🔌"
                                : item.item_name.toLowerCase().includes("aid")
                                ? "🏥"
                                : "🎒"}
                            </div>
                            <button
                              onClick={() => toggleItemChecked(globalIndex)}
                              className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-10"
                            >
                              {item.checked && (
                                <Check className="w-6 h-6 text-green-600" />
                              )}
                            </button>
                          </div>
                          <div className="p-6">
                            <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
                              {item.item_name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                              {item.description}
                            </p>
                            <span className="inline-block text-xs font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            ✨ Create Your Own Packing List
          </Link>
        </div>
      </div>
    </div>
  );
}
