// components/Modals/PDFModal.tsx
"use client";

import React from "react";
import { X, FileText, Loader2 } from "lucide-react";

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  setUserName: (name: string) => void;
  handleConfirmPDF: () => void;
  pdfGenerating: boolean;
}

export default function PDFModal({
  isOpen,
  onClose,
  userName,
  setUserName,
  handleConfirmPDF,
  pdfGenerating,
}: PDFModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
    >
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
          aria-label="Close download modal"
        >
          <X size={24} />
        </button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h3
            id="pdf-modal-title"
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Download Printable PDF
          </h3>
          <p className="text-gray-600">
            Get a beautiful, formatted packing list for offline use.
          </p>
        </div>
        <input
          type="text"
          placeholder="Your name (for PDF header)"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder:text-gray-500"
          style={{ color: "#111827" }}
        />
        <button
          onClick={handleConfirmPDF}
          disabled={pdfGenerating}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all hover:scale-105 active:scale-95 touch-manipulation flex items-center justify-center gap-2"
        >
          {pdfGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            "Download PDF"
          )}
        </button>
      </div>
    </div>
  );
}
