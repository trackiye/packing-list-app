import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,

  experimental: {},

  // FIX: Wrapped the return value in an async function to return a Promise
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Enforce HTTPS (HSTS) - stronger preload
          ...(process.env.NODE_ENV === "production" // FIX: Only send HSTS in Production
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]
            : []),
          // Prevent Clickjacking
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // Prevent MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Stricter Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://api.openai.com https://api.resend.com https://helpful-liger-32280.upstash.io https://o4510293313847296.ingest.us.sentry.io",
              "frame-ancestors 'self'",
              "form-action 'self'",
              "base-uri 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), fullscreen=(self), payment=()",
          },
          // Cross-Origin policies for better security
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
          // X-XSS-Protection for legacy browser support
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  dryRun: process.env.NODE_ENV !== "production",
  automaticVercelMonitors: true,
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
