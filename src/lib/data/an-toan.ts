/**
 * Hai quy tắc cho mọi hàm trong `src/lib/data/*` bọc `unstable_cache`:
 *
 * 1. Truy vấn LỖI thì NÉM, không `return []`.
 *    `unstable_cache` cache bất kỳ giá trị nào hàm trả về — kể cả cái `[]` trả
 *    vội khi Supabase nghẹn. Đo 12/09/2026: Supabase (gói NANO) treo ~40 phút,
 *    pod vừa recreate nên cache lạnh, `getCategories` trả `[]` và cache 10 phút,
 *    `getPosts` trả rỗng và cache 2 phút → trang chủ hiện "0 bài viết · 0 chủ đề"
 *    kéo dài cả sau khi DB đã hồi, smoke test của rollout đỏ. Hàm mà ném thì
 *    Next KHÔNG cache, lượt sau DB hồi là có dữ liệu ngay.
 *
 * 2. Trang KHÔNG được sập chỉ vì một danh sách lỗi → bọc `anToan(fn, duPhong)`
 *    ở lớp export. Dự phòng trả ra KHÔNG đi qua cache, nên chỉ sống một lượt.
 *
 * NGOẠI LỆ — đừng bọc `anToan` cho hàm quyết định 404 (`getPostBySlug`,
 * `getCategoryBySlug`, `getAllPublishedSlugs`): trả `null` khi DB lỗi là biến một
 * bài thật thành `notFound()`, và với trang ISR thì cái 404 đó được cache thành
 * HTML tĩnh cả giờ. Để lỗi lan ra: Next giữ nguyên bản cũ đang phục vụ.
 *
 * Lúc `next build`: `anToan` KHÔNG nuốt lỗi. Build mà nuốt là nướng trang trống
 * thành HTML tĩnh rồi báo "thành công" — tệ hơn build đỏ.
 */

type LoiSupabase = { code?: string; message?: string; details?: string } | null | undefined;

/** PostgREST: `.single()` / `.maybeSingle()` không có dòng nào. Đây KHÔNG phải lỗi hệ thống. */
const MA_KHONG_CO_DONG = 'PGRST116';
/** Postgres: bảng chưa tồn tại — môi trường mới chưa chạy SQL tay. */
const MA_KHONG_CO_BANG = '42P01';

export class LoiTruyVan extends Error {
    readonly noi: string;
    readonly ma?: string;
    constructor(noi: string, goc: NonNullable<LoiSupabase>) {
        super(`[${noi}] ${goc.message ?? 'Truy vấn Supabase lỗi'}${goc.code ? ` (${goc.code})` : ''}`);
        this.name = 'LoiTruyVan';
        this.noi = noi;
        this.ma = goc.code;
    }
}

/**
 * Gọi ngay sau mỗi truy vấn. Trả `true` khi lỗi là loại "không có dữ liệu" mà nơi
 * gọi cho phép (để nơi gọi `return null`/`[]`); ném `LoiTruyVan` với mọi lỗi khác;
 * trả `false` khi không lỗi.
 */
export function kiemLoiTruyVan(
    error: LoiSupabase,
    noi: string,
    opts: { boQuaKhongCoDong?: boolean; boQuaKhongCoBang?: boolean } = {}
): boolean {
    if (!error) return false;
    if (opts.boQuaKhongCoDong && error.code === MA_KHONG_CO_DONG) return true;
    if (opts.boQuaKhongCoBang && error.code === MA_KHONG_CO_BANG) return true;
    throw new LoiTruyVan(noi, error);
}

const DANG_BUILD = process.env.NEXT_PHASE === 'phase-production-build';

/**
 * Bọc một hàm data (thường là kết quả của `unstable_cache`): lỗi thì ghi log và
 * trả `duPhong` — giữ trang sống. Giữ nguyên chữ ký hàm gốc.
 */
export function anToan<A extends unknown[], R>(fn: (...args: A) => Promise<R>, duPhong: R): (...args: A) => Promise<R> {
    return async (...args: A): Promise<R> => {
        try {
            return await fn(...args);
        } catch (e) {
            if (DANG_BUILD) throw e;
            console.error('[data] Trả dự phòng (không cache) vì:', e instanceof Error ? e.message : e);
            return duPhong;
        }
    };
}
