import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    clientTraceMetadata: ["baggage", "sentry-trace", "traceparent"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_AMAZON_AFFILIATE_TAG: process.env.AMAZON_AFFILIATE_TAG || 'trackiye-20',
  },
};

export default withSentryConfig(nextConfig, {
  org: "packmind",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  hideSourceMaps: true,
  disableLogger: true,
});
