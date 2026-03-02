'use client';

export default function SettingsLoading() {
    return (
        <div className="admin-loading">
            <div className="admin-loading-header">
                <div className="skeleton" style={{ width: 160, height: 32 }} />
            </div>

            {[...Array(3)].map((_, i) => (
                <div key={i} className="admin-loading-settings-section" style={{ marginBottom: '1.5rem' }}>
                    <div className="skeleton" style={{ width: 120, height: 18 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[...Array(3)].map((_, j) => (
                            <div key={j}>
                                <div className="skeleton" style={{ width: 100, height: 12, marginBottom: 6 }} />
                                <div className="skeleton" style={{ width: '100%', height: 40, borderRadius: 8 }} />
                            </div>
                        ))}
                    </div>
                    <div className="skeleton" style={{ width: 120, height: 38, borderRadius: 8, alignSelf: 'flex-start' }} />
                </div>
            ))}
        </div>
    );
}
