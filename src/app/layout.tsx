import type { Metadata } from 'next';
import { Be_Vietnam_Pro, JetBrains_Mono } from 'next/font/google';
import { HeaderData } from '@/components/layout/HeaderData';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/Providers';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { LayoutShell } from '@/components/layout/LayoutShell';
import { SITE_CONFIG, KHOA_THEME, ROUTE_LUON_SANG } from '@/lib/constants';
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
    // Truoc day KHONG khai `images`, nen chia se link trang chu ra Facebook /
    // Zalo khong co anh nao. Va anh mac dinh cu (`og-default.png`) la anh VUONG
    // 640x640 — khai `summary_large_image` ma anh vuong thi Facebook hien
    // thumbnail be thay vi the lon.
    images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: SITE_CONFIG.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
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
        {/*
          Script chong nhay mau — PHAI la thu dau tien trong <body>. Trinh duyet
          chay no truoc khi phan tich phan con lai cua body, nen class `.dark` co
          mat truoc khi ve khung dau tien. Neu de React useEffect lam viec nay
          (nhu truoc day) thi nguoi chon dark thay mot nhip nhay SANG -> TOI moi
          lan tai trang.

          `suppressHydrationWarning` tren <html> la danh cho dung viec nay: script
          sua `classList` cua <html> nen HTML server va client khac nhau mot class
          — co y, khong phai loi hydration.

          Boc try/catch: `localStorage` NEM LOI o cua so an danh va trinh duyet
          chan site data. Loi thi khong lam gi, tuc roi ve light.

          Kiem `location.pathname` ngay trong script: cac route trong
          ROUTE_LUON_SANG (landing ban hang) khong bao gio duoc them `.dark`, nho
          vay Header/Footer dung chung — von con 15 cho viet `dark:` — cung sang
          theo ma khong phai viet lai. Dieu huong trong trang do `ThemeToggle` lo.

          ⚠️ Cat dau `/` cuoi bang `slice` chu KHONG bang regex. Trong template
          literal, chuoi `/` co dau `\` dang truoc bi nuot mat, nen mot regex
          `/.../` viet o day sinh ra `//...` — tuc mot COMMENT, va ca script chet cu
          phap im lang (try/catch khong bat duoc loi parse). Deploy ngay 08/09/2026
          da dinh dung loi nay. Sua script thi kiem lai bang `new Function(...)`,
          hoac curl HTML production va doc lai dong script.
          `removeItem('theme')` don khoa doi truoc. Khoa do tung luu `dark` cho ca
          nhung khach chua bao gio tu chon, vi theme mac dinh con doc
          `prefers-color-scheme`. Doi sang khoa moi la reset, va don khoa cu de
          khong de rac lai trong may nguoi doc.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              `try{` +
              `var p=location.pathname;` +
              `if(p.length>1&&p.charAt(p.length-1)==='/')p=p.slice(0,-1);` +
              `var sang=${JSON.stringify(ROUTE_LUON_SANG)}.some(function(r){return p===r||p.indexOf(r+'/')===0});` +
              `if(!sang&&localStorage.getItem('${KHOA_THEME}')==='dark')document.documentElement.classList.add('dark');` +
              `localStorage.removeItem('theme')` +
              `}catch(e){}`,
          }}
        />
        <Providers>
          <div className="flex flex-col min-h-screen">
            <HeaderData />
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
