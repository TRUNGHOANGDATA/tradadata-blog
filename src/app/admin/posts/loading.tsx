'use client';

export default function AdminPostsLoading() {
    return (
        <div className="admin-loading">
            {/* Header */}
            <div className="admin-loading-header">
                <div className="skeleton skeleton-title" />
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div className="skeleton skeleton-btn" />
                    <div className="skeleton skeleton-btn-primary" />
                </div>
            </div>

            {/* Search + filter bar */}
            <div className="admin-loading-filters">
                <div className="skeleton skeleton-search" />
                <div className="skeleton skeleton-filter" />
                <div className="skeleton skeleton-filter" />
            </div>

            {/* Posts list skeleton */}
            <div className="admin-loading-posts">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="admin-loading-post-row">
                        <div className="skeleton skeleton-post-thumb" />
                        <div className="admin-loading-post-info">
                            <div className="skeleton skeleton-post-title" />
                            <div className="skeleton skeleton-post-meta" />
                        </div>
                        <div className="skeleton skeleton-post-category" />
                        <div className="skeleton skeleton-post-status" />
                        <div className="skeleton skeleton-post-date" />
                        <div className="skeleton skeleton-post-actions" />
                    </div>
                ))}
            </div>

            <style>{`
                .admin-loading {
                    padding: 2rem;
                    max-width: 1200px;
                }

                .admin-loading-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                }

                .skeleton {
                    background: linear-gradient(
                        90deg,
                        var(--color-surface-100, #f3f4f6) 25%,
                        var(--color-surface-200, #e5e7eb) 50%,
                        var(--color-surface-100, #f3f4f6) 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s ease-in-out infinite;
                    border-radius: 8px;
                }

                :root[data-theme="dark"] .skeleton,
                @media (prefers-color-scheme: dark) {
                    .skeleton {
                        background: linear-gradient(
                            90deg,
                            rgba(255,255,255,0.06) 25%,
                            rgba(255,255,255,0.12) 50%,
                            rgba(255,255,255,0.06) 75%
                        );
                        background-size: 200% 100%;
                    }
                }

                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                .skeleton-title { width: 160px; height: 32px; }
                .skeleton-btn { width: 100px; height: 38px; border-radius: 10px; }
                .skeleton-btn-primary { width: 130px; height: 38px; border-radius: 10px; }

                .admin-loading-filters {
                    display: flex;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .skeleton-search { flex: 1; max-width: 320px; height: 40px; border-radius: 10px; }
                .skeleton-filter { width: 120px; height: 40px; border-radius: 10px; }

                .admin-loading-posts {
                    border-radius: 12px;
                    border: 1px solid var(--color-surface-200, #e5e7eb);
                    overflow: hidden;
                    background: var(--color-surface-50, #fff);
                }

                :root[data-theme="dark"] .admin-loading-posts {
                    background: rgba(255,255,255,0.02);
                    border-color: rgba(255,255,255,0.08);
                }

                .admin-loading-post-row {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.875rem 1.25rem;
                    border-bottom: 1px solid var(--color-surface-100, #f3f4f6);
                }

                :root[data-theme="dark"] .admin-loading-post-row {
                    border-color: rgba(255,255,255,0.05);
                }

                .admin-loading-post-row:last-child { border-bottom: none; }

                .skeleton-post-thumb {
                    width: 56px;
                    height: 36px;
                    border-radius: 6px;
                    flex-shrink: 0;
                }

                .admin-loading-post-info {
                    flex: 2;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .skeleton-post-title { width: 70%; height: 16px; }
                .skeleton-post-meta { width: 40%; height: 12px; }
                .skeleton-post-category { width: 80px; height: 24px; border-radius: 9999px; }
                .skeleton-post-status { width: 70px; height: 24px; border-radius: 9999px; }
                .skeleton-post-date { width: 90px; height: 14px; }
                .skeleton-post-actions { width: 70px; height: 32px; border-radius: 8px; }
            `}</style>
        </div>
    );
}
