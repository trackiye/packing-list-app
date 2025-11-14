// components/EmailCaptureModal.tsx
interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function EmailCaptureModal({ isOpen, onClose, onSubmit }: EmailCaptureModalProps) {
  if (!isOpen) return null;

  const handleSubmit = () => {
    // Track event if gtag exists
    if (typeof window !== 'undefined') {
      const windowWithGtag = window as Window & { gtag?: (...args: unknown[]) => void };
      if (windowWithGtag.gtag) {
        windowWithGtag.gtag('event', 'email_captured', {
          event_category: 'conversion',
        });
      }
    }
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Your Free Guide</h3>
          <p className="text-gray-600">Ultimate Packing Checklist + Pro Tips</p>
        </div>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
        />
        <button 
          onClick={handleSubmit}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
        >
          Send Me The Free Guide →
        </button>
      </div>
    </div>
  );
}