# Trà Đá Data — Blog + Bán khóa học

Next.js 15 (App Router) + React 19 + Tailwind 4 + Supabase (Postgres) + NextAuth v5.
Domain chuẩn: `https://www.tradadata.com`.

**Hạ tầng: cụm Kubernetes tự dựng, KHÔNG phải Vercel.**
- Namespace `bizflow`, Deployment `tradadata`, container tên `blog`.
- Container `blog` nằm CHUNG POD với `ke-truyen` (trang truyen.tradadata.com) và Deployment
  dùng `strategy: Recreate` ⇒ deploy bên nào thì bên kia cũng downtime ~1-2 phút.
- Gateway public `125.212.235.148` chạy nginx 1.18.0 làm reverse proxy; control plane
  `192.168.1.250` chỉ tới được qua gateway (ProxyJump).
- Manifest Deployment/Service KHÔNG nằm trong repo này — chúng ở trên control plane.
  Repo chỉ giữ `k8s/cronjobs.yaml` (lịch chạy nền).
- **Deploy**: repo này đã public (08/09/2026) ⇒ có CI riêng, KHÔNG còn mượn
  `deploy-blog` của repo `ke-truyen` nữa. `.github/workflows/deploy.yml` tự chạy khi
  push vào `main` (và vẫn bấm tay được qua `workflow_dispatch`):
  typecheck → build image → push ghcr → `kubectl set image ... blog=<image>` → chờ rollout
  → **đối chiếu `/api/health` trả đúng commit SHA** mới coi là thành công.
  ⚠️ Vì vậy **mọi push vào `main` giờ là DEPLOY thật** — container `blog` chung pod với
  `ke-truyen` (`strategy: Recreate`) nên mỗi lần deploy là **cả hai site down ~1-2 phút**.
  Repo `ke-truyen` vẫn còn workflow `deploy-blog` cũ nhưng không nên dùng nữa — hai
  workflow chạy chồng lên nhau vào cùng 1 pod là giẫm chân nhau.
  Secret cần khai ở repo này (Settings → Secrets and variables → Actions):
  `SSH_PRIVATE_KEY`, `SSH_KNOWN_HOSTS`, `SSH_USER`, `SSH_GATEWAY`, `K8S_HOST`,
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
  `NEXT_PUBLIC_SERVICE_ACCOUNT_EMAIL` (tuỳ chọn). Tính đến 08/09/2026 mới khai
  `K8S_HOST`, `NEXT_PUBLIC_SUPABASE_URL`, `SSH_GATEWAY`, `SSH_USER` — còn thiếu
  `SSH_PRIVATE_KEY`/`SSH_KNOWN_HOSTS`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`/`SUPABASE_SERVICE_ROLE_KEY`
  nên workflow sẽ dừng ở bước deploy cho tới khi khai đủ.
  Image chạy Next.js standalone bằng `node server.js` (KHÔNG phải `next start`).
  Deployment mà khai `command:`/`args:` kiểu `npm start` là container không boot được.
- Env đọc từ Secret/env của k8s, KHÔNG phải từ Vercel. Mọi script đẩy env lên Vercel
  đã được xoá khỏi repo.
- **Vận hành cụm khi cần sửa env / xem log**: máy dev KHÔNG có `kubectl`, control plane
  `192.168.1.250` chỉ vào được qua gateway bằng khoá SSH — khoá đó nằm trong secret của
  repo `TRUNGHOANGDATA/ke-truyen`, không có ở repo này. Đường vào là workflow `blog-cron`
  bên repo đó (`workflow_dispatch`, 5 chế độ):
  - `diagnose` — chỉ đọc: CronJob, TÊN các Secret, image, job cron gần nhất.
  - `apply-cronjobs` — áp `k8s/cronjobs.yaml` của repo này lên cụm.
  - `test-run` — chạy ngay một CronJob, không chờ tới giờ.
  - `check-lead-mail` — chỉ đọc, chẩn đoán mail: đếm số dòng log theo dấu hiệu, in mã lỗi
    SMTP, che địa chỉ email, in độ dài `EMAIL_PASS` chứ không in giá trị.
  - `set-mail-secret` — ghi `EMAIL_USER`/`EMAIL_PASS`/`LEAD_NOTIFY_EMAIL` vào Secret
    `tradadata-blog-secret` rồi `rollout restart`. Lấy giá trị từ **secret của repo
    ke-truyen** (`BLOG_EMAIL_USER`, `BLOG_EMAIL_PASS`, `BLOG_LEAD_NOTIFY_EMAIL`).
  ⚠️ Repo `ke-truyen` là **public** ⇒ tuyệt đối không in giá trị secret, log ứng dụng hay
  dữ liệu khách vào Actions log, và không nhận secret qua `inputs` (input hiện nguyên văn
  trong log). Vì cùng lý do workflow đó cố ý không có ô "nhập lệnh kubectl tự do".
  Mỗi lần `rollout restart` là **cả blog và ke-truyen down ~1-2 phút** (`Recreate`, chung pod).
- ⚠️ **Push vào `main` của repo `ke-truyen` là DEPLOY, kể cả khi chỉ sửa workflow.**
  `deploy.yml` bên đó có trigger `push: branches: [main]` — và từ 08/09/2026 repo
  này cũng vậy (`.github/workflows/deploy.yml`), nên push vào `main` ở CẢ HAI repo
  đều là deploy thật. Deploy trang truyện thì recreate pod, nên **blog down theo**
  (và ngược lại).
  Nó có `paths-ignore` nhưng đã từng hở: mẫu `.github/workflows/blog-*.yml` khớp
  `blog-cron.yml` mà KHÔNG khớp `deploy-blog.yml`. Ngày 07/09/2026 mình sửa
  `deploy-blog.yml` và làm cả hai site 502 khoảng 3-5 phút vì đúng lỗ này.
  Trước khi push bất cứ thứ gì vào `ke-truyen`, kiểm `paths-ignore` trong
  `deploy.yml` xem đường dẫn của mình có được loại trừ chưa.

## Chạy dự án

```bash
npm install
npm run dev      # next dev
npm run build    # next build
npm run lint     # eslint (đang có sẵn ~37 lỗi no-explicit-any, chưa dọn)
npx tsc --noEmit # cổng chắn thật, vì next.config bật ignoreBuildErrors
```

Build image như CI:

```bash
docker build -t tradadata-blog:local   --build-arg NEXT_PUBLIC_SUPABASE_URL=...   --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=...   --secret id=supabase_service_role_key,src=./.srk .
```

Cần file `.env.local` (không có trong repo). Các biến đang được dùng:

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `NEXT_PUBLIC_APP_URL`,
`GOOGLE_DRIVE_CREDENTIALS` (service account JSON dạng string), `GOOGLE_OAUTH_REFRESH_TOKEN`,
`GOOGLE_DRIVE_FOLDER_ID` / `_FILES_FOLDER_ID` / `_VIDEOS_FOLDER_ID`,
`EMAIL_USER`, `EMAIL_PASS` (Gmail app password), `NEWSLETTER_FROM_NAME`,
`GEMINI_API_KEY`, `CRON_SECRET`, `NEXT_PUBLIC_SERVICE_ACCOUNT_EMAIL`,
`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

