import { unstable_cache } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { IWorkbookData } from '@univerjs/core';

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

export interface ViDuHam {
    id: string;
    ten_ham: string;
    nhom: string;
    mo_ta: string | null;
    cong_thuc_mau: string | null;
    post_slug: string | null;
    ho_tro: boolean;
    thu_tu: number;
    updated_at: string;
}

export interface ViDuHamDayDu extends ViDuHam {
    snapshot: Partial<IWorkbookData> | null;
}

/** Cột danh mục — cố ý KHÔNG có `snapshot`. */
const COT_DANH_MUC = 'id, ten_ham, nhom, mo_ta, cong_thuc_mau, post_slug, ho_tro, thu_tu, updated_at';

const TAG = 'vi-du-ham';

export const getDanhMucHam = unstable_cache(
    async (): Promise<ViDuHam[]> => {
        if (!supabaseAdmin) return [];
        const { data, error } = await supabaseAdmin
            .from('vi_du_ham')
            .select(COT_DANH_MUC)
            .order('nhom', { ascending: true })
            .order('thu_tu', { ascending: true });
        if (error) {
            // Bảng chưa tạo (42P01) là chuyện bình thường ở môi trường mới.
            if (error.code !== '42P01') console.error('[vi-du-ham] Lỗi đọc danh mục:', error.message);
            return [];
        }
        return (data ?? []) as ViDuHam[];
    },
    ['vi-du-ham-danh-muc-v1'],
    { revalidate: 600, tags: [TAG] }
);

export const getViDuHam = unstable_cache(
    async (tenHam: string): Promise<ViDuHamDayDu | null> => {
        if (!supabaseAdmin) return null;
        const { data, error } = await supabaseAdmin
            .from('vi_du_ham')
            .select(`${COT_DANH_MUC}, snapshot`)
            .eq('ten_ham', tenHam.toUpperCase())
            .maybeSingle();
        if (error) {
            if (error.code !== '42P01') console.error(`[vi-du-ham] Lỗi đọc ${tenHam}:`, error.message);
            return null;
        }
        return (data as ViDuHamDayDu | null) ?? null;
    },
    ['vi-du-ham-mot-v1'],
    { revalidate: 600, tags: [TAG] }
);

/** Gom danh mục theo nhóm, giữ đúng thứ tự nhóm xuất hiện. */
export function gomTheoNhom(ds: ViDuHam[]): Array<{ nhom: string; ham: ViDuHam[] }> {
    const ketQua: Array<{ nhom: string; ham: ViDuHam[] }> = [];
    for (const h of ds) {
        const cuoi = ketQua[ketQua.length - 1];
        if (cuoi && cuoi.nhom === h.nhom) cuoi.ham.push(h);
        else ketQua.push({ nhom: h.nhom, ham: [h] });
    }
    return ketQua;
}
