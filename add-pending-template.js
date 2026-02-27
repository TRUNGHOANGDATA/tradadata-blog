const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addPaymentPendingTemplate() {
    const { data, error } = await supabase
        .from('email_templates')
        .insert([
            {
                id: 'payment_pending',
                name: 'Pending Payment Notification',
                subject: 'ERX.VN - Hướng dẫn thanh toán đơn hàng {{order_code}}',
                body_html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #0f172a; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .highlight { font-weight: bold; color: #0f172a; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Xin chào <span class="highlight">{{name}}</span>,</h2>
        <p>Cảm ơn bạn đã đăng ký <strong>{{product_name}}</strong> tại ERX.VN.</p>
        
        <p>Đơn hàng của bạn đã được ghi nhận. Hệ thống đang chờ được xác nhận thanh toán.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Chi tiết đơn hàng:</h3>
            <p><strong>Mã đơn hàng:</strong> {{order_code}}</p>
            <p><strong>Số tiền cần thanh toán:</strong> <span style="color: #e11d48; font-weight: bold;">{{amount}}</span></p>
        </div>
        
        <p>Nếu bạn chưa thanh toán, vui lòng nhấn vào nút bên dưới để xem hướng dẫn chuyển khoản và mã QR:</p>
        
        <p style="text-align: center; margin: 30px 0;">
            <a href="{{url}}/checkout/{{order_code}}" class="btn">Thanh Toán Ngay</a>
        </p>
        
        <p>Sau khi thanh toán thành công, vui lòng giữ lại biên lai. Chúng tôi sẽ duyệt đơn hàng và gửi email xác nhận cho bạn trong thời gian sớm nhất (thường trong vòng 2-4h làm việc).</p>
        
        <div class="footer">
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ admin qua email hoặc fanpage.</p>
            <p>&copy; ${new Date().getFullYear()} ERX.VN. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
            }
        ]);

    if (error) {
        if (error.code === '23505') {
            console.log('Template payment_pending đã tồn tại!');

            // Xóa đi cài lại cho chắc nếu cần
            /*
            await supabase.from('email_templates').delete().eq('id', 'payment_pending');
            console.log("Đã xoá template cũ, hãy chạy lại script!");
            */
        } else {
            console.error('Lỗi khi thêm template:', error);
        }
    } else {
        console.log('Đã thêm template payment_pending thành công!');
    }
}

addPaymentPendingTemplate();
