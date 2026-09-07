import { DanhSachBlog } from './DanhSachBlog';

export const metadata = {
    title: 'Bài viết',
    description: 'Khám phá tất cả các bài viết về Data & AI',
    alternates: { canonical: '/blog' },
};

// KHÔNG nhận `searchParams` ở đây. Dùng nó là Next ép render động mọi request
// và dòng `revalidate` dưới đây thành vô nghĩa — xem chú thích trong DanhSachBlog.tsx.
// Phân trang nằm ở route riêng `/blog/trang/[so]`.
export const revalidate = 3600;

export default function BlogPage() {
    return <DanhSachBlog trang={1} />;
}
