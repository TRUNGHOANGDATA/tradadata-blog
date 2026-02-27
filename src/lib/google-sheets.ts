import { google } from 'googleapis';
import { supabaseAdmin } from './supabase/server';

export async function logOrderToSheet(orderCode: string) {
    if (!supabaseAdmin) throw new Error('Supabase admin not configured');

    // Lấy thông tin đơn hàng
    const { data: order } = await supabaseAdmin
        .from('orders')
        .select('*, products(name)')
        .eq('order_code', orderCode)
        .single();

    if (!order) return;

    // Lấy sheet ID từ settings
    const { data: sheetSetting } = await supabaseAdmin
        .from('site_settings')
        .select('value')
        .eq('key', 'google_sheet_id')
        .single();

    const sheetId = sheetSetting?.value?.sheetId;
    if (!sheetId) {
        console.log('Chưa cấu hình Google Sheet ID. Bỏ qua ghi log.');
        return;
    }

    const credentialsString = process.env.GOOGLE_DRIVE_CREDENTIALS;
    if (!credentialsString) {
        console.error('Thiếu cấu hình GOOGLE_DRIVE_CREDENTIALS trong env');
        return;
    }

    try {
        const credentials = JSON.parse(credentialsString);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Cấu trúc dòng data: [Ngày thanh toán, Mã Đơn, Tên KH, SĐT, Email, Tên Gói, Số tiền, Trạng thái]
        // Format ngày giờ: DD/MM/YYYY HH:mm:ss
        // Format ngày giờ an toàn: DD/MM/YYYY HH:mm:ss
        const dateObj = order.paid_at ? new Date(order.paid_at) : new Date();
        const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Ho_Chi_Minh' };
        const day = new Intl.DateTimeFormat('en-GB', { ...options, day: '2-digit' }).format(dateObj);
        const month = new Intl.DateTimeFormat('en-GB', { ...options, month: '2-digit' }).format(dateObj);
        const year = new Intl.DateTimeFormat('en-GB', { ...options, year: 'numeric' }).format(dateObj);
        const time = new Intl.DateTimeFormat('en-GB', { ...options, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(dateObj);

        const dateStr = `${day}/${month}/${year} ${time}`;

        const rowData = [
            dateStr,
            order.order_code,
            order.full_name,
            `'${order.phone || ''}`, // Thêm nháy đơn để tránh excel hiển thị sai sđt
            order.email,
            (order.products as any)?.name || '',
            order.amount,
            order.status === 'paid' ? 'Đã thanh toán' : 'Chờ xác nhận'
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Sheet1!A1:H1',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [rowData],
            },
        });

        console.log('Đã ghi đơn hàng vào Google Sheets:', order.order_code);
    } catch (err: any) {
        console.error('Lỗi khi ghi dữ liệu thanh toán vào Google Sheets:', err);
        throw err;
    }
}

export async function updateOrderStatusInSheet(orderCode: string, newStatus: string) {
    if (!supabaseAdmin) throw new Error('Supabase admin not configured');

    // Lấy sheet ID từ settings
    const { data: sheetSetting } = await supabaseAdmin
        .from('site_settings')
        .select('value')
        .eq('key', 'google_sheet_id')
        .single();

    const sheetId = sheetSetting?.value?.sheetId;
    if (!sheetId) {
        console.log('Chưa cấu hình Google Sheet ID. Bỏ qua ghi log.');
        return;
    }

    const credentialsString = process.env.GOOGLE_DRIVE_CREDENTIALS;
    if (!credentialsString) {
        console.error('Thiếu cấu hình GOOGLE_DRIVE_CREDENTIALS trong env');
        return;
    }

    try {
        const credentials = JSON.parse(credentialsString);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 1. Lấy tất cả mã đơn (Cột B) để tìm dòng cần sửa
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'Sheet1!B:B', // Chỉ lấy cột mã đơn hàng
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log('Sheet trống, không tìm thấy đơn hàng cần cập nhật.');
            return;
        }

        // Tìm dòng chứa orderCode (Array index bắt đầu từ 0, spreadsheet row bắt đầu từ 1)
        const rowIndex = rows.findIndex(row => row[0] === orderCode);

        if (rowIndex === -1) {
            console.log(`Không tìm thấy mã đơn ${orderCode} trong Google Sheets để cập nhật.`);
            return;
        }

        // 2. Cập nhật trạng thái (Cột H)
        // Dòng rowIndex = 0 tương ứng với dòng 1 trong Sheet. Vậy dòng cần update là rowIndex + 1.
        const rowNumber = rowIndex + 1;

        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `Sheet1!H${rowNumber}`, // Cột H là trạng thái
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[newStatus]],
            },
        });

        console.log(`Đã cập nhật đơn hàng ${orderCode} thành "${newStatus}" trong Google Sheets.`);
    } catch (err: any) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng vào Google Sheets:', err);
    }
}
