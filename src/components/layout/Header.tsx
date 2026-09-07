'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Menu, X, LogIn, LogOut, User, LayoutDashboard, ChevronDown, Bookmark, ShoppingCart } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SearchBar } from '@/components/ui/SearchBar';
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/constants';
import { useCart } from '@/lib/cart/CartContext';
import { CartSlideOver } from '@/components/cart/CartSlideOver';

export function Header() {
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { cartCount, setCartOpen } = useCart();

    const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'editor';

    return (
        <>
            <header className="sticky top-0 z-40 w-full">
                <div className="glass border-b border-surface-200/50 dark:border-surface-700/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                                <img src="/LOGO_TRA_DA_DATA.jpg" alt={SITE_CONFIG.name} className="h-14 w-14 object-cover transition-transform group-hover:scale-105 rounded-full shadow-sm" />
                                <span className="hidden sm:block font-bold text-lg text-surface-900 dark:text-white tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                    Trà Đá Data
                                </span>
                            </Link>

                            {/* Desktop Nav - Centered */}
                            <nav className="hidden md:flex items-center justify-center gap-1 flex-1">
                                {NAV_ITEMS.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="px-4 py-2 rounded-xl text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200 text-sm font-medium"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Right Actions */}
                            <div className="flex items-center gap-2">
                                <SearchBar />
                                <ThemeToggle />

                                {/* Cart Toggle */}
                                <button
                                    onClick={() => setCartOpen(true)}
                                    className="relative p-2 text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-all"
                                    aria-label="Giỏ hàng"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-surface-950">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </button>

                                {/* Auth */}
                                {session ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setProfileOpen(!profileOpen)}
                                            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
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
                                                    <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-700">
                                                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                                                            {session.user.name}
                                                        </p>
                                                        <p className="text-xs text-fg-subtle truncate">{session.user.email}</p>
                                                    </div>
                                                    <div className="py-1">
                                                        {isAdmin && (
                                                            <Link
                                                                href="/admin"
                                                                onClick={() => setProfileOpen(false)}
                                                                className="flex items-center gap-2 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                                            >
                                                                <LayoutDashboard className="h-4 w-4" />
                                                                Quản trị
                                                            </Link>
                                                        )}
                                                        <Link
                                                            href="/saved"
                                                            onClick={() => setProfileOpen(false)}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                                        >
                                                            <Bookmark className="h-4 w-4" />
                                                            Bài viết đã lưu
                                                        </Link>
                                                        <Link
                                                            href="/profile"
                                                            onClick={() => setProfileOpen(false)}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
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
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        <span className="hidden sm:inline">Đăng nhập</span>
                                    </button>
                                )}

                                {/* Mobile Menu Toggle */}
                                <button
                                    onClick={() => setMobileOpen(!mobileOpen)}
                                    className="md:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                >
                                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Nav */}
                    {mobileOpen && (
                        <div className="md:hidden border-t border-surface-200 dark:border-surface-700 animate-slide-down">
                            <div className="px-4 py-3 space-y-1">
                                {NAV_ITEMS.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center px-3 py-2.5 rounded-xl text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-sm font-medium"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </header>
            <CartSlideOver />
        </>
    );
}
