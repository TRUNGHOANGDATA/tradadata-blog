import { supabaseAdmin } from '@/lib/supabase/server';

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
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(regex, value);
        html = html.replace(regex, value);
    }

    return { subject, html };
}
