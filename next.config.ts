import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    clientTraceMetadata: ["user-agent", "x-forwarded-for", "origin"],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  swcMinify: true,
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "packmind",
  project: "packmind-ai",
  authToken: process.env.SENTRY_AUTH_TOKEN,
}, {
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
});
