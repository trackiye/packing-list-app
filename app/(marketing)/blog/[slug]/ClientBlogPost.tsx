// app/(marketing)/blog/[slug]/ClientBlogPost.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  image?: string;
}

export default function ClientBlogPost({ post }: { post: BlogPost }) {
  return (
    <div className="min-h-screen dark-gradient">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg"></div>
            <span className="text-xl font-bold">Packmind AI</span>
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
        </div>
      </header>
      <div className="h-16"></div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Article Header */}
        <article className="glass-strong-dark rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all posts
            </Link>
          </div>

          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

          {/* Content */}
          <div
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              color: "rgba(255, 255, 255, 0.9)",
            }}
          />

          {/* Call to Action */}
          <div className="mt-12 p-6 glass-dark rounded-xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Pack Smarter?
            </h3>
            <p className="text-white/80 mb-4">
              Try our AI-powered packing list generator and never forget
              essentials again.
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:scale-105"
            >
              Create Your List Now
            </Link>
          </div>
        </article>

        {/* Related Posts */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">More Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {post.slug !== "ultimate-packing-guide-2024" && (
              <Link
                href="/blog/ultimate-packing-guide-2024"
                className="glass-dark rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all hover:scale-105"
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  The Ultimate Packing Guide for 2024
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Master the art of efficient packing with our comprehensive
                  guide.
                </p>
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span>5 min read</span>
                  <span>•</span>
                  <span>Jan 15, 2024</span>
                </div>
              </Link>
            )}
            {post.slug !== "ai-travel-planning" && (
              <Link
                href="/blog/ai-travel-planning"
                className="glass-dark rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all hover:scale-105"
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  How AI is Revolutionizing Travel Planning
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Discover how artificial intelligence is changing the way we
                  plan trips.
                </p>
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span>7 min read</span>
                  <span>•</span>
                  <span>Feb 10, 2024</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-white/60 text-sm">
          <p>© 2025 Packmind AI. Made with care for travelers.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link
              href="/contact"
              className="hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .prose h2 {
          color: white;
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose p {
          margin-bottom: 1rem;
          line-height: 1.75;
        }
        .prose ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
