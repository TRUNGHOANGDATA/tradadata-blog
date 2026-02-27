export interface NewPostEmailProps {
    postTitle: string;
    postExcerpt: string;
    postUrl: string;
    coverImage?: string;
    categoryName?: string;
    unsubscribeUrl: string;
}

export function generateNewPostEmailHtml({
    postTitle,
    postExcerpt,
    postUrl,
    coverImage,
    categoryName,
    unsubscribeUrl,
}: NewPostEmailProps): string {
    const defaultImage = `${process.env.NEXT_PUBLIC_APP_URL}/images/default-cover.jpg`; // Fallback image if needed
    const imageToUse = coverImage || defaultImage;

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bài viết mới từ ERX Blog</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            margin-top: 40px;
            margin-bottom: 40px;
        }
        .header {
            background-color: #1a1a1a;
            padding: 24px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
        }
        .header h1 span {
            color: #4ade80; /* ERX Green */
        }
        .content {
            padding: 32px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 24px;
        }
        .post-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 32px;
        }
        .post-image {
            width: 100%;
            height: auto;
            max-height: 300px;
            object-fit: cover;
            display: block;
        }
        .post-content {
            padding: 24px;
        }
        .category-badge {
            display: inline-block;
            background-color: #f3f4f6;
            color: #4b5563;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 12px;
            letter-spacing: 0.5px;
        }
        .post-title {
            font-size: 22px;
            font-weight: 700;
            margin: 0 0 12px 0;
            color: #111827;
        }
        .post-excerpt {
            color: #4b5563;
            margin: 0 0 24px 0;
            font-size: 15px;
        }
        .cta-button {
            display: inline-block;
            background-color: #4f46e5; /* Indigo */
            color: white !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
        }
        .footer {
            background-color: #f9fafb;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 0 0 12px 0;
            font-size: 13px;
            color: #6b7280;
        }
        .unsubscribe {
            color: #9ca3af;
            text-decoration: underline;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1><span>ERX</span> Blog</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <p class="greeting">Chào bạn, ERX Blog vừa có một bài viết mới cực kỳ thú vị chờ bạn khám phá!</p>
            
            <div class="post-card">
                <!-- Cover Image -->
                ${imageToUse ? `<img src="${imageToUse}" alt="${postTitle}" class="post-image" />` : ''}
                
                <div class="post-content">
                    <!-- Category -->
                    ${categoryName ? `<span class="category-badge">${categoryName}</span>` : ''}
                    
                    <!-- Title & Excerpt -->
                    <h2 class="post-title">${postTitle}</h2>
                    <p class="post-excerpt">${postExcerpt}</p>
                    
                    <!-- CTA -->
                    <a href="${postUrl}" class="cta-button">Đọc bài viết ngay →</a>
                </div>
            </div>
            
            <p style="color: #4b5563; font-size: 14px; text-align: center; margin-top: 20px;">
                Cảm ơn bạn đã luôn đồng hành cùng ERX Vietnam!
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>© ${new Date().getFullYear()} ERX Vietnam. All rights reserved.</p>
            <p>Bạn nhận được email này vì đã đăng ký nhận bản tin từ ERX Blog.</p>
            <a href="${unsubscribeUrl}" class="unsubscribe">Hủy đăng ký (Unsubscribe)</a>
        </div>
    </div>
</body>
</html>
  `;
}
