/**
 * Rate limiter dùng chung cho các API route công khai.
 *
 * Ưu tiên Upstash Redis (bộ đếm dùng chung cho mọi instance của app).
 * Nếu chưa cấu hình Upstash thì tự động rơi về bộ đếm in-memory — chỉ đủ dùng
 * cho local dev: mỗi instance giữ một Map riêng, và Map mất sạch mỗi lần
 * pod restart (deploy blog hay deploy truyện đều làm pod restart).
 *
 * Cấu hình: đặt UPSTASH_REDIS_REST_URL và UPSTASH_REDIS_REST_TOKEN trong env.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export interface RateLimitConfig {
    /** Max requests allowed in the window */
    maxRequests: number;
    /** Window size in seconds */
    windowSizeSeconds: number;
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    /** Số giây còn lại tới khi cửa sổ reset */
    resetIn: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 60,
    windowSizeSeconds: 60,
};

// ==============================
// Upstash
// ==============================

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const isUpstashConfigured = Boolean(upstashUrl && upstashToken);

const redis = isUpstashConfigured
    ? new Redis({ url: upstashUrl!, token: upstashToken! })
    : null;

// Mỗi cặp (maxRequests, windowSizeSeconds) cần một instance riêng — cache lại
// để không tạo mới mỗi request.
const limiterCache = new Map<string, Ratelimit>();

function getLimiter(config: RateLimitConfig): Ratelimit {
    const key = `${config.maxRequests}:${config.windowSizeSeconds}`;
    let limiter = limiterCache.get(key);

    if (!limiter) {
        limiter = new Ratelimit({
            redis: redis!,
            // Sliding window chặt hơn fixed window: không cho dồn 2x request
            // ngay tại thời điểm giao giữa hai cửa sổ.
            limiter: Ratelimit.slidingWindow(config.maxRequests, `${config.windowSizeSeconds} s`),
            prefix: 'tdd-rl',
            analytics: false,
            // Redis treo thì sau 1s coi như cho qua, không bắt người dùng chờ.
            // Ưu tiên site chạy được hơn là chặn tuyệt đối.
            timeout: 1000,
        });
        limiterCache.set(key, limiter);
    }

    return limiter;
}

// ==============================
// Fallback in-memory
// ==============================

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Chỉ dọn rác khi thực sự chạy ở chế độ fallback
if (!isUpstashConfigured) {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of rateLimitMap.entries()) {
            if (now > entry.resetTime) {
                rateLimitMap.delete(key);
            }
        }
    }, 60_000);
}

function rateLimitInMemory(identifier: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(identifier, {
            count: 1,
            resetTime: now + config.windowSizeSeconds * 1000,
        });
        return { success: true, remaining: config.maxRequests - 1, resetIn: config.windowSizeSeconds };
    }

    const resetIn = Math.ceil((entry.resetTime - now) / 1000);

    if (entry.count >= config.maxRequests) {
        return { success: false, remaining: 0, resetIn };
    }

    entry.count++;
    return { success: true, remaining: config.maxRequests - entry.count, resetIn };
}

// ==============================
// API công khai
// ==============================

let warnedMissingUpstash = false;

export async function rateLimit(
    identifier: string,
    config: RateLimitConfig = DEFAULT_CONFIG
): Promise<RateLimitResult> {
    if (!isUpstashConfigured) {
        if (!warnedMissingUpstash && process.env.NODE_ENV === 'production') {
            warnedMissingUpstash = true;
            console.warn(
                '[rate-limit] Thiếu UPSTASH_REDIS_REST_URL/TOKEN — đang dùng bộ đếm in-memory, ' +
                'chỉ chặn được trong phạm vi một instance và mất khi pod restart.'
            );
        }
        return rateLimitInMemory(identifier, config);
    }

    try {
        const { success, remaining, reset } = await getLimiter(config).limit(identifier);
        return {
            success,
            remaining,
            resetIn: Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
        };
    } catch (error) {
        // Redis lỗi/timeout thì KHÔNG chặn người dùng thật — fail open,
        // nhưng vẫn còn bộ đếm in-memory chặn được spam thô trong cùng instance.
        console.error('[rate-limit] Upstash lỗi, tạm rơi về in-memory:', error);
        return rateLimitInMemory(identifier, config);
    }
}

/**
 * Lấy IP client từ header do reverse proxy đặt (nginx ở gateway, Cloudflare...)
 */
export function getClientIp(request: Request): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        request.headers.get('cf-connecting-ip') ||
        'unknown'
    );
}
