'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Download, LogIn, Phone, FileSpreadsheet, Loader2, CheckCircle } from 'lucide-react';

interface Props {
    driveUrl: string;
    filename: string;
    label?: string;
}

export function InlineDownloadBlock({ driveUrl, filename, label }: Props) {
    const { data: session, status } = useSession();
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [loading, setLoading] = useState(false);
    const [phoneUpdated, setPhoneUpdated] = useState(false);

    const handleDownload = async () => {
        if (status !== 'authenticated') {
            signIn('google', { callbackUrl: window.location.pathname });
            return;
        }

        try {
            setLoading(true);

            const res = await fetch('/api/demo-download/inline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ driveUrl }),
            });

            if (res.status === 403) {
                setShowPhoneModal(true);
                setLoading(false);
                return;
            }

            if (res.status === 401) {
                signIn('google', { callbackUrl: window.location.pathname });
                return;
            }

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Có lỗi xảy ra khi tải file');
                setLoading(false);
                return;
            }

            if (data.driveUrl) {
                window.open(data.driveUrl, '_blank');
            }
        } catch {
            alert('Không thể tải file. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPhoneError('');

        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length !== 10 || !cleaned.startsWith('0')) {
            setPhoneError('Số điện thoại phải có 10 chữ số, bắt đầu bằng 0');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/profile/phone', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: cleaned }),
            });

            if (res.ok) {
                setPhoneUpdated(true);
                setTimeout(() => {
                    setShowPhoneModal(false);
                    setPhoneUpdated(false);
                    handleDownload();
                }, 1000);
            } else {
                const err = await res.json();
                setPhoneError(err.error || 'Có lỗi xảy ra');
            }
        } catch {
            setPhoneError('Không thể cập nhật. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="my-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl not-prose">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
                            📎 {filename}
                        </p>
                        {label && (
                            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{label}</p>
                        )}
                    </div>
                    <button
                        onClick={handleDownload}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : status !== 'authenticated' ? (
                            <LogIn className="w-4 h-4" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        {status !== 'authenticated'
                            ? 'Đăng nhập'
                            : loading
                                ? 'Đang tải...'
                                : 'Tải xuống'
                        }
                    </button>
                </div>
            </div>

            {/* Phone Modal */}
            {showPhoneModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                        <button
                            onClick={() => setShowPhoneModal(false)}
                            className="absolute top-4 right-4 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 text-xl"
                        >
                            ✕
                        </button>

                        {phoneUpdated ? (
                            <div className="text-center py-4">
                                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                                    Cập nhật thành công!
                                </h3>
                                <p className="text-surface-600 dark:text-surface-400">
                                    Đang bắt đầu tải file...
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
                                        <Phone className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100">
                                            Cập nhật số điện thoại
                                        </h3>
                                        <p className="text-sm text-surface-500 dark:text-surface-400">
                                            Để tải file miễn phí
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handlePhoneSubmit}>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="0912 345 678"
                                        className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-lg tracking-wider"
                                        maxLength={12}
                                        autoFocus
                                    />
                                    {phoneError && (
                                        <p className="text-red-500 text-sm mt-2">{phoneError}</p>
                                    )}
                                    <p className="text-xs text-surface-500 mt-2">
                                        Chúng tôi không spam. SĐT chỉ dùng để xác thực.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={loading || !phone}
                                        className="w-full mt-4 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Download className="w-5 h-5" />
                                        )}
                                        {loading ? 'Đang lưu...' : 'Xác nhận & Tải xuống'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
