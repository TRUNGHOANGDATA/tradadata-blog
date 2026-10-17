import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { revalidateGameVietHoa } from '@/lib/cache';

/**
 * CRUD tab Game Việt hoá. Admin + editor.
 * Bảng: game_viet_hoa (supabase/manual/game-viet-hoa.sql).
 */

const SLUG_HOP_LE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ThanBai = {
    id?: string;
    slug?: string;
    ten?: string;
    ten_goc?: string | null;
    anh_bia?: string | null;
    nen_tang?: unknown;
    the_loai?: unknown;
    phien_ban_game?: string | null;
    phien_ban_patch?: string | null;
    nhom_dich?: string | null;
    tien_do?: number;
    mo_ta?: string | null;
    link_tai?: unknown;
    link_mua?: string | null;
    post_slug?: string | null;
    is_published?: boolean;
    thu_tu?: number;
    so_tien?: unknown;
};

const chuoi = (v: unknown) => (v == null ? '' : String(v).trim());
const hoacNull = (v: unknown) => chuoi(v) || null;

/** Link hiện ra cho khách bấm ⇒ chỉ nhận http(s). Chặn `javascript:` và các scheme lạ. */
function urlHoacNull(v: unknown, ten: string): string | null {
    const s = chuoi(v);
    if (!s) return null;
    let u: URL;
    try {
        u = new URL(s);
    } catch {
        throw new Error(`${ten} không phải URL hợp lệ.`);
    }
    if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error(`${ten} phải bắt đầu bằng http:// hoặc https://.`);
    return u.toString();
}

function mangChuoi(v: unknown): string[] {
    if (!Array.isArray(v)) return [];
    return [...new Set(v.map(chuoi).filter(Boolean))].slice(0, 20);
}

function chuanHoa(b: ThanBai) {
    const ten = chuoi(b.ten);
    if (!ten) throw new Error('Thiếu tên game.');
    const slug = chuoi(b.slug).toLowerCase();
    if (!SLUG_HOP_LE.test(slug)) throw new Error('Đường dẫn chỉ gồm chữ thường không dấu, số và dấu gạch ngang.');

    const tienDo = Math.round(Number(b.tien_do));
    if (!Number.isFinite(tienDo) || tienDo < 0 || tienDo > 100) throw new Error('Tiến độ phải từ 0 đến 100.');

    // Số tiền ủng hộ (VNĐ) điền sẵn vào QR. Trống = QR không kèm tiền.
    let soTien: number | null = null;
    if (chuoi(b.so_tien)) {
        soTien = Math.round(Number(b.so_tien));
        if (!Number.isFinite(soTien) || soTien < 0 || soTien > 100_000_000) throw new Error('Số tiền ủng hộ phải từ 0 đến 100.000.000đ.');
    }

    const linkTai = (Array.isArray(b.link_tai) ? b.link_tai : [])
        .map((l: { nhan?: unknown; url?: unknown }, i: number) => {
            const url = urlHoacNull(l?.url, `Link tải #${i + 1}`);
            return url ? { nhan: chuoi(l?.nhan) || 'Tải về', url } : null;
        })
        .filter(Boolean);

    return {
        slug,
        ten,
        ten_goc: hoacNull(b.ten_goc),
        anh_bia: urlHoacNull(b.anh_bia, 'Ảnh bìa'),
        nen_tang: mangChuoi(b.nen_tang),
        the_loai: mangChuoi(b.the_loai),
        phien_ban_game: hoacNull(b.phien_ban_game),
        phien_ban_patch: hoacNull(b.phien_ban_patch),
        nhom_dich: hoacNull(b.nhom_dich),
        tien_do: tienDo,
        mo_ta: hoacNull(b.mo_ta),
        link_tai: linkTai,
        link_mua: urlHoacNull(b.link_mua, 'Link mua game'),
        post_slug: hoacNull(b.post_slug),
        is_published: b.is_published === true,
        thu_tu: Number.isFinite(Number(b.thu_tu)) ? Number(b.thu_tu) : 0,
        so_tien: soTien,
        updated_at: new Date().toISOString(),
    };
}

async function kiemQuyen() {
    const session = await auth();
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) return null;
    return session;
}

/** Trùng slug (unique) ⇒ báo lỗi tiếng Việt thay vì mã Postgres. */
function loiGhi(error: { code?: string }) {
    if (error.code === '23505') return new Error('Đường dẫn này đã có game khác dùng.');
    return error;
}

export async function GET() {
    try {
        if (!(await kiemQuyen())) return NextResponse.json({ error: 'Không có quyền' }, { status: 401 });
        if (!supabaseAdmin) return NextResponse.json({ error: 'DB chưa cấu hình' }, { status: 500 });

        // Admin cần cả bản nháp, nên đọc thẳng (không cache).
        const { data, error } = await supabaseAdmin
            .from('game_viet_hoa')
            .select('*')
            .order('thu_tu', { ascending: true })
            .order('created_at', { ascending: false });
        if (error) throw error;
        return NextResponse.json({ items: data ?? [] });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!(await kiemQuyen())) return NextResponse.json({ error: 'Không có quyền' }, { status: 401 });
        if (!supabaseAdmin) return NextResponse.json({ error: 'DB chưa cấu hình' }, { status: 500 });

        const ban = chuanHoa((await request.json()) as ThanBai);
        const { data, error } = await supabaseAdmin.from('game_viet_hoa').insert(ban).select().single();
        if (error) throw loiGhi(error);

        revalidateGameVietHoa();
        return NextResponse.json({ item: data }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 400 });
    }
}

export async function PUT(request: Request) {
    try {
        if (!(await kiemQuyen())) return NextResponse.json({ error: 'Không có quyền' }, { status: 401 });
        if (!supabaseAdmin) return NextResponse.json({ error: 'DB chưa cấu hình' }, { status: 500 });

        const body = (await request.json()) as ThanBai;
        if (!body.id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 });

        const ban = chuanHoa(body);
        const { data, error } = await supabaseAdmin
            .from('game_viet_hoa')
            .update(ban)
            .eq('id', body.id)
            .select()
            .single();
        if (error) throw loiGhi(error);

        revalidateGameVietHoa();
        return NextResponse.json({ item: data });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        if (!(await kiemQuyen())) return NextResponse.json({ error: 'Không có quyền' }, { status: 401 });
        if (!supabaseAdmin) return NextResponse.json({ error: 'DB chưa cấu hình' }, { status: 500 });

        const id = new URL(request.url).searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 });

        const { error } = await supabaseAdmin.from('game_viet_hoa').delete().eq('id', id);
        if (error) throw error;

        revalidateGameVietHoa();
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
