import { notFound } from 'next/navigation';
import { getCategories, getCategoryBySlug } from '@/lib/data/categories';
import { NoiDungDanhMuc, demSoTrangDanhMuc } from '../../NoiDungDanhMuc';

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string; so: string }> };

/**
 * Sinh sẵn mọi trang của mọi danh mục lúc build (trang 2 trở lên — trang 1 là
 * `/category/[slug]`). Danh mục nào chỉ có 1 trang thì không sinh gì.
 */
export async function generateStaticParams() {
    const categories = await getCategories();
    const out: { slug: string; so: string }[] = [];
    for (const cat of categories) {
        const tong = await demSoTrangDanhMuc(cat.id);
        for (let i = 2; i <= tong; i++) out.push({ slug: cat.slug, so: String(i) });
    }
    return out;
}

export async function generateMetadata({ params }: Props) {
    const { slug, so } = await params;
    const cat = await getCategoryBySlug(slug);
    return {
        title: cat ? `${cat.name} — trang ${so}` : `Danh mục — trang ${so}`,
        // Trang 2 trở lên gần trùng trang 1 -> không index, vẫn cho theo link.
        robots: { index: false, follow: true },
        alternates: { canonical: `/category/${slug}/trang/${so}` },
    };
}

export default async function TrangDanhMuc({ params }: Props) {
    const { slug, so } = await params;
    const trang = Number(so);

    // Xem chu thich day du o src/app/blog/trang/[so]/page.tsx: route prerender
    // nen ma tra ve la 200 du body dung la trang 404. Da can nhac
    // `dynamicParams = false` va co y khong dung.
    if (!Number.isInteger(trang) || trang < 2) notFound();

    const cat = await getCategoryBySlug(slug);
    if (!cat) notFound();

    const tong = await demSoTrangDanhMuc(cat.id);
    if (trang > tong) notFound();

    return <NoiDungDanhMuc slug={slug} trang={trang} />;
}
