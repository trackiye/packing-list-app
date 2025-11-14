// components/Modals/ShareModal.tsx
"use client";

import React from "react";
import { X, Share2 } from "lucide-react";
import { trackShareClick } from "@/components/Analytics";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareLink: string;
  // Handlers are passed from page.tsx (where the core logic and tracking live)
}

export default function ShareModal({
  isOpen,
  onClose,
  shareLink,
}: ShareModalProps) {
  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      // NOTE: We track the copy action here for immediate feedback
      trackShareClick("copy_link");
      // Optionally provide a toast success message here if desired
    }
  };

  const handleTwitterShare = () => {
    trackShareClick("twitter");
    window.open(
      `https://twitter.com/intent/tweet?text=Check out my personalized packing list!&url=${encodeURIComponent(
        shareLink
      )}`,
      "_blank"
    );
  };

  const handleFacebookShare = () => {
    trackShareClick("facebook");
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareLink
      )}`,
      "_blank"
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
          aria-label="Close share modal"
        >
          <X size={24} />
        </button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-purple-600" />
          </div>
          <h3
            id="share-modal-title"
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Share Your List
          </h3>
          <p className="text-gray-600">Send to friends or save for later</p>
        </div>

        {/* Share Link Display */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4 break-all text-sm text-gray-700 border">
          {shareLink}
        </div>

        {/* Share Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopyLink}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105 active:scale-95 touch-manipulation"
          >
            Copy Link
          </button>
          <button
            onClick={handleTwitterShare}
            className="px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all hover:scale-110 active:scale-95 touch-manipulation"
            aria-label="Share on X (Twitter)"
          >
            Twitter
          </button>
          <button
            onClick={handleFacebookShare}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-110 active:scale-95 touch-manipulation"
            aria-label="Share on Facebook"
          >
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
