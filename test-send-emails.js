const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const TEST_EMAIL = 'trunghoang101091@gmail.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tradadata.com';

async function getTemplate(templateId, variables) {
    const { data, error } = await supabase
        .from('email_templates')
        .select('subject, body_html')
        .eq('id', templateId)
        .single();

    if (error || !data) {
        throw new Error(`Template "${templateId}" not found: ${error?.message}`);
    }

    let subject = data.subject;
    let html = data.body_html;

    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(regex, value);
        html = html.replace(regex, value);
    }

    return { subject, html };
}

async function sendTestEmail(templateId, variables, label) {
    try {
        const { subject, html } = await getTemplate(templateId, variables);

        await transporter.sendMail({
            from: `"Trà Đá Data" <${process.env.EMAIL_USER}>`,
            to: TEST_EMAIL,
            subject: `[TEST] ${subject}`,
            html: html,
        });

        console.log(`✅ ${label} — Đã gửi thành công!`);
    } catch (err) {
        console.error(`❌ ${label} — Lỗi:`, err.message);
    }
}

async function main() {
    console.log(`📧 Gửi test emails đến: ${TEST_EMAIL}`);
    console.log(`📧 Gửi từ: ${process.env.EMAIL_USER}`);
    console.log('-------------------------------------------\n');

    // 1. Welcome Email
    await sendTestEmail('welcome', {
        name: 'Trung Hoàng',
        email: TEST_EMAIL,
        url: APP_URL,
        unsubscribe_url: `${APP_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(TEST_EMAIL)}`,
    }, '1/5 — Welcome Mail');

    // 2. Payment Pending
    await sendTestEmail('payment_pending', {
        name: 'Trung Hoàng',
        order_code: 'TDD-20260228-001',
        product_name: 'Khóa Data Analytics Premium',
        amount: '499,000 VNĐ',
        url: APP_URL,
    }, '2/5 — Payment Pending');

    // 3. Payment Success
    await sendTestEmail('payment_success', {
        name: 'Trung Hoàng',
        order_code: 'TDD-20260228-001',
        product_name: 'Khóa Data Analytics Premium',
        amount: '499,000 VNĐ',
        url: APP_URL,
    }, '3/5 — Payment Success');

    // 4. Renewal Reminder
    await sendTestEmail('renewal_reminder', {
        name: 'Trung Hoàng',
        product_name: 'Premium Membership',
        expires_at: '03/03/2026',
        url: APP_URL,
    }, '4/5 — Renewal Reminder');

    // 5. New Post (Newsletter)
    await sendTestEmail('new_post', {
        title: 'Hướng dẫn SQL cho người mới bắt đầu',
        excerpt: 'Bài viết này sẽ giúp bạn nắm vững các câu lệnh SQL cơ bản nhất, từ SELECT, WHERE đến JOIN — tất cả đều có ví dụ thực tế dễ hiểu.',
        post_url: `${APP_URL}/blog/huong-dan-sql`,
        cover_image: '<img src="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=280&fit=crop" alt="SQL Guide" style="width:100%;height:auto;max-height:280px;object-fit:cover;display:block;">',
        category: '<span class="badge">Data Engineering</span>',
        unsubscribe_url: `${APP_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(TEST_EMAIL)}`,
    }, '5/5 — New Post Newsletter');

    console.log('\n-------------------------------------------');
    console.log('🎉 Hoàn tất! Kiểm tra hộp thư đến (và spam) của', TEST_EMAIL);
}

main();
