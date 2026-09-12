/**
 * Nhận diện ngày theo thói quen Việt Nam: NGÀY/THÁNG/NĂM.
 *
 * Vì sao cần: bộ tự nhận ngày của Univer chạy theo region Mỹ nên gõ `25/12/2025`
 * nó coi là VĂN BẢN (tháng 25 không tồn tại), còn `05/06/2025` nó hiểu là mùng 6
 * tháng 5 chứ không phải mùng 5 tháng 6. Đã đo thật ngày 11/09/2026.
 * `setNumfmtLocal()` chỉ đổi cách hiện SỐ, không đụng tới chuyện này.
 *
 * Chấp nhận ba dấu ngăn `/`, `-`, `.` vì người Việt gõ cả ba.
 * Năm 2 chữ số theo quy ước Excel: 00-29 là 20xx, 30-99 là 19xx.
 */
const MAU_NGAY = /^(\d{1,2})\s*[/\-.]\s*(\d{1,2})\s*[/\-.]\s*(\d{2}|\d{4})$/;

const SO_NGAY_THANG = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function laNamNhuan(nam: number): boolean {
    return (nam % 4 === 0 && nam % 100 !== 0) || nam % 400 === 0;
}

function soNgayTrongThang(nam: number, thang: number): number {
    if (thang === 2 && laNamNhuan(nam)) return 29;
    return SO_NGAY_THANG[thang - 1];
}

/**
 * Đổi chuỗi ngày/tháng/năm thành số serial của Excel (số ngày kể từ 30/12/1899).
 *
 * Trả `null` nếu chuỗi không phải ngày hợp lệ theo thứ tự ngày-tháng-năm — lúc đó
 * cứ để Univer xử lý theo mặc định của nó.
 *
 * LƯU Ý: chỉ nhận từ năm 1900 trở đi. Excel có lỗi lịch sử coi 1900 là năm nhuận
 * nên mọi ngày trước 01/03/1900 sẽ lệch 1 — không đáng xử lý cho một công cụ luyện tập.
 */
export function doiNgayVietSangSerial(chuoi: string): number | null {
    const khop = MAU_NGAY.exec(chuoi.trim());
    if (!khop) return null;

    const ngay = Number(khop[1]);
    const thang = Number(khop[2]);
    let nam = Number(khop[3]);

    if (khop[3].length === 2) {
        nam = nam < 30 ? 2000 + nam : 1900 + nam;
    }

    if (nam < 1900 || nam > 9999) return null;
    if (thang < 1 || thang > 12) return null;
    if (ngay < 1 || ngay > soNgayTrongThang(nam, thang)) return null;

    return Math.round((Date.UTC(nam, thang - 1, ngay) - Date.UTC(1899, 11, 30)) / 86400000);
}
