import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
        }

        const { title, ideas } = await request.json();
        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Auto-build prompt from user's simple input
        const prompt = `Bạn là một blogger chuyên nghiệp, viết bài bằng tiếng Việt.

Hãy viết một bài blog chi tiết với tiêu đề: "${title}"

${ideas ? `Các ý tưởng/nội dung cần bao gồm:\n${ideas}` : ''}

Yêu cầu:
- Viết hoàn toàn bằng **tiếng Việt**, chuyên nghiệp và dễ hiểu
- Sử dụng Markdown formatting: ## cho heading, **bold**, danh sách, code blocks nếu phù hợp
- Bài viết khoảng 800-1500 từ, có cấu trúc rõ ràng
- Bắt đầu bằng phần giới thiệu hấp dẫn
- Kết thúc bằng phần tổng kết/kết luận
- Không thêm tiêu đề H1 (# ) vì đã có sẵn
- Không viết "Bài viết này..." hay mở đầu sáo rỗng

Sau bài viết, hãy thêm 2 phần riêng biệt (mỗi phần trên 1 dòng mới):
EXCERPT: [Viết 1-2 câu mô tả ngắn gọn cho bài viết, tối đa 160 ký tự]
KEYWORDS: [Liệt kê 5-8 từ khóa SEO, phân cách bằng dấu phẩy]`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Parse response - extract content, excerpt, keywords
        let content = text;
        let excerpt = '';
        let keywords = '';

        // Extract EXCERPT
        const excerptMatch = text.match(/EXCERPT:\s*(.+?)(?:\n|$)/i);
        if (excerptMatch) {
            excerpt = excerptMatch[1].trim();
            content = content.replace(/EXCERPT:\s*.+?(?:\n|$)/i, '').trim();
        }

        // Extract KEYWORDS
        const keywordsMatch = text.match(/KEYWORDS:\s*(.+?)(?:\n|$)/i);
        if (keywordsMatch) {
            keywords = keywordsMatch[1].trim();
            content = content.replace(/KEYWORDS:\s*.+?(?:\n|$)/i, '').trim();
        }

        return NextResponse.json({
            content,  // Markdown string
            excerpt,
            keywords,
        });
    } catch (error: any) {
        console.error('AI generate content error:', error);
        if (error?.message?.includes('429')) {
            return NextResponse.json(
                { error: 'API Key đã vượt quá giới hạn (Quota Exceeded) hoặc request quá nhanh. Vui lòng kiểm tra lại Google AI Studio.' },
                { status: 429 }
            );
        }
        return NextResponse.json(
            { error: error.message || 'Failed to generate content' },
            { status: 500 }
        );
    }
}
