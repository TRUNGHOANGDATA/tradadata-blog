const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================
// SHARED STYLES
// ============================================================
const sharedStyles = `
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); margin-top: 40px; margin-bottom: 40px; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; }
    .header-logo { color: #ffffff; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: 0.5px; }
    .header-logo span { color: #4ade80; }
    .header-sub { color: #94a3b8; font-size: 13px; margin: 8px 0 0 0; letter-spacing: 0.3px; }
    .body { padding: 32px 28px; }
    .greeting { font-size: 18px; color: #1e293b; margin: 0 0 20px 0; line-height: 1.6; }
    .greeting strong { color: #4ade80; }
    .text { font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 16px 0; }
    .card { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .card-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px 0; }
    .card-value { font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 12px 0; }
    .card-value.amount { color: #ef4444; font-size: 22px; }
    .btn-wrap { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); color: #0f172a !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; letter-spacing: 0.3px; box-shadow: 0 4px 14px rgba(74,222,128,0.4); }
    .btn-secondary { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff !important; box-shadow: 0 4px 14px rgba(99,102,241,0.4); }
    .divider { height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin: 24px 0; }
    .footer { background-color: #f8fafc; padding: 24px 28px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 0 0 8px 0; font-size: 13px; color: #94a3b8; }
    .footer a { color: #64748b; text-decoration: underline; font-size: 12px; }
    .badge { display: inline-block; background-color: #ecfdf5; color: #059669; padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-warn { background-color: #fef3c7; color: #d97706; }
    .post-img { width: 100%; height: auto; max-height: 280px; object-fit: cover; display: block; border-radius: 0; }
`;

const headerHtml = `
    <div class="header">
        <h1 class="header-logo">Trà Đá <span>Data</span></h1>
    </div>
`;

const footerHtml = (hasUnsubscribe = false) => `
    <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Trà Đá Data. All rights reserved.</p>
        ${hasUnsubscribe ? '<p>Bạn nhận email này vì đã đăng ký nhận bản tin.</p><a href="{{unsubscribe_url}}">Hủy đăng ký (Unsubscribe)</a>' : '<p>Trà Đá Data — Data dễ hiểu cho mọi người.</p>'}
    </div>
`;

// ============================================================
// TEMPLATE 1: WELCOME
// ============================================================
const welcomeTemplate = {
    id: 'welcome',
    name: 'Welcome - Chào mừng Subscriber',
    subject: '🎉 Chào mừng bạn đến với Trà Đá Data!',
    body_html: `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Chào mừng</title><style>${sharedStyles}</style></head><body>
<div class="wrapper">
    ${headerHtml}
    <div class="body">
        <p class="greeting">Xin chào <strong>{{name}}</strong> 👋</p>
        <p class="text">Cảm ơn bạn đã đăng ký nhận bản tin từ <strong>Trà Đá Data</strong>! Từ giờ, bạn sẽ được cập nhật những bài viết mới nhất về Data, AI, và công nghệ — mỗi tuần một lần.</p>

        <div class="card">
            <p class="card-label">Tài khoản đăng ký</p>
            <p class="card-value">{{email}}</p>
            <p class="card-label">Quyền lợi của bạn</p>
            <p class="text" style="margin:0">✅ Nhận bài viết mới sớm nhất<br>✅ Ưu đãi dành riêng cho subscribers<br>✅ Tài nguyên Data miễn phí</p>
        </div>

        <div class="btn-wrap">
            <a href="{{url}}/blog" class="btn">Khám phá bài viết →</a>
        </div>

        <p class="text" style="text-align:center; color:#94a3b8; font-size:13px;">Nếu bạn không đăng ký, vui lòng bỏ qua email này.</p>
    </div>
    ${footerHtml(true)}
</div>
</body></html>`
};

