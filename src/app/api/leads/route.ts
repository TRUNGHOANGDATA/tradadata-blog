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
            // Mặc định gửi về chính hòm thư đang dùng để gửi mail. Đặt LEAD_NOTIFY_EMAIL
            // nếu muốn nhận ở địa chỉ khác (ngăn cách bằng dấu phẩy nếu nhiều người nhận).
            const to = process.env.LEAD_NOTIFY_EMAIL || process.env.EMAIL_USER;
            if (!to) {
                console.error('[lead] Thieu LEAD_NOTIFY_EMAIL lan EMAIL_USER - bo qua buoc bao mail');
                return;
            }
            const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string));
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.tradadata.com';
            const telHref = phone.replace(/[^0-9+]/g, '');
            const row = (k: string, v: string) =>
                `<tr><td style="padding:8px 0;color:#666;width:110px;vertical-align:top">${k}</td><td style="padding:8px 0">${v}</td></tr>`;

            const result = await sendEmail(
                to,
                `[Khách quan tâm phần mềm] ${full_name} - ${phone}`,
                `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;max-width:560px">
                    <h2 style="margin:0 0 4px">Có khách để lại thông tin</h2>
                    <p style="color:#666;margin:0 0 20px">Gửi từ trang giới thiệu phần mềm bán hàng</p>
                    <table style="border-collapse:collapse;width:100%">
                        ${row('Họ tên', `<b>${esc(full_name)}</b>`)}
                        ${row('Điện thoại', `<a href="tel:${esc(telHref)}" style="font-weight:700">${esc(phone)}</a>`)}
                        ${row('Công ty', esc(company) || '<i style="color:#999">không điền</i>')}
                        ${row('Nhu cầu', esc(note) ? `<span style="white-space:pre-line">${esc(note)}</span>` : '<i style="color:#999">không điền</i>')}
                    </table>
                    <p style="margin-top:24px">
                        <a href="${appUrl}/admin/leads" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:10px 18px;border-radius:10px;font-weight:600">Mở trang quản lý khách quan tâm</a>
                    </p>
                </div>`
            );

            // Ghi ro ket qua de con truy duoc khi khach bao "da gui ma khong thay mail"
            if (result?.success) console.log('[lead] Da bao mail ve', to);
            else console.error('[lead] Gui mail bao that bai:', result?.error);
        };
        notify().catch((e) => console.error('Lỗi gửi mail báo lead:', e));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Lead submit error:', error);
        return NextResponse.json({ error: 'Đã có lỗi xảy ra, bạn thử lại giúp mình.' }, { status: 500 });
    }
}
