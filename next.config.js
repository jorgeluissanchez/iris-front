import { env } from './src/config/env';
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: [
    '@heroui/theme',
    '@heroui/system',
    '@heroui/dom-animation',
    '@heroui/framer-utils',
    '@heroui/react-utils',
  ],
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${env.API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
