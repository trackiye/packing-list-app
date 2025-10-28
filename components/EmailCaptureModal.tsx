import React, { useState } from 'react';
import { X, Mail, Gift } from 'lucide-react';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  trigger: 'exit_intent' | 'after_generation';
}

export default function EmailCaptureModal({ isOpen, onClose, onSubmit, trigger }: EmailCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(email);
      
      if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', 'email_captured', {
          event_category: 'conversion',
          trigger: trigger,
        });
      }

      setEmail('');
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {trigger === 'exit_intent' ? (
              <Gift className="w-8 h-8 text-purple-600" />
            ) : (
              <Mail className="w-8 h-8 text-purple-600" />
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {trigger === 'exit_intent' 
              ? "Wait! Before You Go..." 
              : "Love Your List?"}
          </h3>
          
          <p className="text-gray-600">
            {trigger === 'exit_intent'
              ? "Get our Ultimate Packing Checklist PDF + Pro Tips (Free!)"
              : "Get exclusive packing tips and destination guides sent to your inbox!"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              disabled={isSubmitting}
              required
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? 'Sending...' : 'Send Me The Free Guide →'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </div>
  );
}