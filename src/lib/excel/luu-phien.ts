/**
 * Lưu bài đang làm để refresh không mất, theo kiểu "mỗi người một phiên".
 *
 * Dùng sessionStorage (KHÔNG phải localStorage) vì:
 *   - sessionStorage RIÊNG cho từng tab -> mỗi người/mỗi tab là một phiên độc lập.
 *   - Mất khi đóng tab -> máy DÙNG CHUNG (lớp học, quán net) thì người sau mở lên
 *     không thấy bài người trước. localStorage sẽ rò như vậy.
 * Muốn giữ lâu thì học viên tự "Tải về máy" (.xlsx) — đó mới là bản lưu bền.
 *
 * Mọi thao tác bọc try/catch: chế độ riêng tư hoặc storage đầy có thể ném lỗi,
 * và mất phiên chỉ là bất tiện nhỏ, không được làm hỏng bảng tính.
 */
import type { IWorkbookData } from '@univerjs/core';

const KHOA = 'tdd-thuc-hanh-workbook';

export function luuPhien(snapshot: IWorkbookData): void {
    try {
        sessionStorage.setItem(KHOA, JSON.stringify(snapshot));
    } catch {
        // đầy hoặc bị chặn -> bỏ qua
    }
}

export function docPhien(): IWorkbookData | null {
    try {
        const s = sessionStorage.getItem(KHOA);
        return s ? (JSON.parse(s) as IWorkbookData) : null;
    } catch {
        return null;
    }
}

export function xoaPhien(): void {
    try {
        sessionStorage.removeItem(KHOA);
    } catch {
        // bỏ qua
    }
}
