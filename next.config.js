/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for @react-native-async-storage and pino-pretty warnings
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'pino-pretty': false,
        '@react-native-async-storage/async-storage': false,
        'fs': false,
        'net': false,
        'tls': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
