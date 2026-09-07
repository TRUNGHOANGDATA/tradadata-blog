'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { SanPhamNhung } from '@/types';
import { Search, CheckCircle2, Loader2, Link as LinkIcon, ExternalLink, Pencil, X, Ticket, Plus } from 'lucide-react';
import Link from 'next/link';

interface AdminOrder {
    id: string;
    order_code: string;
    email: string;
    full_name: string;
    phone: string;
    amount: number;
    original_amount: number | null;
    coupon_code: string | null;
    status: string;
    created_at: string;
    paid_at: string | null;
    admin_note: string | null;
    products: { name: string } | null;
}

interface Product {
    id: string;
    name: string;
    price: number;
    product_type: string;
    duration_days: number | null;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [approving, setApproving] = useState<Record<string, boolean>>({});
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };
    const [editAmountModal, setEditAmountModal] = useState({
        isOpen: false,
        orderId: '',
        orderCode: '',
        currentAmount: 0,
        newAmount: 0,
        note: '',
        submitting: false
    });
    const [products, setProducts] = useState<Product[]>([]);
    const [createModal, setCreateModal] = useState({
        isOpen: false,
        email: '',
        full_name: '',
        phone: '',
        product_id: '',
        amount: 0,
        status: 'paid' as 'paid' | 'pending',
        admin_note: '',
        submitting: false
    });


    const fetchOrders = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('status', statusFilter);
            if (fromDate) queryParams.append('from', fromDate);
            if (toDate) queryParams.append('to', toDate);

            const res = await fetch(`/api/admin/orders?${queryParams.toString()}`);
            const data = await res.json();
            if (data.orders) setOrders(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            if (!silent) setLoading(false);
        }
    }, [statusFilter, fromDate, toDate]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        fetch('/api/admin/products').then(r => r.json()).then(data => {
            if (data.products) setProducts(data.products.filter((p: Product) => p.product_type === 'subscription'));
        }).catch(() => { });
    }, []);

    // Auto-refresh every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => fetchOrders(true), 10000);
        return () => clearInterval(interval);
    }, [fetchOrders]);
    const handleApprove = async (id: string) => {
        if (!confirm('Bạn xác nhận đã nhận được tiền và muốn duyệt đơn hàng này?')) return;

        setApproving(prev => ({ ...prev, [id]: true }));
        try {
            const res = await fetch(`/api/admin/orders/${id}/approve`, { method: 'POST' });
            const data = await res.json();

            if (res.ok) {
                showToast('Duyệt đơn thành công!', 'success');
                fetchOrders();
            } else {
                showToast(data.error || 'Có lỗi xảy ra', 'error');
            }
        } catch {
            showToast('Lỗi hệ thống khi duyệt đơn', 'error');
        } finally {
            setApproving(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn huỷ/từ chối đơn hàng này? (Hành động này sẽ thu hồi quyền truy cập nếu đã duyệt)')) return;

        setApproving(prev => ({ ...prev, [id]: true }));
        try {
            const res = await fetch(`/api/admin/orders/${id}/cancel`, { method: 'POST' });
            const data = await res.json();

            if (res.ok) {
                showToast('Huỷ đơn thành công!', 'success');
                fetchOrders();
            } else {
                showToast(data.error || 'Có lỗi xảy ra', 'error');
            }
        } catch {
            showToast('Lỗi hệ thống khi huỷ đơn', 'error');
        } finally {
            setApproving(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleUpdateAmount = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditAmountModal(prev => ({ ...prev, submitting: true }));
        try {
            const res = await fetch(`/api/admin/orders/${editAmountModal.orderId}/update-amount`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: editAmountModal.newAmount,
                    note: editAmountModal.note
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Cập nhật giá thành công!');
                setEditAmountModal(prev => ({ ...prev, isOpen: false }));
                fetchOrders();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch {
            alert('Lỗi hệ thống khi cập nhật giá');
        } finally {
            setEditAmountModal(prev => ({ ...prev, submitting: false }));
        }
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateModal(prev => ({ ...prev, submitting: true }));
        try {
            const res = await fetch('/api/admin/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: createModal.email,
                    full_name: createModal.full_name,
                    phone: createModal.phone,
                    product_id: createModal.product_id,
                    amount: createModal.amount,
                    status: createModal.status,
                    admin_note: createModal.admin_note,
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message || 'Tạo đơn hàng thành công!');
                setCreateModal(prev => ({ ...prev, isOpen: false, email: '', full_name: '', phone: '', product_id: '', amount: 0, admin_note: '', submitting: false }));
                fetchOrders();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch {
            alert('Lỗi hệ thống khi tạo đơn hàng');
        } finally {
            setCreateModal(prev => ({ ...prev, submitting: false }));
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const filteredOrders = orders.filter(order => {
        const query = search.toLowerCase();
        return (
            order.order_code.toLowerCase().includes(query) ||
            order.email.toLowerCase().includes(query) ||
            (order.full_name || '').toLowerCase().includes(query) ||
            (order.phone || '').toLowerCase().includes(query)
        );
    });

    const totalAmount = filteredOrders
        .filter(order => order.status === 'paid')
        .reduce((sum, order) => sum + (order.amount || 0), 0);

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-fg">Quản lý duyệt đơn</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCreateModal(prev => ({ ...prev, isOpen: true }))}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors shadow-lg shadow-brand-600/25"
                    >
                        <Plus className="w-4 h-4" /> Tạo đơn hàng
                    </button>
                    <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-sm font-medium hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    >
                        Quản lý Gói Sản phẩm
                    </Link>
                </div>
            </div>

            {/* Filter */}
            <div className="flex flex-col gap-3 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-faint" />
                        <input
                            type="text"
                            placeholder="Tìm theo Mã đơn, Email, Tên, SĐT..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-surface-200 dark:border-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-sm"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-card border border-surface-200 dark:border-surface-700 text-sm"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ xác nhận</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="cancelled">Đã huỷ</option>
                    </select>
                </div>
                <div className="flex flex-wrap items-center gap-2 bg-card border border-line rounded-xl px-3 py-1.5 shadow-sm w-fit">
                    <span className="text-sm font-medium text-fg-subtle">Từ ngày:</span>
                    <input
                        type="date"
                        className="bg-transparent text-sm focus:outline-none text-fg placeholder-surface-400"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                    <span className="text-sm font-medium text-fg-subtle">đến:</span>
                    <input
                        type="date"
                        className="bg-transparent text-sm focus:outline-none text-fg placeholder-surface-400"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            {filteredOrders.length > 0 && (
                <div className="mb-4 text-right">
                    <span className="text-fg-subtle text-sm mr-2">Tổng tiền đơn duyệt: </span>
                    <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                        {formatCurrency(totalAmount)}
                    </span>
                </div>
            )}
            <div className="bg-card rounded-2xl border border-line overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b border-line bg-surface-50 dark:bg-surface-800/50">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-fg-subtle uppercase w-[14%]">Mã Đơn / Ngày tạo</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-fg-subtle uppercase w-[24%]">Khách hàng</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-fg-subtle uppercase w-[24%]">Sản phẩm / Tiền</th>
                                <th className="text-center px-3 py-3 text-xs font-semibold text-fg-subtle uppercase w-[12%]">Trạng thái</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-fg-subtle uppercase w-[26%]">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-fg-faint">
                                        Không tìm thấy đơn hàng nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <Link
                                                    href={`/checkout/${order.order_code}`}
                                                    target="_blank"
                                                    className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                                                >
                                                    {order.order_code} <ExternalLink className="w-3 h-3" />
                                                </Link>
                                                <span className="text-xs text-fg-subtle mt-1">{formatDate(order.created_at)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-fg">{order.full_name}</span>
                                                <span className="text-sm text-fg-subtle">{order.email}</span>
                                                <span className="text-sm text-fg-subtle">{order.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-fg">
                                                    {(order.products as SanPhamNhung)?.name}
                                                </span>
                                                <div className="flex flex-col mt-1">
                                                    {order.coupon_code && order.original_amount && order.original_amount !== order.amount ? (
                                                        <>
                                                            <span className="text-xs text-fg-faint line-through">
                                                                {formatCurrency(order.original_amount)}
                                                            </span>
                                                            <span className="font-bold text-brand-600 dark:text-brand-400">
                                                                {formatCurrency(order.amount)}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-0.5">
                                                                <Ticket className="w-3 h-3" />
                                                                <span className="font-mono font-semibold">{order.coupon_code}</span>
                                                                <span>(−{formatCurrency(order.original_amount - order.amount)})</span>
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="font-bold text-brand-600 dark:text-brand-400">
                                                            {formatCurrency(order.amount)}
                                                        </span>
                                                    )}
                                                    {order.admin_note && (
                                                        <span className="text-xs text-amber-600 dark:text-amber-500 italic mt-0.5 border-l-2 border-amber-300 dark:border-amber-700 pl-2">
                                                            {order.admin_note}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 text-center">
                                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${order.status === 'paid'
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                : order.status === 'cancelled'
                                                    ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                                                }`}>
                                                {order.status === 'paid' ? 'Đã duyệt' : order.status === 'cancelled' ? 'Đã huỷ' : 'Chờ xác nhận'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {order.status === 'pending' ? (
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        onClick={() => setEditAmountModal({
                                                            isOpen: true,
                                                            orderId: order.id,
                                                            orderCode: order.order_code,
                                                            currentAmount: order.amount,
                                                            newAmount: order.amount,
                                                            note: order.admin_note || '',
                                                            submitting: false
                                                        })}
                                                        disabled={approving[order.id]}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-surface-200 dark:border-surface-700 text-fg-muted hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/10 hover:scale-105 hover:shadow-md text-xs font-medium rounded-lg transition-all whitespace-nowrap disabled:opacity-50"
                                                        title="Sửa giá (Khuyến mãi)"
                                                    >
                                                        <Pencil className="w-3 h-3" /> Sửa giá
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(order.id)}
                                                        disabled={approving[order.id]}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105 hover:shadow-md text-xs font-medium rounded-lg transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Từ chối đơn hàng"
                                                    >
                                                        <X className="w-3 h-3" /> Từ chối
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprove(order.id)}
                                                        disabled={approving[order.id]}
                                                        className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all shadow-sm shadow-emerald-500/20 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Xác nhận đã thu tiền"
                                                    >
                                                        {approving[order.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                                        Duyệt
                                                    </button>
                                                </div>
                                            ) : order.status === 'paid' ? (
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200/60 dark:border-emerald-800/40">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                            {formatDate(order.paid_at || order.created_at)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleCancel(order.id)}
                                                        disabled={approving[order.id]}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105 hover:shadow-md text-xs font-medium rounded-lg transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Huỷ duyệt / Thu hồi"
                                                    >
                                                        <X className="w-3 h-3" /> Thu hồi
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800/50 border border-surface-200/60 dark:border-surface-700/40">
                                                        <X className="w-3 h-3 text-fg-faint" />
                                                        <span className="text-xs text-fg-faint">Đã huỷ</span>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Amount Modal */}
            {editAmountModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-line">
                            <h3 className="text-lg font-bold text-fg">Sửa giá đơn hàng</h3>
                            <button
                                onClick={() => setEditAmountModal(prev => ({ ...prev, isOpen: false }))}
                                className="text-fg-faint hover:text-surface-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateAmount} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Mã đơn hàng</label>
                                <input
                                    type="text"
                                    disabled
                                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-fg-subtle font-mono text-sm"
                                    value={editAmountModal.orderCode}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Giá cũ</label>
                                    <input
                                        type="text"
                                        disabled
                                        className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-fg-subtle text-sm line-through"
                                        value={formatCurrency(editAmountModal.currentAmount)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Giá mới (VNĐ)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full px-3 py-2 bg-card border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-fg text-sm transition-shadow"
                                        value={editAmountModal.newAmount}
                                        onChange={e => setEditAmountModal(prev => ({ ...prev, newAmount: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Ghi chú (Hiển thị cho Admin)</label>
                                <textarea
                                    rows={2}
                                    placeholder="Ví dụ: Giảm giá 20% nhân dịp..."
                                    className="w-full px-3 py-2 bg-card border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-fg text-sm transition-shadow resize-none"
                                    value={editAmountModal.note}
                                    onChange={e => setEditAmountModal(prev => ({ ...prev, note: e.target.value }))}
                                />
                            </div>
                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditAmountModal(prev => ({ ...prev, isOpen: false }))}
                                    className="px-4 py-2 font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors text-sm"
                                >
                                    Huỷ
                                </button>
                                <button
                                    type="submit"
                                    disabled={editAmountModal.submitting}
                                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium flex items-center gap-2 rounded-xl transition-colors shadow-lg shadow-brand-600/25 disabled:opacity-50 text-sm"
                                >
                                    {editAmountModal.submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Order Modal */}
            {createModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-line">
                            <h3 className="text-lg font-bold text-fg">Tạo đơn hàng thủ công</h3>
                            <button
                                onClick={() => setCreateModal(prev => ({ ...prev, isOpen: false }))}
                                className="text-fg-faint hover:text-surface-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateOrder} className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Email khách hàng *</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="customer@email.com"
                                        className="w-full px-3 py-2 bg-card border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
                                        value={createModal.email}
                                        onChange={e => setCreateModal(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Họ tên</label>
                                    <input
                                        type="text"
                                        placeholder="Nguyễn Văn A"
                                        className="w-full px-3 py-2 bg-card border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
                                        value={createModal.full_name}
                                        onChange={e => setCreateModal(prev => ({ ...prev, full_name: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Số điện thoại</label>
                                    <input
                                        type="text"
                                        placeholder="0912 345 678"
                                        className="w-full px-3 py-2 bg-card border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
                                        value={createModal.phone}
                                        onChange={e => setCreateModal(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Sản phẩm *</label>
                                <select
                                    required
                                    className="w-full px-3 py-2 bg-card border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
                                    value={createModal.product_id}
                                    onChange={e => {
                                        const pid = e.target.value;
                                        const prod = products.find(p => p.id === pid);
                                        setCreateModal(prev => ({ ...prev, product_id: pid, amount: prod?.price || 0 }));
                                    }}
                                >
                                    <option value="">-- Chọn sản phẩm --</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} — {formatCurrency(p.price)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Số tiền (VNĐ)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full px-3 py-2 bg-card border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
                                        value={createModal.amount}
                                        onChange={e => setCreateModal(prev => ({ ...prev, amount: Number(e.target.value) }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Trạng thái</label>
                                    <div className="flex gap-2 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => setCreateModal(prev => ({ ...prev, status: 'paid' }))}
                                            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${createModal.status === 'paid'
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-2 ring-emerald-500/30'
                                                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                                                }`}
                                        >
                                            Đã thanh toán
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCreateModal(prev => ({ ...prev, status: 'pending' }))}
                                            className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${createModal.status === 'pending'
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-2 ring-amber-500/30'
                                                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                                                }`}
                                        >
                                            Chờ xác nhận
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {createModal.status === 'paid' && (
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                    <p className="text-xs text-emerald-700 dark:text-emerald-400">⚡ Đơn hàng sẽ được duyệt ngay và cấp quyền truy cập khoá học cho khách hàng.</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Ghi chú (Admin)</label>
                                <textarea
                                    rows={2}
                                    placeholder="Lý do tạo đơn, ghi chú..."
                                    className="w-full px-3 py-2 bg-card border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm resize-none"
                                    value={createModal.admin_note}
                                    onChange={e => setCreateModal(prev => ({ ...prev, admin_note: e.target.value }))}
                                />
                            </div>
                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCreateModal(prev => ({ ...prev, isOpen: false }))}
                                    className="px-4 py-2 font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors text-sm"
                                >
                                    Huỷ
                                </button>
                                <button
                                    type="submit"
                                    disabled={createModal.submitting}
                                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium flex items-center gap-2 rounded-xl transition-colors shadow-lg shadow-brand-600/25 disabled:opacity-50 text-sm"
                                >
                                    {createModal.submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    Tạo đơn hàng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast notification */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom-4 fade-in duration-300
                    ${toast.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-900/80 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                        : 'bg-red-50 dark:bg-red-900/80 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300'
                    }`}
                >
                    {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {toast.message}
                </div>
            )}
        </>
    );
}
