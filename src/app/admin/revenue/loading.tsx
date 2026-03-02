'use client';

export default function RevenueLoading() {
    return (
        <div className="admin-loading">
            <div className="admin-loading-header">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-btn" />
            </div>

            {/* Stats row */}
            <div className="admin-loading-stats">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="admin-loading-stat-card">
                        <div className="skeleton skeleton-icon" />
                        <div className="admin-loading-stat-text">
                            <div className="skeleton skeleton-label" />
                            <div className="skeleton skeleton-value" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart skeleton */}
            <div className="admin-loading-chart">
                <div className="admin-loading-chart-header">
                    <div className="skeleton skeleton-chart-title" />
                    <div className="skeleton skeleton-chart-legend" />
                </div>
                <div className="admin-loading-chart-body">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="admin-loading-chart-bar-wrapper">
                            <div
                                className="skeleton admin-loading-chart-bar"
                                style={{ height: `${30 + Math.random() * 60}%` }}
                            />
                        </div>
                    ))}
                </div>
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
                .skeleton-title { width: 160px; height: 32px; }
                .skeleton-btn { width: 140px; height: 40px; border-radius: 10px; }
                .admin-loading-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
                .admin-loading-stat-card {
                    display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border-radius: 12px;
                    background: var(--color-surface-50, #f9fafb); border: 1px solid var(--color-surface-200, #e5e7eb);
                }
                :root[data-theme="dark"] .admin-loading-stat-card { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
                .skeleton-icon { width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0; }
                .admin-loading-stat-text { flex: 1; display: flex; flex-direction: column; gap: 8px; }
                .skeleton-label { width: 80px; height: 12px; }
                .skeleton-value { width: 100px; height: 24px; }
                .admin-loading-chart {
                    border-radius: 12px; border: 1px solid var(--color-surface-200, #e5e7eb); overflow: hidden;
                    background: var(--color-surface-50, #fff); padding: 1.5rem;
                }
                :root[data-theme="dark"] .admin-loading-chart { background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.08); }
                .admin-loading-chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .skeleton-chart-title { width: 140px; height: 20px; }
                .skeleton-chart-legend { width: 200px; height: 16px; }
                .admin-loading-chart-body { display: flex; align-items: flex-end; gap: 8px; height: 220px; }
                .admin-loading-chart-bar-wrapper { flex: 1; height: 100%; display: flex; align-items: flex-end; }
                .admin-loading-chart-bar { width: 100%; border-radius: 4px 4px 0 0; min-height: 20px; }
            `}</style>
        </div>
    );
}
