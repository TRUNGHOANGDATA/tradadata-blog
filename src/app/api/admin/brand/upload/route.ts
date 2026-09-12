import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { auth } from '@/lib/auth';
import { loiThanhChu } from '@/lib/errors';
import { uploadToGoogleDrive } from '@/lib/storage/google-drive';
import { CHUAN_ANH, type LoaiAnhThuongHieu } from '@/lib/brand';

/**
 * Upload ảnh nhận diện thương hiệu.
 *
 * Vì sao KHÔNG dùng chung `/api/admin/upload`: route đó chạy `toiUuAnh`, vốn
 * nén mọi ảnh về cùng một ngưỡng "rộng tối đa 1600" vì nó phục vụ ảnh bìa bài
 * viết. Với logo thì thừa — ảnh 1254px được giữ nguyên cho một chỗ hiển thị
 * 44px. Ở đây mỗi loại có preset riêng, đo được:
 *     logo   512x512   JPEG q88  ~78 KB
 *     banner 1600x900  JPEG q88  ~261 KB  (gốc PNG 1724 KB)
 *     og     1200x630  JPEG q85  ~152 KB
 *
 * Tải banner lên thì route tự sinh THÊM ảnh chia sẻ mạng xã hội bằng cách cắt
 * giữa về 1.91:1. Banner gốc là 16:9 nên không vừa khít tỉ lệ OG; cắt giữa
 * (`fit: cover`) giữ đúng bố cục, còn `contain` sẽ chèn viền đen vì 4 góc
 * banner mỗi góc một màu. Nhờ vậy admin chỉ phải tải 2 file thay vì 3.
 *
 * Giữ PNG khi ảnh CÓ alpha — JPEG không có kênh trong suốt, đổi là nền hoá
 * đen. Đây cũng là lý do ô "logo cho nền tối" khuyến nghị PNG.
 */

const LOAI_HOP_LE: LoaiAnhThuongHieu[] = ['logo', 'logo-toi', 'hero', 'banner', 'og'];
const KIEU_CHO_PHEP = ['image/jpeg', 'image/png', 'image/webp'];
const KICH_THUOC_TOI_DA = 10 * 1024 * 1024;

type AnhDaNen = { buffer: Buffer; ten: string; mime: string };

async function nenTheoChuan(goc: Buffer, ten: string, loai: LoaiAnhThuongHieu): Promise<AnhDaNen> {
    const chuan = CHUAN_ANH[loai];
    const meta = await sharp(goc).metadata();
    const giuPng = meta.format === 'png' && meta.hasAlpha;

    // `rotate()` không tham số = áp orientation trong EXIF vào pixel. Cần, vì
    // `resize` bỏ qua EXIF nên ảnh chụp dọc từ điện thoại sẽ bị quay ngang.
    const ong = sharp(goc)
        .rotate()
        .resize(chuan.rong, chuan.cao, { fit: 'cover', position: 'centre' });

    const goc2 = ten.replace(/\.[^.]+$/, '');
    if (giuPng) {
        return {
            buffer: await ong.png({ compressionLevel: 9, palette: true }).toBuffer(),
            ten: `${goc2}-${loai}.png`,
            mime: 'image/png',
        };
    }
    return {
        buffer: await ong.jpeg({ quality: loai === 'og' ? 85 : 88 }).toBuffer(),
        ten: `${goc2}-${loai}.jpg`,
        mime: 'image/jpeg',
    };
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Không có quyền' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const loai = String(formData.get('loai') || '') as LoaiAnhThuongHieu;

        if (!file) {
            return NextResponse.json({ error: 'Chưa chọn file' }, { status: 400 });
        }
        if (!LOAI_HOP_LE.includes(loai)) {
            return NextResponse.json({ error: 'Loại ảnh không hợp lệ' }, { status: 400 });
        }
        if (!KIEU_CHO_PHEP.includes(file.type)) {
            return NextResponse.json(
                { error: `Định dạng ${file.type} không dùng được. Hãy chọn file PNG, JPG hoặc WebP.` },
                { status: 400 }
            );
        }
        if (file.size > KICH_THUOC_TOI_DA) {
            return NextResponse.json(
                { error: `File nặng ${(file.size / 1024 / 1024).toFixed(1)}MB, tối đa 10MB.` },
                { status: 400 }
            );
        }

        const goc = Buffer.from(await file.arrayBuffer());
        const chinh = await nenTheoChuan(goc, file.name, loai);
        const ketQua = await uploadToGoogleDrive(chinh.buffer, chinh.ten, chinh.mime);
        if (!ketQua) {
            return NextResponse.json(
                { error: 'Tải lên Google Drive thất bại. Kiểm tra lại cấu hình Drive.' },
                { status: 500 }
            );
        }

        // Banner thì sinh kèm ảnh chia sẻ, để admin không phải xuất thêm file.
        let ogUrl: string | null = null;
        if (loai === 'banner') {
            const og = await nenTheoChuan(goc, file.name, 'og');
            const ketQuaOg = await uploadToGoogleDrive(og.buffer, og.ten, og.mime);
            // Sinh ảnh OG hỏng thì KHÔNG làm hỏng cả lần tải banner — nơi gọi
            // chỉ cần biết là chưa có ảnh OG mới.
            ogUrl = ketQuaOg?.url ?? null;
            console.log(`[brand] banner ${(chinh.buffer.length / 1024).toFixed(0)}KB, og ${ogUrl ? `${(og.buffer.length / 1024).toFixed(0)}KB` : 'THẤT BẠI'}`);
        }

        return NextResponse.json({ success: true, url: ketQua.url, ogUrl });
    } catch (error) {
        console.error('[brand] Lỗi tải ảnh thương hiệu:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
