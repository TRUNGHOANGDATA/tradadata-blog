# Trà Đá Data

Blog kiêm trang bán khoá học tại [www.tradadata.com](https://www.tradadata.com) — chia sẻ
kiến thức về Data, AI và Supply Chain.

Next.js 15 (App Router) · React 19 · Tailwind 4 · Supabase (Postgres) · NextAuth v5

> Tài liệu kiến trúc chi tiết nằm ở [CLAUDE.md](CLAUDE.md). File này chỉ là điểm bắt đầu.

## Chạy ở máy

```bash
npm install
npm run dev          # http://localhost:3000
```

Cần file `.env.local` ở thư mục gốc (không có trong repo). Lấy giá trị từ Secret
`tradadata-blog-secret` trên cụm, hoặc từ dashboard của từng dịch vụ.

Các biến đang được dùng:

| Nhóm | Biến |
|---|---|
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Đăng nhập | `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `NEXT_PUBLIC_APP_URL` |
| Google Drive | `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`, `GOOGLE_DRIVE_CREDENTIALS`, `GOOGLE_DRIVE_FOLDER_ID`, `GOOGLE_DRIVE_FILES_FOLDER_ID`, `GOOGLE_DRIVE_VIDEOS_FOLDER_ID` |
| Email | `EMAIL_USER`, `EMAIL_PASS`, `NEWSLETTER_FROM_NAME` |
| Khác | `GEMINI_API_KEY`, `CRON_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |

## Lệnh hay dùng

```bash
npm run dev          # chạy dev
npm run build        # build production
npx tsc --noEmit     # BẮT BUỘC chạy trước khi push (xem phần Bẫy bên dưới)
npm run lint         # eslint — đang có sẵn ~37 lỗi no-explicit-any, chưa dọn
```

## Kiến trúc tóm tắt

- **Truy cập DB**: gần như mọi query đi qua `supabaseAdmin` (service role key, bỏ qua RLS)
  trong `src/lib/supabase/server.ts`. ⇒ **Phân quyền nằm ở tầng API route**, không dựa vào RLS.
- **Đăng nhập**: NextAuth v5, chỉ Google, session JWT. Role: `admin` | `editor` | `reader`.
- **Nội dung bài viết**: Tiptap JSON lưu ở `posts.content`, render server-side bằng
  `renderPostContent()` trong `src/lib/highlight-utils.ts`.
- **File/ảnh**: upload lên Google Drive, ưu tiên OAuth2 refresh token (dùng quota của user);
  service account chỉ là fallback và **có 0 quota**.
- **Bán hàng**: chuyển khoản thủ công, không cổng thanh toán. Khách đặt đơn → admin duyệt tay
  ở `/admin/orders` → kích hoạt Premium.

## Deploy

Site chạy trên **cụm Kubernetes tự dựng**, không phải Vercel.

Repo này đã public nên tự có CI riêng, không còn mượn workflow của `ke-truyen` nữa.
Workflow **`deploy`** (`.github/workflows/deploy.yml`) tự chạy mỗi khi push vào `main`
(typecheck → build image → push ghcr → `kubectl set image` → chờ rollout → đối chiếu
`/api/health`). Cần deploy lại mà không có commit mới thì bấm tay:

```bash
gh workflow run deploy --repo TRUNGHOANGDATA/tradadata-blog -f ref=main
```

Nghiệm thu — bắt buộc:

```bash
curl https://www.tradadata.com/api/health
```

`version` phải đúng bằng commit SHA vừa deploy. Workflow tự kiểm bước này, không khớp thì
báo đỏ. **`kubectl rollout status` xong không có nghĩa là code mới đang phục vụ.**

Muốn deploy tay (khi Actions không dùng được): xem [k8s/DEPLOY.md](k8s/DEPLOY.md).

> ⚠️ Container `blog` nằm chung pod với trang truyện, Deployment dùng `strategy: Recreate`
> ⇒ deploy bên nào thì bên kia cũng gián đoạn 1–2 phút.

## Lịch chạy nền

Hai CronJob của k8s, manifest ở [k8s/cronjobs.yaml](k8s/cronjobs.yaml):

| CronJob | Lịch | Việc |
|---|---|---|
| `tradadata-blog-email-queue` | mỗi 10 phút | Gửi email báo bài mới trong `email_queue` |
| `tradadata-blog-check-subscriptions` | 01:00 UTC | Gửi email nhắc gia hạn Premium |

Quản lý bằng workflow `blog-cron` ở repo `ke-truyen`: `diagnose` (xem tình trạng),
`apply-cronjobs` (áp lại manifest), `test-run` (chạy thử ngay, không chờ tới giờ).

## Bẫy cần biết trước khi sửa code

- **Lỗi type không chặn build.** `next.config.ts` bật `typescript.ignoreBuildErrors`, nên
  `next build` vẫn qua dù code sai type. Cổng chắn thật là `npx tsc --noEmit`, chạy thủ công.
- **Ghi dữ liệu bài viết thì phải xoá cache.** `/blog/[slug]` là trang tĩnh (SSG), không tự
  làm mới. Gọi `revalidatePost()` / `revalidateTaxonomy()` trong `src/lib/cache.ts` ở mọi API
  route ghi vào `posts` / `post_tags` / `post_categories` / `categories` / `tags`. Quên là bài
  sửa xong không thấy đổi cho tới lần deploy sau.
- **Danh sách bài viết không được mang cột `content`.** `BlogListClient` và `PinnedSlider` là
  Client Component; props của chúng bị serialize vào payload gửi cho trình duyệt. Mọi hàm trả
  về danh sách trong `src/lib/data/posts.ts` phải dùng `formatPostForList`. Quên là lộ sạch
  nội dung bài Premium.
- **Nhúng `categories` phải ghi rõ `categories!category_id`.** Bảng `posts` có hai quan hệ tới
  `categories` (khoá ngoại và bảng nối), viết chung chung là PostgREST trả lỗi.
- **Repo không dựng lại được database.** `setup.sql` và `schema.json` đã xoá vì chỉ mô tả 4
  bảng đời đầu mà trông như bản đầy đủ. `supabase/migrations/` chỉ là lịch sử một phần, thiếu
  toàn bộ 10 bảng của phần bán hàng — xem `supabase/migrations/README.md`. Muốn biết cột nào
  có thật thì đọc code hoặc query DB.
- **Không hardcode secret vào bất kỳ file nào.** Script chạy tay đọc `.env.local` qua
  `scripts-env.js`.

## Cấu trúc thư mục

```
src/app/          route (App Router) — trang công khai, /admin, /api
src/components/   component dùng chung
src/lib/          data access, auth, cache, email, storage, rate limit
k8s/              manifest CronJob + hướng dẫn deploy tay
```

## Script chạy tay

Đều chạy bằng `node <tên-file>`, đọc `.env.local`:

| Script | Việc |
|---|---|
| `set-admin.js` | Cấp quyền admin cho một email |
| `get-google-token.js` | Lấy Google OAuth refresh token (dùng khi xoay vòng key) |
| `seed-email-templates.js` | Nạp lại bảng `email_templates` |
| `check-users.js` | In danh sách `profiles` |
| `scrape-hocexcel.js` | Tải sitemap hocexcel.online, gom chủ đề — dùng khi lên kế hoạch nội dung |
| `tao-anh-bai-viet.js` | Module dựng ảnh bảng tính Excel (SVG → PNG) — file khai ảnh gọi vào |
| `tao-anh-bia.js` | Module dựng ảnh bìa bài viết 1200x630 |
| `nhap-bai-viet.js` | Nhập bài từ Markdown trong `noi-dung/` vào `posts` dạng nháp |
| `create-favicon.js` | Sinh `favicon.ico` từ logo (cần `npm i sharp`) |
| `submit-index.mjs` | Đẩy URL lên Google Indexing API |
| `test-send-emails.js` | Thử gửi email |
