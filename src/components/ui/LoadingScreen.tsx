export default function LoadingScreen() {
    const messages = [
        'Đang pha trà đá...',
        'Thêm ít đường...',
        'Khuấy đều đá...',
        'Trà sắp sẵn sàng...',
        'Rót trà vào ly...',
        'Thêm chút đá lạnh...',
    ];

    // Pick a deterministic message based on time (changes every 3 seconds)
    const msgIndex = Math.floor(Date.now() / 3000) % messages.length;

    return (
        <div className="loading-screen">
            {/* Floating bubbles */}
            <div className="loading-bubbles">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="loading-bubble"
                        style={{
                            '--delay': `${i * 0.4}s`,
                            '--left': `${10 + i * 11}%`,
                            '--size': `${8 + (i % 3) * 6}px`,
                            '--duration': `${2.5 + (i % 3) * 0.8}s`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            {/* Logo */}
            <div className="loading-logo-container">
                <div className="loading-logo-ring" />
                <img
                    src="/LOGO_TRA_DA_DATA.jpg"
                    alt="Trà Đá Data"
                    className="loading-logo"
                />
            </div>

            {/* Text */}
            <p className="loading-text">
                {messages[msgIndex]}
            </p>

            {/* Dots */}
            <div className="loading-dots">
                <span className="loading-dot" style={{ animationDelay: '0s' }} />
                <span className="loading-dot" style={{ animationDelay: '0.2s' }} />
                <span className="loading-dot" style={{ animationDelay: '0.4s' }} />
            </div>

            <style>{`
                .loading-screen {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 80vh;
                    position: relative;
                    overflow: hidden;
                }

                /* Logo container */
                .loading-logo-container {
                    position: relative;
                    margin-bottom: 1.5rem;
                }

                .loading-logo {
                    width: 96px;
                    height: 96px;
                    border-radius: 50%;
                    object-fit: cover;
                    position: relative;
                    z-index: 2;
                    animation: logoBounce 1.8s ease-in-out infinite;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                }

                .loading-logo-ring {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 112px;
                    height: 112px;
                    margin-top: -56px;
                    margin-left: -56px;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    border-top-color: #22c55e;
                    border-right-color: #22c55e;
                    z-index: 1;
                    animation: ringSpin 1.5s linear infinite;
                }

                /* Bounce animation */
                @keyframes logoBounce {
                    0%, 100% {
                        transform: translateY(0) scale(1);
                    }
                    30% {
                        transform: translateY(-18px) scale(1.05);
                    }
                    50% {
                        transform: translateY(-10px) scale(1.02);
                    }
                    70% {
                        transform: translateY(-14px) scale(1.04);
                    }
                }

                /* Ring spin */
                @keyframes ringSpin {
                    to { transform: rotate(360deg); }
                }

                /* Text */
                .loading-text {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--color-surface-600, #6b7280);
                    margin-bottom: 0.75rem;
                    animation: fadeInOut 3s ease-in-out infinite;
                }

                @media (prefers-color-scheme: dark) {
                    .loading-text {
                        color: var(--color-surface-400, #9ca3af);
                    }
                }

                @keyframes fadeInOut {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }

                /* Dots */
                .loading-dots {
                    display: flex;
                    gap: 6px;
                }

                .loading-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #22c55e;
                    animation: dotBounce 1.2s ease-in-out infinite;
                }

                @keyframes dotBounce {
                    0%, 80%, 100% {
                        transform: scale(0.4);
                        opacity: 0.3;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                /* Bubbles */
                .loading-bubbles {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    overflow: hidden;
                }

                .loading-bubble {
                    position: absolute;
                    bottom: -20px;
                    left: var(--left);
                    width: var(--size);
                    height: var(--size);
                    border-radius: 50%;
                    background: radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.25), rgba(34, 197, 94, 0.08));
                    border: 1px solid rgba(34, 197, 94, 0.15);
                    animation: bubbleFloat var(--duration) ease-in-out infinite;
                    animation-delay: var(--delay);
                }

                @keyframes bubbleFloat {
                    0% {
                        transform: translateY(0) scale(0.5);
                        opacity: 0;
                    }
                    20% {
                        opacity: 0.8;
                    }
                    80% {
                        opacity: 0.4;
                    }
                    100% {
                        transform: translateY(-85vh) scale(1.2);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}
