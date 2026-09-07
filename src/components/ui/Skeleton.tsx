/**
 * Khối xám nhấp nháy dùng cho các file `loading.tsx`.
 *
 * Vì sao không dùng màn loading toàn trang nữa: màn loading che hết bố cục nên
 * người đọc mất mốc, và mỗi lần điều hướng là nhìn thấy một trang trắng khác
 * hẳn trang sắp hiện ra. Skeleton giữ đúng khung của nội dung thật nên nội dung
 * đổ vào không làm layout nhảy.
 *
 * Quy tắc: skeleton phải có CÙNG kích thước và khoảng cách với nội dung thật.
 * Sai kích thước thì còn tệ hơn không có, vì layout sẽ giật khi dữ liệu về.
 */
export function Sk({ className = '' }: { className?: string }) {
    return <div aria-hidden="true" className={`animate-pulse rounded-md bg-sunken ${className}`} />;
}

/** Thẻ bài viết: khớp với PostCard (ảnh 16/9, nhãn, 2 dòng tiêu đề, 2 dòng mô tả, meta). */
export function SkPostCard() {
    return (
        <div className="rounded-2xl border border-line bg-card overflow-hidden shadow-e1">
            <Sk className="aspect-[16/9] rounded-none" />
            <div className="p-5">
                <Sk className="h-5 w-24 mb-3" />
                <Sk className="h-5 w-full mb-1.5" />
                <Sk className="h-5 w-4/5 mb-3" />
                <Sk className="h-4 w-full mb-1.5" />
                <Sk className="h-4 w-2/3 mb-4" />
                <div className="flex gap-4">
                    <Sk className="h-3 w-20" />
                    <Sk className="h-3 w-24" />
                </div>
            </div>
        </div>
    );
}

/** Lưới thẻ bài viết. */
export function SkPostGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <SkPostCard key={i} />
            ))}
        </div>
    );
}
