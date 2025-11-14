// components/Modals/EmailListModal.tsx
// REPLACE THE ENTIRE FILE WITH THIS:

"use client";

import React from "react";
import { X, Mail, Loader2 } from "lucide-react";

interface EmailListModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  handleConfirmEmail: () => Promise<void>;
  emailSending: boolean;
}

export default function EmailListModal({
  isOpen,
  onClose,
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  handleConfirmEmail,
  emailSending,
}: EmailListModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleConfirmEmail();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-white/20 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Email Your List</h2>
            <p className="text-white/70 text-sm">Get it sent to your inbox</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
              disabled={emailSending}
            />
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
              disabled={emailSending}
            />
          </div>

          <button
            type="submit"
            disabled={emailSending}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {emailSending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Send to Email
              </>
            )}
          </button>
        </form>

        <p className="text-white/60 text-xs text-center mt-4">
          We&apos;ll send you a link to access your packing list anytime
        </p>
      </div>
    </div>
  );
}
