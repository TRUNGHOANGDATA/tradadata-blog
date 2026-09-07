import { notFound, redirect } from 'next/navigation';
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

    // So trang vo nghia / vuot pham vi -> chuyen huong ve trang 1 cua danh muc,
    // KHONG dung notFound(). Xem chu thich day du o blog/trang/[so]/page.tsx:
    // route co generateStaticParams + revalidate nen Next cache ket qua not-found
    // va tra ma 200 -> soft 404, Google coi la trang that.
    if (!Number.isInteger(trang) || trang < 2) redirect(`/category/${slug}`);

    // Danh muc khong ton tai thi 404 THAT SU — day khong phai loi so trang.
    const cat = await getCategoryBySlug(slug);
    if (!cat) notFound();

    const tong = await demSoTrangDanhMuc(cat.id);
    if (trang > tong) redirect(`/category/${slug}`);

    return <NoiDungDanhMuc slug={slug} trang={trang} />;
}
