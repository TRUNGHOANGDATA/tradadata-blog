'use client';

export default function AdminLoading() {
    return (
        <div className="admin-loading">
            {/* Header */}
            <div className="admin-loading-header">
                <div className="skeleton" style={{ width: 220, height: 32 }} />
                <div className="skeleton" style={{ width: 140, height: 40, borderRadius: 10 }} />
            </div>

            {/* Stats cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="admin-loading-stat-card">
                        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div className="skeleton" style={{ width: 80, height: 12 }} />
                            <div className="skeleton" style={{ width: 100, height: 24 }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="admin-loading-table">
                <div className="admin-loading-table-header">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: 14, flex: 1, maxWidth: 120 }} />
                    ))}
                </div>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="admin-loading-table-row">
                        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0 }} />
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
