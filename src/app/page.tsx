import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, TrendingUp } from 'lucide-react';
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

        {/* Chu THAT tren trang, anh chi lam minh hoa.
            Truoc day ca thong diep nam trong mot file JPEG (banner co san chu):
            khong co dong chu that nao o hero, nen chu khong co gian, khong doi
            mau theo che do toi, khong chon duoc, va o khung 760px thi dong mo ta
            trong anh chi con co ~11px. Logo con bi lap hai lan — mot o header,
            mot nua trong anh. Banner van duoc dung, nhung dung cho no: `og:image`
            va dau email. */}
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-0 lg:px-8 lg:py-16">
          <div className="lg:pr-10">
            <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-surface-900 sm:text-5xl lg:text-[3.25rem] dark:text-white">
              Nâng tầm kỹ năng{' '}
              <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-300 dark:to-teal-300">
                Data &amp; AI
              </span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-surface-600 dark:text-white/75">
              Kiến thức thực chiến, giải thích bằng ví dụ làm được ngay — từ hàm Excel đầu tiên
              đến pipeline dữ liệu và AI.
            </p>

            {/* Thay cho hang icon Excel/SQL/Power BI ve san trong banner: day la
                chu that va BAM DUOC, tuc bien trang tri thanh dieu huong. */}
            {categories.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {categories.slice(0, 7).map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="inline-flex min-h-8 items-center whitespace-nowrap rounded-lg bg-card px-3 text-sm font-medium text-fg-muted ring-1 ring-line transition-colors hover:text-fg hover:ring-line-strong"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* MOT hanh dong chinh moi man hinh. Truoc day hai nut cung do dam nen
                khong biet nen bam cai nao; "Xem chu de" gio la lien ket phu. */}
            <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
              <Link
                href="/blog"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-600 px-6 font-semibold text-white shadow-e2 transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-e3"
              >
                <BookOpen className="h-5 w-5" aria-hidden="true" />
                Khám phá bài viết
              </Link>
              <Link
                href="/categories"
                className="group inline-flex min-h-12 items-center gap-1.5 rounded-xl px-4 font-medium text-surface-600 transition-colors hover:bg-white/70 hover:text-surface-900 dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white"
              >
                Xem chủ đề
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-7 text-sm text-fg-subtle">
              <span className="font-semibold tabular-nums text-fg">
                {totalPosts && totalPosts > 0 ? `${totalPosts}+` : '0'}
              </span>{' '}
              bài viết
              <span className="mx-2" aria-hidden="true">·</span>
              <span className="font-semibold tabular-nums text-fg">{categories.length}</span> chủ đề
            </p>
          </div>

          {/* Ban cho man hinh nho: anh nam duoi khoi chu, trong cung luoi nen
              khong phai tu che khoang cach. */}
          <div className="lg:hidden">
            <Image
              src={duongDanAnh('hero', brand)}
              alt=""
              width={640}
              height={760}
              sizes="(min-width: 1024px) 1px, 384px"
              priority
              className="mx-auto aspect-[4/5] w-full max-w-sm rounded-3xl object-cover shadow-e2 ring-1 ring-line"
            />
          </div>
        </div>

        {/* Tu 1024px: anh tran ra sat mep phai man hinh roi mo dan sang trai de
            hoa vao nen — het cam giac mot mieng anh dan de len trang.
            `alt=""` vi <h1> va doan mo ta ben canh da noi het noi dung. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] lg:block">
          <Image
            src={duongDanAnh('hero', brand)}
            alt=""
            fill
            sizes="(min-width: 1024px) 42vw, 1px"
            priority
            className="object-cover object-left"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 22%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 22%)',
            }}
          />
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
