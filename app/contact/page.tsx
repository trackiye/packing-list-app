"use client";

import { useState } from "react";
import { Send, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import Header from "@/components/Header";
import BeautifulFooter from "@/components/BeautifulFooter";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("✅ Message sent! We'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="floating-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Header />
      <div className="h-14" />

      <main className="relative z-10 container-custom px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-white/80">
              Questions? Feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="card p-8 animate-fadeIn hover-lift">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all resize-none"
                  placeholder="How can we help?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10 text-center">
              <p className="text-white/60 text-sm flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Or email us directly
              </p>
            </div>
          </div>
        </div>
      </main>

      <BeautifulFooter />
    </div>
  );
}
