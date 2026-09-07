import { redirect } from 'next/navigation';
import { DanhSachBlog, demSoTrang } from '../../DanhSachBlog';

export const revalidate = 3600;

type Props = { params: Promise<{ so: string }> };

/**
 * Sinh sẵn mọi trang danh sách lúc build (trang 2 trở lên — trang 1 là `/blog`).
 * Nhờ vậy cả dãy đều tĩnh và đọc từ cache thay vì render lại mỗi request.
 */
export async function generateStaticParams() {
    const tongTrang = await demSoTrang();
    return Array.from({ length: Math.max(0, tongTrang - 1) }, (_, i) => ({ so: String(i + 2) }));
}

export async function generateMetadata({ params }: Props) {
    const { so } = await params;
    return {
        title: `Bài viết — trang ${so}`,
        description: 'Khám phá tất cả các bài viết về Data & AI',
        // Trang 2 trở lên là nội dung gần trùng trang 1 -> không cho index,
        // nhưng vẫn cho theo link để crawler đi tới từng bài.
        robots: { index: false, follow: true },
        alternates: { canonical: `/blog/trang/${so}` },
    };
}

export default async function TrangBlog({ params }: Props) {
    const { so } = await params;
    const trang = Number(so);

    // Tham so vo nghia hoac vuot so trang -> CHUYEN HUONG ve /blog, khong dung
    // `notFound()`.
    //
    // Vi sao: route nay co `generateStaticParams` + `revalidate`, nen Next cache
    // luon ket qua not-found va phuc vu nhu trang tinh — do duoc tren production:
    // /blog/trang/abc tra dung noi dung trang 404 nhung ma trang thai la 200.
    // Mot trang 404 tra 200 la "soft 404": Google coi la trang that va index no.
    //
    // Cach khac la `export const dynamicParams = false` de router tu 404, nhung
    // the thi khi so bai tang len du 15 trang, /blog/trang/15 se 404 cho tro
    // toi lan build sau — te hon, vi do la link co that trong bo phan trang.
    if (!Number.isInteger(trang) || trang < 2) redirect('/blog');

    const tongTrang = await demSoTrang();
    if (trang > tongTrang) redirect('/blog');

    return <DanhSachBlog trang={trang} />;
}
