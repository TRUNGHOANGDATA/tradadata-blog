'use client';

// Bộ đệm client dùng chung cho danh sách bài đã lưu.
//
// Mọi BookmarkButton trên một trang cùng gọi `layDanhSachDaLuu()`; lần gọi đầu
// bắn MỘT request tới /api/bookmarks/ids, các nút còn lại dùng chung promise đó
// (dedupe). Nhờ vậy trang danh sách 10 thẻ chỉ tốn 1 request thay vì 10.
//
// Đệm theo `userKey` (id người dùng): đổi tài khoản / đăng xuất là nạp lại,
// không trả nhầm danh sách của phiên trước.

let cachedKey: string | null = null;
let cachedPromise: Promise<Set<string>> | null = null;

async function taiDanhSach(): Promise<Set<string>> {
    try {
        const res = await fetch('/api/bookmarks/ids');
        if (!res.ok) return new Set();
        const data = await res.json();
        return new Set<string>(Array.isArray(data.ids) ? data.ids : []);
    } catch {
        // Lỗi mạng: coi như chưa lưu gì, không chặn UI. Lần điều hướng sau thử lại.
        cachedPromise = null;
        return new Set();
    }
}

/**
 * Trả về Set post_id đã lưu của người dùng hiện tại. Dùng chung một promise cho
 * mọi nút trong cùng phiên/điều hướng. `userKey` là id người dùng để reset khi đổi.
 */
export function layDanhSachDaLuu(userKey: string): Promise<Set<string>> {
    if (cachedKey !== userKey || !cachedPromise) {
        cachedKey = userKey;
        cachedPromise = taiDanhSach();
    }
    return cachedPromise;
}

/** Cập nhật bộ đệm sau khi người dùng bấm lưu/bỏ lưu — để các nút khác đồng bộ. */
export function capNhatDaLuu(postId: string, daLuu: boolean): void {
    if (!cachedPromise) return;
    const p = cachedPromise;
    cachedPromise = p.then(set => {
        if (daLuu) set.add(postId);
        else set.delete(postId);
        return set;
    });
}

/** Xoá bộ đệm (đăng xuất). */
export function xoaDemDaLuu(): void {
    cachedKey = null;
    cachedPromise = null;
}
