'use client';

export default function SettingsLoading() {
    return (
        <div className="admin-loading">
            <div className="admin-loading-header">
                <div className="skeleton skeleton-title" />
            </div>

            {/* Settings form skeleton */}
            {[...Array(3)].map((_, section) => (
                <div key={section} className="admin-loading-settings-section">
                    <div className="skeleton skeleton-section-title" />
                    <div className="admin-loading-settings-fields">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="admin-loading-field">
                                <div className="skeleton skeleton-field-label" />
                                <div className="skeleton skeleton-field-input" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="admin-loading-settings-btn-row">
                <div className="skeleton skeleton-save-btn" />
            </div>

            <style>{`
                .admin-loading { padding: 2rem; max-width: 800px; }
                .admin-loading-header { margin-bottom: 2rem; }
                .skeleton {
                    background: linear-gradient(90deg, var(--color-surface-100, #f3f4f6) 25%, var(--color-surface-200, #e5e7eb) 50%, var(--color-surface-100, #f3f4f6) 75%);
                    background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; border-radius: 8px;
                }
                :root[data-theme="dark"] .skeleton, @media (prefers-color-scheme: dark) {
                    .skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 75%); background-size: 200% 100%; }
                }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                .skeleton-title { width: 160px; height: 32px; }
                .admin-loading-settings-section {
                    margin-bottom: 2rem; padding: 1.5rem; border-radius: 12px;
                    border: 1px solid var(--color-surface-200, #e5e7eb); background: var(--color-surface-50, #f9fafb);
                }
                :root[data-theme="dark"] .admin-loading-settings-section { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
                .skeleton-section-title { width: 200px; height: 22px; margin-bottom: 1.25rem; }
                .admin-loading-settings-fields { display: flex; flex-direction: column; gap: 1.25rem; }
                .admin-loading-field { display: flex; flex-direction: column; gap: 6px; }
                .skeleton-field-label { width: 120px; height: 14px; }
                .skeleton-field-input { width: 100%; height: 40px; border-radius: 10px; }
                .admin-loading-settings-btn-row { display: flex; justify-content: flex-end; }
                .skeleton-save-btn { width: 120px; height: 42px; border-radius: 10px; }
            `}</style>
        </div>
    );
}
