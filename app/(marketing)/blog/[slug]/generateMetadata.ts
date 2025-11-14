// app/(marketing)/blog/[slug]/generateMetadata.ts
import type { Metadata } from "next";

// Replace this with your real blog data or fetch
const blogPosts = [
  {
    slug: "how-to-pack-for-europe",
    title: "How to Pack for Europe Like a Pro",
    description: "Ultimate Europe packing guide",
  },
  {
    slug: "beach-vacation-essentials",
    title: "Beach Vacation Essentials 2025",
    description: "Don't forget these items",
  },
  {
    slug: "winter-trip-packing-guide",
    title: "Winter Trip Packing Guide",
    description: "Stay warm and stylish",
  },
  {
    slug: "carry-on-only-tips",
    title: "Carry-On Only: 7-Day Trip Challenge",
    description: "Pack light, travel smart",
  },
  {
    slug: "family-vacation-checklist",
    title: "Family Vacation Packing Checklist",
    description: "For parents who forget nothing",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "This blog post does not exist.",
    };
  }

  return {
    title: `${post.title} | Packmind AI Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://packmindai.com/blog/${slug}`,
      type: "article",
    },
  };
}
