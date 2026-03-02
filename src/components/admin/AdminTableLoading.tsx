'use client';

// Shared table loading skeleton for admin list pages
// Styles defined in globals.css (skeleton, admin-loading-* classes)
function AdminTableLoading({ title = '', cols = 5, rows = 6, showStats = false, statsCount = 3 }: {
    title?: string; cols?: number; rows?: number; showStats?: boolean; statsCount?: number;
}) {
    return (
        <div className="admin-loading">
            <div className="admin-loading-header">
                <div className="skeleton" style={{ width: 180, height: 32 }} />
                <div className="skeleton" style={{ width: 140, height: 40, borderRadius: 10 }} />
            </div>

            {showStats && (
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${statsCount}, 1fr)`, gap: '1rem', marginBottom: '2rem' }}>
                    {[...Array(statsCount)].map((_, i) => (
                        <div key={i} className="admin-loading-stat-card">
                            <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div className="skeleton" style={{ width: 80, height: 12 }} />
                                <div className="skeleton" style={{ width: 100, height: 24 }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="admin-loading-table">
                <div className="admin-loading-table-header">
                    {[...Array(cols)].map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: 14, flex: 1, maxWidth: 120 }} />
                    ))}
                </div>
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="admin-loading-table-row">
                        <div className="skeleton" style={{ flex: 2, height: 16 }} />
                        <div className="skeleton" style={{ flex: 1, height: 14, maxWidth: 100 }} />
                        <div className="skeleton" style={{ width: 70, height: 24, borderRadius: 9999 }} />
                        <div className="skeleton" style={{ width: 80, height: 32, borderRadius: 8 }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminTableLoading;
