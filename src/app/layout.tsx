import type { Metadata } from 'next';
import { Be_Vietnam_Pro, JetBrains_Mono } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/Providers';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { LayoutShell } from '@/components/layout/LayoutShell';
import { SITE_CONFIG } from '@/lib/constants';
import './globals.css';

/**
 * Font chu chinh — Be Vietnam Pro, do Lam Bao, Tony Le va VietAnh Nguyen thiet ke
 * RIENG cho tieng Viet. Site nay 100% tieng Viet nen chat luong chu co dau la
 * tieu chi dung nhat, va no la font duy nhat trong nhung font da xet duoc ve cho
 * muc dich do.
 *
 * ⚠️ Day la font TINH, khong co truc bien the. Moi weight la MOT file rieng cho
 * MOI dai Unicode, nen chi phi tang theo so weight — khac hoan toan Inter truoc
 * day (bien thé, 1 file phu ca dai 400-700 chi 57KB).
 *
 * Do ngay 08/09/2026 (latin + vietnamese):
 *     4 weight (400/500/600/700)  8 file  132 KB   <- dang dung
 *     5 weight (them 800)        10 file  166 KB
 *     6 weight (them 900)        12 file  199 KB
 *
 * Vi sao dung o 4 weight: trong `src/` co 13 cho dung `font-extrabold` (800) va
 * `font-black` (900) — 7 trong so do o /phan-mem-ban-hang. Theo quy tac khop font
 * cua CSS, weight 800 khi khong co face 800 se chon face NANG NHAT con lai duoi
 * no, tuc 700; trinh duyet KHONG bia dam gia. Nen 13 cho do render o 700 va
 * khong can sua mot dong code nao.
 *
 * Muon 800 dung nghia thi them '800' vao mang duoi, doi lai +34 KB.
 */
const fontChinh = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  // `next/font` mac dinh `preload: true`, va font nay khai o layout GOC nen
  // moi trang deu duoc `rel=preload` -> tai 39KB font monospace ngay ca khi
  // trang khong co mot dong code nao. Do tren production 08/09/2026: `/blog`
  // co 0 the <pre>/<code> nhung van tai bb3ef058b751a6ad.woff2 (JetBrains Mono).
  //
  // Bo preload thi trinh duyet chi tai khi that su co chu dung den font, tuc
  // gan nhu chi o trang bai viet co code block. `display: 'swap'` da co san nen
  // luc dau code block hien bang font du phong roi doi sang, khong bi trang.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.description}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: ['Excel', 'Power BI', 'Power Query', 'VBA', 'SQL', 'Python', 'AI', 'Supply Chain', 'Data Analytics', 'Trà Đá Data'],
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${fontChinh.variable} ${jetbrainsMono.variable} font-sans`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <LayoutShell>
              <Footer />
              <FloatingActions />
            </LayoutShell>
          </div>
        </Providers>
      </body>
    </html>
  );
}
