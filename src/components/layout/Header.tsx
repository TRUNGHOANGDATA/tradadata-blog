'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Menu, X, LogIn, LogOut, User, LayoutDashboard, ChevronDown, Bookmark, ShoppingCart } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LogoThuongHieu } from '@/components/layout/LogoThuongHieu';
import { SearchBar } from '@/components/ui/SearchBar';
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/constants';
import { useCart } from '@/lib/cart/CartContext';
import { CartSlideOver } from '@/components/cart/CartSlideOver';
import type { Category } from '@/types';

/** Slug danh muc mo dropdown "Chu de" tren nav. */
const NAV_CHU_DE = '/categories';

/** Muc nav dang active: khop chinh xac, hoac la tien to cua duong dan hien tai. */
function laActive(pathname: string, href: string): boolean {
    if (href === '/') return pathname === '/';
    // "Chu de" sang khi o trang danh sach hoac trong bat ky danh muc con nao.
    if (href === NAV_CHU_DE) return pathname === NAV_CHU_DE || pathname.startsWith('/category');
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({
    categories = [],
    categoryCounts = {},
    logoUrl,
    logoToiUrl,
}: {
    categories?: Category[];
    categoryCounts?: Record<string, number>;
    logoUrl: string;
    logoToiUrl?: string;
}) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [catOpen, setCatOpen] = useState(false);
    const [mobileCatOpen, setMobileCatOpen] = useState(false);
    const [prodOpen, setProdOpen] = useState(false);
    const [mobileProdOpen, setMobileProdOpen] = useState(false);
    const { cartCount, setCartOpen } = useCart();

    const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'editor';

    return (
        <>
            <header className="sticky top-0 z-40 w-full">
                <div className="glass border-b border-line/70">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 gap-2">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                                {/* Alt mo ta DICH DEN chu khong phai mo ta anh: duoi 1024px
                                    chu "Tra Da Data" bi an, nen logo la thu duy nhat dat ten
                                    cho lien ket nay. */}
                                <LogoThuongHieu
                                    src={logoUrl}
                                    srcToi={logoToiUrl}
                                    canh={44}
                                    alt={`${SITE_CONFIG.name} — trang chủ`}
                                    className="h-11 w-11 transition-transform group-hover:scale-105 shadow-sm ring-1 ring-line"
                                />
                                <span className="hidden xl:block whitespace-nowrap font-bold text-lg text-fg tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                    Trà Đá Data
                                </span>
                            </Link>

                            {/* Desktop Nav */}
                            <nav className="hidden lg:flex min-w-0 items-center justify-center gap-0.5 flex-1">
                                {NAV_ITEMS.map((item) => {
                                    const active = laActive(pathname, item.href);

                                    // "Chu de" mang theo mega-dropdown liet ke danh muc.
                                    if (item.href === NAV_CHU_DE) {
                                        return (
                                            <div
                                                key={item.href}
                                                className="relative"
                                                onMouseEnter={() => setCatOpen(true)}
                                                onMouseLeave={() => setCatOpen(false)}
                                            >
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setCatOpen(false)}
                                                    aria-expanded={catOpen}
                                                    className={`inline-flex items-center gap-1 shrink-0 whitespace-nowrap px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active
                                                        ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30'
                                                        : 'text-fg-muted hover:text-fg hover:bg-sunken'
                                                        }`}
                                                >
                                                    {item.label}
                                                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
                                                </Link>

                                                {catOpen && categories.length > 0 && (
                                                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[36rem] animate-slide-down">
                                                        <div className="rounded-2xl border border-line bg-card shadow-e3 p-3">
                                                            <div className="grid grid-cols-2 gap-1 max-h-[70vh] overflow-y-auto">
                                                                {categories.map((cat) => (
                                                                    <Link
                                                                        key={cat.id}
                                                                        href={`/category/${cat.slug}`}
                                                                        onClick={() => setCatOpen(false)}
                                                                        className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-sunken transition-colors"
                                                                    >
                                                                        <span
                                                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl transition-transform group-hover:scale-110"
                                                                            style={{ backgroundColor: `${cat.color || '#16a34a'}18` }}
                                                                        >
                                                                            {cat.icon}
                                                                        </span>
                                                                        <span className="min-w-0">
                                                                            <span className="block truncate text-sm font-semibold text-fg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                                                                {cat.name}
                                                                            </span>
                                                                            <span className="block text-xs text-fg-subtle">
                                                                                {categoryCounts[cat.id] || 0} bài viết
                                                                            </span>
                                                                        </span>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                            <Link
                                                                href={NAV_CHU_DE}
                                                                onClick={() => setCatOpen(false)}
                                                                className="mt-1 flex items-center justify-center gap-1 rounded-xl border border-line py-2 text-sm font-medium text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
                                                            >
                                                                Xem tất cả chủ đề
                                                                <ChevronDown className="h-4 w-4 -rotate-90" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    // Mục có `children` -> dropdown đơn giản (vd "Sản phẩm và dịch vụ").
                                    if (item.children) {
                                        return (
                                            <div
                                                key={item.href}
                                                className="relative"
                                                onMouseEnter={() => setProdOpen(true)}
                                                onMouseLeave={() => setProdOpen(false)}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => setProdOpen(true)}
                                                    aria-expanded={prodOpen}
                                                    aria-haspopup="menu"
                                                    className={`inline-flex items-center gap-1 shrink-0 whitespace-nowrap px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active
                                                        ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30'
                                                        : 'text-fg-muted hover:text-fg hover:bg-sunken'
                                                        }`}
                                                >
                                                    {item.label}
                                                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${prodOpen ? 'rotate-180' : ''}`} />
                                                </button>

                                                {prodOpen && (
                                                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-56 animate-slide-down">
                                                        <div className="rounded-2xl border border-line bg-card shadow-e3 p-2">
                                                            {item.children.map((c) => (
                                                                <Link
                                                                    key={c.href}
                                                                    href={c.href}
                                                                    onClick={() => setProdOpen(false)}
                                                                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-fg-muted hover:bg-sunken hover:text-fg transition-colors"
                                                                >
                                                                    {c.label}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            aria-current={active ? 'page' : undefined}
                                            className={`shrink-0 whitespace-nowrap px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active
                                                ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30'
                                                : 'text-fg-muted hover:text-fg hover:bg-sunken'
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Right Actions */}
                            {/* `shrink-0`: day la cum thao tac, khong duoc co lai. Thieu
                                no thi flex bop cum nay truoc va chu trong cac nut xuong
                                dong. Phan nhuong cho la `nav` o giua (co `min-w-0`). */}
                            <div className="flex shrink-0 items-center gap-2">
                                <SearchBar />
                                <ThemeToggle />

                                {/* Cart Toggle */}
                                <button
                                    onClick={() => setCartOpen(true)}
                                    className="relative inline-flex items-center justify-center min-h-11 min-w-11 text-fg-muted hover:text-fg hover:bg-sunken rounded-xl transition-all"
                                    aria-label="Giỏ hàng"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-card">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </button>

                                {/* Auth */}
                                {session ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setProfileOpen(!profileOpen)}
                                            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-sunken transition-all"
                                        >
                                            {session.user.image ? (
                                                <img
                                                    src={session.user.image}
                                                    alt={session.user.name || ''}
                                                    className="w-8 h-8 rounded-lg object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                                                    <User className="h-4 w-4 text-brand-600" />
                                                </div>
                                            )}
                                            <ChevronDown className="h-3 w-3 text-fg-faint hidden sm:block" />
                                        </button>

                                        {/* Dropdown */}
                                        {profileOpen && (
                                            <>
                                                <div className="fixed inset-0" onClick={() => setProfileOpen(false)} />
                                                <div className="absolute right-0 top-12 w-56 glass rounded-xl shadow-xl animate-slide-down overflow-hidden">
                                                    <div className="px-4 py-3 border-b border-line">
                                                        <p className="text-sm font-medium text-fg truncate">
                                                            {session.user.name}
                                                        </p>
                                                        <p className="text-xs text-fg-subtle truncate">{session.user.email}</p>
                                                    </div>
                                                    <div className="py-1">
                                                        {isAdmin && (
                                                            <Link
                                                                href="/admin"
                                                                onClick={() => setProfileOpen(false)}
                                                                className="flex items-center gap-2 px-4 py-2 text-sm text-fg-muted hover:bg-sunken transition-colors"
                                                            >
                                                                <LayoutDashboard className="h-4 w-4" />
                                                                Quản trị
                                                            </Link>
                                                        )}
                                                        <Link
                                                            href="/saved"
                                                            onClick={() => setProfileOpen(false)}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm text-fg-muted hover:bg-sunken transition-colors"
                                                        >
                                                            <Bookmark className="h-4 w-4" />
                                                            Bài viết đã lưu
                                                        </Link>
                                                        <Link
                                                            href="/profile"
                                                            onClick={() => setProfileOpen(false)}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm text-fg-muted hover:bg-sunken transition-colors"
                                                        >
                                                            <User className="h-4 w-4" />
                                                            Tài khoản
                                                        </Link>
                                                        <button
                                                            onClick={() => signOut()}
                                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                        >
                                                            <LogOut className="h-4 w-4" />
                                                            Đăng xuất
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => signIn('google')}
                                        aria-label="Đăng nhập"
                                        className="flex shrink-0 items-center justify-center gap-2 min-h-11 px-4 whitespace-nowrap rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40"
                                    >
                                        <LogIn className="h-4 w-4" aria-hidden="true" />
                                        <span className="hidden xl:inline">Đăng nhập</span>
                                    </button>
                                )}

                                {/* Mobile Menu Toggle */}
                                <button
                                    onClick={() => setMobileOpen(!mobileOpen)}
                                    className="lg:hidden inline-flex items-center justify-center min-h-11 min-w-11 rounded-xl hover:bg-sunken transition-colors"
                                    aria-label="Mở menu"
                                >
                                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Nav */}
                    {mobileOpen && (
                        <div className="lg:hidden border-t border-line animate-slide-down max-h-[calc(100vh-4rem)] overflow-y-auto">
                            <div className="px-4 py-3 space-y-1">
                                {NAV_ITEMS.map((item) => {
                                    const active = laActive(pathname, item.href);

                                    if (item.href === NAV_CHU_DE) {
                                        return (
                                            <div key={item.href}>
                                                <button
                                                    onClick={() => setMobileCatOpen((v) => !v)}
                                                    aria-expanded={mobileCatOpen}
                                                    className={`flex items-center justify-between w-full min-h-11 px-3 rounded-xl text-sm font-medium transition-colors ${active
                                                        ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30'
                                                        : 'text-fg-muted hover:bg-sunken'
                                                        }`}
                                                >
                                                    {item.label}
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${mobileCatOpen ? 'rotate-180' : ''}`} />
                                                </button>

                                                {mobileCatOpen && categories.length > 0 && (
                                                    <div className="mt-1 mb-1 ml-3 pl-3 border-l border-line grid grid-cols-1 gap-0.5">
                                                        {categories.map((cat) => (
                                                            <Link
                                                                key={cat.id}
                                                                href={`/category/${cat.slug}`}
                                                                onClick={() => setMobileOpen(false)}
                                                                className="flex items-center gap-2.5 min-h-11 px-2.5 rounded-lg text-sm text-fg-muted hover:bg-sunken hover:text-fg transition-colors"
                                                            >
                                                                <span
                                                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-base"
                                                                    style={{ backgroundColor: `${cat.color || '#16a34a'}18` }}
                                                                >
                                                                    {cat.icon}
                                                                </span>
                                                                <span className="flex-1 truncate">{cat.name}</span>
                                                                <span className="text-xs text-fg-faint">{categoryCounts[cat.id] || 0}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    if (item.children) {
                                        return (
                                            <div key={item.href}>
                                                <button
                                                    onClick={() => setMobileProdOpen((v) => !v)}
                                                    aria-expanded={mobileProdOpen}
                                                    className={`flex items-center justify-between w-full min-h-11 px-3 rounded-xl text-sm font-medium transition-colors ${active
                                                        ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30'
                                                        : 'text-fg-muted hover:bg-sunken'
                                                        }`}
                                                >
                                                    {item.label}
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${mobileProdOpen ? 'rotate-180' : ''}`} />
                                                </button>

                                                {mobileProdOpen && (
                                                    <div className="mt-1 mb-1 ml-3 pl-3 border-l border-line grid grid-cols-1 gap-0.5">
                                                        {item.children.map((c) => (
                                                            <Link
                                                                key={c.href}
                                                                href={c.href}
                                                                onClick={() => setMobileOpen(false)}
                                                                className="flex items-center min-h-11 px-2.5 rounded-lg text-sm text-fg-muted hover:bg-sunken hover:text-fg transition-colors"
                                                            >
                                                                {c.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            aria-current={active ? 'page' : undefined}
                                            className={`flex items-center min-h-11 px-3 rounded-xl text-sm font-medium transition-colors ${active
                                                ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30'
                                                : 'text-fg-muted hover:bg-sunken'
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </header>
            <CartSlideOver />
        </>
    );
}
