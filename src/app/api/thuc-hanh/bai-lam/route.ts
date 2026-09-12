import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { loiThanhChu } from '@/lib/errors';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * Bài đang làm của người đăng nhập ở /thuc-hanh — thay cho sessionStorage.
 *
 *   GET /api/thuc-hanh/bai-lam?ten_ham=XLOOKUP   -> snapshot đã lưu (404 nếu chưa có)
 *   PUT /api/thuc-hanh/bai-lam { ten_ham, snapshot } -> upsert
 *
 * Bắt đăng nhập: `profile_id` lấy từ token, KHÔNG nhận từ body — ai cũng chỉ
 * đọc/ghi được bài của chính mình. KHÔNG cache: dữ liệu theo người dùng.
 * Bảng: bai_lam_excel (supabase/manual/vi-du-ham.sql).
 */

/** Snapshot Univer của một bảng luyện tập hiếm khi quá vài chục KB; chặn ở đây
 *  để một tab lỗi không nhồi cả MB vào Postgres NANO. */
const KICH_THUOC_TOI_DA = 400 * 1024;
const TEN_HAM_HOP_LE = /^[A-Z][A-Z0-9._]{0,30}$|^_tu_do$/;

async function layProfileId(): Promise<string | null> {
    const session = await auth();
    const id = session?.user?.profileId;
    return typeof id === 'string' && id ? id : null;
}

export async function GET(request: Request) {
    try {
        const profileId = await layProfileId();
        if (!profileId) return NextResponse.json({ error: 'Cần đăng nhập' }, { status: 401 });
        if (!supabaseAdmin) return NextResponse.json({ error: 'DB chưa cấu hình' }, { status: 500 });

        const tenHam = (new URL(request.url).searchParams.get('ten_ham') || '_tu_do').toUpperCase().replace('_TU_DO', '_tu_do');
        if (!TEN_HAM_HOP_LE.test(tenHam)) return NextResponse.json({ error: 'Tên hàm không hợp lệ' }, { status: 400 });

        const { data, error } = await supabaseAdmin
            .from('bai_lam_excel')
            .select('snapshot, updated_at')
            .eq('profile_id', profileId)
            .eq('ten_ham', tenHam)
            .maybeSingle();
        if (error) throw error;
        if (!data) return NextResponse.json({ error: 'Chưa có bài' }, { status: 404 });

        return NextResponse.json({ snapshot: data.snapshot, updated_at: data.updated_at }, {
            headers: { 'Cache-Control': 'private, no-store' },
        });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const profileId = await layProfileId();
        if (!profileId) return NextResponse.json({ error: 'Cần đăng nhập' }, { status: 401 });
        if (!supabaseAdmin) return NextResponse.json({ error: 'DB chưa cấu hình' }, { status: 500 });

        const than = await request.text();
        if (than.length > KICH_THUOC_TOI_DA) {
            return NextResponse.json({ error: 'Bài quá lớn để lưu online — hãy Tải về máy.' }, { status: 413 });
        }
        const body = JSON.parse(than) as { ten_ham?: string; snapshot?: unknown };
        const tenHam = (body.ten_ham || '_tu_do').toString();
        if (!TEN_HAM_HOP_LE.test(tenHam)) return NextResponse.json({ error: 'Tên hàm không hợp lệ' }, { status: 400 });
        if (!body.snapshot || typeof body.snapshot !== 'object') {
            return NextResponse.json({ error: 'Thiếu snapshot' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('bai_lam_excel')
            .upsert(
                { profile_id: profileId, ten_ham: tenHam, snapshot: body.snapshot, updated_at: new Date().toISOString() },
                { onConflict: 'profile_id,ten_ham' }
            );
        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
