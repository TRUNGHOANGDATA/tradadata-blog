/**
 * Redis client dùng chung (Upstash REST).
 *
 * Trước đây mỗi nơi cần Redis lại tự `new Redis(...)` — rate-limit.ts giữ một
 * instance riêng. Gom về một chỗ để mọi tính năng (rate limit, đếm lượt xem)
 * dùng chung một client, và để chỗ nào cũng kiểm tra `isRedisConfigured` theo
 * cùng một cách.
 *
 * Thiếu env (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`) thì
 * `redis` = null; nơi gọi phải tự xử lý fallback (local dev không có Upstash).
 */

import { Redis } from '@upstash/redis';

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const isRedisConfigured = Boolean(upstashUrl && upstashToken);

export const redis = isRedisConfigured
    ? new Redis({ url: upstashUrl!, token: upstashToken! })
    : null;

// Tên khoá Redis dùng cho bộ đếm lượt xem — gom một chỗ để route ghi và cron
// gộp luôn khớp nhau.
export const VIEW_KEYS = {
    /** Hash { slug: số lượt xem chưa gộp về Postgres } */
    pending: 'tdd:views:pending',
    /** Tiền tố khoá chống đếm trùng: tdd:views:seen:<ip>:<slug> */
    seenPrefix: 'tdd:views:seen',
} as const;