## Kiến trúc

- **Data access**: hầu như MỌI truy vấn DB đi qua `supabaseAdmin` (service role key, bypass RLS)
  trong `src/lib/supabase/server.ts`. Client browser (`src/lib/supabase/client.ts`) gần như không dùng.
  ⇒ Phân quyền nằm ở tầng API route, KHÔNG dựa vào RLS.
- **Auth**: NextAuth v5 (`src/lib/auth.ts`), chỉ Google provider, session JWT.
  `jwt` callback đọc `profiles` để nhét `role` + `is_subscribed` vào token.
  Role: `admin` | `editor` | `reader`.
- **Middleware** (`src/middleware.ts`): redirect `tradadata.vn`/apex → `www.tradadata.com`,
  và chạy `auth()` cho `/admin/*`. Matcher loại trừ `api/` ⇒ **API routes tự kiểm tra quyền**.
- **Nội dung bài viết**: Tiptap JSON lưu ở `posts.content` (text). Render server-side bằng
  `renderPostContent()` trong `src/lib/highlight-utils.ts` (dùng `@tiptap/html` + happy-dom + lowlight),
  bọc trong `unstable_cache`.
- **File/ảnh**: upload lên Google Drive (`src/lib/storage/google-drive.ts`), ưu tiên OAuth2 refresh token
  (dùng quota 15GB của user); service account chỉ là fallback và **có 0 quota**.
