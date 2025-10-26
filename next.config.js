/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@heroui/theme',
    '@heroui/system',
    '@heroui/dom-animation',
    '@heroui/framer-utils',
    '@heroui/react-utils',
  ],
};

module.exports = nextConfig;
