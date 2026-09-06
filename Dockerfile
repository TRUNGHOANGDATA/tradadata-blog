# syntax=docker/dockerfile:1.7
#
# Image cho container `blog` (Deployment `tradadata`, namespace `bizflow`).
# Dựng theo chuẩn standalone của Next.js: stage cuối chỉ chứa server đã tree-shake
# + static + public, không có toàn bộ node_modules và không có mã nguồn.

# ─────────────────────────────────────────────────────────────
# 1. deps — cài dependency, tách riêng để tận dụng cache layer
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ─────────────────────────────────────────────────────────────
# 2. builder — chạy next build
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Biến NEXT_PUBLIC_* bị nhúng thẳng vào bundle phía client lúc build,
# nên bắt buộc phải có mặt ở đây chứ không thể chỉ đặt lúc chạy.
# Đây đều là giá trị công khai (URL, anon key) nên truyền bằng build-arg là ổn.
ARG NEXT_PUBLIC_APP_URL=https://www.tradadata.com
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SERVICE_ACCOUNT_EMAIL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_SERVICE_ACCOUNT_EMAIL=$NEXT_PUBLIC_SERVICE_ACCOUNT_EMAIL \
    NEXT_TELEMETRY_DISABLED=1

# SUPABASE_SERVICE_ROLE_KEY cần có lúc build vì trang chủ, /blog, /categories,
# /courses được prerender và generateStaticParams đọc danh sách slug từ DB.
# Thiếu nó thì build vẫn chạy nhưng các trang này bị prerender RỖNG và phải chờ
# hết TTL (tới 1 giờ với /blog) mới có nội dung.
#
# Dùng BuildKit secret thay vì ARG: giá trị chỉ tồn tại trong lúc chạy lệnh,
# không nằm lại trong layer hay trong `docker history`.
RUN --mount=type=secret,id=supabase_service_role_key,required=false \
    SUPABASE_SERVICE_ROLE_KEY="$(cat /run/secrets/supabase_service_role_key 2>/dev/null || echo '')" \
    npm run build

# ─────────────────────────────────────────────────────────────
# 3. runner — image chạy thật
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Chạy bằng user không phải root
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# standalone KHÔNG tự chép `public/` và `.next/static` — phải chép tay,
# quên là mất sạch ảnh, CSS và JS.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Commit SHA của image, để /api/health báo ra đúng phiên bản đang chạy
ARG APP_VERSION=unknown
ENV APP_VERSION=$APP_VERSION

USER nextjs
EXPOSE 3000

# server.js do output:'standalone' sinh ra
CMD ["node", "server.js"]
