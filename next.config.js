/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for catching potential issues
  reactStrictMode: true,

  // Use Turbopack for faster builds
  turbopack: {
    resolveAlias: {},
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:;",
          },
        ],
      },
      // API routes should not be cached
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },

  // Redirect old routes if needed
  async redirects() {
    return [
      {
        source: '/auth',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Environment variables configuration
  env: {
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // Webpack configuration for optimization
  webpack: (config, { isServer }) => {
    // Optimize for production
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true,
        },
      };
    }
    return config;
  },

  // Experimental features for Next.js 16
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Production source maps disabled for security
  productionBrowserSourceMaps: false,

  // Images configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,

  // PoweredBy header removal
  poweredByHeader: false,
};

module.exports = nextConfig;
