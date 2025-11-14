// app/(marketing)/blog/[slug]/page.tsx
// SERVER COMPONENT — NO "use client" AT ALL
import BlogPostServer from "./BlogPostServer";
import { generateMetadata } from "./generateMetadata";
import { generateStaticParams } from "./generateStaticParams";

export { generateMetadata };
export { generateStaticParams };

export default BlogPostServer;
