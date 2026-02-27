import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) throw new Error('Supabase admin not configured');

        const { data, error } = await supabaseAdmin.from('email_templates').select('*');
        if (error) throw error;

        const templates = data?.reduce((acc: any, curr: any) => {
            acc[curr.id] = { subject: curr.subject, html_content: curr.body_html };
            return acc;
        }, {});

        return NextResponse.json({ templates });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) throw new Error('Supabase admin not configured');

        const body = await request.json();
        const { templateId, subject, html_content } = body;

        const { error } = await supabaseAdmin
            .from('email_templates')
            .update({ subject, body_html: html_content, updated_at: new Date().toISOString() })
            .eq('id', templateId);

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Template updated' });
    } catch (error: any) {
        console.error('Error updating email template:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
