/**
 * Kiểu dữ liệu + hàm THUẦN của danh mục hàm Excel 365.
 *
 * Vì sao tách khỏi `src/lib/data/vi-du-ham.ts`: file đó `import { supabaseAdmin }
 * from '@/lib/supabase/server'`, mà `supabase/server.ts` gọi `createClient()`
 * NGAY LÚC NẠP MODULE. Client Component nào import một GIÁ TRỊ từ đó (không phải
 * `import type`) là kéo nguyên chuỗi ấy vào bundle trình duyệt, nơi
 * `SUPABASE_SERVICE_ROLE_KEY` không tồn tại (không có tiền tố `NEXT_PUBLIC_`)
 * ⇒ supabase-js ném `supabaseKey is required` ngay khi chunk được nạp.
 *
 * Đúng lỗi này đã làm /thuc-hanh hiện trang 500 với MỌI người đã đăng nhập kể từ
 * #49: `BangTinh.tsx` import `gomTheoNhom`. Người chưa đăng nhập không thấy gì
 * bất thường vì cổng đăng nhập không nạp chunk của Univer.
 *
 * ⇒ Mọi thứ Client Component cần phải nằm ở ĐÂY. `vi-du-ham.ts` xuất lại để nơi
 * gọi phía server không phải đổi đường import.
 * Rào chặn lâu dài: `supabase/server.ts` đã có `import 'server-only'` nên lần sau
 * lỡ tay là BUILD ĐỎ, không phải trắng trang trên production.
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

/**
 * Gom danh mục theo nhóm, GIỮ NGUYÊN thứ tự truy vấn trả về (đã sắp theo
 * `nhom, thu_tu`) — không sắp lại, không dùng Map, để nhóm hiện đúng thứ tự admin đặt.
 */
export function gomTheoNhom(ds: ViDuHam[]): Array<{ nhom: string; ham: ViDuHam[] }> {
    const ketQua: Array<{ nhom: string; ham: ViDuHam[] }> = [];
    for (const h of ds) {
        const cuoi = ketQua[ketQua.length - 1];
        if (cuoi && cuoi.nhom === h.nhom) cuoi.ham.push(h);
        else ketQua.push({ nhom: h.nhom, ham: [h] });
    }
    return ketQua;
}
