import { Metadata } from 'next';
import { getCategoryBySlug } from '@/lib/data/categories';
import { SITE_CONFIG } from '@/lib/constants';
import { NoiDungDanhMuc } from './NoiDungDanhMuc';

// KHÔNG nhận `searchParams`: dùng nó là Next ép render động mọi request và dòng
// `revalidate` dưới đây thành vô nghĩa. Phân trang ở `/category/[slug]/trang/[so]`.
export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

// Pre-build all category pages at build time
// KHONG prerender luc build — tra [] de moi trang render ON-DEMAND (ISR) o lan
// truy cap dau roi cache theo `revalidate`. Vi sao: build prerender ~869 trang
// param (288 bai x3 truy van + 457 tag) la mot con bao truy van len Supabase
// goi NANO -> DB `statement timeout (57014)` -> build do (do 12/09/2026, hai lan
// lien). ISR giu trang van tinh; chi khac la khach dau tien sau deploy cho render
// mot lan. dynamicParams mac dinh = true nen moi slug van vao duoc.
export async function generateStaticParams() {
    return [];
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
