'use client';

export default function CategoriesLoading() {
    return (
        <div className="admin-loading">
            <div className="admin-loading-header">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-btn" />
            </div>

            {/* Category grid skeleton */}
            <div className="admin-loading-grid">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="admin-loading-category-card">
                        <div className="admin-loading-category-top">
                            <div className="skeleton skeleton-emoji" />
                            <div className="skeleton skeleton-dots" />
                        </div>
                        <div className="skeleton skeleton-cat-name" />
                        <div className="skeleton skeleton-cat-desc" />
                        <div className="admin-loading-category-badge">
                            <div className="skeleton skeleton-badge-sm" />
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .admin-loading { padding: 2rem; max-width: 1200px; }
                .admin-loading-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
                .skeleton {
                    background: linear-gradient(90deg, var(--color-surface-100, #f3f4f6) 25%, var(--color-surface-200, #e5e7eb) 50%, var(--color-surface-100, #f3f4f6) 75%);
                    background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; border-radius: 8px;
                }
                :root[data-theme="dark"] .skeleton, @media (prefers-color-scheme: dark) {
                    .skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 75%); background-size: 200% 100%; }
                }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                .skeleton-title { width: 180px; height: 32px; }
                .skeleton-btn { width: 160px; height: 40px; border-radius: 10px; }
                .admin-loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
                .admin-loading-category-card {
                    padding: 1.25rem; border-radius: 12px; border: 1px solid var(--color-surface-200, #e5e7eb);
                    background: var(--color-surface-50, #f9fafb); display: flex; flex-direction: column; gap: 0.75rem;
                }
                :root[data-theme="dark"] .admin-loading-category-card { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
                .admin-loading-category-top { display: flex; justify-content: space-between; align-items: center; }
                .skeleton-emoji { width: 40px; height: 40px; border-radius: 10px; }
                .skeleton-dots { width: 24px; height: 24px; border-radius: 6px; }
                .skeleton-cat-name { width: 60%; height: 20px; }
                .skeleton-cat-desc { width: 90%; height: 14px; }
                .admin-loading-category-badge { margin-top: 4px; }
                .skeleton-badge-sm { width: 70px; height: 22px; border-radius: 9999px; }
            `}</style>
        </div>
    );
}