// ============================================================
// TEMPLATE 2: PAYMENT PENDING
// ============================================================
const paymentPendingTemplate = {
    id: 'payment_pending',
    name: 'Payment Pending - Chờ thanh toán',
    subject: '⏳ Trà Đá Data — Hướng dẫn thanh toán đơn hàng {{order_code}}',
    body_html: `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Chờ thanh toán</title><style>${sharedStyles}</style></head><body>
<div class="wrapper">
    ${headerHtml}
    <div class="body">
        <p class="greeting">Xin chào <strong>{{name}}</strong>,</p>
        <p class="text">Cảm ơn bạn đã đăng ký <strong>{{product_name}}</strong> tại Trà Đá Data. Đơn hàng của bạn đã được ghi nhận và đang chờ thanh toán.</p>

        <div class="card">
            <p class="card-label">Mã đơn hàng</p>
            <p class="card-value">{{order_code}}</p>
            <p class="card-label">Sản phẩm</p>
            <p class="card-value">{{product_name}}</p>
            <p class="card-label">Số tiền cần thanh toán</p>
            <p class="card-value amount">{{amount}}</p>
        </div>

        <p class="text">Nhấn vào nút bên dưới để xem hướng dẫn chuyển khoản và mã QR:</p>

        <div class="btn-wrap">
            <a href="{{url}}/checkout/{{order_code}}" class="btn">Thanh Toán Ngay →</a>
        </div>

        <div class="divider"></div>
        <p class="text" style="font-size:13px; color:#94a3b8;">⏰ Đơn hàng sẽ tự động hủy sau 24 giờ nếu chưa thanh toán.<br>Sau khi chuyển khoản, chúng tôi sẽ duyệt và gửi xác nhận trong 2-4h làm việc.</p>
    </div>
    ${footerHtml(false)}
</div>
</body></html>`
};

// ============================================================
// TEMPLATE 3: PAYMENT SUCCESS
// ============================================================
const paymentSuccessTemplate = {
    id: 'payment_success',
    name: 'Payment Success - Thanh toán thành công',
    subject: '✅ Trà Đá Data — Thanh toán thành công đơn {{order_code}}',
    body_html: `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Thanh toán thành công</title><style>${sharedStyles}</style></head><body>
<div class="wrapper">
    ${headerHtml}
    <div class="body">
        <div style="text-align:center; margin-bottom:24px;">
            <div style="display:inline-block; background:linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius:50%; padding:20px; margin-bottom:16px;">
                <span style="font-size:40px;">🎉</span>
            </div>
            <h2 style="color:#059669; font-size:22px; margin:0;">Thanh toán thành công!</h2>
        </div>

        <p class="greeting">Xin chào <strong>{{name}}</strong>,</p>
        <p class="text">Chúng tôi đã xác nhận thanh toán cho đơn hàng của bạn. Cảm ơn bạn đã tin tưởng Trà Đá Data!</p>

        <div class="card">
            <p class="card-label">Mã đơn hàng</p>
            <p class="card-value">{{order_code}}</p>
            <p class="card-label">Sản phẩm</p>
            <p class="card-value">{{product_name}}</p>
            <p class="card-label">Số tiền đã thanh toán</p>
            <p class="card-value" style="color:#059669;">{{amount}}</p>
            <p class="card-label">Trạng thái</p>
            <p style="margin:0;"><span class="badge">✓ Đã thanh toán</span></p>
        </div>

        <p class="text">Bạn có thể truy cập nội dung ngay bây giờ:</p>

        <div class="btn-wrap">
            <a href="{{url}}/courses" class="btn">Truy cập khóa học →</a>
        </div>

        <div class="divider"></div>
        <p class="text" style="font-size:13px; color:#94a3b8;">Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ qua email hoặc fanpage của chúng tôi.</p>
    </div>
    ${footerHtml(false)}
</div>
</body></html>`
};

