import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Đóng gói server tối giản vào .next/standalone để image Docker nhẹ
  // (chỉ chép node_modules thực sự được dùng thay vì toàn bộ).
  output: 'standalone',
  productionBrowserSourceMaps: false,
  serverExternalPackages: ['googleapis', 'nodemailer', 'happy-dom'],
  eslint: {
    // VAN phai bo qua: repo dang co 59 loi eslint co san (no-explicit-any,
    // react-hooks/set-state-in-effect). Bat len la khong build duoc. Don dan roi
    // hay doi thanh false.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // KHONG duoc bat lai thanh true.
    //
    // Truoc day de `true`, nghia la loi type KHONG chan build — ma duong deploy
    // dang dung (`deploy-blog` o repo ke-truyen) cung khong chay `tsc` rieng,
    // nen mot loi type co the ra thang production. Suot dot lam UI, thu duy nhat
    // chan duoc la minh chay `npx tsc --noEmit` bang tay; thu do chi dung khi co
    // nguoi lam.
    //
    // De `false` thi `next build` tu type-check, nen image Docker build that bai
    // truoc khi kip cham vao cum. `tsc --noEmit` hien dang sach nen bat duoc ngay.
    ignoreBuildErrors: false,
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

