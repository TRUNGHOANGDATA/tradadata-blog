'use client';

export default function CategoriesLoading() {
    return (
        <div className="admin-loading">
            <div className="admin-loading-header">
                <div className="skeleton" style={{ width: 180, height: 32 }} />
                <div className="skeleton" style={{ width: 160, height: 40, borderRadius: 10 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="admin-loading-category-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }} />
                            <div className="skeleton" style={{ width: 24, height: 24, borderRadius: 6 }} />
                        </div>
                        <div className="skeleton" style={{ width: '60%', height: 20 }} />
                        <div className="skeleton" style={{ width: '90%', height: 14 }} />
                        <div className="skeleton" style={{ width: 70, height: 22, borderRadius: 9999, marginTop: 4 }} />
                    </div>
                ))}
            </div>
        </div>
    );
}
