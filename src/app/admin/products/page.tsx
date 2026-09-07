'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Check, X, Loader2, ImagePlus, Sparkles } from 'lucide-react';

interface Section {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    duration_days?: number | null;
    product_type: string;
    features: string[];
    is_active: boolean;
    sort_order: number;
    image_url?: string | null;
    section_id?: string | null;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal / Form state
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
        name: '', description: '', price: 0, product_type: 'subscription', features: [], is_active: true, sort_order: 0
    });
    const [featuresText, setFeaturesText] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // AI Image state
    const [aiImageOpen, setAiImageOpen] = useState(false);
    const [aiImageLoading, setAiImageLoading] = useState(false);
    const [aiImageDesc, setAiImageDesc] = useState('');

    useEffect(() => {
        fetchProducts();
        fetch('/api/admin/course-sections').then(r => r.json()).then(d => setSections(d || []));
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            if (data.products) setProducts(data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEdit = (product?: Product) => {
        if (product) {
            setCurrentProduct(product);
            setFeaturesText((product.features || []).join('\n'));
        } else {
            setCurrentProduct({
                name: '', description: '', price: 0, product_type: 'subscription', features: [], is_active: true, sort_order: 0
            });
            setFeaturesText('');
        }
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
        setCurrentProduct({});
    };

    const handleSave = async () => {
        if (!currentProduct.name) return alert('Tên sản phẩm không được để trống');

        setSaving(true);
        const payload = {
            ...currentProduct,
            features: featuresText.split('\n').map(s => s.trim()).filter(Boolean)
        };

        const isUpdate = !!currentProduct.id;
        const url = isUpdate ? `/api/admin/products/${currentProduct.id}` : '/api/admin/products';
        const method = isUpdate ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                await fetchProducts();
                handleCloseEdit();
            } else {
                const data = await res.json();
                alert('Lỗi: ' + data.error);
            }
        } catch (error) {
            alert('Lỗi hệ thống');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc xoá sản phẩm này? Cẩn thận nếu đã có người mua thì có thể bị lỗi liên kết.')) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id));
            } else {
                alert('Xoá thất bại vì sản phẩm đã có giao dịch mua khóa ngoại.');
            }
        } catch (error) {
            alert('Lỗi hệ thống');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
                setCurrentProduct(prev => ({ ...prev, image_url: data.url }));
            } else {
                alert('Upload thất bại');
            }
        } catch {
            alert('Lỗi upload ảnh');
        } finally {
            setUploadingImage(false);
            if (imageInputRef.current) imageInputRef.current.value = '';
        }
    };

    const generateAiImage = async () => {
        if (!aiImageDesc.trim()) return;
        const prompt = `Hãy tạo một hình ảnh minh hoạ chất lượng cao cho sản phẩm/khoá học với mô tả sau:\n\n"${aiImageDesc.trim()}"\n\nYêu cầu:\n- Phong cách chuyên nghiệp, hiện đại\n- Màu sắc hài hoà, bắt mắt\n- Phù hợp để làm ảnh sản phẩm/khoá học\n- Không có text/chữ trong ảnh\n- Tỷ lệ 16:9`;
        try {
            await navigator.clipboard.writeText(prompt);
            alert('✅ Đã copy prompt tạo ảnh! Paste vào Gemini Photo để tạo ảnh.');
            setAiImageDesc('');
            setAiImageOpen(false);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = prompt;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('✅ Đã copy prompt tạo ảnh! Paste vào Gemini Photo để tạo ảnh.');
            setAiImageDesc('');
            setAiImageOpen(false);
        }
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
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-fg">Gói Sản Phẩm</h1>
                <button
                    onClick={() => handleOpenEdit()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25"
                >
                    <Plus className="h-4 w-4" />
                    Thêm gói mới
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-card rounded-3xl p-6 border border-line flex flex-col relative overflow-hidden group">
                        {!product.is_active && (
                            <div className="absolute top-4 right-4 px-2 py-1 bg-surface-100 dark:bg-surface-800 text-fg-subtle rounded text-xs font-semibold z-10">
                                Ẩn
                            </div>
                        )}
                        {product.image_url && (
                            <div className="w-full h-40 overflow-hidden rounded-t-3xl -mt-6 -mx-6 mb-4" style={{ width: 'calc(100% + 3rem)' }}>
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-fg">{product.name}</h3>
                        <p className="text-fg-subtle text-sm mt-1 mb-4 h-10 line-clamp-2">{product.description}</p>
                        <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-6">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </div>

                        <div className="flex-1 space-y-3 mb-6">
                            {(product.features || []).map((feat, idx) => (
                                <div key={idx} className="flex gap-3 text-sm text-surface-600 dark:text-surface-400">
                                    <Check className="h-5 w-5 text-brand-500 shrink-0" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-surface-100 dark:border-surface-800 mt-auto">
                            <button
                                onClick={() => handleOpenEdit(product)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors text-sm font-medium"
                            >
                                <Edit className="w-4 h-4" /> Sửa
                            </button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Form */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm">
                    <div className="bg-card rounded-3xl p-6 w-full max-w-lg border border-line shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-fg">
                                {currentProduct.id ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                            </h2>
                            <button onClick={handleCloseEdit} className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800">
                                <X className="w-5 h-5 text-fg-subtle" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">Tên gói</label>
                                <input
                                    type="text"
                                    value={currentProduct.name}
                                    onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">Mô tả ngắn</label>
                                <input
                                    type="text"
                                    value={currentProduct.description}
                                    onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">Giá (VND)</label>
                                    <input
                                        type="number"
                                        value={currentProduct.price}
                                        onChange={e => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">Thứ tự hiển thị</label>
                                    <input
                                        type="number"
                                        value={currentProduct.sort_order}
                                        onChange={e => setCurrentProduct({ ...currentProduct, sort_order: Number(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">Tính theo</label>
                                    <select
                                        value={currentProduct.product_type}
                                        onChange={e => setCurrentProduct({ ...currentProduct, product_type: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                                    >
                                        <option value="subscription">Gói tháng/năm (Subscription)</option>
                                        <option value="course">Mua đứt (Khóa học)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                                        Chu kỳ (Số ngày)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Để trống nếu vĩnh viễn"
                                        value={currentProduct.duration_days || ''}
                                        onChange={e => {
                                            const val = e.target.value ? Number(e.target.value) : null;
                                            setCurrentProduct({ ...currentProduct, duration_days: val as number });
                                        }}
                                        className="w-full px-4 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                                    />
                                    <div className="text-xs text-fg-subtle mt-1">Ví dụ: 30 (1 tháng), 365 (1 năm)</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">Đầu mục</label>
                                    <select
                                        value={currentProduct.section_id || ''}
                                        onChange={e => setCurrentProduct({ ...currentProduct, section_id: e.target.value || null })}
                                        className="w-full px-4 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                                    >
                                        <option value="">-- Không thuộc đầu mục --</option>
                                        {sections.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 justify-between flex items-center text-surface-700 dark:text-surface-300">
                                        Trạng thái
                                        <input
                                            type="checkbox"
                                            checked={currentProduct.is_active}
                                            onChange={e => setCurrentProduct({ ...currentProduct, is_active: e.target.checked })}
                                            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                                        />
                                    </label>
                                    <div className="text-xs text-fg-subtle mt-2">Bật để hiển thị trên Pricing</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">Các tính năng (Mỗi dòng 1 tính năng)</label>
                                <textarea
                                    value={featuresText}
                                    onChange={e => setFeaturesText(e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm"
                                    placeholder="Đọc toàn bộ bài viết premium..."
                                />
                            </div>

                            {/* Ảnh sản phẩm */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Ảnh sản phẩm</label>
                                    <button
                                        type="button"
                                        onClick={() => setAiImageOpen(true)}
                                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 text-purple-600 dark:text-pink-400 transition-all border border-purple-500/20"
                                        title="Tạo ảnh bằng AI"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" /> AI Tạo Ảnh
                                    </button>
                                </div>
                                {currentProduct.image_url ? (
                                    <div className="relative rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700">
                                        <img src={currentProduct.image_url} alt="" className="w-full h-40 object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setCurrentProduct(prev => ({ ...prev, image_url: null }))}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => imageInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-surface-300 dark:border-surface-600 cursor-pointer hover:border-brand-400 dark:hover:border-brand-600 transition-colors"
                                    >
                                        {uploadingImage ? (
                                            <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
                                        ) : (
                                            <>
                                                <ImagePlus className="w-6 h-6 text-fg-faint mb-1" />
                                                <span className="text-xs text-fg-subtle">Click để upload ảnh</span>
                                            </>
                                        )}
                                    </div>
                                )}
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 mt-4"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu sản phẩm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Image Modal */}
            {aiImageOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm">
                    <div className="bg-card rounded-3xl p-6 w-full max-w-lg border border-line shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-fg">
                                <Sparkles className="h-6 w-6 text-brand-500" />
                                Tạo Ảnh bằng AI
                            </h2>
                            <button onClick={() => setAiImageOpen(false)} className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800">
                                <X className="w-5 h-5 text-fg-subtle" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">Mô tả chi tiết ảnh bạn muốn tạo</label>
                                <textarea
                                    value={aiImageDesc}
                                    onChange={e => setAiImageDesc(e.target.value)}
                                    rows={3}
                                    placeholder="Ví dụ: Hình ảnh vector 3D một chiếc hộp quà tỏa sáng, màu sắc pastel, phong cách hiện đại..."
                                    className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={generateAiImage}
                                disabled={!aiImageDesc.trim()}
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                <Sparkles className="w-5 h-5" /> Tạo prompt ảnh (Gemini)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
