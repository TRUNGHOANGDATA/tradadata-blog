import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/gmail';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

// Nhận thông tin khách quan tâm phần mềm bán hàng (từ /phan-mem-ban-hang).
// Endpoint công khai — không có auth, nên phải chặn spam và không tin dữ liệu gửi lên.

const MAX_LEN = { full_name: 100, phone: 30, company: 200, note: 2000 };

function clean(v: unknown, max: number): string {
    return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
    try {
        // 5 lượt/phút mỗi IP — form này người thật chỉ gửi một lần
        const ip = getClientIp(request);
        const limiter = await rateLimit(`lead:${ip}`, { maxRequests: 5, windowSizeSeconds: 60 });
        if (!limiter.success) {
            return NextResponse.json(
                { error: 'Bạn gửi hơi nhanh, vui lòng thử lại sau ít phút.' },
                { status: 429, headers: { 'Retry-After': String(limiter.resetIn) } }
            );
        }

        const body = await request.json().catch(() => ({}));
        const full_name = clean(body.full_name, MAX_LEN.full_name);
        const phone = clean(body.phone, MAX_LEN.phone);
        const company = clean(body.company, MAX_LEN.company);
        const note = clean(body.note, MAX_LEN.note);

        if (!full_name || !phone) {
            return NextResponse.json({ error: 'Vui lòng điền họ tên và số điện thoại.' }, { status: 400 });
        }

        // Chỉ cần đủ chữ số để gọi được; không ép định dạng cứng vì khách hay gõ
        // kèm dấu chấm, dấu cách, hoặc +84.
        if ((phone.match(/\d/g) || []).length < 9) {
            return NextResponse.json({ error: 'Số điện thoại chưa đúng, bạn kiểm tra lại giúp mình.' }, { status: 400 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Hệ thống chưa sẵn sàng, bạn nhắn Zalo giúp mình.' }, { status: 500 });
        }

        const { error: insertError } = await supabaseAdmin.from('software_leads').insert({
            full_name,
            phone,
            company: company || null,
            note: note || null,
            source: 'phan-mem-ban-hang',
            status: 'new',
        });

        if (insertError) {
            console.error('Lỗi lưu lead:', insertError);
            return NextResponse.json({ error: 'Không lưu được thông tin, bạn nhắn Zalo giúp mình.' }, { status: 500 });
        }

        // Báo admin — chạy ngầm, lỗi gửi mail KHÔNG được làm hỏng phản hồi cho khách
        // vì thông tin đã lưu vào DB an toàn rồi.
        const notify = async () => {
            const to = process.env.EMAIL_USER;
            if (!to) return;
            const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string));
            await sendEmail(
                to,
                `[Lead] ${full_name} quan tâm phần mềm bán hàng`,
                `<h2>Có khách để lại thông tin</h2>
                 <p><b>Họ tên:</b> ${esc(full_name)}</p>
                 <p><b>Điện thoại:</b> ${esc(phone)}</p>
                 <p><b>Công ty:</b> ${esc(company) || '(không điền)'}</p>
                 <p><b>Nhu cầu:</b><br>${esc(note).replace(/\n/g, '<br>') || '(không điền)'}</p>
                 <hr><p style="color:#666">Gửi từ trang /phan-mem-ban-hang</p>`
            );
        };
        notify().catch((e) => console.error('Lỗi gửi mail báo lead:', e));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Lead submit error:', error);
        return NextResponse.json({ error: 'Đã có lỗi xảy ra, bạn thử lại giúp mình.' }, { status: 500 });
    }
}
