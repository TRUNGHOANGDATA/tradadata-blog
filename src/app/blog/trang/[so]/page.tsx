import { notFound } from 'next/navigation';
import { DanhSachBlog, demSoTrang } from '../../DanhSachBlog';

export const revalidate = 3600;

type Props = { params: Promise<{ so: string }> };

/**
 * Sinh sẵn mọi trang danh sách lúc build (trang 2 trở lên — trang 1 là `/blog`).
 * Nhờ vậy cả dãy đều tĩnh và đọc từ cache thay vì render lại mỗi request.
 */
// KHONG prerender luc build — tra [] de moi trang render ON-DEMAND (ISR) o lan
// truy cap dau roi cache theo `revalidate`. Vi sao: build prerender ~869 trang
// param (288 bai x3 truy van + 457 tag) la mot con bao truy van len Supabase
// goi NANO -> DB `statement timeout (57014)` -> build do (do 12/09/2026, hai lan
// lien). ISR giu trang van tinh; chi khac la khach dau tien sau deploy cho render
// mot lan. dynamicParams mac dinh = true nen moi slug van vao duoc.
export async function generateStaticParams() {
    return [];
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

    // ĐÃ THỬ HAI CÁCH, cả hai đều KHÔNG trả được mã 404 thật:
    //
    //   notFound()  -> body dung la trang 404, nhung ma tra ve 200
    //   redirect()  -> cung 200, kem body la trang chuyen huong phia client
    //
    // Ly do: route nay co `generateStaticParams` + `revalidate`, nen Next PRERENDER
    // ket qua roi cache lai (do duoc tren production: `x-nextjs-prerender: 1`,
    // `x-nextjs-cache: HIT`). Da prerender thi khong con request nao de gan ma
    // trang thai hay header Location vao.
    //
    // Cach DUY NHAT tra 404 that la `export const dynamicParams = false` — router
    // tu 404 cho moi tham so khong nam trong generateStaticParams, khong render gi.
    // CO Y KHONG dung, vi khi so bai tang du 15 trang thi /blog/trang/15 se 404
    // cho toi lan deploy sau — ma do la link CO THAT trong bo phan trang. Doi mot
    // link that bi hong de sua ma trang thai cua mot URL khong ai tro tao la lo.
    //
    // Giu `notFound()` de nguoi doc thay dung trang 404. Google phan loai truong
    // hop nay la "soft 404" va KHONG index no, nen thiet hai SEO thuc te la ~0.
    if (!Number.isInteger(trang) || trang < 2) notFound();

    const tongTrang = await demSoTrang();
    if (trang > tongTrang) notFound();

    return <DanhSachBlog trang={trang} />;
}