// ============================================================
// TEMPLATE 4: RENEWAL REMINDER
// ============================================================
const renewalReminderTemplate = {
    id: 'renewal_reminder',
    name: 'Renewal Reminder - Nhắc gia hạn',
    subject: '⚡ Trà Đá Data — Gói {{product_name}} sắp hết hạn!',
    body_html: `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Nhắc gia hạn</title><style>${sharedStyles}</style></head><body>
<div class="wrapper">
    ${headerHtml}
    <div class="body">
        <p class="greeting">Xin chào <strong>{{name}}</strong>,</p>
        <p class="text">Gói <strong>{{product_name}}</strong> của bạn tại Trà Đá Data sẽ hết hạn vào ngày <strong>{{expires_at}}</strong>.</p>

        <div class="card">
            <p class="card-label">Gói đăng ký</p>
            <p class="card-value">{{product_name}}</p>
            <p class="card-label">Ngày hết hạn</p>
            <p class="card-value"><span class="badge badge-warn">⏰ {{expires_at}}</span></p>
        </div>

        <p class="text">Gia hạn ngay để tiếp tục truy cập tất cả nội dung Premium, bao gồm bài viết chuyên sâu, dữ liệu phân tích, và khóa học độc quyền.</p>

        <div class="btn-wrap">
            <a href="{{url}}/courses" class="btn">Gia hạn ngay →</a>
        </div>

        <div class="divider"></div>
        <p class="text" style="font-size:13px; color:#94a3b8;">Nếu bạn không muốn gia hạn, tài khoản sẽ tự động chuyển về Free sau khi hết hạn. Bạn vẫn có thể gia hạn bất cứ lúc nào.</p>
    </div>
    ${footerHtml(false)}
</div>
</body></html>`
};

// ============================================================
// TEMPLATE 5: NEW POST (NEWSLETTER)
// ============================================================
const newPostTemplate = {
    id: 'new_post',
    name: 'New Post - Bài viết mới (Newsletter)',
    subject: '🔥 Bài viết mới: {{title}}',
    body_html: `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Bài viết mới</title><style>${sharedStyles}
    .post-card { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin: 24px 0; }
    .post-body { padding: 24px; }
    .post-title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; line-height: 1.4; }
    .post-excerpt { font-size: 15px; color: #475569; margin: 0 0 20px 0; line-height: 1.7; }
    </style></head><body>
<div class="wrapper">
    ${headerHtml}
    <div class="body">
        <p class="greeting">Chào bạn 👋</p>
        <p class="text">Trà Đá Data vừa có một bài viết mới cực kỳ thú vị — chờ bạn khám phá!</p>

        <div class="post-card">
            {{cover_image}}
            <div class="post-body">
                {{category}}
                <h2 class="post-title">{{title}}</h2>
                <p class="post-excerpt">{{excerpt}}</p>
                <a href="{{post_url}}" class="btn btn-secondary" style="display:inline-block;">Đọc bài viết →</a>
            </div>
        </div>

        <p class="text" style="text-align:center; color:#94a3b8; font-size:14px;">Cảm ơn bạn đã luôn đồng hành cùng Trà Đá Data! 💚</p>
    </div>
    ${footerHtml(true)}
</div>
</body></html>`
};

// ============================================================
// SEED FUNCTION
// ============================================================
async function seedTemplates() {
    const templates = [
        welcomeTemplate,
        paymentPendingTemplate,
        paymentSuccessTemplate,
        renewalReminderTemplate,
        newPostTemplate,
    ];

    console.log('🚀 Bắt đầu seed email templates...\n');

    for (const tpl of templates) {
        // Try delete first, then insert (upsert)
        await supabase.from('email_templates').delete().eq('id', tpl.id);

        const { error } = await supabase
            .from('email_templates')
            .insert(tpl);

        if (error) {
            console.error(`❌ Lỗi khi seed "${tpl.id}":`, error.message);
        } else {
            console.log(`✅ ${tpl.id} — ${tpl.name}`);
        }
    }

    console.log('\n🎉 Hoàn tất! Kiểm tra Admin → Cài đặt → Mẫu Email');
}

seedTemplates();
