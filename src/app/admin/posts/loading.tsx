'use client';

export default function AdminPostsLoading() {
    return (
        <div className="admin-loading">
            {/* Header */}
            <div className="admin-loading-header">
                <div className="skeleton" style={{ width: 160, height: 32 }} />
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div className="skeleton" style={{ width: 100, height: 38, borderRadius: 10 }} />
                    <div className="skeleton" style={{ width: 130, height: 38, borderRadius: 10 }} />
                </div>
            </div>

            {/* Search + filter bar */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div className="skeleton" style={{ flex: 1, maxWidth: 320, height: 40, borderRadius: 10 }} />
                <div className="skeleton" style={{ width: 120, height: 40, borderRadius: 10 }} />
                <div className="skeleton" style={{ width: 120, height: 40, borderRadius: 10 }} />
            </div>

            {/* Posts list */}
            <div className="admin-loading-table">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="admin-loading-table-row">
                        <div className="skeleton" style={{ width: 56, height: 36, borderRadius: 6, flexShrink: 0 }} />
                        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div className="skeleton" style={{ width: '70%', height: 16 }} />
                            <div className="skeleton" style={{ width: '40%', height: 12 }} />
                        </div>
                        <div className="skeleton" style={{ width: 80, height: 24, borderRadius: 9999 }} />
                        <div className="skeleton" style={{ width: 70, height: 24, borderRadius: 9999 }} />
                        <div className="skeleton" style={{ width: 90, height: 14 }} />
                        <div className="skeleton" style={{ width: 70, height: 32, borderRadius: 8 }} />
                    </div>
                ))}
            </div>
        </div>
    );
}
