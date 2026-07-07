import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,

  // Proxy all API requests to your running Alibaba Cloud backend!
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'https://routineiq-itblaotrkx.ap-southeast-1.fcapp.run/api/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
