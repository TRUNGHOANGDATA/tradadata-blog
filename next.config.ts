import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Đóng gói server tối giản vào .next/standalone để image Docker nhẹ
  // (chỉ chép node_modules thực sự được dùng thay vì toàn bộ).
  output: 'standalone',
  productionBrowserSourceMaps: false,
  serverExternalPackages: ['googleapis', 'nodemailer', 'happy-dom'],
  eslint: {
    // Da don sach LOI eslint (189 -> 0) nen bat cong chan len duoc.
    // Next chi chan build khi co ERROR, con WARNING thi khong — hien con 94
    // canh bao (69 bien khong dung, 24 no-img-element, 1 exhaustive-deps).
    //
    // 24 canh bao `no-img-element` la CO Y: dung `<img>` de khong di qua
    // /_next/image. Do tren cum cho thay optimizer ton 1,3-6 giay moi anh khi
    // cache lanh, nen voi anh trong danh sach bai viet thi `<img>` nhanh hon han.
    ignoreDuringBuilds: false,
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
    // CHI WebP, KHONG dung AVIF.
    //
    // Do thuc te tren cum (07/09/2026), cung mot anh cover 502KB tu Google Drive,
    // cache lanh:
    //     AVIF w=1920  6,18s  ->  24 KB
    //     WebP w=1920  1,29s  ->  30 KB
    //     AVIF w=828   7,06s  ->  25 KB
    //     WebP w=828   1,09s  ->  31 KB
    // Tuc pod bo ra 6-7 GIAY encode AVIF de tiet kiem 6KB. Do rong gan nhu khong
    // anh huong — chi phi nam o bo encode AVIF. Day la ly do "anh dau bai load lau".
    // Cum nay yeu, dung them AVIF lai la quay ve 6 giay.
    formats: ['image/webp'],

    // Bo 2048 va 3840 khoi thang mac dinh cua Next.
    // Anh hero rong toi da ~1216px (max-w-7xl tru padding) ma truoc day trinh
    // duyet xin w=3840 vi the <Image fill> khong khai `sizes`. Moi breakpoint la
    // mot lan encode rieng, nen cang it bac cang it viec cho pod.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],

    // Optimizer chi tra `max-age=86400` (1 ngay), va `.next/cache` nam TRONG
    // container nen moi lan deploy la mat sach -> anh lai lanh. Keo TTL len 30 ngay
    // de tra gia encode mot lan cho moi lan deploy thay vi lap lai hang ngay.
    minimumCacheTTL: 2592000,
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

