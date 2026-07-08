import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  transpilePackages: ['jose', 'jwks-rsa'],
};

export default nextConfig;
