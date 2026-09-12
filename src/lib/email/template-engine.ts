import { supabaseAdmin } from '@/lib/supabase/server';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Biến LUÔN có sẵn trong mọi mẫu email, nơi gọi không phải truyền.
 *
 * Nhờ vậy chèn banner vào mẫu email chỉ là sửa HTML trong trang cài đặt, không
 * phải đụng vào 8 route đang gọi `sendEmail`.
 *
 * Dùng đường dẫn `/api/brand/...` trên domain nhà chứ không phải link Google
 * Drive: link Drive có thể đổi khi xoay vòng quyền, còn địa chỉ này thì cố định
 * và Gmail hiển thị chắc chắn hơn.
 *
 * Nơi gọi vẫn ghi đè được — `variables` trải sau nên thắng.
 */
function bienThuongHieu(): Record<string, string> {
    return {
        banner_url: `${SITE_CONFIG.url}/api/brand/banner`,
        logo_url: `${SITE_CONFIG.url}/api/brand/logo`,
        site_url: SITE_CONFIG.url,
        site_name: SITE_CONFIG.name,
    };
}

export async function getEmailTemplate(templateId: string, variables: Record<string, string>) {
    if (!supabaseAdmin) {
        throw new Error('Supabase admin not configured');
    }

    // Lấy template từ database
    const { data: template, error } = await supabaseAdmin
        .from('email_templates')
        .select('subject, body_html')
        .eq('id', templateId)
        .single();

    if (error || !template) {
        console.error('Lỗi khi lấy email template:', error);
        throw new Error('Email template not found: ' + templateId);
    }

    let subject = template.subject;
    let html = template.body_html;

    // Thay thế các biến {{ten_bien}}
    for (const [key, value] of Object.entries({ ...bienThuongHieu(), ...variables })) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(regex, value);
        html = html.replace(regex, value);
    }

    return { subject, html };
}
