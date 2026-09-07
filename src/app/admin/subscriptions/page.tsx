'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Crown, Filter, Calendar, Clock, CheckCircle2, AlertTriangle, XCircle, Gift, ChevronDown, ChevronUp } from 'lucide-react';

interface Subscription {
    id: string;
    user_email: string;
    user_name: string;
    user_phone: string;
    product_id: string;
    starts_at: string;
    expires_at: string;
    order_id: string | null;
    created_at: string;
    products: { id: string; name: string; product_type: string; duration_days: number } | null;
    orders: { order_code: string; amount: number; admin_note: string | null; status: string } | null;
}

interface Product {
    id: string;
    name: string;
}

interface CustomerSummary {
    email: string;
    name: string;
    phone: string;
    products: Map<string, { name: string; earliestStart: Date; latestExpiry: Date; subscriptions: Subscription[] }>;
    overallStatus: 'active' | 'expiring' | 'expired';
    latestExpiry: Date;
}

type StatusFilter = 'all' | 'active' | 'expiring' | 'expired';

export default function AdminSubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [productFilter, setProductFilter] = useState('all');
    const [expandedEmail, setExpandedEmail] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/subscriptions');
            const data = await res.json();
            if (data.subscriptions) setSubscriptions(data.subscriptions);
            if (data.products) setProducts(data.products);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const getSubStatus = (sub: Subscription) => {
        const expires = new Date(sub.expires_at);
        if (expires < now) return 'expired';
        if (expires <= sevenDaysLater) return 'expiring';
        return 'active';
    };

    // Group subscriptions by customer email
    // Skip subscriptions whose orders have been cancelled
    const buildCustomerSummaries = (): CustomerSummary[] => {
        const activeSubs = subscriptions.filter(sub =>
            !sub.orders || sub.orders.status !== 'cancelled'
        );
        const map = new Map<string, CustomerSummary>();

        activeSubs.forEach(sub => {
            const email = sub.user_email;
            if (!map.has(email)) {
                map.set(email, {
                    email,
                    name: sub.user_name || '',
                    phone: sub.user_phone || '',
                    products: new Map(),
                    overallStatus: 'expired',
                    latestExpiry: new Date(0),
                });
            }

            const customer = map.get(email)!;
            const productName = sub.products?.name || 'Chưa xác định';
            const productId = sub.product_id;

            if (!customer.products.has(productId)) {
                customer.products.set(productId, {
                    name: productName,
                    earliestStart: new Date(sub.starts_at),
                    latestExpiry: new Date(sub.expires_at),
                    subscriptions: [],
                });
            }

            const prod = customer.products.get(productId)!;
            prod.subscriptions.push(sub);
            const startDate = new Date(sub.starts_at);
            const expiryDate = new Date(sub.expires_at);
            if (startDate < prod.earliestStart) prod.earliestStart = startDate;
            if (expiryDate > prod.latestExpiry) prod.latestExpiry = expiryDate;
            if (expiryDate > customer.latestExpiry) customer.latestExpiry = expiryDate;
        });

        // Set overall status per customer
        map.forEach(customer => {
            if (customer.latestExpiry > sevenDaysLater) {
                customer.overallStatus = 'active';
            } else if (customer.latestExpiry > now) {
                customer.overallStatus = 'expiring';
            } else {
                customer.overallStatus = 'expired';
            }
        });

        return Array.from(map.values());
    };

    const customers = buildCustomerSummaries();

    const statusConfig: Record<string, { label: string; icon: React.ReactNode; badgeClass: string }> = {
        active: {
            label: 'Đang hoạt động',
            icon: <CheckCircle2 className="w-3.5 h-3.5" />,
            badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
        },
        expiring: {
            label: 'Sắp hết hạn',
            icon: <AlertTriangle className="w-3.5 h-3.5" />,
            badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
        },
        expired: {
            label: 'Đã hết hạn',
            icon: <XCircle className="w-3.5 h-3.5" />,
            badgeClass: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
        },
    };

    const formatDate = (d: Date) =>
        `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

    const getDaysLeft = (expiry: Date) =>
        Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Filter customers
    const filtered = customers.filter(c => {
        const query = search.toLowerCase();
        const matchSearch = !query ||
            c.email.toLowerCase().includes(query) ||
            c.name.toLowerCase().includes(query) ||
            c.phone.toLowerCase().includes(query);

        const matchStatus = statusFilter === 'all' || statusFilter === c.overallStatus;

        const matchProduct = productFilter === 'all' ||
            c.products.has(productFilter);

        return matchSearch && matchStatus && matchProduct;
    });

    // Stats
    const stats = {
        total: customers.length,
        active: customers.filter(c => c.overallStatus === 'active').length,
        expiring: customers.filter(c => c.overallStatus === 'expiring').length,
        expired: customers.filter(c => c.overallStatus === 'expired').length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-fg">Theo dõi Premium</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <button onClick={() => setStatusFilter('all')}
                    className={`p-4 rounded-xl border transition-all text-left ${statusFilter === 'all'
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-2 ring-brand-500/20'
                        : 'border-line bg-card hover:border-brand-300'}`}>
                    <p className="text-xs font-medium text-fg-subtle mb-1">Tổng khách hàng</p>
                    <p className="text-2xl font-bold text-fg">{stats.total}</p>
                    <p className="text-xs text-fg-faint mt-1">{subscriptions.length} đăng ký</p>
                </button>
                <button onClick={() => setStatusFilter('active')}
                    className={`p-4 rounded-xl border transition-all text-left ${statusFilter === 'active'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500/20'
                        : 'border-line bg-card hover:border-emerald-300'}`}>
                    <p className="text-xs font-medium text-fg-subtle mb-1">Đang hoạt động</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.active}</p>
                </button>
                <button onClick={() => setStatusFilter('expiring')}
                    className={`p-4 rounded-xl border transition-all text-left ${statusFilter === 'expiring'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 ring-2 ring-amber-500/20'
                        : 'border-line bg-card hover:border-amber-300'}`}>
                    <p className="text-xs font-medium text-fg-subtle mb-1">Sắp hết hạn</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.expiring}</p>
                    <p className="text-xs text-fg-faint mt-1">trong 7 ngày</p>
                </button>
                <button onClick={() => setStatusFilter('expired')}
                    className={`p-4 rounded-xl border transition-all text-left ${statusFilter === 'expired'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-500/20'
                        : 'border-line bg-card hover:border-red-300'}`}>
                    <p className="text-xs font-medium text-fg-subtle mb-1">Đã hết hạn</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.expired}</p>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-faint" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email, SĐT..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-surface-200 dark:border-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-fg-faint" />
                    <select
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-card border border-surface-200 dark:border-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-sm"
                    >
                        <option value="all">Tất cả sản phẩm</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Customer Table */}
            <div className="bg-card rounded-2xl border border-line overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-line bg-surface-50 dark:bg-surface-800/50">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-fg-subtle uppercase">Khách hàng</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-fg-subtle uppercase">Sản phẩm</th>
                                <th className="text-center px-5 py-3 text-xs font-semibold text-fg-subtle uppercase">Trạng thái</th>
                                <th className="text-center px-5 py-3 text-xs font-semibold text-fg-subtle uppercase">Thời hạn</th>
                                <th className="text-right px-5 py-3 text-xs font-semibold text-fg-subtle uppercase">Còn lại</th>
                                <th className="text-right px-5 py-3 text-xs font-semibold text-fg-subtle uppercase w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-fg-faint">
                                        Không có khách hàng nào.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(customer => {
                                    const cfg = statusConfig[customer.overallStatus];
                                    const daysLeft = getDaysLeft(customer.latestExpiry);
                                    const isExpanded = expandedEmail === customer.email;
                                    const productEntries = Array.from(customer.products.entries());

                                    return (
                                        <>{/* Main row */}
                                            <tr
                                                key={customer.email}
                                                className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer"
                                                onClick={() => setExpandedEmail(isExpanded ? null : customer.email)}
                                            >
                                                {/* Customer */}
                                                <td className="px-5 py-3.5">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm text-fg">{customer.name || '—'}</span>
                                                        <span className="text-xs text-fg-subtle">{customer.email}</span>
                                                        {customer.phone && <span className="text-xs text-fg-faint">{customer.phone}</span>}
                                                    </div>
                                                </td>
                                                {/* Products */}
                                                <td className="px-5 py-3.5">
                                                    <div className="flex flex-col gap-1">
                                                        {productEntries.map(([pid, prod]) => (
                                                            <div key={pid} className="flex items-center gap-2">
                                                                <Crown className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                                                                <span className="text-sm font-medium text-fg">{prod.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                {/* Status */}
                                                <td className="px-5 py-3.5 text-center">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.badgeClass}`}>
                                                        {cfg.icon} {cfg.label}
                                                    </span>
                                                </td>
                                                {/* Duration */}
                                                <td className="px-5 py-3.5 text-center">
                                                    {productEntries.map(([pid, prod]) => (
                                                        <div key={pid} className="text-xs text-fg-subtle flex items-center justify-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(prod.earliestStart)} → {formatDate(prod.latestExpiry)}
                                                        </div>
                                                    ))}
                                                </td>
                                                {/* Days left */}
                                                <td className="px-5 py-3.5 text-right">
                                                    {customer.overallStatus === 'expired' ? (
                                                        <span className="text-sm font-medium text-red-500">Hết hạn</span>
                                                    ) : (
                                                        <span className={`text-sm font-bold ${daysLeft <= 7 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                            {daysLeft} ngày
                                                        </span>
                                                    )}
                                                </td>
                                                {/* Expand */}
                                                <td className="px-3 py-3.5 text-right">
                                                    {isExpanded
                                                        ? <ChevronUp className="w-4 h-4 text-fg-faint" />
                                                        : <ChevronDown className="w-4 h-4 text-fg-faint" />
                                                    }
                                                </td>
                                            </tr>
                                            {/* Expanded detail rows */}
                                            {isExpanded && productEntries.map(([pid, prod]) =>
                                                prod.subscriptions.map(sub => {
                                                    const subStatus = getSubStatus(sub);
                                                    const subCfg = statusConfig[subStatus];
                                                    const isFree = sub.orders?.amount === 0;
                                                    return (
                                                        <tr key={sub.id} className="bg-surface-50/50 dark:bg-surface-800/30">
                                                            <td className="px-5 py-2.5 pl-10">
                                                                <span className="text-xs text-fg-faint">Chi tiết đăng ký</span>
                                                            </td>
                                                            <td className="px-5 py-2.5">
                                                                <span className="text-xs text-fg-subtle">{prod.name}</span>
                                                            </td>
                                                            <td className="px-5 py-2.5 text-center">
                                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${subCfg.badgeClass}`}>
                                                                    {subCfg.icon} {subCfg.label}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-2.5 text-center">
                                                                <span className="text-xs text-fg-subtle">
                                                                    {formatDate(new Date(sub.starts_at))} → {formatDate(new Date(sub.expires_at))}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-2.5 text-right" colSpan={2}>
                                                                {sub.orders ? (
                                                                    <div className="flex flex-col items-end">
                                                                        <span className="text-xs font-mono text-brand-600 dark:text-brand-400">{sub.orders.order_code}</span>
                                                                        {isFree ? (
                                                                            <span className="inline-flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400">
                                                                                <Gift className="w-3 h-3" /> Miễn phí
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-[11px] text-fg-subtle">
                                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sub.orders.amount)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs text-fg-faint italic">Cấp tay</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary footer */}
            <div className="mt-4 text-sm text-fg-subtle text-right">
                Hiển thị {filtered.length} / {customers.length} khách hàng
            </div>
        </>
    );
}
