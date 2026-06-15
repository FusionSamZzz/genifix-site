import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/media/**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  serverExternalPackages: [
    "sharp",
    "@img/sharp-linux-x64",
    "@img/sharp-libvips-linux-x64",
  ],
  outputFileTracingIncludes: {
    "/": [
      "./node_modules/sharp/**/*",
      "./node_modules/@img/**/*",
    ],
    "/admin": [
      "./node_modules/sharp/**/*",
      "./node_modules/@img/**/*",
    ],
    "/api": [
      "./node_modules/sharp/**/*",
      "./node_modules/@img/**/*",
    ],
  },
  experimental: {
    turbopackServerFastRefresh: false,
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: true });
