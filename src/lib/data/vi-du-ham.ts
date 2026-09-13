import { unstable_cache } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';
import { anToan, kiemLoiTruyVan } from '@/lib/data/an-toan';
import type { IWorkbookData } from '@univerjs/core';
import type { ViDuHam } from '@/lib/excel/ham-365';

/**
 * Danh mục hàm Excel 365 + ví dụ nạp sẵn cho /thuc-hanh.
 *
 * Bảng `vi_du_ham` tạo bằng supabase/manual/vi-du-ham.sql (chạy tay). Chưa có
 * bảng thì mọi hàm ở đây trả rỗng — trang vẫn chạy, chỉ không có danh mục.
 *
 * Tách hai lớp đọc:
 *   - danh mục (không kèm snapshot) — nhẹ, cache, đọc ở server khi render trang
 *   - một ví dụ (kèm snapshot) — đọc khi người dùng bấm, qua /api/vi-du-ham
 * Snapshot có thể vài chục KB mỗi hàm; nhét cả 50 cái vào props của Client
 * Component là gửi cả xuống trình duyệt ngay lúc mở trang.
 */

// Kiểu + hàm thuần nằm ở `@/lib/excel/ham-365` để Client Component dùng được mà
// KHÔNG kéo `supabase/server` vào bundle trình duyệt (xem chú thích ở file đó).
// Xuất lại ở đây để nơi gọi phía server giữ nguyên đường import.
export { gomTheoNhom } from '@/lib/excel/ham-365';
export type { ViDuHam };

export interface ViDuHamDayDu extends ViDuHam {
    snapshot: Partial<IWorkbookData> | null;
}

/** Cột danh mục — cố ý KHÔNG có `snapshot`. */
const COT_DANH_MUC = 'id, ten_ham, nhom, mo_ta, cong_thuc_mau, post_slug, ho_tro, thu_tu, updated_at';

const TAG = 'vi-du-ham';

export const getDanhMucHam = anToan(unstable_cache(
    async (): Promise<ViDuHam[]> => {
        if (!supabaseAdmin) return [];
        const { data, error } = await supabaseAdmin
            .from('vi_du_ham')
            .select(COT_DANH_MUC)
            .order('nhom', { ascending: true })
            .order('thu_tu', { ascending: true });
        // Bảng chưa tạo (42P01) là bình thường ở môi trường mới -> rỗng (và được
        // cache, đúng ý: không có bảng thì không cần hỏi lại DB mỗi lượt).
        // Lỗi khác -> ném để không cache rỗng; anToan bên ngoài trả [] một lượt.
        if (kiemLoiTruyVan(error, 'vi-du-ham.getDanhMucHam', { boQuaKhongCoBang: true })) return [];
        return (data ?? []) as ViDuHam[];
    },
    ['vi-du-ham-danh-muc-v1'],
    { revalidate: 600, tags: [TAG] }
), []);

export const getViDuHam = anToan(unstable_cache(
    async (tenHam: string): Promise<ViDuHamDayDu | null> => {
        if (!supabaseAdmin) return null;
        const { data, error } = await supabaseAdmin
            .from('vi_du_ham')
            .select(`${COT_DANH_MUC}, snapshot`)
            .eq('ten_ham', tenHam.toUpperCase())
            .maybeSingle();
        if (kiemLoiTruyVan(error, 'vi-du-ham.getViDuHam', { boQuaKhongCoDong: true, boQuaKhongCoBang: true })) return null;
        return (data as ViDuHamDayDu | null) ?? null;
    },
    ['vi-du-ham-mot-v1'],
    { revalidate: 600, tags: [TAG] }
), null);
