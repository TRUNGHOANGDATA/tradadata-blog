import { permanentRedirect } from 'next/navigation';

/**
 * /pricing đã gộp vào /courses.
 *
 * Lý do: hai trang cùng đọc bảng `products` và cùng bán y hệt các gói đó, nhưng
 * /pricing là bản kém hơn — mô tả bị `h-12` cắt cụt, không có giỏ hàng, đi một
 * đường mua riêng (`/checkout/create?product_id=`), và metadata còn sót tên
 * "rxx.vn" của dự án khác. Trong khi đó /courses mới là trang được bảo trì:
 * có trong menu, có giỏ hàng, chia theo nhóm, có JSON-LD.
 *
 * Trớ trêu là CTA trong bài viết Premium bị khoá lại trỏ về /pricing, nên khách
 * chạm paywall bị đẩy vào đúng trang yếu hơn. Các link đó đã đổi sang /courses.
 *
 * Giữ route này chuyển hướng 308 thay vì xoá, vì URL đã nằm trong sitemap và có
 * thể được chia sẻ ở ngoài. Đừng dựng lại một trang bán thứ hai ở đây.
 */
export default function PricingPage() {
    permanentRedirect('/courses');
}