- **Email**: Nodemailer + Gmail (`src/lib/email/gmail.ts`). Template lưu trong bảng `email_templates`,
  thay biến `{{ten_bien}}` bằng `src/lib/email/template-engine.ts`.
  `service: 'gmail'` ⇒ luôn xác thực vào smtp.gmail.com, nên **`EMAIL_USER` bắt buộc phải là
  chính tài khoản Google đã sinh ra app password trong `EMAIL_PASS`** (16 ký tự, bỏ hết dấu
  cách). Sai điều này là Gmail trả `535` / `code: 'EAUTH'`. Đã bị đúng lỗi này một lần
  (07/09/2026): `EMAIL_USER` khai địa chỉ đuôi `.vn` không phải tài khoản Google ⇒ mail chết
  im lặng nhiều tháng.
  `sendEmail` **không throw** — nó trả `{ success: false, error }`, mọi nơi gọi đều bỏ qua lỗi
  để không làm hỏng request. Nghĩa là mail chết thì UI vẫn báo thành công, chỉ log mới biết.
  Có 8 route gọi nó (`orders/create`, `admin/orders/create`, `admin/orders/[id]/approve`,
  `cron/check-subscriptions`, `cron/process-email-queue`, `newsletter/send`,
  `newsletter/subscribe`, `api/leads`) ⇒ **một điểm chết duy nhất làm mất sạch mail**, nặng
  nhất là khách đặt hàng không nhận được hướng dẫn chuyển khoản.
  Kiểm tra nhanh mail còn sống không: chạy `blog-cron` chế độ `check-lead-mail`, xem
  `[lead] Da bao mail ve` và `Message sent:` có > 0 không.
  `LEAD_NOTIFY_EMAIL` là nơi nhận mail báo khách quan tâm phần mềm; thiếu thì rơi về `EMAIL_USER`.
- **Cron**: 2 endpoint `/api/cron/process-email-queue` và `/api/cron/check-subscriptions`,
  cả hai yêu cầu header `Authorization: Bearer $CRON_SECRET`.
  Lịch chạy bằng CronJob của k8s, manifest ở `k8s/cronjobs.yaml`.
  (Trước đây lịch khai trong `vercel.json` — file đó chỉ Vercel mới đọc nên trên cụm
  chưa bao giờ chạy; đã xoá để khỏi gây hiểu nhầm.)

## Bảng DB đang dùng

`profiles`, `posts`, `categories`, `tags`, `post_tags`, `post_categories` (junction, cho phép 1 bài nhiều chủ đề),
`comments`, `user_bookmarks`, `subscribers`, `email_queue`, `email_templates`, `site_settings`,
`products`, `course_sections`, `orders`, `coupons`, `coupon_products`, `user_coupons`, `user_subscriptions`.

⚠️ **Repo KHÔNG dựng lại được database.** `setup.sql` và `schema.json` đã bị xoá — chúng chỉ
mô tả 4 bảng đời đầu nhưng trông như bản đầy đủ. `supabase/migrations/` vẫn còn nhưng chỉ là
lịch sử một phần: nó **không** chứa 10 bảng app đang dùng (`orders` 18 file code, `products` 8,
`user_subscriptions` 8, `user_coupons` 7, `coupons` 6, `site_settings` 5, `coupon_products` 4,
`software_leads` 2, `course_sections` 2, `email_queue` 2 — không bảng nào có trong migration).
Chạy hết migration lên DB rỗng sẽ ra schema thiếu sạch phần bán hàng mà vẫn báo thành công.
Xem `supabase/migrations/README.md`. Schema thật sửa trực tiếp trên Supabase — cần biết cột nào
có thật thì đọc code hoặc query DB.

## Luồng nghiệp vụ chính

**Bán hàng (chuyển khoản thủ công, không cổng thanh toán):**
1. `/courses` hoặc `/pricing` → thêm giỏ (`CartContext`, localStorage `tdd-cart`).
2. `/checkout/create` → `POST /api/orders/create`: kiểm tra product, áp coupon
   (hạn dùng, `usage_limit`, `per_user_limit`, giới hạn theo product qua `coupon_products`),
   sinh `order_code` = `TDD-XXXXXX`, hạn 24h, status `pending`, gửi mail `payment_pending`.
   Nếu coupon làm giá = 0 ⇒ tự động `paid` + kích hoạt subscription luôn.
3. Khách chuyển khoản → admin vào `/admin/orders` bấm duyệt →
   `POST /api/admin/orders/[id]/approve`: set `paid`, bật `profiles.is_subscribed`,
   tạo `user_subscriptions` với **subscription stacking** (`starts_at = max(now, expires_at hiện tại)`),
   gửi mail `payment_success`, ghi log Google Sheet.
4. Client poll `/api/orders/status?order_code=...` mỗi 15s để tự xoá giỏ khi đơn được duyệt.

