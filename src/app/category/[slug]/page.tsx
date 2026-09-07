import { Metadata } from 'next';
import { getCategoryBySlug, getCategories } from '@/lib/data/categories';
import { SITE_CONFIG } from '@/lib/constants';
import { NoiDungDanhMuc } from './NoiDungDanhMuc';

// KHÔNG nhận `searchParams`: dùng nó là Next ép render động mọi request và dòng
// `revalidate` dưới đây thành vô nghĩa. Phân trang ở `/category/[slug]/trang/[so]`.
export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

// Pre-build all category pages at build time
export async function generateStaticParams() {
    const categories = await getCategories();
    return categories.map((cat: { slug: string }) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        return { title: 'Không tìm thấy danh mục' };
    }

    const title = `${category.name} — Bài viết & hướng dẫn`;
    const description = category.description
        || `Tổng hợp bài viết về ${category.name} tại ${SITE_CONFIG.name}.`;

    return {
        title,
        description,
        alternates: { canonical: `/category/${slug}` },
        openGraph: { title, description, url: `${SITE_CONFIG.url}/category/${slug}` },
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    return <NoiDungDanhMuc slug={slug} trang={1} />;
}
