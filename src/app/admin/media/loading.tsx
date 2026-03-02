'use client';

export default function MediaLoading() {
    return (
        <div className="admin-loading">
            <div className="admin-loading-header">
                <div>
                    <div className="skeleton skeleton-title" />
                    <div className="skeleton skeleton-subtitle" style={{ marginTop: 8 }} />
                </div>
                <div className="skeleton skeleton-btn" />
            </div>

            {/* Media grid skeleton */}
            <div className="admin-loading-media-grid">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="admin-loading-media-card">
                        <div className="skeleton skeleton-media-thumb" />
                        <div className="admin-loading-media-info">
                            <div className="skeleton skeleton-media-name" />
                            <div className="skeleton skeleton-media-meta" />
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .admin-loading { padding: 2rem; max-width: 1200px; }
                .admin-loading-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; }
                .skeleton {
                    background: linear-gradient(90deg, var(--color-surface-100, #f3f4f6) 25%, var(--color-surface-200, #e5e7eb) 50%, var(--color-surface-100, #f3f4f6) 75%);
                    background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; border-radius: 8px;
                }
                :root[data-theme="dark"] .skeleton, @media (prefers-color-scheme: dark) {
                    .skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 75%); background-size: 200% 100%; }
                }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                .skeleton-title { width: 160px; height: 32px; }
                .skeleton-subtitle { width: 80px; height: 16px; }
                .skeleton-btn { width: 140px; height: 40px; border-radius: 10px; }
                .admin-loading-media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
                .admin-loading-media-card {
                    border-radius: 12px; border: 1px solid var(--color-surface-200, #e5e7eb);
                    background: var(--color-surface-50, #f9fafb); overflow: hidden;
                }
                :root[data-theme="dark"] .admin-loading-media-card { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
                .skeleton-media-thumb { width: 100%; aspect-ratio: 1; border-radius: 0; }
                .admin-loading-media-info { padding: 0.75rem; display: flex; flex-direction: column; gap: 6px; }
                .skeleton-media-name { width: 80%; height: 14px; }
                .skeleton-media-meta { width: 50%; height: 12px; }
            `}</style>
        </div>
    );
}
