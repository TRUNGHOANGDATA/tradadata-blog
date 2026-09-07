import { notFound } from 'next/navigation';
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

    // `/blog/trang/1` da co redirect ve `/blog` trong next.config.ts.
    if (!Number.isInteger(trang) || trang < 2) notFound();

    const tongTrang = await demSoTrang();
    if (trang > tongTrang) notFound();

    return <DanhSachBlog trang={trang} />;
}