⚠️ Duration khi admin duyệt tay bị **hardcode 30 ngày** trong `approve/route.ts`,
trong khi luồng auto-activate ở `orders/create` lại đọc đúng `products.duration_days`.

**Premium gating**: `posts.is_premium` + `profiles.is_subscribed`. Nếu chưa mở khoá,
`src/app/blog/[slug]/page.tsx` làm mờ HTML và chèn CTA. Nội dung đầy đủ vẫn được render
ở server rồi mới cắt ⇒ chỉ là rào UI, không phải rào bảo mật thật.

**Newsletter**: `subscribers` → admin gửi bài mới → đẩy vào `email_queue` → cron gửi tối đa 90 mail/lần.

## Quy ước code

- Comment và message trả về người dùng viết **tiếng Việt**.
- Indent 4 space trong `src/`.
- API route: luôn mở đầu bằng `const session = await auth()` rồi check
  `session.user.role !== 'admin'` (một số route cho phép cả `editor`).
- `next.config.ts` đang bật `eslint.ignoreDuringBuilds` và `typescript.ignoreBuildErrors`
  ⇒ **lỗi type không chặn deploy**. Chạy `npx tsc --noEmit` thủ công trước khi push.
- Ảnh remote phải khai báo hostname trong `next.config.ts` → `images.remotePatterns`.

## Điểm cần lưu ý khi phát triển tiếp

- **Trang nào tĩnh, trang nào động** (đo bằng `curl -I`, xem `Cache-Control`):
  - `/`, `/categories`, `/tag/[slug]`, `/courses` — có `revalidate` và không dùng
    API động ⇒ được cache ở tầng route (`x-nextjs-cache: HIT`), rất nhanh.
  - `/blog` — **động**, vì dùng `searchParams` (phân trang, lọc danh mục).
    `export const revalidate` ở file đó KHÔNG bao giờ áp dụng, đừng tin nó.
  - `/blog/[slug]` — **động**, vì gọi `auth()` để gating Premium.
    Có `generateStaticParams` nhưng nó chỉ còn tác dụng lúc build.
  ⇒ Với hai trang động này, thứ giữ cho chúng nhanh là **data cache**, không phải
  route cache. Đừng thêm `export const revalidate` rồi tưởng đã xong.

- **Mọi truy vấn dùng chung phải đi qua `src/lib/data/*` và bọc `unstable_cache`.**
  Đừng viết `supabaseAdmin.from(...)` thẳng trong page component. Lý do đo được
  (07/09/2026): TTFB `/blog` là **1343ms** vì tầng data không cache và có 36 truy
  vấn thô nằm rải trong page.
  - `posts.ts`: `getPosts`, `getPostBySlug`, `getPinnedPosts`, `getRelatedPosts`,
    `searchPosts`, `getPostTags`, `getAllPublishedSlugs` — tag `posts`.
  - `categories.ts`: `getCategories`, `getCategoryBySlug`, `getCategoryPostCounts`
    — tag `categories` (riêng `getCategoryPostCounts` mang cả hai tag).
  - `settings.ts`: `getSetting(key, fallback)` — tag `settings`.
  - **KHÔNG được cache**: dữ liệu theo người dùng hoặc theo đơn hàng —
    `profiles.is_subscribed` trong `/blog/[slug]`, `user_bookmarks` ở `/saved`,
    `orders` ở `/checkout/[order_code]`, và `getPostBySlugForPreview` (xem bản nháp).
    Cache dùng chung cho mọi khách nên cache mấy thứ này là rò dữ liệu/quyền.

- **Layout gốc KHÔNG được `await` truy vấn không cache.** `Footer` nằm trong layout
  và đọc `site_settings`; trước đây không cache nên React không render nổi shell,
  server không gửi được byte nào cho tới khi truy vấn xong ⇒ mọi trang động trả giá,
  và `loading.tsx` cũng không có cơ hội hiện ra. Đã bọc `unstable_cache` tag `settings`.

