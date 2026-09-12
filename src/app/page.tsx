import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, BookOpen, TrendingUp } from 'lucide-react';
import { PostCard } from '@/components/blog/PostCard';
import { Newsletter } from '@/components/blog/Newsletter';
import { CategoryCard } from '@/components/blog/CategoryCard';
import { PinnedSlider } from '@/components/blog/PinnedSlider';
import { SITE_CONFIG } from '@/lib/constants';
import { getLatestPosts, getPosts, getPinnedPosts } from '@/lib/data/posts';
import { getCategories, getCategoryPostCounts } from '@/lib/data/categories';
import { getBrandAssets } from '@/lib/data/settings';
import { duongDanAnh } from '@/lib/brand';

// Render động để bài ghim ăn hiệu lực TỨC THÌ khi admin bấm ghim/bỏ ghim.
// Trước đây trang chủ dùng `revalidate = 60` ⇒ được cache ở tầng route với header
// `s-maxage=60, stale-while-revalidate=~1 năm`. `revalidatePath('/')` trong route
// pin xoá được cache của Next, nhưng cửa sổ stale-while-revalidate cho phép cache
// dùng chung (nginx gateway/proxy) phục vụ bản cũ ⇒ slider ghim không đổi ngay.
// Đổi sang động thì KHÔNG mất tốc độ: mọi truy vấn (getPinnedPosts, getLatestPosts,
// getCategories, getPosts, getCategoryPostCounts) đều đã bọc `unstable_cache` nên
// không đụng DB — giống hệt cách /blog và /blog/[slug] đang chạy nhanh.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categories, recentPosts, { count: totalPosts }, pinnedPosts, brand] = await Promise.all([
    getCategories(),
    getLatestPosts(7),
    getPosts({ limit: 1, page: 1 }),  // just for the count
    getPinnedPosts(5),
    getBrandAssets(),
  ]);

  // Filter out pinned posts from the recent posts grid
  const pinnedIds = new Set(pinnedPosts.map(p => p.id));
  const otherPosts = recentPosts.filter(p => !pinnedIds.has(p.id)).slice(0, 6);

  // Dem bai theo danh muc — da gom vao tang data va co cache (tags: posts + categories)
  const categoryCounts = await getCategoryPostCounts();



  // JSON-LD: WebSite (enables sitelinks search box in Google)
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: 'vi',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // JSON-LD: Organization (for Google Knowledge Panel)
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    // Truoc day tro toi `/logo.png` — file KHONG he ton tai trong `public/`,
    // tuc Google doc mot logo 404 suot thoi gian qua.
    logo: `${SITE_CONFIG.url}/api/brand/logo`,
    description: SITE_CONFIG.description,
    sameAs: [
      'https://www.youtube.com/@tradadata',
      'https://www.facebook.com/TRADADATA1010/',
      'https://www.facebook.com/thaytrungdata/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'trunghoangdata101091@gmail.com',
      contactType: 'customer service',
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-emerald-50 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950">
          <div className="absolute inset-0 opacity-30 dark:opacity-20">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-300 dark:bg-brand-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-300 dark:bg-emerald-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse [animation-delay:2s]" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 dark:bg-teal-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse [animation-delay:4s]" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            {/* Banner mang san toan bo thong diep (ten, slogan, danh sach cong nghe)
                nen tu 768px tro len no THAY cho khoi chu — giu ca hai la lap y.
                Duoi 768px thi an: chu nam trong anh o be ngang 375px khong doc noi.

                Anh de `alt=""`: <h1> va doan mo ta ngay duoi van con trong DOM
                (chi `sr-only` o man lon), nen trinh doc man hinh da co nguyen van
                thong diep roi — dat alt o day la doc trung hai lan.

                Khung khoa ti le 16/9 san (dung ti le that cua file: 1600x900) de
                anh vao khong lam nhay layout. Toi da 760px chu khong tran vien:
                16:9 o container 1280px la CAO 720px, nuot tron man hinh dau. */}
            <div className="hidden md:block mb-10">
              <Image
                src={duongDanAnh('banner', brand)}
                alt=""
                width={1600}
                height={900}
                // Duoi 768px banner bi an han, nen khai 1px de trinh duyet chon
                // bien the nho nhat thay vi tai ban 828px ve roi khong dung.
                sizes="(min-width: 768px) 760px, 1px"
                priority
                className="mx-auto w-full max-w-[760px] rounded-3xl ring-1 ring-line shadow-e2"
              />
            </div>

            <div className="inline-flex md:hidden items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/10 text-brand-700 dark:text-white/90 text-sm backdrop-blur-sm border border-brand-200 dark:border-white/20 mb-6 font-medium shadow-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Kiến thức thực tế, chia sẻ tận tâm
            </div>
            <h1 className="md:sr-only text-4xl font-bold text-surface-900 dark:text-white mb-6 leading-tight">
              Nâng tầm kỹ năng{' '}
              <span className="bg-gradient-to-r from-brand-600 to-emerald-500 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
                Data & AI
              </span>
            </h1>
            <p className="md:sr-only text-lg text-surface-600 dark:text-white/80 mb-8 leading-relaxed">
              Blog chia sẻ kiến thức chuyên sâu về Excel, Power Query, VBA, Power BI, SQL, Python,
              trí tuệ nhân tạo và quản lý chuỗi cung ứng.
            </p>
            {/* MOT hanh dong chinh moi man hinh. Truoc day hai nut cung do dam nen
                khong biet nen bam cai nao; "Xem chu de" gio la lien ket phu. */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 dark:bg-white text-white dark:text-brand-700 font-semibold hover:bg-brand-700 dark:hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <BookOpen className="h-5 w-5" aria-hidden="true" />
                Khám phá bài viết
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-surface-600 dark:text-white/80 hover:text-surface-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
              >
                Xem chủ đề
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 max-w-xs mx-auto">
            {[
              { label: 'Bài viết', value: totalPosts && totalPosts > 0 ? `${totalPosts}+` : '0' },
              { label: 'Chủ đề', value: categories.length.toString() },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-brand-700 dark:text-white">{stat.value}</div>
                <div className="text-sm font-medium text-surface-600 dark:text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PINNED POSTS SLIDER ===== */}
      {pinnedPosts.length > 0 && (
        <PinnedSlider posts={pinnedPosts} />
      )}

      {/* ===== CATEGORIES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-fg">
              Chủ đề
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mt-1">Khám phá theo lĩnh vực bạn quan tâm</p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 py-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 text-sm font-medium"
          >
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat) => {
            return <CategoryCard key={cat.id} category={cat} postCount={categoryCounts[cat.id] || 0} />;
          })}
        </div>
      </section>

      {/* ===== RECENT POSTS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-brand-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-fg">
              Bài viết mới nhất
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 py-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 text-sm font-medium"
          >
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </>
  );
}
