import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://taskflow-api-682258391368.asia-southeast1.run.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
