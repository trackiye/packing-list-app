// app/(marketing)/blog/[slug]/generateStaticParams.ts
export async function generateStaticParams() {
  return [
    { slug: "how-to-pack-for-europe" },
    { slug: "beach-vacation-essentials" },
    { slug: "winter-trip-packing-guide" },
    { slug: "carry-on-only-tips" },
    { slug: "family-vacation-checklist" },
  ];
}
