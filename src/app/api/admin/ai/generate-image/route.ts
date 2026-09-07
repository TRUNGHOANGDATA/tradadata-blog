import { NextResponse } from 'next/server';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { uploadToGoogleDrive } from '@/lib/storage/google-drive';

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

        const { description } = await request.json();
        if (!description) {
            return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Auto-build a professional prompt from user's simple description
        const prompt = `Create a high-quality, professional illustration for a blog article.

Subject: "${description}"

Requirements:
- Clean, modern, and visually appealing design
- Professional style suitable for a tech/education blog
- Vibrant colors with good contrast
- No text or watermarks in the image
- 16:9 aspect ratio, suitable for web use`;

        // `responseModalities` co that trong API nhung kieu cua @google/generative-ai
        // chua khai. Ep ve dung mot kieu hep thay vi `any` de van con duoc kiem
        // phan con lai cua object.
        // Ep ca request ve dung kieu tham so cua `generateContent` qua `Parameters<>`,
        // nen neu SDK doi chu ky thi cho nay bao loi — khac han `any`, im lang mai mai.
        const yeuCau = {
            contents: [{
                role: 'user',
                parts: [{ text: prompt }],
            }],
            generationConfig: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        } as unknown as Parameters<typeof model.generateContent>[0];
        const result = await model.generateContent(yeuCau);

        const response = result.response;
        const parts = response.candidates?.[0]?.content?.parts || [];

        // Find the image part
        let imageData: string | null = null;
        let mimeType = 'image/png';

        // Phan anh tra ve nam trong `inlineData` — cung la truong SDK chua khai.
        type PhanCoAnh = { inlineData?: { data?: string; mimeType?: string } };
        for (const part of parts as PhanCoAnh[]) {
            if (part.inlineData) {
                imageData = part.inlineData.data ?? null;
                mimeType = part.inlineData.mimeType || 'image/png';
                break;
            }
        }

        if (!imageData) {
            return NextResponse.json(
                { error: 'AI không thể tạo ảnh cho mô tả này. Hãy thử mô tả khác.' },
                { status: 422 }
            );
        }

        // Convert base64 to Buffer and upload to Google Drive
        const buffer = Buffer.from(imageData, 'base64');
        const ext = mimeType.includes('png') ? 'png' : 'jpg';
        const filename = `ai-image-${Date.now()}.${ext}`;

        const url = await uploadToGoogleDrive(buffer, filename, mimeType);

        if (!url) {
            return NextResponse.json(
                { error: 'Không thể upload ảnh lên Google Drive' },
                { status: 500 }
            );
        }

        return NextResponse.json({ url: url.url });
    } catch (error) {
        console.error('AI generate image error:', error);
        if (loiThanhChu(error).includes('429')) {
            return NextResponse.json(
                { error: 'API Key đã vượt quá giới hạn (Quota Exceeded) hoặc request quá nhanh. Vui lòng kiểm tra lại Google AI Studio.' },
                { status: 429 }
            );
        }
        return NextResponse.json(
            { error: loiThanhChu(error) || 'Failed to generate image' },
            { status: 500 }
        );
    }
}
