'use client';

import { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, Import, ToggleLeft, ToggleRight, Calendar, Hash, Percent, Banknote, Eye, X, Loader2 } from 'lucide-react';
import DateTimePicker from '@/components/ui/DateTimePicker';

interface Coupon {
    id: string;
    code: string;
    discount_type: string;
    discount_value: number;
    min_order_amount: number;
    max_discount: number | null;
    usage_limit: number | null;
    per_user_limit: number | null;
    used_count: number;
    expires_at: string | null;
    is_active: boolean;
    created_at: string;
    applicable_products: { id: string; name: string }[];
    latest_user_emails: string[];
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [showBatch, setShowBatch] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [usageData, setUsageData] = useState<{ user_email: string; used_at: string }[]>([]);
    const [usageCoupon, setUsageCoupon] = useState<Coupon | null>(null);
    const [usageLoading, setUsageLoading] = useState(false);

    const fetchProducts = async () => {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
            const data = await res.json();
            setProducts(data.products || []);
        }
    };

    // Single create form
    const [form, setForm] = useState({
        code: '',
        discount_type: 'percent',
        discount_value: 10,
        min_order_amount: 0,
        max_discount: '',
        usage_limit: '',
        per_user_limit: '',
        expires_at: '',
        applicable_product_ids: [] as string[],
    });

    // Batch import
    const [batchText, setBatchText] = useState('');
    const [batchType, setBatchType] = useState('percent');
    const [batchValue, setBatchValue] = useState(10);
    const [batchMaxDiscount, setBatchMaxDiscount] = useState('');
    const [batchMinOrder, setBatchMinOrder] = useState(0);
    const [batchUsageLimit, setBatchUsageLimit] = useState('');
    const [batchPerUserLimit, setBatchPerUserLimit] = useState('');
    const [batchExpires, setBatchExpires] = useState('');
    const [batchProductIds, setBatchProductIds] = useState<string[]>([]);

    const toggleBatchProduct = (productId: string) => {
        setBatchProductIds(prev =>
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    const fetchCoupons = async () => {
        const res = await fetch('/api/admin/coupons');
        if (res.ok) {
            const data = await res.json();
            setCoupons(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCoupons();
        fetchProducts();
    }, []);

    const handleCreate = async () => {
        setError('');
        setSuccess('');
        const res = await fetch('/api/admin/coupons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                max_discount: form.max_discount ? Number(form.max_discount) : null,
                usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
                per_user_limit: form.per_user_limit ? Number(form.per_user_limit) : null,
                expires_at: form.expires_at || null,
            }),
        });
        if (res.ok) {
            setSuccess('Tạo mã thành công!');
            setShowCreate(false);
            setForm({ code: '', discount_type: 'percent', discount_value: 10, min_order_amount: 0, max_discount: '', usage_limit: '', expires_at: '', per_user_limit: '', applicable_product_ids: [] });
            fetchCoupons();
        } else {
            const data = await res.json();
            setError(data.error || 'Lỗi tạo mã');
        }
    };

    const viewUsage = async (coupon: Coupon) => {
        setUsageCoupon(coupon);
        setUsageLoading(true);
        try {
            const res = await fetch(`/api/admin/coupons/usage?coupon_id=${coupon.id}`);
            if (res.ok) {
                const data = await res.json();
                setUsageData(data);
            }
        } catch { /* ignore */ }
        setUsageLoading(false);
    };

    const toggleProductSelection = (productId: string) => {
        setForm(prev => {
            const current = [...prev.applicable_product_ids];
            if (current.includes(productId)) {
                return { ...prev, applicable_product_ids: current.filter(id => id !== productId) };
            } else {
                return { ...prev, applicable_product_ids: [...current, productId] };
            }
        });
    };

    const handleBatchImport = async () => {
        setError('');
        setSuccess('');
        const codes = batchText
            .split(/[\n,;]+/)
            .map((c) => c.trim())
            .filter(Boolean);

        if (codes.length === 0) {
            setError('Vui lòng nhập ít nhất 1 mã');
            return;
        }

        const res = await fetch('/api/admin/coupons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                batch: codes,
                discount_type: batchType,
                discount_value: batchValue,
                max_discount: batchMaxDiscount ? Number(batchMaxDiscount) : null,
                min_order_amount: batchMinOrder,
                usage_limit: batchUsageLimit ? Number(batchUsageLimit) : null,
                per_user_limit: batchPerUserLimit ? Number(batchPerUserLimit) : null,
                expires_at: batchExpires || null,
                applicable_product_ids: batchProductIds.length > 0 ? batchProductIds : [],
            }),
        });

        if (res.ok) {
            const data = await res.json();
            setSuccess(data.message);
            setShowBatch(false);
            setBatchText('');
            setBatchMaxDiscount('');
            setBatchMinOrder(0);
            setBatchUsageLimit('');
            setBatchPerUserLimit('');
            setBatchExpires('');
            setBatchProductIds([]);
            fetchCoupons();
        } else {
            const data = await res.json();
            setError(data.error || 'Lỗi import');
        }
    };

    const handleToggle = async (id: string, is_active: boolean) => {
        await fetch('/api/admin/coupons', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, is_active: !is_active }),
        });
        fetchCoupons();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Xác nhận xóa mã giảm giá này?')) return;
        await fetch('/api/admin/coupons', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        fetchCoupons();
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-3">
                        <Ticket className="w-7 h-7 text-brand-600" />
                        Mã giảm giá
                    </h1>
                    <p className="text-surface-500 mt-1">{coupons.length} mã</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setShowBatch(!showBatch); setShowCreate(false); }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-900 dark:text-surface-100 rounded-xl text-sm font-medium transition-colors"
                    >
                        <Import className="w-4 h-4" />
                        Import hàng loạt
                    </button>
                    <button
                        onClick={() => { setShowCreate(!showCreate); setShowBatch(false); }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Tạo mã mới
                    </button>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-600 dark:text-green-400">
                    {success}
                </div>
            )}

            {/* Create Single Form */}
            {showCreate && (
                <div className="mb-6 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
                    <h3 className="font-bold text-surface-900 dark:text-surface-100 mb-4">Tạo mã giảm giá</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Mã giảm giá *</label>
                            <input
                                type="text"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                placeholder="VD: SUMMER2026"
                                className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Loại giảm giá</label>
                            <select
                                value={form.discount_type}
                                onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                                className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm"
                            >
                                <option value="percent">Phần trăm (%)</option>
                                <option value="fixed">Cố định (VNĐ)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Giá trị *</label>
                            <input
                                type="number"
                                value={form.discount_value}
                                onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                                className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Giảm tối đa</label>
                            <input
                                type="number"
                                value={form.max_discount}
                                onChange={(e) => setForm({ ...form, max_discount: e.target.value })}
                                placeholder="Không giới hạn"
                                className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Đơn tối thiểu</label>
                            <input
                                type="number"
                                value={form.min_order_amount}
                                onChange={(e) => setForm({ ...form, min_order_amount: Number(e.target.value) })}
                                className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Giới hạn lượt dùng</label>
                            <input
                                type="number"
                                value={form.usage_limit}
                                onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                                placeholder="Không giới hạn"
                                className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Lượt dùng / Mỗi khách</label>
                            <input
                                type="number"
                                value={form.per_user_limit}
                                onChange={(e) => setForm({ ...form, per_user_limit: e.target.value })}
                                placeholder="Không giới hạn"
                                className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Hạn sử dụng</label>
                            <DateTimePicker
                                value={form.expires_at}
                                onChange={(val) => setForm({ ...form, expires_at: val })}
                                placeholder="Chọn ngày hết hạn"
                            />
                        </div>

                        {/* Product restrictions */}
                        <div className="col-span-full">
                            <label className="text-xs font-medium text-surface-500 mb-2 block">Áp dụng cho khóa học (Mặc định: Tất cả)</label>
                            <div className="bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2">
                                {products.map(p => (
                                    <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-800 p-1.5 rounded-lg transition-colors">
                                        <input
                                            type="checkbox"
                                            className="rounded border-surface-300 dark:border-surface-600 text-brand-600 focus:ring-brand-600 bg-white dark:bg-surface-800"
                                            checked={form.applicable_product_ids.includes(p.id)}
                                            onChange={() => toggleProductSelection(p.id)}
                                        />
                                        <span className="text-sm text-surface-700 dark:text-surface-300 truncate">{p.name} - {formatCurrency(p.price)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-end col-span-full justify-end mt-2">
                            <button onClick={handleCreate} className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition-colors">
                                Tạo mã
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Batch Import */}
            {showBatch && (
                <div className="mb-6 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
                    <h3 className="font-bold text-surface-900 dark:text-surface-100 mb-4">Import hàng loạt</h3>
                    <p className="text-sm text-surface-500 mb-4">Nhập nhiều mã giảm giá, mỗi dòng 1 mã (hoặc phân tách bằng dấu phẩy). Tất cả mã sẽ áp dụng chung cài đặt bên dưới.</p>

                    {/* Textarea */}
                    <div className="mb-4">
                        <label className="text-xs font-medium text-surface-500 mb-1 block">Danh sách mã *</label>
                        <textarea
                            value={batchText}
                            onChange={(e) => setBatchText(e.target.value)}
                            rows={4}
                            placeholder={"SUMMER01\nSUMMER02\nSUMMER03"}
                            className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm font-mono resize-none"
                        />
                    </div>

                    {/* Settings grid — same fields as single create */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Loại giảm giá</label>
                            <select
                                value={batchType}
                                onChange={(e) => setBatchType(e.target.value)}
                                className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm"
                            >
                                <option value="percent">Phần trăm (%)</option>
                                <option value="fixed">Cố định (VNĐ)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Giá trị *</label>
                            <input
                                type="number"
                                value={batchValue}
                                onChange={(e) => setBatchValue(Number(e.target.value))}
                                className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Giảm tối đa</label>
                            <input
                                type="number"
                                value={batchMaxDiscount}
                                onChange={(e) => setBatchMaxDiscount(e.target.value)}
                                placeholder="Không giới hạn"
                                className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Đơn tối thiểu</label>
                            <input
                                type="number"
                                value={batchMinOrder}
                                onChange={(e) => setBatchMinOrder(Number(e.target.value))}
                                className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Giới hạn lượt dùng</label>
                            <input
                                type="number"
                                value={batchUsageLimit}
                                onChange={(e) => setBatchUsageLimit(e.target.value)}
                                placeholder="Không giới hạn"
                                className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Lượt dùng / Mỗi khách</label>
                            <input
                                type="number"
                                value={batchPerUserLimit}
                                onChange={(e) => setBatchPerUserLimit(e.target.value)}
                                placeholder="Không giới hạn"
                                className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-surface-500 mb-1 block">Hạn sử dụng</label>
                            <DateTimePicker
                                value={batchExpires}
                                onChange={(val) => setBatchExpires(val)}
                                placeholder="Chọn ngày hết hạn"
                            />
                        </div>

                        {/* Product restrictions */}
                        <div className="col-span-full">
                            <label className="text-xs font-medium text-surface-500 mb-2 block">Áp dụng cho khóa học (Mặc định: Tất cả)</label>
                            <div className="bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2">
                                {products.map(p => (
                                    <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-800 p-1.5 rounded-lg transition-colors">
                                        <input
                                            type="checkbox"
                                            className="rounded border-surface-300 dark:border-surface-600 text-brand-600 focus:ring-brand-600 bg-white dark:bg-surface-800"
                                            checked={batchProductIds.includes(p.id)}
                                            onChange={() => toggleBatchProduct(p.id)}
                                        />
                                        <span className="text-sm text-surface-700 dark:text-surface-300 truncate">{p.name} - {formatCurrency(p.price)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-end col-span-full justify-end mt-2">
                            <button
                                onClick={handleBatchImport}
                                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition-colors"
                            >
                                Import {batchText.split(/[\n,;]+/).filter((c) => c.trim()).length} mã
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Coupons Table */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-surface-500">Đang tải...</div>
                ) : coupons.length === 0 ? (
                    <div className="p-12 text-center">
                        <Ticket className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                        <p className="text-surface-500">Chưa có mã giảm giá nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase">Mã</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase">Giảm giá</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase">Lượt dùng</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase">/User</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase">Áp dụng</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase">Hạn</th>
                                    <th className="text-center px-5 py-3 text-xs font-semibold text-surface-500 uppercase">Trạng thái</th>
                                    <th className="text-center px-5 py-3 text-xs font-semibold text-surface-500 uppercase">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                                {coupons.map((c) => (
                                    <tr key={c.id} className={`hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors ${!c.is_active ? 'opacity-50' : ''}`}>
                                        <td className="px-5 py-4">
                                            <span className="font-mono font-bold text-sm text-surface-900 dark:text-surface-100 bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded-lg">
                                                {c.code}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm">
                                            <div className="flex items-center gap-1.5">
                                                {c.discount_type === 'percent' ? (
                                                    <><Percent className="w-3.5 h-3.5 text-brand-500" /><span className="font-semibold text-brand-600 dark:text-brand-400">{c.discount_value}%</span></>
                                                ) : (
                                                    <><Banknote className="w-3.5 h-3.5 text-brand-500" /><span className="font-semibold text-brand-600 dark:text-brand-400">{formatCurrency(c.discount_value)}</span></>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm">
                                            <button
                                                onClick={() => viewUsage(c)}
                                                className="flex flex-col items-start text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors group"
                                                title="Xem chi tiết lượt dùng"
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    <Hash className="w-3.5 h-3.5" />
                                                    <span>{c.used_count}/{c.usage_limit || '∞'}</span>
                                                    <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </span>
                                                {c.latest_user_emails && c.latest_user_emails.length > 0 && (
                                                    <div className="mt-1 flex flex-col gap-0.5">
                                                        {c.latest_user_emails.slice(0, 2).map((email, i) => (
                                                            <span key={i} className="text-xs text-surface-400 truncate max-w-[180px]" title={email}>
                                                                {email}
                                                            </span>
                                                        ))}
                                                        {c.latest_user_emails.length > 2 && (
                                                            <span className="text-xs text-brand-500">+{c.latest_user_emails.length - 2} khác</span>
                                                        )}
                                                    </div>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-surface-500">
                                            {c.per_user_limit ? `${c.per_user_limit} lần` : '∞'}
                                        </td>
                                        <td className="px-5 py-4 text-sm">
                                            {c.applicable_products && c.applicable_products.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {c.applicable_products.map((p) => (
                                                        <span key={p.id} className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
                                                            {p.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-surface-400">Tất cả</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-surface-500">
                                            {c.expires_at ? (
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(c.expires_at).toLocaleDateString('vi-VN')}
                                                </div>
                                            ) : 'Không HSD'}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <button
                                                onClick={() => handleToggle(c.id, c.is_active)}
                                                className="inline-flex items-center gap-1"
                                                title={c.is_active ? 'Tắt' : 'Bật'}
                                            >
                                                {c.is_active ? (
                                                    <ToggleRight className="w-7 h-7 text-green-500" />
                                                ) : (
                                                    <ToggleLeft className="w-7 h-7 text-surface-400" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            {c.used_count > 0 ? (
                                                <span
                                                    className="p-1.5 text-surface-300 dark:text-surface-600 cursor-not-allowed inline-block"
                                                    title="Không thể xoá mã đã được sử dụng"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleDelete(c.id)}
                                                    className="p-1.5 text-red-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Usage Detail Modal */}
            {usageCoupon && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setUsageCoupon(null)}>
                    <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[70vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="p-5 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-surface-900 dark:text-surface-100">Lịch sử sử dụng</h3>
                                <p className="text-sm text-surface-500 mt-0.5">Mã: <span className="font-mono font-semibold">{usageCoupon.code}</span></p>
                            </div>
                            <button onClick={() => setUsageCoupon(null)} className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 overflow-y-auto max-h-[50vh]">
                            {usageLoading ? (
                                <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>
                            ) : usageData.length === 0 ? (
                                <p className="text-center text-surface-500 py-8">Chưa có ai sử dụng mã này</p>
                            ) : (
                                <div className="space-y-3">
                                    {usageData.map((u, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
                                            <span className="text-sm font-medium text-surface-900 dark:text-surface-100">{u.user_email}</span>
                                            <span className="text-xs text-surface-500">{u.used_at ? new Date(u.used_at).toLocaleString('vi-VN') : '—'}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
