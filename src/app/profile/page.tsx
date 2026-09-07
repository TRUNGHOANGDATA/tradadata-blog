'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    User, Package, Crown, ArrowLeft, Save, Loader2,
    Clock, CheckCircle2, XCircle, Mail, Phone, Pencil, Shield, Calendar
} from 'lucide-react';

type Tab = 'info' | 'orders' | 'premium';

interface Order {
    id: string;
    order_code: string;
    amount: number;
    status: string;
    created_at: string;
    paid_at: string | null;
    products: { name: string; product_type: string } | null;
}

interface Subscription {
    id: string;
    starts_at: string;
    expires_at: string;
    products: { name: string } | null;
}

interface Profile {
    full_name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    is_subscribed: boolean;
    role: string;
}

export default function ProfilePage() {
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('info');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [formName, setFormName] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (authStatus === 'unauthenticated') {
            router.push('/login');
        }
    }, [authStatus, router]);

    useEffect(() => {
        if (authStatus !== 'authenticated') return;
        fetch('/api/profile')
            .then(res => res.json())
            .then(data => {
                setProfile(data.profile);
                setOrders(data.orders || []);
                setSubscriptions(data.subscriptions || []);
                setFormName(data.profile?.full_name || '');
                setFormPhone(data.profile?.phone || '');
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [authStatus]);

    const handleSave = async () => {
        setError('');
        setSuccess('');
        if (formPhone && !/^0[35789][0-9]{8}$/.test(formPhone)) {
            setError('Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: formName, phone: formPhone }),
            });
            if (res.ok) {
                setSuccess('Đã lưu thông tin!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const d = await res.json();
                setError(d.error || 'Có lỗi xảy ra');
            }
        } catch {
            setError('Có lỗi xảy ra');
        }
        setSaving(false);
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    const formatDate = (s: string) =>
        new Date(s).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formatDateTime = (s: string) =>
        new Date(s).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
        pending: { label: 'Chờ thanh toán', icon: <Clock className="w-3.5 h-3.5" />, className: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
        paid: { label: 'Đã thanh toán', icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800' },
        cancelled: { label: 'Đã huỷ', icon: <XCircle className="w-3.5 h-3.5" />, className: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800' },
    };

    const tabs = [
        { key: 'info' as Tab, label: 'Thông tin', icon: <User className="w-4 h-4" /> },
        { key: 'orders' as Tab, label: 'Đơn hàng', icon: <Package className="w-4 h-4" />, count: orders.length },
        { key: 'premium' as Tab, label: 'Premium', icon: <Crown className="w-4 h-4" /> },
    ];

    const activeSub = subscriptions.find(s => new Date(s.expires_at) > new Date());
    const isPremium = !!activeSub || profile?.is_subscribed === true;

    if (authStatus === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
                <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-surface-600 dark:text-surface-400" />
                    </Link>
                    <div className="flex items-center gap-3 flex-1">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                                <User className="w-6 h-6 text-brand-600" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                                {profile?.full_name || session?.user?.name || 'Người dùng'}
                            </h1>
                            <p className="text-sm text-fg-subtle">{session?.user?.email}</p>
                        </div>
                    </div>
                    {isPremium && (
                        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-brand-500/10 to-purple-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                            <Crown className="w-3.5 h-3.5" /> Premium
                        </span>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1.5 p-1.5 bg-surface-200/80 dark:bg-surface-800/80 rounded-2xl mb-6 border border-surface-300/50 dark:border-surface-700/50">
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${tab === t.key
                                ? 'bg-white dark:bg-brand-600/20 text-brand-700 dark:text-brand-300 shadow-sm border border-surface-200 dark:border-brand-500/30'
                                : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-white/50 dark:hover:bg-surface-700/50'
                                }`}
                        >
                            {t.icon}
                            {t.label}
                            {t.count !== undefined && t.count > 0 && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key
                                    ? 'bg-brand-100 dark:bg-brand-500/30 text-brand-700 dark:text-brand-300'
                                    : 'bg-surface-300 dark:bg-surface-600 text-surface-600 dark:text-surface-300'
                                    }`}>{t.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
                    {/* ===== INFO TAB ===== */}
                    {tab === 'info' && (
                        <div className="p-6 space-y-5">
                            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                                <Pencil className="w-4 h-4 text-brand-500" /> Thông tin cá nhân
                            </h2>

                            {success && (
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-xl border border-green-200 dark:border-green-800 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> {success}
                                </div>
                            )}
                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800">
                                    {error}
                                </div>
                            )}

                            {/* Email — read only */}
                            <div>
                                <label className="flex items-center gap-1.5 text-sm font-medium text-surface-600 dark:text-surface-400 mb-1.5">
                                    <Mail className="w-3.5 h-3.5" /> Email
                                </label>
                                <input
                                    type="email"
                                    value={session?.user?.email || ''}
                                    readOnly
                                    className="w-full px-4 py-2.5 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-fg-subtle cursor-not-allowed text-sm"
                                />
                                <p className="text-xs text-fg-faint mt-1 flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> Email liên kết với tài khoản đăng nhập, không thể thay đổi
                                </p>
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="flex items-center gap-1.5 text-sm font-medium text-surface-600 dark:text-surface-400 mb-1.5">
                                    <User className="w-3.5 h-3.5" /> Họ và tên
                                </label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors text-surface-900 dark:text-surface-100 text-sm"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="flex items-center gap-1.5 text-sm font-medium text-surface-600 dark:text-surface-400 mb-1.5">
                                    <Phone className="w-3.5 h-3.5" /> Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    value={formPhone}
                                    onChange={e => setFormPhone(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors text-surface-900 dark:text-surface-100 text-sm"
                                    placeholder="0984456710"
                                />
                                <p className="text-xs text-fg-faint mt-1">10 chữ số, bắt đầu bằng 03/05/07/08/09</p>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white transition-all ${saving ? 'bg-brand-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 active:scale-[0.98]'}`}
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    )}

                    {/* ===== ORDERS TAB ===== */}
                    {tab === 'orders' && (
                        <div className="p-6">
                            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
                                <Package className="w-4 h-4 text-brand-500" /> Lịch sử đơn hàng
                            </h2>
                            {orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="w-12 h-12 mx-auto text-surface-300 dark:text-surface-600 mb-3" />
                                    <p className="text-fg-subtle">Chưa có đơn hàng nào</p>
                                    <Link href="/pricing" className="text-brand-600 text-sm hover:underline mt-2 inline-block">
                                        Xem bảng giá →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {orders.map(order => {
                                        const st = statusConfig[order.status] || statusConfig.pending;
                                        return (
                                            <div key={order.id} className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-100 dark:border-surface-700/50 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <span className="font-mono font-bold text-sm text-surface-900 dark:text-surface-100">{order.order_code}</span>
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${st.className}`}>
                                                                {st.icon} {st.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-surface-600 dark:text-surface-400 truncate">{order.products?.name || 'Sản phẩm'}</p>
                                                        <p className="text-xs text-fg-faint mt-0.5">{formatDateTime(order.created_at)}</p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="text-base font-bold text-brand-600 dark:text-brand-400">{formatCurrency(order.amount)}</p>
                                                        {order.status === 'pending' && (
                                                            <Link
                                                                href={`/checkout/${order.order_code}`}
                                                                className="text-xs text-brand-600 hover:underline mt-0.5 inline-block"
                                                            >
                                                                Tiếp tục thanh toán →
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ===== PREMIUM TAB ===== */}
                    {tab === 'premium' && (
                        <div className="p-6">
                            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 mb-4">
                                <Crown className="w-4 h-4 text-brand-500" /> Premium
                            </h2>

                            {isPremium ? (
                                <div className="space-y-4">
                                    {activeSub ? (
                                        <div className="p-5 bg-gradient-to-br from-brand-500/10 via-purple-500/5 to-transparent border border-brand-200 dark:border-brand-800 rounded-2xl">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                                                    <Crown className="w-5 h-5 text-brand-500" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-surface-900 dark:text-surface-100">Đang hoạt động</p>
                                                    <p className="text-sm text-fg-subtle">{(activeSub.products as any)?.name || 'Gói Premium'}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mt-4">
                                                <div className="p-3 bg-white/60 dark:bg-surface-800/60 rounded-xl">
                                                    <p className="text-xs text-fg-subtle mb-0.5 flex items-center gap-1"><Calendar className="w-3 h-3" /> Bắt đầu</p>
                                                    <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{formatDate(activeSub.starts_at)}</p>
                                                </div>
                                                <div className="p-3 bg-white/60 dark:bg-surface-800/60 rounded-xl">
                                                    <p className="text-xs text-fg-subtle mb-0.5 flex items-center gap-1"><Calendar className="w-3 h-3" /> Hết hạn</p>
                                                    <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{formatDate(activeSub.expires_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-5 bg-gradient-to-br from-brand-500/10 via-purple-500/5 to-transparent border border-brand-200 dark:border-brand-800 rounded-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                                                    <Crown className="w-5 h-5 text-brand-500" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-surface-900 dark:text-surface-100">Đang hoạt động</p>
                                                    <p className="text-sm text-fg-subtle">Premium được kích hoạt bởi Admin</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* All subscriptions history */}
                                    {subscriptions.length > 1 && (
                                        <div>
                                            <p className="text-sm font-medium text-fg-subtle mb-2">Lịch sử đăng ký</p>
                                            <div className="space-y-2">
                                                {subscriptions.map(sub => (
                                                    <div key={sub.id} className="flex items-center justify-between py-2 px-3 bg-surface-50 dark:bg-surface-800/50 rounded-lg text-sm">
                                                        <span className="text-surface-600 dark:text-surface-400">{(sub.products as any)?.name || 'Premium'}</span>
                                                        <span className="text-fg-subtle">{formatDate(sub.starts_at)} → {formatDate(sub.expires_at)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <Link
                                        href="/pricing"
                                        className="block text-center py-3 rounded-xl font-medium text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                                    >
                                        Gia hạn thêm →
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
                                        <Crown className="w-8 h-8 text-fg-faint" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-2">Chưa có gói Premium</h3>
                                    <p className="text-sm text-fg-subtle mb-5">Nâng cấp để truy cập toàn bộ nội dung đặc quyền</p>
                                    <Link
                                        href="/pricing"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors font-medium"
                                    >
                                        <Crown className="w-4 h-4" /> Đăng ký Premium
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
}
