import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { revalidateViDuHam } from '@/lib/cache';

/**
 * CRUD danh mục hàm + ví dụ cho /thuc-hanh. Admin only.
 * Bảng: vi_du_ham (supabase/manual/vi-du-ham.sql).
 */

const TEN_HAM_HOP_LE = /^[A-Z][A-Z0-9._]{0,30}$/;

type ThanBai = {
    id?: string;
    ten_ham?: string;
    nhom?: string;
    mo_ta?: string | null;
    cong_thuc_mau?: string | null;
    post_slug?: string | null;
    ho_tro?: boolean;
    thu_tu?: number;
    snapshot?: unknown;
};

function chuanHoa(b: ThanBai) {
    const ten_ham = String(b.ten_ham ?? '').trim().toUpperCase();
    if (!TEN_HAM_HOP_LE.test(ten_ham)) {
        throw new Error('Tên hàm chỉ gồm chữ in hoa, số, dấu chấm — ví dụ XLOOKUP, TEXT.AFTER.');
    }
    const nhom = String(b.nhom ?? '').trim();
    if (!nhom) throw new Error('Thiếu nhóm hàm.');

    let snapshot: unknown = null;
    if (b.snapshot !== undefined && b.snapshot !== null && b.snapshot !== '') {
        snapshot = typeof b.snapshot === 'string' ? JSON.parse(b.snapshot) : b.snapshot;
        if (typeof snapshot !== 'object' || Array.isArray(snapshot)) {
            throw new Error('Snapshot phải là một object JSON (IWorkbookData của Univer).');
        }
    }

    return {
        ten_ham,
        nhom,
        mo_ta: b.mo_ta?.toString().trim() || null,
        cong_thuc_mau: b.cong_thuc_mau?.toString().trim() || null,
        post_slug: b.post_slug?.toString().trim() || null,
        ho_tro: b.ho_tro !== false,
        thu_tu: Number.isFinite(Number(b.thu_tu)) ? Number(b.thu_tu) : 0,
        snapshot,
        updated_at: new Date().toISOString(),
    };
}

async function kiemAdmin() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') return null;
    return session;
}

export async function GET() {
    try {
        if (!(await kiemAdmin())) return NextResponse.json({ error: 'Không có quyền' }, { status: 401 });
        if (!supabaseAdmin) return NextResponse.json({ error: 'DB chưa cấu hình' }, { status: 500 });

        // Admin cần cả snapshot để sửa, nên đọc thẳng (không cache).
        const { data, error } = await supabaseAdmin
            .from('vi_du_ham')
            .select('*')
            .order('nhom', { ascending: true })
            .order('thu_tu', { ascending: true });
        if (error) throw error;
        return NextResponse.json({ items: data ?? [] });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!(await kiemAdmin())) return NextResponse.json({ error: 'Không có quyền' }, { status: 401 });
        if (!supabaseAdmin) return NextResponse.json({ error: 'DB chưa cấu hình' }, { status: 500 });

        const ban = chuanHoa((await request.json()) as ThanBai);
        const { data, error } = await supabaseAdmin.from('vi_du_ham').insert(ban).select().single();
        if (error) throw error;

        revalidateViDuHam();
        return NextResponse.json({ item: data }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 400 });
    }
}

export async function PUT(request: Request) {
    try {
        if (!(await kiemAdmin())) return NextResponse.json({ error: 'Không có quyền' }, { status: 401 });
        if (!supabaseAdmin) return NextResponse.json({ error: 'DB chưa cấu hình' }, { status: 500 });

        const body = (await request.json()) as ThanBai;
        if (!body.id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 });

        const ban = chuanHoa(body);
        const { data, error } = await supabaseAdmin
            .from('vi_du_ham')
            .update(ban)
            .eq('id', body.id)
            .select()
            .single();
        if (error) throw error;

        revalidateViDuHam();
        return NextResponse.json({ item: data });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        if (!(await kiemAdmin())) return NextResponse.json({ error: 'Không có quyền' }, { status: 401 });
        if (!supabaseAdmin) return NextResponse.json({ error: 'DB chưa cấu hình' }, { status: 500 });

        const id = new URL(request.url).searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 });

        const { error } = await supabaseAdmin.from('vi_du_ham').delete().eq('id', id);
        if (error) throw error;

        revalidateViDuHam();
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
