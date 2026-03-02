'use client';

export default function AdminLoading() {
    return (
        <div className="admin-loading">
            {/* Header skeleton */}
            <div className="admin-loading-header">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-btn" />
            </div>

            {/* Stats cards skeleton */}
            <div className="admin-loading-stats">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="admin-loading-card">
                        <div className="skeleton skeleton-icon" />
                        <div className="admin-loading-card-text">
                            <div className="skeleton skeleton-label" />
                            <div className="skeleton skeleton-value" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table skeleton */}
            <div className="admin-loading-table">
                <div className="admin-loading-table-header">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="skeleton skeleton-col" />
                    ))}
                </div>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="admin-loading-table-row">
                        <div className="skeleton skeleton-cell-avatar" />
                        <div className="skeleton skeleton-cell-text" />
                        <div className="skeleton skeleton-cell-short" />
                        <div className="skeleton skeleton-cell-badge" />
                        <div className="skeleton skeleton-cell-actions" />
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
                    margin-bottom: 2rem;
                }

                /* Skeleton base */
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

                .skeleton-title {
                    width: 220px;
                    height: 32px;
                }

                .skeleton-btn {
                    width: 140px;
                    height: 40px;
                    border-radius: 10px;
                }

                /* Stats cards */
                .admin-loading-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .admin-loading-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.25rem;
                    border-radius: 12px;
                    background: var(--color-surface-50, #f9fafb);
                    border: 1px solid var(--color-surface-200, #e5e7eb);
                }

                :root[data-theme="dark"] .admin-loading-card {
                    background: rgba(255,255,255,0.03);
                    border-color: rgba(255,255,255,0.08);
                }

                .skeleton-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 10px;
                    flex-shrink: 0;
                }

                .admin-loading-card-text {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .skeleton-label {
                    width: 80px;
                    height: 12px;
                }

                .skeleton-value {
                    width: 100px;
                    height: 24px;
                }

                /* Table */
                .admin-loading-table {
                    border-radius: 12px;
                    border: 1px solid var(--color-surface-200, #e5e7eb);
                    overflow: hidden;
                    background: var(--color-surface-50, #fff);
                }

                :root[data-theme="dark"] .admin-loading-table {
                    background: rgba(255,255,255,0.02);
                    border-color: rgba(255,255,255,0.08);
                }

                .admin-loading-table-header {
                    display: flex;
                    gap: 1rem;
                    padding: 1rem 1.25rem;
                    border-bottom: 1px solid var(--color-surface-200, #e5e7eb);
                    background: var(--color-surface-100, #f3f4f6);
                }

                :root[data-theme="dark"] .admin-loading-table-header {
                    background: rgba(255,255,255,0.04);
                    border-color: rgba(255,255,255,0.08);
                }

                .skeleton-col {
                    height: 14px;
                    flex: 1;
                    max-width: 120px;
                }

                .admin-loading-table-row {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.25rem;
                    border-bottom: 1px solid var(--color-surface-100, #f3f4f6);
                }

                :root[data-theme="dark"] .admin-loading-table-row {
                    border-color: rgba(255,255,255,0.05);
                }

                .admin-loading-table-row:last-child {
                    border-bottom: none;
                }

                .skeleton-cell-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    flex-shrink: 0;
                }

                .skeleton-cell-text {
                    flex: 2;
                    height: 16px;
                }

                .skeleton-cell-short {
                    flex: 1;
                    height: 14px;
                    max-width: 100px;
                }

                .skeleton-cell-badge {
                    width: 70px;
                    height: 24px;
                    border-radius: 9999px;
                }

                .skeleton-cell-actions {
                    width: 80px;
                    height: 32px;
                    border-radius: 8px;
                }
            `}</style>
        </div>
    );
}
