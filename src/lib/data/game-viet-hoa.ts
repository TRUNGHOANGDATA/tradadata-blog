import { unstable_cache } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/server';
import { anToan, kiemLoiTruyVan } from '@/lib/data/an-toan';

/**
 * Tab "Game Việt hoá" (/game-viet-hoa). Bảng `game_viet_hoa` tạo bằng
 * supabase/manual/game-viet-hoa.sql (chạy tay). Chưa có bảng thì danh sách rỗng,
 * trang vẫn chạy.
 *
 * Client Component chỉ được `import type` từ file này (xem CLAUDE.md).
 */

export interface LinkTai {
    nhan: string;
    url: string;
}

/** Cột cho thẻ danh sách — cố ý KHÔNG có mo_ta/link_tai. */
export interface GameTomTat {
    slug: string;
    ten: string;
    anh_bia: string | null;
    nen_tang: string[];
    the_loai: string[];
    tien_do: number;
    updated_at: string;
}

export interface GameDayDu extends GameTomTat {
    id: string;
    ten_goc: string | null;
    phien_ban_game: string | null;
    phien_ban_patch: string | null;
    nhom_dich: string | null;
    mo_ta: string | null;
    link_tai: LinkTai[];
    link_mua: string | null;
    post_slug: string | null;
    /** VNĐ điền sẵn vào QR ủng hộ; null = QR không kèm số tiền. */
    so_tien: number | null;
    /** Lượt tải thật, tăng ở /api/game-viet-hoa/[slug]/tai. Cache 1 giờ nên hiện trễ. */
    luot_tai: number;
}

const COT_TOM_TAT = 'slug, ten, anh_bia, nen_tang, the_loai, tien_do, updated_at';
const TAG = 'game-viet-hoa';

export const getDanhSachGame = anToan(unstable_cache(
    async (): Promise<GameTomTat[]> => {
        if (!supabaseAdmin) return [];
        const { data, error } = await supabaseAdmin
            .from('game_viet_hoa')
            .select(COT_TOM_TAT)
            .eq('is_published', true)
            .order('thu_tu', { ascending: true })
            .order('created_at', { ascending: false });
        if (kiemLoiTruyVan(error, 'game-viet-hoa.getDanhSachGame', { boQuaKhongCoBang: true })) return [];
        return (data ?? []) as GameTomTat[];
    },
    ['game-viet-hoa-danh-sach-v1'],
    { revalidate: 3600, tags: [TAG] }
), []);

// KHÔNG bọc anToan: hàm này quyết định notFound(), trả null khi DB lỗi là cache
// một cái 404 cho game có thật (xem an-toan.ts).
export const getGameBySlug = unstable_cache(
    async (slug: string): Promise<GameDayDu | null> => {
        if (!supabaseAdmin) return null;
        const { data, error } = await supabaseAdmin
            .from('game_viet_hoa')
            .select(`id, ${COT_TOM_TAT}, ten_goc, phien_ban_game, phien_ban_patch, nhom_dich, mo_ta, link_tai, link_mua, post_slug, so_tien, luot_tai`)
            .eq('slug', slug)
            .eq('is_published', true)
            .maybeSingle();
        if (kiemLoiTruyVan(error, 'game-viet-hoa.getGameBySlug', { boQuaKhongCoDong: true, boQuaKhongCoBang: true })) return null;
        return (data as GameDayDu | null) ?? null;
    },
    ['game-viet-hoa-mot-v3'],
    { revalidate: 3600, tags: [TAG] }
);
