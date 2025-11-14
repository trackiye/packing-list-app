// components/ListEditor.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PackingItem {
  item_name: string;
  description: string;
  category: string;
  checked?: boolean;
}

interface ListEditorProps {
  items: PackingItem[];
  onItemsChange: (items: PackingItem[]) => void;
}

const CATEGORIES = [
  'Clothing',
  'Toiletries',
  'Electronics',
  'Documents',
  'Footwear',
  'Accessories',
  'Health & Safety',
  'Miscellaneous'
];

export default function ListEditor({ items, onItemsChange }: ListEditorProps) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newItem, setNewItem] = useState<PackingItem>({
    item_name: '',
    description: '',
    category: 'Miscellaneous',
    checked: false,
  });

  const handleAddItem = () => {
    if (!newItem.item_name.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    if (!newItem.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    onItemsChange([...items, { ...newItem }]);
    setNewItem({
      item_name: '',
      description: '',
      category: 'Miscellaneous',
      checked: false,
    });
    setIsAddingItem(false);
    toast.success('Item added!');

    // Track custom item addition
    if (typeof window !== 'undefined') {
      const windowWithGtag = window as Window & { gtag?: (...args: unknown[]) => void };
      if (windowWithGtag.gtag) {
        windowWithGtag.gtag('event', 'custom_item_added', {
          event_category: 'engagement',
          category: newItem.category,
        });
      }
    }
  };

  const handleUpdateItem = (index: number) => {
    const updated = [...items];
    updated[index] = { ...newItem };
    onItemsChange(updated);
    setEditingIndex(null);
    setNewItem({
      item_name: '',
      description: '',
      category: 'Miscellaneous',
      checked: false,
    });
    toast.success('Item updated!');
  };

  const handleDeleteItem = (index: number) => {
    const itemName = items[index].item_name;
    onItemsChange(items.filter((_, i) => i !== index));
    toast.success(`Removed ${itemName}`);

    // Track item deletion
    if (typeof window !== 'undefined') {
      const windowWithGtag = window as Window & { gtag?: (...args: unknown[]) => void };
      if (windowWithGtag.gtag) {
        windowWithGtag.gtag('event', 'item_deleted', {
          event_category: 'engagement',
        });
      }
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setNewItem({ ...items[index] });
    setIsAddingItem(false);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setIsAddingItem(false);
    setNewItem({
      item_name: '',
      description: '',
      category: 'Miscellaneous',
      checked: false,
    });
  };

  return (
    <div className="space-y-4">
      {/* Add Item Button */}
      {!isAddingItem && editingIndex === null && (
        <button
          onClick={() => setIsAddingItem(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg font-medium"
        >
          <Plus size={20} />
          Add Custom Item
        </button>
      )}

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(isAddingItem || editingIndex !== null) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-purple-200"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingIndex !== null ? 'Edit Item' : 'Add Custom Item'}
            </h3>

            <div className="space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={newItem.item_name}
                  onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                  placeholder="e.g., Sunscreen"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={50}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="e.g., SPF 50+ for sun protection"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={2}
                  maxLength={150}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    if (editingIndex !== null) {
                      handleUpdateItem(editingIndex);
                    } else {
                      handleAddItem();
                    }
                  }}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  {editingIndex !== null ? 'Update' : 'Add Item'}
                </button>
                <button
                  onClick={cancelEditing}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items List - Compact Edit View */}
      {items.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Edit2 size={16} />
            Quick Edit
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {items.map((item, index) => (
              <motion.div
                key={index}
                layout
                className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate text-sm">
                    {item.item_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => startEditing(index)}
                    className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                    title="Edit item"
                    aria-label={`Edit ${item.item_name}`}
                  >
                    <Edit2 size={14} className="text-purple-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete item"
                    aria-label={`Delete ${item.item_name}`}
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}