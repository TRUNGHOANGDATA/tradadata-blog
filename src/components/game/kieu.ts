/**
 * Kiểu dùng chung cho tab Game Việt hoá. Để ở module thường (không 'use client')
 * vì cả Server Component lẫn Client Component đều cần — import giá trị từ module
 * 'use client' vào Server Component chỉ nhận về client reference, không phải chuỗi.
 */

/** Thẻ kính mờ trên nền tối. */
export const THE_KINH =
    'rounded-2xl border border-[rgba(110,140,255,.28)] bg-[rgba(12,20,60,.62)] backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,.35)]';

/** Ô nhỏ bên trong thẻ (dòng thông tin, ô nhập). */
export const O_TOI = 'rounded-xl border border-[rgba(110,140,255,.28)] bg-[rgba(10,16,48,.78)]';

export const CHU_PHU = 'text-[#a9b3e0]';

/**
 * `next/image` chỉ tối ưu được host khai ở `images.remotePatterns`; host lạ thì
 * ném lỗi giữa trang. Ảnh bìa tải qua /api/admin/upload luôn là lh3, nhưng admin
 * vẫn có thể dán URL khác ⇒ host lạ thì tắt tối ưu thay vì sập trang.
 */
export function toiUuDuoc(src: string): boolean {
    return src.startsWith('https://lh3.googleusercontent.com/');
}

/**
 * Bỏ đuôi "Việt hoá" admin lỡ gõ vào tên game, để chỗ nào tự ghép thêm chữ đó
 * (tiêu đề tab, hộp ủng hộ) không thành "… Việt Hoá Việt hoá".
 */
export function boDuoiVietHoa(ten: string): string {
    return ten.normalize('NFC').replace(/\s*[-–:|(]?\s*vi[eệ]t\s*h(?:o[aáà]|óa)\)?\s*$/iu, '').trim() || ten;
}