- **KHÔNG được thêm `loading.tsx` ở gốc `src/app/`.** Nó đặt một Suspense boundary
  ở tầng cao nhất của **mọi** route, nên Next xả HTML shell với status 200 ngay lập
  tức. Đến khi `notFound()` hay `redirect()` được gọi thì dòng status đã gửi đi rồi —
  Next chỉ còn cách nhét chỉ thị vào trong stream. Body của một route `redirect()`
  thử nghiệm chứa nguyên văn `REDIRECT;replace;/;307;` bên trong một phản hồi 200.

  Đây là gốc của cả một lớp lỗi từng bị coi là bí ẩn:
  - `/pricing` thành trang trắng 200 ở PR #8 (`permanentRedirect()` không sinh
    `Location`) — đã vòng qua bằng `redirects()` trong `next.config.ts` (PR #12),
    nhưng lúc đó chưa biết vì sao.
  - `/blog/trang/999`, `/category/<không-tồn-tại>`, `/tag/<không-tồn-tại>`,
    `/blog/<slug-không-tồn-tại>` đều trả **soft 404** (mã 200 kèm giao diện 404).

  Cách xác định (08/09/2026): chạy `next dev` cục bộ để loại trừ nginx, rồi bỏ lần
  lượt `error.tsx`, `not-found.tsx`, `middleware` — vẫn 200. Bỏ `src/app/loading.tsx`
  thì `/category/x` và `/tag/x` trả **404 thật** ngay.

  ⚠️ `loading.tsx` ở segment con cũng gây đúng chuyện đó cho segment đó và con của
  nó. Đo được:

  | bỏ gì | `/category/x` | `/tag/x` | `/blog/x` | `/blog/trang/999` |
  |---|---|---|---|---|
  | nguyên trạng | 200 | 200 | 200 | 200 |
  | chỉ `src/app/loading.tsx` | 404 | 404 | 200 | 200 |
  | thêm `blog/loading.tsx` + `blog/[slug]/loading.tsx` | 404 | 404 | 404 | 404 |

  Hiện đã bỏ ở gốc. `blog/loading.tsx` và `blog/[slug]/loading.tsx` **còn giữ**, nên
  hai đường `/blog/*` vẫn là soft 404 — giữ có ý thức để còn skeleton khi điều hướng
  trong trang. Muốn 404 thật ở đó thì phải bỏ chúng, hoặc chuyển sang bọc `<Suspense>`
  **bên trong** page ở dưới điểm quyết định `notFound()`.

  Muốn có skeleton mà vẫn giữ mã đúng: đừng dùng `loading.tsx`, hãy `await` truy vấn
  quyết định 404 trước, rồi mới bọc `<Suspense>` quanh phần chậm còn lại.

- **Invalidate**: `revalidatePost(slugs, postId)` / `revalidateTaxonomy()` /
  `revalidateSettings()` trong `src/lib/cache.ts` —
  **bắt buộc gọi ở mọi API route ghi vào posts / post_tags / post_categories /
  categories / tags / site_settings**.
  Đừng gọi trong route đếm lượt xem (`/api/posts/[slug]/view`) — sẽ phá cache mỗi lượt đọc.
- `src/lib/rate-limit.ts` dùng Upstash Redis (sliding window) khi có
  `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`; thiếu env thì tự rơi về bộ đếm
  in-memory (chỉ đủ cho local dev). Hàm `rateLimit()` là **async** — phải `await`.
  Redis lỗi thì fail open, không chặn người dùng thật.
- **Premium gating**: nội dung bị CẮT ở server (`truncateContent`, `PREMIUM_PREVIEW_BLOCKS`
  block đầu) trước khi render, không phải làm mờ bằng CSS. Hai biến thể dùng cache key
  khác nhau (`post-content-<id>` và `post-content-preview-<id>`).
- **Danh sách bài viết KHÔNG được mang theo `content`.** `BlogListClient` và `PinnedSlider`
  là Client Component, props của chúng bị Next serialize vào RSC payload gửi cho trình duyệt.
  Mọi hàm trả về danh sách trong `src/lib/data/posts.ts` phải dùng `formatPostForList`
  (đã bỏ `content`); chỉ `getPostBySlug`/`getPostBySlugForPreview` mới giữ `content`.
  Thêm hàm danh sách mới mà quên là lộ sạch nội dung bài Premium.
- Các fallback `|| 'https://tradadata.com'` trong email/order route vẫn là non-www,
  chỉ dùng khi thiếu `NEXT_PUBLIC_APP_URL`. Không ảnh hưởng nếu env được set đúng.
- **Secret**: đã gỡ hết secret hardcode khỏi working tree (commit `e610833`), các script gốc repo
  đọc từ `.env.local` qua `scripts-env.js`. Nhưng git history của repo public vẫn còn
  credential cũ ⇒ toàn bộ key trong đó phải coi là đã lộ và bắt buộc xoay vòng.
  Tuyệt đối không hardcode secret vào bất kỳ file nào trong repo.
