import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/Providers';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { LayoutShell } from '@/components/layout/LayoutShell';
import { SITE_CONFIG } from '@/lib/constants';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
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
