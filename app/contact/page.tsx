// app/contact/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  Clock,
  Heart,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen dark-gradient overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 mesh-gradient opacity-40"></div>
        <div className="absolute top-10 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-all hover:scale-105 glass-dark px-4 py-2 rounded-full"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Hero Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 pulse-glow shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl">
            Let&apos;s Talk!
          </h1>
          <p className="text-2xl text-white/90 mb-2">
            We&apos;d love to hear from you
          </p>
          <p className="text-lg text-white/70">
            Questions, feedback, or just want to say hi? Drop us a line!
          </p>
        </div>

        {submitted ? (
          // Success State
          <div className="glass-strong-dark rounded-3xl p-12 border-2 border-green-500/30 shadow-2xl text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 pulse-glow">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Message Sent! 🎉
            </h2>
            <p className="text-xl text-white/90 mb-3">
              Thanks for reaching out, {formData.name || "friend"}!
            </p>
            <p className="text-white/80 text-lg mb-8">
              We&apos;ll get back to you within 24-48 hours. In the meantime,
              why not create a packing list?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all border border-white/20"
              >
                Send Another Message
              </button>
              <Link
                href="/"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all shadow-lg inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Create Packing List
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Form - Takes 3 columns */}
            <div className="lg:col-span-3">
              <div className="glass-strong-dark rounded-3xl p-8 border border-white/20 shadow-2xl animate-in slide-in-from-left-4 duration-700">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-purple-400" />
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-white font-semibold mb-2 text-sm"
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-white font-semibold mb-2 text-sm"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-white font-semibold mb-2 text-sm"
                    >
                      What&apos;s this about? *
                    </label>
                    <select
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    >
                      <option value="" className="bg-gray-900">
                        Select a topic...
                      </option>
                      <option value="general" className="bg-gray-900">
                        💬 General Question
                      </option>
                      <option value="bug" className="bg-gray-900">
                        🐛 Report a Bug
                      </option>
                      <option value="feature" className="bg-gray-900">
                        💡 Feature Request
                      </option>
                      <option value="partnership" className="bg-gray-900">
                        🤝 Partnership/Business
                      </option>
                      <option value="feedback" className="bg-gray-900">
                        ⭐ Feedback
                      </option>
                      <option value="other" className="bg-gray-900">
                        ✨ Something Else
                      </option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-white font-semibold mb-2 text-sm"
                    >
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                      placeholder="Tell us what's on your mind..."
                    />
                    <p className="text-white/60 text-xs mt-2">
                      The more details, the better we can help!
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl pulse-glow"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Response Time */}
              <div className="glass-dark rounded-3xl p-6 border border-white/20 shadow-xl hover:scale-105 transition-all animate-in slide-in-from-right-4 duration-700">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">
                      Response Time
                    </h3>
                    <p className="text-white/80 text-sm mb-2">
                      We typically respond within{" "}
                      <span className="text-blue-400 font-bold">
                        24-48 hours
                      </span>
                    </p>
                    <p className="text-white/60 text-xs">
                      Need urgent help? Mark your subject as &quot;Bug&quot; for
                      priority support.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Email */}
              <div className="glass-dark rounded-3xl p-6 border border-white/20 shadow-xl hover:scale-105 transition-all animate-in slide-in-from-right-4 duration-700 delay-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">
                      Prefer Email?
                    </h3>
                    <p className="text-white/80 text-sm mb-2">
                      Reach us directly at:
                    </p>
                    <a
                      href="mailto:hello@packmind.ai"
                      className="text-purple-400 hover:text-purple-300 transition-colors font-semibold block mb-2"
                    >
                      hello@packmind.ai
                    </a>
                    <p className="text-white/60 text-xs">
                      We&apos;ll reply from the same thread!
                    </p>
                  </div>
                </div>
              </div>

              {/* Why Contact Us */}
              <div className="glass-dark rounded-3xl p-6 border border-white/20 shadow-xl animate-in slide-in-from-right-4 duration-700 delay-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-3">
                      We Love Hearing From You!
                    </h3>
                    <div className="space-y-2 text-white/80 text-sm">
                      <p>
                        💬 <strong>Questions?</strong> Ask away!
                      </p>
                      <p>
                        🐛 <strong>Found a bug?</strong> Help us fix it!
                      </p>
                      <p>
                        💡 <strong>Have an idea?</strong> We&apos;re all ears!
                      </p>
                      <p>
                        ⭐ <strong>Love Packmind?</strong> Tell us!
                      </p>
                      <p>
                        😕 <strong>Something off?</strong> Let&apos;s improve!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fun Fact */}
              <div className="glass-dark rounded-3xl p-6 border border-white/20 shadow-xl animate-in slide-in-from-right-4 duration-700 delay-300 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <div className="text-center">
                  <div className="text-4xl mb-2">✈️</div>
                  <p className="text-white/90 font-semibold mb-1">Fun Fact!</p>
                  <p className="text-white/70 text-sm">
                    Our team has visited 47 countries combined. We know a thing
                    or two about packing! 🎒
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-16 grid sm:grid-cols-3 gap-6 animate-in fade-in duration-700 delay-500">
          <div className="glass-dark rounded-2xl p-6 text-center border border-white/20 hover:scale-105 transition-all">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-white font-bold mb-2">Privacy First</h3>
            <p className="text-white/70 text-sm">
              Your messages are confidential
            </p>
          </div>
          <div className="glass-dark rounded-2xl p-6 text-center border border-white/20 hover:scale-105 transition-all">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-white font-bold mb-2">Quick Response</h3>
            <p className="text-white/70 text-sm">Usually within 24-48 hours</p>
          </div>
          <div className="glass-dark rounded-2xl p-6 text-center border border-white/20 hover:scale-105 transition-all">
            <div className="text-4xl mb-3">💙</div>
            <h3 className="text-white font-bold mb-2">Real Humans</h3>
            <p className="text-white/70 text-sm">
              No bots, just friendly folks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
