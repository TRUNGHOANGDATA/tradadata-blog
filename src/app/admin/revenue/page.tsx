'use client';

import { useState, useEffect } from 'react';
import { Loader2, DollarSign, Calendar, AlertCircle, TrendingUp, Package, Ticket, ShoppingCart, Lightbulb } from 'lucide-react';
import Link from 'next/link';

interface RevenueStats {
    totalRevenue: number;
    monthlyRevenue: number;
    periodRevenue?: number;
    pendingOrders: number;
}

interface DailyData {
    date: string;
    revenue: number;
    orders: number;
}

interface ProductData {
    name: string;
    revenue: number;
    count: number;
}

interface CouponImpact {
    totalDiscount: number;
    usedCount: number;
    topCoupons: { code: string; count: number; discount: number }[];
}

interface RecentOrder {
    order_code: string;
    full_name: string;
    email: string;
    amount: number;
    paid_at: string;
    product_name: string;
    coupon_code: string | null;
}

export default function AdminRevenuePage() {
    const [stats, setStats] = useState<RevenueStats | null>(null);
    const [dailyRevenue, setDailyRevenue] = useState<DailyData[]>([]);
    const [productBreakdown, setProductBreakdown] = useState<ProductData[]>([]);
    const [couponImpact, setCouponImpact] = useState<CouponImpact | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    useEffect(() => {
        loadRevenue();
    }, [fromDate, toDate]);

    async function loadRevenue() {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            if (fromDate) query.append('from', fromDate);
            if (toDate) query.append('to', toDate);

            const res = await fetch(`/api/admin/revenue?${query.toString()}`);
            const data = await res.json();
            if (data.stats) setStats(data.stats);
            if (data.dailyRevenue) setDailyRevenue(data.dailyRevenue);
            if (data.productBreakdown) setProductBreakdown(data.productBreakdown);
            if (data.couponImpact) setCouponImpact(data.couponImpact);
            if (data.recentOrders) setRecentOrders(data.recentOrders);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatShortCurrency = (amount: number) => {
        if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
        return amount.toString();
    };

    const formatShortDate = (dateStr: string) => {
        const d = new Date(dateStr + 'T00:00:00');
        return `${d.getDate()}/${d.getMonth() + 1}`;
    };

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
        );
    }

    const maxDailyRevenue = Math.max(...dailyRevenue.map(d => d.revenue), 1);
    const totalProductRevenue = productBreakdown.reduce((s, p) => s + p.revenue, 0) || 1;

    // Generate data insights
    function generateInsights(): { icon: string; text: string; type: 'positive' | 'warning' | 'info' | 'suggestion' }[] {
        const insights: { icon: string; text: string; type: 'positive' | 'warning' | 'info' | 'suggestion' }[] = [];
        if (!stats || dailyRevenue.length === 0) return insights;

        // 1) Weekly trend: compare last 7 days vs previous 7 days
        const last7 = dailyRevenue.slice(-7);
        const prev7 = dailyRevenue.slice(-14, -7);
        const last7Rev = last7.reduce((s, d) => s + d.revenue, 0);
        const prev7Rev = prev7.reduce((s, d) => s + d.revenue, 0);
        if (prev7Rev > 0) {
            const pctChange = ((last7Rev - prev7Rev) / prev7Rev) * 100;
            if (pctChange > 0) {
                insights.push({ icon: '📈', text: `Doanh thu 7 ngày gần nhất tăng ${pctChange.toFixed(0)}% so với 7 ngày trước (${formatShortCurrency(last7Rev)} vs ${formatShortCurrency(prev7Rev)})`, type: 'positive' });
            } else if (pctChange < -10) {
                insights.push({ icon: '📉', text: `Doanh thu 7 ngày gần nhất giảm ${Math.abs(pctChange).toFixed(0)}% so với 7 ngày trước`, type: 'warning' });
            } else {
                insights.push({ icon: '➡️', text: `Doanh thu 7 ngày gần nhất ổn định so với tuần trước`, type: 'info' });
            }
        } else if (last7Rev > 0) {
            insights.push({ icon: '🎉', text: `Tuần này có doanh thu ${formatCurrency(last7Rev)}, tuần trước chưa phát sinh`, type: 'positive' });
        }

        // 2) Peak day
        const peakDay = dailyRevenue.reduce((max, d) => d.revenue > max.revenue ? d : max, dailyRevenue[0]);
        if (peakDay.revenue > 0) {
            insights.push({ icon: '🏆', text: `Ngày có doanh thu cao nhất: ${formatShortDate(peakDay.date)} — ${formatCurrency(peakDay.revenue)} (${peakDay.orders} đơn)`, type: 'info' });
        }

        // 3) Active days
        const activeDays = dailyRevenue.filter(d => d.revenue > 0).length;
        insights.push({ icon: '📅', text: `${activeDays}/${dailyRevenue.length} ngày có phát sinh doanh thu trong 30 ngày qua`, type: activeDays < 5 ? 'warning' : 'info' });

        // 4) Product concentration
        if (productBreakdown.length === 1) {
            insights.push({ icon: '⚠️', text: `Toàn bộ doanh thu đến từ 1 sản phẩm — cân nhắc đa dạng hoá để giảm rủi ro`, type: 'suggestion' });
        } else if (productBreakdown.length > 1) {
            const topProduct = productBreakdown[0];
            const topPct = (topProduct.revenue / totalProductRevenue * 100).toFixed(0);
            insights.push({ icon: '📦', text: `"${topProduct.name}" chiếm ${topPct}% tổng doanh thu (${topProduct.count} đơn)`, type: 'info' });
        }

        // 5) Coupon impact
        if (couponImpact && couponImpact.totalDiscount > 0 && stats.totalRevenue > 0) {
            const discountPct = (couponImpact.totalDiscount / (stats.totalRevenue + couponImpact.totalDiscount) * 100).toFixed(1);
            insights.push({ icon: '🎫', text: `Mã giảm giá đã giảm tổng ${formatCurrency(couponImpact.totalDiscount)} (${discountPct}% doanh thu gốc, ${couponImpact.usedCount} lượt)`, type: Number(discountPct) > 20 ? 'warning' : 'info' });
        }

        // 6) Avg order value
        const totalOrders = dailyRevenue.reduce((s, d) => s + d.orders, 0);
        if (totalOrders > 0 && stats.totalRevenue > 0) {
            const avgOrder = stats.totalRevenue / totalOrders;
            insights.push({ icon: '💰', text: `Giá trị trung bình mỗi đơn: ${formatCurrency(avgOrder)}`, type: 'info' });
        }

        // 7) Pending orders
        if (stats.pendingOrders > 0) {
            insights.push({ icon: '⏳', text: `Có ${stats.pendingOrders} đơn đang chờ duyệt — kiểm tra và xử lý sớm`, type: 'warning' });
        }

        return insights;
    }

    const insights = generateInsights();

    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Báo cáo Doanh thu</h1>
                <div className="flex items-center gap-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl px-3 py-1.5 shadow-sm">
                    <span className="text-sm font-medium text-surface-500">Từ ngày:</span>
                    <input
                        type="date"
                        className="bg-transparent text-sm focus:outline-none text-surface-900 dark:text-surface-100 placeholder-surface-400"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                    <span className="text-sm font-medium text-surface-500">đến:</span>
                    <input
                        type="date"
                        className="bg-transparent text-sm focus:outline-none text-surface-900 dark:text-surface-100 placeholder-surface-400"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-surface-500">Tổng doanh thu</span>
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                        {stats ? formatCurrency(stats.totalRevenue) : '0 ₫'}
                    </p>
                </div>

                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-surface-500">Doanh thu tháng này</span>
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                            <Calendar className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                        {stats ? formatCurrency(stats.monthlyRevenue) : '0 ₫'}
                    </p>
                </div>

                {(fromDate && toDate) && (
                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-brand-200 dark:border-brand-800 p-5 hover:shadow-lg transition-shadow bg-brand-50/50 dark:bg-brand-900/10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-brand-700 dark:text-brand-300">Doanh thu chọn lọc</span>
                            <div className="p-2 rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-800/50">
                                <DollarSign className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                            {stats ? formatCurrency(stats.periodRevenue || 0) : '0 ₫'}
                        </p>
                    </div>
                )}

                <Link href="/admin/orders" className={`bg-white dark:bg-surface-900 rounded-2xl border ${stats && stats.pendingOrders > 0 ? 'border-amber-400 dark:border-amber-600 shadow-md shadow-amber-500/10 animate-pulse' : 'border-surface-200 dark:border-surface-800'} p-5 hover:shadow-lg transition-all block group cursor-pointer`}>
                    <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-medium ${stats && stats.pendingOrders > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-surface-500'}`}>Đơn chờ duyệt</span>
                        <div className={`p-2 rounded-xl ${stats && stats.pendingOrders > 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'bg-surface-50 text-surface-500 dark:bg-surface-800'}`}>
                            <AlertCircle className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                            {stats?.pendingOrders || 0}
                        </p>
                        <span className="text-xs text-brand-600 font-medium group-hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Xem ngay →</span>
                    </div>
                </Link>
            </div>

            {/* Daily Revenue Chart */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 mb-6">
                <div className="flex items-center gap-2 mb-5">
                    <TrendingUp className="h-5 w-5 text-brand-500" />
                    <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100">Doanh thu 30 ngày gần nhất</h2>
                </div>
                <div className="flex items-end gap-[3px] h-[200px] relative">
                    {dailyRevenue.map((d, i) => {
                        const height = maxDailyRevenue > 0 ? (d.revenue / maxDailyRevenue) * 100 : 0;
                        const isHovered = hoveredBar === i;
                        const isToday = i === dailyRevenue.length - 1;
                        return (
                            <div
                                key={d.date}
                                className="relative flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                                onMouseEnter={() => setHoveredBar(i)}
                                onMouseLeave={() => setHoveredBar(null)}
                            >
                                {/* Tooltip */}
                                {isHovered && (
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10 shadow-lg pointer-events-none">
                                        <div className="font-semibold">{formatShortDate(d.date)}</div>
                                        <div>{formatCurrency(d.revenue)}</div>
                                        <div className="text-surface-400 dark:text-surface-500">{d.orders} đơn</div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-900 dark:border-t-surface-100" />
                                    </div>
                                )}
                                {/* Bar */}
                                <div
                                    className={`w-full rounded-t-sm transition-all duration-200 ${d.revenue === 0
                                        ? 'bg-surface-100 dark:bg-surface-800'
                                        : isToday
                                            ? 'bg-brand-500 dark:bg-brand-400'
                                            : isHovered
                                                ? 'bg-brand-400 dark:bg-brand-300'
                                                : 'bg-brand-300/70 dark:bg-brand-600/50'
                                        }`}
                                    style={{ height: `${Math.max(height, d.revenue > 0 ? 4 : 1)}%` }}
                                />
                            </div>
                        );
                    })}
                </div>
                {/* X-axis labels */}
                <div className="flex gap-[3px] mt-2">
                    {dailyRevenue.map((d, i) => (
                        <div key={d.date} className="flex-1 text-center">
                            {(i % 5 === 0 || i === dailyRevenue.length - 1) && (
                                <span className="text-[10px] text-surface-400">{formatShortDate(d.date)}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Two-column: Product Breakdown + Coupon Impact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Product Breakdown */}
                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Package className="h-5 w-5 text-blue-500" />
                        <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100">Doanh thu theo sản phẩm</h2>
                    </div>
                    {productBreakdown.length === 0 ? (
                        <p className="text-surface-400 text-sm text-center py-8">Chưa có dữ liệu</p>
                    ) : (
                        <div className="space-y-4">
                            {productBreakdown.map((p, i) => {
                                const pct = (p.revenue / totalProductRevenue) * 100;
                                const colors = [
                                    'bg-brand-500', 'bg-blue-500', 'bg-emerald-500',
                                    'bg-amber-500', 'bg-purple-500', 'bg-rose-500',
                                ];
                                return (
                                    <div key={p.name}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-medium text-surface-700 dark:text-surface-300 truncate mr-2">{p.name}</span>
                                            <span className="text-sm font-bold text-surface-900 dark:text-surface-100 whitespace-nowrap">
                                                {formatCurrency(p.revenue)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-500`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-surface-400 w-14 text-right">{p.count} đơn</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Coupon Impact */}
                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Ticket className="h-5 w-5 text-green-500" />
                        <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100">Tác động mã giảm giá</h2>
                    </div>
                    {!couponImpact || couponImpact.usedCount === 0 ? (
                        <p className="text-surface-400 text-sm text-center py-8">Chưa có mã giảm giá nào được sử dụng</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-100 dark:border-red-900/30">
                                    <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Tổng giảm giá</p>
                                    <p className="text-lg font-bold text-red-700 dark:text-red-300">
                                        −{formatCurrency(couponImpact.totalDiscount)}
                                    </p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4 border border-green-100 dark:border-green-900/30">
                                    <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Lượt sử dụng</p>
                                    <p className="text-lg font-bold text-green-700 dark:text-green-300">
                                        {couponImpact.usedCount} lần
                                    </p>
                                </div>
                            </div>
                            {couponImpact.topCoupons.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-semibold text-surface-500 uppercase mb-3">Top mã giảm giá</h3>
                                    <div className="space-y-2">
                                        {couponImpact.topCoupons.map((c) => (
                                            <div key={c.code} className="flex items-center justify-between p-2.5 bg-surface-50 dark:bg-surface-800 rounded-xl">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm font-bold text-surface-900 dark:text-surface-100 bg-surface-200 dark:bg-surface-700 px-2 py-0.5 rounded-md">
                                                        {c.code}
                                                    </span>
                                                    <span className="text-xs text-surface-500">{c.count} lần</span>
                                                </div>
                                                <span className="text-sm font-semibold text-red-500">
                                                    −{formatCurrency(c.discount)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-amber-500" />
                        <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100">Đơn hàng gần đây</h2>
                    </div>
                    <Link href="/admin/orders" className="text-sm text-brand-600 hover:underline font-medium">
                        Xem tất cả →
                    </Link>
                </div>
                {recentOrders.length === 0 ? (
                    <p className="text-surface-400 text-sm text-center py-8">Chưa có đơn hàng nào</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-surface-200 dark:border-surface-800">
                                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-surface-500 uppercase">Mã đơn</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-surface-500 uppercase">Khách hàng</th>
                                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-surface-500 uppercase">Sản phẩm</th>
                                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-surface-500 uppercase">Số tiền</th>
                                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-surface-500 uppercase">Ngày</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                                {recentOrders.map((o) => (
                                    <tr key={o.order_code} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <Link href={`/checkout/${o.order_code}`} target="_blank" className="font-mono text-sm font-bold text-brand-600 hover:underline">
                                                {o.order_code}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-surface-900 dark:text-surface-100">{o.full_name}</span>
                                                <span className="text-xs text-surface-400">{o.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-surface-600 dark:text-surface-400">{o.product_name}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-sm font-bold text-surface-900 dark:text-surface-100">{formatCurrency(o.amount)}</span>
                                            {o.coupon_code && (
                                                <span className="block text-xs text-green-600 dark:text-green-400">🎫 {o.coupon_code}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right text-xs text-surface-500">{formatDateTime(o.paid_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Data Insights */}
            {insights.length > 0 && (
                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 shadow-sm mt-6">
                    <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        Phân tích & Nhận định
                    </h2>
                    <div className="space-y-2.5">
                        {insights.map((insight, i) => {
                            const colors = {
                                positive: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-300',
                                warning: 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30 text-amber-800 dark:text-amber-300',
                                info: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30 text-blue-800 dark:text-blue-300',
                                suggestion: 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/30 text-purple-800 dark:text-purple-300',
                            };
                            return (
                                <div key={i} className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm ${colors[insight.type]}`}>
                                    <span className="text-base shrink-0 mt-0.5">{insight.icon}</span>
                                    <span>{insight.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}
