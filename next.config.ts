import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
    optimizeCss: false,
  },
    compiler: {
    // modern browsers target
  },
  transpilePackages: [],

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    const backendUrl = (
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:5000"
    ).replace(/\/api\/v1\/?$/, "").replace(/\/api\/?$/, "").replace(/\/$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;