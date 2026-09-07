'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, Shield, User, ShieldCheck, BookOpen, Search, Info, Crown, Plus, X, GraduationCap, Copy, Check } from 'lucide-react';

interface UserProfile {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
    role: string;
    is_subscribed: boolean;
    created_at: string;
}

const ROLE_DESCRIPTIONS = {
    admin: 'Toàn quyền: đăng bài, sửa/xoá, quản lý users & settings.',
    editor: 'Viết bài, sửa bài. Không thể quản lý users.',
    reader: 'Chỉ đọc. Không truy cập được trang Admin.',
};

export default function UsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<{ id: string; name: string; price: number; duration_days: number | null; }[]>([]);
    const [createModal, setCreateModal] = useState({
        isOpen: false, email: '', full_name: '', phone: '', role: 'reader',
        submitting: false, resultMessage: ''
    });
    const [subModal, setSubModal] = useState({
        isOpen: false, user_email: '', user_id: '', user_name: '', product_id: '',
        duration_days: 0, submitting: false
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.users) setUsers(data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch('/api/admin/products').then(r => r.json()).then(data => {
            if (data.products) setProducts(data.products);
        }).catch(() => { });
    }, []);

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;
        const q = searchQuery.toLowerCase();
        return users.filter(
            u => (u.full_name?.toLowerCase().includes(q)) || u.email.toLowerCase().includes(q)
        );
    }, [users, searchQuery]);

    const handleRoleChange = async (userId: string, userName: string, currentRole: string, newRole: string) => {
        if (newRole === currentRole) return;

        const roleLabels: Record<string, string> = { admin: 'Admin', editor: 'Editor', reader: 'Reader' };
        const confirmed = confirm(
            `Bạn có chắc muốn đổi role của "${userName}" từ ${roleLabels[currentRole]} → ${roleLabels[newRole]}?\n\n` +
            `Quyền hạn mới: ${ROLE_DESCRIPTIONS[newRole as keyof typeof ROLE_DESCRIPTIONS]}`
        );
        if (!confirmed) return;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, role: newRole }),
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                const data = await res.json();
                alert('Lỗi: ' + (data.error || 'Unknown'));
            }
        } catch {
            alert('Có lỗi xảy ra');
        }
    };

    const handlePremiumToggle = async (userId: string, userName: string, current: boolean) => {
        const action = current ? 'TẮT Premium' : 'BẬT Premium';
        const confirmed = confirm(
            `Bạn có chắc muốn ${action} cho "${userName}"?`
        );
        if (!confirmed) return;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, is_subscribed: !current }),
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_subscribed: !current } : u));
            } else {
                const data = await res.json();
                alert('Lỗi: ' + (data.error || 'Unknown'));
            }
        } catch {
            alert('Có lỗi xảy ra');
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    const getRoleInfo = (role: string) => {
        switch (role) {
            case 'admin':
                return { label: 'Admin', color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20', icon: ShieldCheck };
            case 'editor':
                return { label: 'Editor', color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20', icon: Shield };
            default:
                return { label: 'Reader', color: 'text-surface-600 bg-surface-100 dark:text-surface-400 dark:bg-surface-800', icon: BookOpen };
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateModal(prev => ({ ...prev, submitting: true }));
        try {
            const res = await fetch('/api/admin/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: createModal.email, full_name: createModal.full_name,
                    phone: createModal.phone, role: createModal.role,
                })
            });
            const data = await res.json();
            if (res.ok) {
                setCreateModal(prev => ({ ...prev, submitting: false, resultMessage: data.message }));
                fetchUsers();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
                setCreateModal(prev => ({ ...prev, submitting: false }));
            }
        } catch {
            alert('Lỗi hệ thống');
            setCreateModal(prev => ({ ...prev, submitting: false }));
        }
    };

    const handleAddSub = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubModal(prev => ({ ...prev, submitting: true }));
        try {
            const res = await fetch('/api/admin/users/add-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_email: subModal.user_email, user_id: subModal.user_id,
                    product_id: subModal.product_id,
                    duration_days: subModal.duration_days || undefined,
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message || 'Thêm khoá học thành công!');
                setSubModal(prev => ({ ...prev, isOpen: false }));
                fetchUsers();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch {
            alert('Lỗi hệ thống');
        } finally {
            setSubModal(prev => ({ ...prev, submitting: false }));
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
                <h1 className="text-2xl font-bold text-fg">Quản lý người dùng</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-fg-subtle">{filteredUsers.length} / {users.length}</span>
                    <button
                        onClick={() => setCreateModal({ isOpen: true, email: '', full_name: '', phone: '', role: 'reader', submitting: false, resultMessage: '' })}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors shadow-lg shadow-brand-600/25"
                    >
                        <Plus className="w-4 h-4" /> Tạo tài khoản
                    </button>
                </div>
            </div>

            {/* Role Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {(['admin', 'editor', 'reader'] as const).map(role => {
                    const info = getRoleInfo(role);
                    const Icon = info.icon;
                    return (
                        <div key={role} className="flex items-start gap-3 bg-card rounded-xl border border-line p-3">
                            <div className={`p-2 rounded-lg ${info.color}`}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-fg">{info.label}</p>
                                <p className="text-xs text-fg-subtle">{ROLE_DESCRIPTIONS[role]}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-faint" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-surface-200 dark:border-surface-700 text-sm text-fg placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                />
            </div>

            <div className="bg-card rounded-2xl border border-line overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-line bg-surface-50 dark:bg-surface-800/50">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-fg-subtle uppercase">Người dùng</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-fg-subtle uppercase">Email</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-fg-subtle uppercase">Vai trò</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-fg-subtle uppercase">Premium</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-fg-subtle uppercase">Ngày tham gia</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-fg-subtle uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-fg-faint text-sm">
                                        Không tìm thấy người dùng nào
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => {
                                const roleInfo = getRoleInfo(user.role);
                                return (
                                    <tr key={user.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt="" className="w-9 h-9 rounded-xl object-cover" referrerPolicy="no-referrer" />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                                                        <User className="h-4 w-4 text-brand-600" />
                                                    </div>
                                                )}
                                                <span className="text-sm font-medium text-fg">
                                                    {user.full_name || 'Chưa đặt tên'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-fg-subtle">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, user.full_name || user.email, user.role, e.target.value)}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${roleInfo.color}`}
                                            >
                                                <option value="reader">Reader</option>
                                                <option value="editor">Editor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handlePremiumToggle(user.id, user.full_name || user.email, user.is_subscribed)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${user.is_subscribed
                                                    ? 'bg-amber-500'
                                                    : 'bg-surface-300 dark:bg-surface-600'
                                                    }`}
                                                title={user.is_subscribed ? 'Premium đang BẬT — Click để tắt' : 'Premium đang TẮT — Click để bật'}
                                            >
                                                <span
                                                    className={`inline-flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 ${user.is_subscribed ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                >
                                                    {user.is_subscribed && <Crown className="h-2.5 w-2.5 text-amber-500" />}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-fg-subtle">
                                            {formatDate(user.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSubModal({
                                                    isOpen: true, user_email: user.email, user_id: user.id,
                                                    user_name: user.full_name || user.email,
                                                    product_id: '', duration_days: 0, submitting: false
                                                })}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/20 text-xs font-medium rounded-xl transition-all"
                                                title="Thêm khoá học cho user này"
                                            >
                                                <GraduationCap className="w-3.5 h-3.5" /> Thêm khoá học
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Account Modal */}
            {createModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-line">
                            <h3 className="text-lg font-bold text-fg">Tạo tài khoản mới</h3>
                            <button onClick={() => setCreateModal(prev => ({ ...prev, isOpen: false }))} className="text-fg-faint hover:text-surface-600"><X className="w-5 h-5" /></button>
                        </div>
                        {createModal.resultMessage ? (
                            <div className="p-4 space-y-4">
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">✅ {createModal.resultMessage}</p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-500">Khách hàng chỉ cần đăng nhập bằng Google với email này để truy cập hệ thống.</p>
                                </div>
                                <button
                                    onClick={() => setCreateModal(prev => ({ ...prev, isOpen: false }))}
                                    className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors text-sm"
                                >
                                    Đóng
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleCreateUser} className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Email Google *</label>
                                    <input type="email" required placeholder="customer@gmail.com" className="w-full px-3 py-2 bg-card border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" value={createModal.email} onChange={e => setCreateModal(prev => ({ ...prev, email: e.target.value }))} />
                                    <p className="text-xs text-fg-faint mt-1">Khách hàng sẽ đăng nhập bằng Google với email này</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Họ tên</label>
                                        <input type="text" placeholder="Nguyễn Văn A" className="w-full px-3 py-2 bg-card border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" value={createModal.full_name} onChange={e => setCreateModal(prev => ({ ...prev, full_name: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">SĐT</label>
                                        <input type="text" placeholder="0912 345 678" className="w-full px-3 py-2 bg-card border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" value={createModal.phone} onChange={e => setCreateModal(prev => ({ ...prev, phone: e.target.value }))} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Vai trò</label>
                                    <select className="w-full px-3 py-2 bg-card border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" value={createModal.role} onChange={e => setCreateModal(prev => ({ ...prev, role: e.target.value }))}>
                                        <option value="reader">Reader</option>
                                        <option value="editor">Editor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="pt-2 flex justify-end gap-2">
                                    <button type="button" onClick={() => setCreateModal(prev => ({ ...prev, isOpen: false }))} className="px-4 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl text-sm font-medium">Huỷ</button>
                                    <button type="submit" disabled={createModal.submitting} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium flex items-center gap-2 rounded-xl shadow-lg shadow-brand-600/25 disabled:opacity-50 text-sm">
                                        {createModal.submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Tạo tài khoản
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Add Subscription Modal */}
            {subModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-line">
                            <h3 className="text-lg font-bold text-fg">Thêm khoá học</h3>
                            <button onClick={() => setSubModal(prev => ({ ...prev, isOpen: false }))} className="text-fg-faint hover:text-surface-600"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleAddSub} className="p-4 space-y-4">
                            <div className="p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
                                <p className="text-sm text-fg-subtle">Cấp khoá học cho:</p>
                                <p className="text-sm font-semibold text-fg">{subModal.user_name} ({subModal.user_email})</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Khoá học *</label>
                                <select required className="w-full px-3 py-2 bg-card border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" value={subModal.product_id} onChange={e => setSubModal(prev => ({ ...prev, product_id: e.target.value }))}>
                                    <option value="">-- Chọn khoá học --</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}{p.duration_days ? ` (${p.duration_days} ngày)` : ''}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Số ngày <span className="text-surface-400 font-normal">(để trống = theo sản phẩm)</span></label>
                                <input type="number" min="0" placeholder="30" className="w-full px-3 py-2 bg-card border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm" value={subModal.duration_days || ''} onChange={e => setSubModal(prev => ({ ...prev, duration_days: Number(e.target.value) }))} />
                            </div>
                            <div className="pt-2 flex justify-end gap-2">
                                <button type="button" onClick={() => setSubModal(prev => ({ ...prev, isOpen: false }))} className="px-4 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl text-sm font-medium">Huỷ</button>
                                <button type="submit" disabled={subModal.submitting} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium flex items-center gap-2 rounded-xl shadow-md shadow-amber-500/20 disabled:opacity-50 text-sm">
                                    {subModal.submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4" />} Cấp khoá học
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
