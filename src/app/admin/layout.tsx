'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    LayoutDashboard,
    FileText,
    FolderOpen,
    Tags,
    Image,
    FileSpreadsheet,
    Users,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    ShoppingCart,
    Settings as SettingsIcon,
    Box,
    UserCircle,
    DollarSign,
    Ticket,
    Crown,
    BookOpen,
    Menu,
    X,
    Film,
    Inbox,
} from 'lucide-react';

const ADMIN_NAV = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Doanh thu', href: '/admin/revenue', icon: DollarSign },
    { label: 'Bài viết', href: '/admin/posts', icon: FileText },
    { label: 'Chủ đề', href: '/admin/categories', icon: FolderOpen },
    { label: 'Tags', href: '/admin/tags', icon: Tags },
    { label: 'Media', href: '/admin/media', icon: Image },
    { label: 'Files', href: '/admin/files', icon: FileSpreadsheet },
    { label: 'Video', href: '/admin/videos', icon: Film },
    { label: 'Sản phẩm', href: '/admin/products', icon: Box },
    { label: 'Đầu mục khách hàng', href: '/admin/course-sections', icon: BookOpen },
    { label: 'Đơn hàng', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Theo dõi Premium', href: '/admin/subscriptions', icon: Crown },
    { label: 'Mã giảm giá', href: '/admin/coupons', icon: Ticket },
    { label: 'Khách quan tâm PM', href: '/admin/leads', icon: Inbox },
    { label: 'Khách hàng', href: '/admin/customers', icon: UserCircle },
    { label: 'Người dùng', href: '/admin/users', icon: Users },
    { label: 'Cài đặt', href: '/admin/settings', icon: SettingsIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'editor';

    // Close mobile menu on navigation
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    if (!session) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4">
                        Bạn cần đăng nhập
                    </h2>
                    <Link href="/login" className="px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                        Không có quyền truy cập
                    </h2>
                    <p className="text-fg-subtle mb-4">Bạn cần quyền Admin hoặc Editor để truy cập trang này.</p>
                    <Link href="/" className="px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors">
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    // Shared nav content
    const navContent = (mobile = false) => (
        <>
            <nav className={`flex-1 py-4 space-y-1 px-2 ${mobile ? 'overflow-y-auto' : ''}`}>
                {ADMIN_NAV.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                                : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                                } ${!mobile && collapsed ? 'justify-center' : ''}`}
                            title={!mobile && collapsed ? item.label : undefined}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {(mobile || !collapsed) && item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-surface-200 dark:border-surface-800">
                <Link
                    href="/"
                    className={`flex items-center gap-2 text-sm text-fg-subtle hover:text-surface-700 dark:hover:text-surface-300 transition-colors ${!mobile && collapsed ? 'justify-center' : ''
                        }`}
                >
                    <ArrowLeft className="h-4 w-4" />
                    {(mobile || !collapsed) && 'Về trang chủ'}
                </Link>
            </div>
        </>
    );

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Mobile top bar */}
            <div className="fixed top-16 left-0 right-0 z-30 md:hidden bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 px-4 py-2.5 flex items-center gap-3">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                    <Menu className="h-5 w-5 text-surface-600 dark:text-surface-400" />
                </button>
                <span className="font-bold text-sm text-surface-900 dark:text-surface-100">Admin</span>
            </div>

            {/* Mobile overlay drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    {/* Drawer */}
                    <aside className="absolute top-0 left-0 w-72 h-full bg-white dark:bg-surface-900 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800">
                            <span className="font-bold text-surface-900 dark:text-surface-100">Admin</span>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        {navContent(true)}
                    </aside>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside
                className={`${collapsed ? 'w-16' : 'w-60'
                    } bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 transition-all duration-300 shrink-0 hidden md:flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
            >
                <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800">
                    {!collapsed && (
                        <span className="font-bold text-surface-900 dark:text-surface-100">
                            Admin
                        </span>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    >
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </button>
                </div>
                {navContent(false)}
            </aside>

            {/* Main Content — scrolls independently */}
            <div className="flex-1 bg-surface-50 dark:bg-surface-950 overflow-y-auto pt-12 md:pt-0">
                <div className="max-w-6xl mx-auto p-4 md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
