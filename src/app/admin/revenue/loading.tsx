'use client';

export default function RevenueLoading() {
    return (
        <div className="admin-loading">
            <div className="admin-loading-header">
                <div className="skeleton" style={{ width: 200, height: 32 }} />
                <div className="skeleton" style={{ width: 160, height: 40, borderRadius: 10 }} />
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="admin-loading-stat-card">
                        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div className="skeleton" style={{ width: 80, height: 12 }} />
                            <div className="skeleton" style={{ width: 110, height: 24 }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart area */}
            <div className="admin-loading-chart" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div className="skeleton" style={{ width: 160, height: 20, marginBottom: 16 }} />
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200 }}>
                    {[40, 65, 50, 80, 55, 90, 70, 85, 60, 75, 95, 88].map((h, i) => (
                        <div key={i} className="skeleton" style={{ flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0' }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
