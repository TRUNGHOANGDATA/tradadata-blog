/**
 * Lấy thông điệp lỗi từ một giá trị `unknown` bắt được trong `catch`.
 *
 * Vì sao cần: trước đây 78 chỗ viết `catch (error)` rồi đọc thẳng
 * `error.message`. Kiểu `any` tắt mọi kiểm tra, nên nếu chỗ đó ném ra một
 * chuỗi hay một object lạ thì `error.message` là `undefined` và người dùng
 * nhận về thông báo trống — không ai biết cho tới khi có người báo.
 *
 * TypeScript luôn cho biến trong `catch` kiểu `unknown` (đúng, vì JS ném được
 * bất cứ thứ gì), nên phải thu hẹp kiểu trước khi dùng. Hàm này làm việc đó
 * một lần cho toàn repo.
 */
export function loiThanhChu(e: unknown): string {
    if (e instanceof Error) return e.message;
    if (typeof e === 'string') return e;
    if (e && typeof e === 'object' && 'message' in e) {
        const m = (e as { message?: unknown }).message;
        if (typeof m === 'string') return m;
    }
    return 'Đã có lỗi xảy ra';
}

/**
 * Đọc một thuộc tính "phụ" của lỗi mà không cần `any`.
 *
 * Dùng cho các lỗi có thêm dữ liệu ngoài `message` — ví dụ `code` của Google
 * Drive API (409 = quyền đã tồn tại) hay `response.data` của googleapis.
 * Trả về `undefined` nếu không có, để nơi gọi tự quyết định.
 */
export function thuocTinhLoi<T = unknown>(e: unknown, ten: string): T | undefined {
    if (e && typeof e === 'object' && ten in e) {
        return (e as Record<string, T>)[ten];
    }
    return undefined;
}

/** Lỗi này có phải do người dùng/hệ thống huỷ request giữa đường không. */
export function laLoiHuy(e: unknown): boolean {
    return e instanceof Error && e.name === 'AbortError';
}
