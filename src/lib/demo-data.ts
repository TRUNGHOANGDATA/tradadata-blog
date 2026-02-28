import type { Post, Category } from '@/types';
import { DEFAULT_CATEGORIES } from './constants';

export const DEMO_CATEGORIES: Category[] = DEFAULT_CATEGORIES.map((cat, i) => ({
    id: `cat-${i}`,
    ...cat,
    description: `Tìm hiểu và thực hành ${cat.name}`,
    created_at: new Date().toISOString(),
}));

export const DEMO_POSTS: Post[] = [
    {
        id: '1', title: 'Hướng dẫn Power Query từ cơ bản đến nâng cao',
        slug: 'huong-dan-power-query-co-ban-den-nang-cao',
        excerpt: 'Tổng hợp kiến thức Power Query giúp bạn xử lý dữ liệu chuyên nghiệp trong Excel và Power BI.',
        content: null,
        cover_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
        author_id: '1', category_id: '1', status: 'published', is_premium: false, reading_time: 15, view_count: 2340,
        published_at: '2025-02-20T00:00:00Z', created_at: '2025-02-20T00:00:00Z', updated_at: '2025-02-20T00:00:00Z',
        author: { id: '1', full_name: 'Trà Đá Data', avatar_url: null, email: '', role: 'admin', created_at: '', updated_at: '' },
        category: { id: '1', name: 'Power Query', slug: 'power-query', icon: '🔄', color: '#F2C811', sort_order: 2, description: null, created_at: '' },
    },
    {
        id: '2', title: 'Python cho Data Analysis: Pandas từ A-Z',
        slug: 'python-pandas-data-analysis',
        excerpt: 'Học Pandas - thư viện phân tích dữ liệu mạnh mẽ nhất trong Python.',
        content: null,
        cover_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop',
        author_id: '1', category_id: '5', status: 'published', is_premium: true, reading_time: 20, view_count: 1560,
        published_at: '2025-02-18T00:00:00Z', created_at: '2025-02-18T00:00:00Z', updated_at: '2025-02-18T00:00:00Z',
        author: { id: '1', full_name: 'Trà Đá Data', avatar_url: null, email: '', role: 'admin', created_at: '', updated_at: '' },
        category: { id: '5', name: 'Python', slug: 'python', icon: '🐍', color: '#3776AB', sort_order: 6, description: null, created_at: '' },
    },
    {
        id: '3', title: 'SQL nâng cao: Window Functions và CTE',
        slug: 'sql-nang-cao-window-functions-cte',
        excerpt: 'Window Functions và Common Table Expressions trong SQL Server.',
        content: null,
        cover_image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop',
        author_id: '1', category_id: '4', status: 'published', is_premium: false, reading_time: 12, view_count: 890,
        published_at: '2025-02-15T00:00:00Z', created_at: '2025-02-15T00:00:00Z', updated_at: '2025-02-15T00:00:00Z',
        author: { id: '1', full_name: 'Trà Đá Data', avatar_url: null, email: '', role: 'admin', created_at: '', updated_at: '' },
        category: { id: '4', name: 'SQL', slug: 'sql', icon: '🗄️', color: '#CC2927', sort_order: 5, description: null, created_at: '' },
    },
    {
        id: '4', title: 'Ứng dụng AI trong Supply Chain Management',
        slug: 'ung-dung-ai-supply-chain',
        excerpt: 'Cách các doanh nghiệp sử dụng trí tuệ nhân tạo để tối ưu hóa chuỗi cung ứng.',
        content: null,
        cover_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop',
        author_id: '1', category_id: '6', status: 'published', is_premium: true, reading_time: 18, view_count: 720,
        published_at: '2025-02-12T00:00:00Z', created_at: '2025-02-12T00:00:00Z', updated_at: '2025-02-12T00:00:00Z',
        author: { id: '1', full_name: 'Trà Đá Data', avatar_url: null, email: '', role: 'admin', created_at: '', updated_at: '' },
        category: { id: '6', name: 'AI', slug: 'ai', icon: '🤖', color: '#8B5CF6', sort_order: 7, description: null, created_at: '' },
    },
    {
        id: '5', title: 'Excel VBA: Tự động hoá báo cáo doanh số',
        slug: 'excel-vba-tu-dong-hoa-bao-cao',
        excerpt: 'Xây dựng macro VBA giúp tạo báo cáo doanh số tự động.',
        content: null,
        cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
        author_id: '1', category_id: '2', status: 'published', is_premium: false, reading_time: 10, view_count: 1820,
        published_at: '2025-02-10T00:00:00Z', created_at: '2025-02-10T00:00:00Z', updated_at: '2025-02-10T00:00:00Z',
        author: { id: '1', full_name: 'Trà Đá Data', avatar_url: null, email: '', role: 'admin', created_at: '', updated_at: '' },
        category: { id: '2', name: 'VBA', slug: 'vba', icon: '⚙️', color: '#8B4513', sort_order: 3, description: null, created_at: '' },
    },
    {
        id: '6', title: 'Power BI Dashboard: Phân tích dữ liệu bán hàng',
        slug: 'power-bi-dashboard-phan-tich',
        excerpt: 'Tạo dashboard trực quan trong Power BI để theo dõi KPIs.',
        content: null,
        cover_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
        author_id: '1', category_id: '3', status: 'published', is_premium: false, reading_time: 14, view_count: 1200,
        published_at: '2025-02-08T00:00:00Z', created_at: '2025-02-08T00:00:00Z', updated_at: '2025-02-08T00:00:00Z',
        author: { id: '1', full_name: 'Trà Đá Data', avatar_url: null, email: '', role: 'admin', created_at: '', updated_at: '' },
        category: { id: '3', name: 'Power BI', slug: 'power-bi', icon: '📈', color: '#F2C811', sort_order: 4, description: null, created_at: '' },
    },
];

export const BLOG_FILTER_CATEGORIES = [
    { name: 'Tất cả', slug: '' },
    ...DEFAULT_CATEGORIES.map(cat => ({
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon
    }))
];
