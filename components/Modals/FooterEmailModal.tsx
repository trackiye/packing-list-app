// components/Modals/FooterEmailModal.tsx - FIX: Removed conditional hook call
"use client";

import React, { useCallback } from "react"; // Ensure useCallback is imported
import { X, Mail, Loader2, Zap } from "lucide-react";
import toast from "react-hot-toast";

// Assuming these are available globally or imported in page.tsx
interface FooterEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  setEmailCaptured: (captured: boolean) => void;
}

export default function FooterEmailModal({
  isOpen,
  onClose,
  userEmail,
  setUserEmail,
  setEmailCaptured,
}: FooterEmailModalProps) {
  // FIX: Hook moved outside of the conditional return (if (!isOpen))
  const handleSendGuide = useCallback(async () => {
    // Basic email validation (Full Zod validation is in page.tsx handler)
    if (!userEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const toastId = toast.loading("Sending your free guide...");

    try {
      const response = await fetch("/api/send-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        // State updates via props
        setEmailCaptured(true);
        onClose();
        toast.success(
          "✅ Success! Check your email for the Ultimate Packing Guide!",
          { id: toastId }
        );
        setUserEmail("");
      } else {
        toast.error("Failed to send guide. Please try again.", { id: toastId });
      }
    } catch (error) {
      console.error("Guide send error:", error);
      toast.error("Connection error. Please try again.", { id: toastId });
    }
  }, [userEmail, setUserEmail, setEmailCaptured, onClose]);

  if (!isOpen) return null; // Now, the hook is always called before this return

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
          aria-label="Close guide modal"
        >
          <X size={24} />
        </button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
          <h3
            id="guide-modal-title"
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Get Free Packing Guide
          </h3>
          <p className="text-gray-600">Ultimate checklist + pro tips</p>
        </div>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 bg-white placeholder:text-gray-500"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <button
          onClick={handleSendGuide}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105 active:scale-95 touch-manipulation flex items-center justify-center gap-2"
        >
          Send Me The Guide →
        </button>
        <p className="text-xs text-gray-500 text-center mt-3">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
