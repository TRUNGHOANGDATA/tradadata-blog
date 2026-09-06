// ============================================
// Site Configuration
// ============================================

export const SITE_CONFIG = {
    name: 'Trà Đá Data',
    description: 'Chia sẻ kiến thức về Data, AI & Supply Chain',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://www.tradadata.com',
    ogImage: '/images/og-default.png',
    author: 'Trà Đá Data',
};

// ============================================
// Navigation
// ============================================

export const NAV_ITEMS = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Bài viết', href: '/blog' },
    { label: 'Chủ đề', href: '/categories' },
    { label: 'Khóa học', href: '/courses' },
    { label: 'Phần mềm bán hàng', href: '/phan-mem-ban-hang' },
    { label: 'Giới thiệu', href: '/about' },
];

// ============================================
// Default Categories (will be seeded to DB)
// ============================================

export const DEFAULT_CATEGORIES = [
    { name: 'Excel', slug: 'excel', icon: '📊', color: '#217346', sort_order: 1 },
    { name: 'Power Query', slug: 'power-query', icon: '🔄', color: '#F2C811', sort_order: 2 },
    { name: 'VBA', slug: 'vba', icon: '⚙️', color: '#8B4513', sort_order: 3 },
    { name: 'Power BI', slug: 'power-bi', icon: '📈', color: '#F2C811', sort_order: 4 },
    { name: 'SQL', slug: 'sql', icon: '🗄️', color: '#CC2927', sort_order: 5 },
    { name: 'Python', slug: 'python', icon: '🐍', color: '#3776AB', sort_order: 6 },
    { name: 'AI', slug: 'ai', icon: '🤖', color: '#8B5CF6', sort_order: 7 },
    { name: 'Supply Chain', slug: 'supply-chain', icon: '🚛', color: '#059669', sort_order: 8 },
];

// ============================================
// Pagination
// ============================================

export const POSTS_PER_PAGE = 12;
