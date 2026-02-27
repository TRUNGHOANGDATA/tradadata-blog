/**
 * Simple in-memory rate limiter for API routes.
 * For production with multiple serverless instances, consider Redis-based solutions.
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup expired entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
        if (now > entry.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 60_000); // Clean every minute

export interface RateLimitConfig {
    /** Max requests allowed in the window */
    maxRequests: number;
    /** Window size in seconds */
    windowSizeSeconds: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 60,
    windowSizeSeconds: 60,
};

export function rateLimit(
    identifier: string,
    config: RateLimitConfig = DEFAULT_CONFIG
): { success: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    if (!entry || now > entry.resetTime) {
        // New window
        rateLimitMap.set(identifier, {
            count: 1,
            resetTime: now + config.windowSizeSeconds * 1000,
        });
        return { success: true, remaining: config.maxRequests - 1, resetIn: config.windowSizeSeconds };
    }

    if (entry.count >= config.maxRequests) {
        const resetIn = Math.ceil((entry.resetTime - now) / 1000);
        return { success: false, remaining: 0, resetIn };
    }

    entry.count++;
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);
    return { success: true, remaining: config.maxRequests - entry.count, resetIn };
}

/**
 * Get client IP from request headers (works with Vercel, Cloudflare, etc.)
 */
export function getClientIp(request: Request): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        request.headers.get('cf-connecting-ip') ||
        'unknown'
    );
}
