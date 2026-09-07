import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Đóng gói server tối giản vào .next/standalone để image Docker nhẹ
  // (chỉ chép node_modules thực sự được dùng thay vì toàn bộ).
  output: 'standalone',
  productionBrowserSourceMaps: false,
  serverExternalPackages: ['googleapis', 'nodemailer', 'happy-dom'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'ujwdhjtzmmflhfewqtid.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        // /pricing da gop vao /courses (PR #8).
        //
        // Phai khai o day, KHONG duoc dung `permanentRedirect()` trong page
        // component: trang do bi Next prerender tinh, va khi prerender thi
        // `permanentRedirect()` khong sinh ra redirect — no de lai mot trang
        // RONG 47KB tra ve 200. Da xay ra that: /pricing tra trang trang tu
        // PR #8 den 07/09/2026. Khai o `redirects()` thi Next tra 308 ngay o
        // tang routing, khong render gi ca.
        source: '/pricing',
        destination: '/courses',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Link',
            value: '<https://lh3.googleusercontent.com>; rel=preconnect, <https://images.unsplash.com>; rel=preconnect',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

