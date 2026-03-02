'use client';

export default function MediaLoading() {
    return (
        <div className="admin-loading">
            <div className="admin-loading-header">
                <div className="skeleton" style={{ width: 180, height: 32 }} />
                <div className="skeleton" style={{ width: 160, height: 40, borderRadius: 10 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="admin-loading-media-card">
                        <div className="skeleton" style={{ width: '100%', height: 160, borderRadius: 0 }} />
                        <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div className="skeleton" style={{ width: '70%', height: 14 }} />
                            <div className="skeleton" style={{ width: '40%', height: 12 }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
