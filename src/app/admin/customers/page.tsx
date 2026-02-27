'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, ExternalLink, X, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface Customer {
    email: string;
    full_name: string;
    phone: string;
    total_orders: number;
    total_spent: number;
    last_order_at: string | null;
}

interface CustomerOrder {
    id: string;
    order_code: string;
    amount: number;
    status: string;
    created_at: string;
    paid_at: string | null;
    products: { name: string } | null;
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modal state
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/customers');
            const data = await res.json();
            if (data.customers) setCustomers(data.customers);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrders = async (customer: Customer) => {
        setSelectedCustomer(customer);
        setLoadingOrders(true);
        setCustomerOrders([]);
        try {
            const res = await fetch(`/api/admin/customers/${encodeURIComponent(customer.email)}`);
            const data = await res.json();
            if (data.orders) setCustomerOrders(data.orders);
        } catch (error) {
            console.error('Error fetching customer orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    const formatDateTime = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const filteredCustomers = customers.filter(c => {
        const query = search.toLowerCase();
        return (
            c.email.toLowerCase().includes(query) ||
            (c.full_name || '').toLowerCase().includes(query) ||
            (c.phone || '').toLowerCase().includes(query)
        );
    });

    if (loading && customers.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Khách hàng</h1>
                <div className="flex items-center gap-2 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 px-4 py-2 rounded-xl text-sm font-medium">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Tổng số: {customers.length} khách</span>
                </div>
            </div>

            {/* Filter */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo Tên, Email, SĐT..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Khách hàng</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Tổng đơn</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Tổng chi tiêu</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-surface-500 uppercase">Đơn gần nhất</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-surface-400">
                                        Không có khách hàng nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.email}
                                        className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer"
                                        onClick={() => handleViewOrders(customer)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-surface-900 dark:text-surface-100">{customer.full_name}</span>
                                                <span className="text-sm text-surface-500">{customer.email}</span>
                                                <span className="text-sm text-surface-500">{customer.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center justify-center min-w-[2rem] h-8 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 font-medium text-sm">
                                                {customer.total_orders}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-brand-600 dark:text-brand-400">
                                                {formatCurrency(customer.total_spent)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-surface-500">
                                            {customer.last_order_at ? formatDate(customer.last_order_at) : <span className="text-surface-400 italic">Chưa có đơn</span>}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Orders Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => setSelectedCustomer(null)}>
                    <div className="bg-white dark:bg-surface-900 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200"
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                            <div>
                                <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100">Lịch sử đơn hàng</h3>
                                <p className="text-sm text-surface-500 mt-1">
                                    Khách hàng: <span className="font-medium text-surface-900 dark:text-surface-100">{selectedCustomer.full_name}</span> ({selectedCustomer.email})
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="text-surface-400 hover:text-surface-600 transition-colors p-2 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5">
                            {loadingOrders ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
                                </div>
                            ) : customerOrders.length === 0 ? (
                                <div className="text-center p-8 text-surface-500">
                                    Không tìm thấy đơn hàng nào.
                                </div>
                            ) : (
                                <div className="border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                                                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase">Mã Đơn / Ngày</th>
                                                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase">Sản phẩm</th>
                                                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase">Thành tiền</th>
                                                <th className="text-right px-4 py-3 text-xs font-semibold text-surface-500 uppercase">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
                                            {customerOrders.map(order => (
                                                <tr key={order.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-col">
                                                            <Link
                                                                href={`/checkout/${order.order_code}`}
                                                                target="_blank"
                                                                className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                                                            >
                                                                {order.order_code} <ExternalLink className="w-3 h-3" />
                                                            </Link>
                                                            <span className="text-xs text-surface-500 mt-1">{formatDateTime(order.created_at)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-medium text-surface-900 dark:text-surface-100">
                                                        {(order.products as any)?.name || 'Sản phẩm không xác định'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-bold text-surface-900 dark:text-surface-100">
                                                        {formatCurrency(order.amount)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${order.status === 'paid'
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                            : order.status === 'cancelled'
                                                                ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                                                            }`}>
                                                            {order.status === 'paid' ? 'Đã duyệt' : order.status === 'cancelled' ? 'Đã huỷ' : 'Chờ xác nhận'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
