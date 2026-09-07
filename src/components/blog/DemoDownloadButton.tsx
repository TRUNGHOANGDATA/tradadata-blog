'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Download, LogIn, Phone, FileSpreadsheet, Loader2, CheckCircle } from 'lucide-react';

interface Props {
    demoUrl?: string;
    demoLabel?: string;
    postSlug: string;
}

export function DemoDownloadButton({ demoUrl, demoLabel, postSlug }: Props) {
    const { data: session, status } = useSession();
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [loading, setLoading] = useState(false);
    const [phoneUpdated, setPhoneUpdated] = useState(false);
    const [hasDemo, setHasDemo] = useState(!!demoUrl);
    const [checkedDemo, setCheckedDemo] = useState(!!demoUrl);

    // API endpoint for sharing file + getting Drive URL
    const downloadUrl = `/api/demo-download?slug=${encodeURIComponent(postSlug)}`;

    // Client-side check: if demoUrl not provided by server, check via API
    useEffect(() => {
        if (demoUrl) {
            setHasDemo(true);
            setCheckedDemo(true);
            return;
        }
        // Check if this post has a demo file
        fetch(downloadUrl)
            .then(res => {
                // 404 = no demo file, anything else = has demo (even 401/403 = has demo but needs auth/phone)
                setHasDemo(res.status !== 404);
                setCheckedDemo(true);
            })
            .catch(() => {
                setCheckedDemo(true);
            });
    }, [demoUrl, downloadUrl]);

    // Determine file type for display
    const isExcel = true; // all demo files are Excel for now

    // Don't render if no demo file
    if (!checkedDemo || !hasDemo) return null;

    const handleDownload = async () => {
        if (status !== 'authenticated') {
            signIn('google', { callbackUrl: `/blog/${postSlug}` });
            return;
        }

        try {
            setLoading(true);

            // POST to API — shares file with user's email + returns Drive URL
            const res = await fetch(downloadUrl, { method: 'POST' });

            if (res.status === 403) {
                setShowPhoneModal(true);
                setLoading(false);
                return;
            }

            if (res.status === 401) {
                signIn('google', { callbackUrl: `/blog/${postSlug}` });
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Có lỗi xảy ra khi tải file');
                setLoading(false);
                return;
            }

            // Open Google Drive link in new tab — file is shared with user's email
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

        // Validate
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
                    // Trigger download after phone update
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
            {/* Download Button */}
            <div className="mt-10 mb-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center">
                        <FileSpreadsheet className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-1">
                            📥 Tải File Demo
                        </h3>
                        <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
                            {demoLabel || 'File thực hành kèm bài viết — tải về để thực hành ngay.'}
                        </p>
                        <button
                            onClick={handleDownload}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : status !== 'authenticated' ? (
                                <LogIn className="w-5 h-5" />
                            ) : (
                                <Download className="w-5 h-5" />
                            )}
                            {status !== 'authenticated'
                                ? 'Đăng nhập để tải xuống'
                                : loading
                                    ? 'Đang tải file...'
                                    : 'Tải xuống miễn phí'
                            }
                        </button>
                        {isExcel && (
                            <p className="text-xs text-surface-500 dark:text-surface-500 mt-2">
                                📎 File đính kèm bài viết — chứa đầy đủ dữ liệu mẫu
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Phone Update Modal */}
            {showPhoneModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                        <button
                            onClick={() => setShowPhoneModal(false)}
                            className="absolute top-4 right-4 text-fg-faint hover:text-surface-600 dark:hover:text-surface-300 text-xl leading-none"
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
                                            Để tải file demo miễn phí
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
                                    <p className="text-xs text-fg-subtle mt-2">
                                        Chúng tôi không spam. SĐT chỉ dùng để xác thực và gửi thông tin khóa học khi có yêu cầu.
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
