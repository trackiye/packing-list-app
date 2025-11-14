// app/(marketing)/blog/[slug]/BlogPostServer.tsx
import { notFound } from "next/navigation";
import ClientBlogPost from "./ClientBlogPost";

const blogPosts = [
  {
    slug: "ultimate-packing-guide-2024",
    title: "The Ultimate Packing Guide for 2024",
    excerpt:
      "Master the art of efficient packing with our comprehensive guide.",
    content: `<h2>Introduction</h2><p>Packing efficiently can make or break your travel experience...</p>`,
    author: "Travel Team",
    date: "2024-01-15",
    readTime: "5 min read",
  },
  // ... your other 2 posts
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostServer({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  return <ClientBlogPost post={post} />;
}
