import { SITE_CONFIG } from '@/lib/constants';

export const metadata = {
    title: 'Chính sách bảo mật | ERX Blog',
    description: 'Chính sách bảo mật và quyền riêng tư của ERX VIETNAM',
    robots: { index: false, follow: true },
};

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                Chính sách Bảo mật
            </h1>
            <p className="text-surface-500 mb-10">Cập nhật lần cuối: 27/02/2026</p>

            <div className="prose prose-surface dark:prose-invert max-w-none space-y-8">
                {/* 1 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">1. Giới thiệu</h2>
                    <p>
                        <strong>{SITE_CONFIG.name}</strong> (thuộc ERX VIETNAM) cam kết bảo vệ quyền riêng tư của bạn.
                        Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân khi bạn sử dụng website và dịch vụ của chúng tôi.
                    </p>
                </section>

                {/* 2 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">2. Thông tin chúng tôi thu thập</h2>
                    <p>Chúng tôi thu thập các loại thông tin sau:</p>

                    <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mt-4">2.1. Khi đăng nhập (Google OAuth)</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Email:</strong> Địa chỉ email Google của bạn</li>
                        <li><strong>Họ tên:</strong> Tên hiển thị từ tài khoản Google</li>
                        <li><strong>Ảnh đại diện:</strong> Avatar từ tài khoản Google</li>
                    </ul>
                    <p className="text-sm text-surface-500 mt-2">
                        Chúng tôi <strong>không</strong> truy cập mật khẩu, danh bạ, Drive, hoặc bất kỳ dữ liệu Google nào khác.
                    </p>

                    <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mt-4">2.2. Khi đặt hàng</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Họ tên đầy đủ</strong></li>
                        <li><strong>Số điện thoại</strong></li>
                        <li><strong>Thông tin đơn hàng</strong> (sản phẩm, số tiền, trạng thái thanh toán)</li>
                    </ul>

                    <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mt-4">2.3. Khi đăng ký Newsletter</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Email:</strong> Để gửi thông báo bài viết mới</li>
                    </ul>

                    <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mt-4">2.4. Dữ liệu kỹ thuật (tự động)</h3>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Địa chỉ IP, loại trình duyệt, thiết bị</li>
                        <li>Trang đã truy cập, thời gian truy cập</li>
                    </ul>
                </section>

                {/* 3 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">3. Mục đích sử dụng</h2>
                    <p>Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Xác thực tài khoản và cung cấp quyền truy cập dịch vụ</li>
                        <li>Xử lý đơn hàng và theo dõi quyền truy cập khoá học</li>
                        <li>Gửi email thông báo bài viết mới (nếu đã đăng ký)</li>
                        <li>Gửi email xác nhận thanh toán</li>
                        <li>Cải thiện trải nghiệm người dùng và chất lượng dịch vụ</li>
                        <li>Liên hệ hỗ trợ khi cần thiết</li>
                    </ul>
                </section>

                {/* 4 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">4. Chia sẻ với bên thứ ba</h2>
                    <p>
                        Chúng tôi <strong>không bán, cho thuê, hoặc chia sẻ</strong> thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào
                        với mục đích thương mại.
                    </p>
                    <p>Thông tin chỉ được chia sẻ trong các trường hợp sau:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Google OAuth:</strong> Xác thực đăng nhập (chỉ đọc thông tin cơ bản)</li>
                        <li><strong>Supabase:</strong> Lưu trữ dữ liệu (đối tác hạ tầng, tuân thủ GDPR)</li>
                        <li><strong>Yêu cầu pháp lý:</strong> Khi có yêu cầu hợp pháp từ cơ quan chức năng</li>
                    </ul>
                </section>

                {/* 5 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">5. Bảo mật dữ liệu</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Dữ liệu được lưu trữ trên nền tảng <strong>Supabase</strong> với mã hoá và kiểm soát truy cập (Row Level Security).</li>
                        <li>Kết nối website sử dụng <strong>HTTPS</strong> để bảo vệ dữ liệu truyền tải.</li>
                        <li>Chúng tôi không lưu trữ mật khẩu — xác thực hoàn toàn qua Google OAuth.</li>
                        <li>Quyền truy cập dữ liệu nội bộ được giới hạn cho admin hệ thống.</li>
                    </ul>
                </section>

                {/* 6 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">6. Cookie</h2>
                    <p>Website sử dụng cookie cho các mục đích sau:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Cookie phiên đăng nhập:</strong> Duy trì trạng thái đăng nhập (bắt buộc)</li>
                        <li><strong>Cookie tuỳ chọn giao diện:</strong> Lưu chế độ sáng/tối (tuỳ chọn)</li>
                    </ul>
                    <p>Chúng tôi không sử dụng cookie quảng cáo hoặc cookie theo dõi từ bên thứ ba.</p>
                </section>

                {/* 7 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">7. Quyền của bạn</h2>
                    <p>Bạn có các quyền sau đối với dữ liệu cá nhân:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Truy cập:</strong> Xem thông tin cá nhân đã cung cấp</li>
                        <li><strong>Chỉnh sửa:</strong> Cập nhật thông tin họ tên, số điện thoại</li>
                        <li><strong>Xoá:</strong> Yêu cầu xoá tài khoản và dữ liệu liên quan (liên hệ admin)</li>
                        <li><strong>Huỷ đăng ký Newsletter:</strong> Thông qua link huỷ trong email hoặc liên hệ admin</li>
                    </ul>
                    <p>
                        Để thực hiện các quyền trên, vui lòng liên hệ:{' '}
                        <a href="mailto:info@erx.vn" className="text-brand-600 dark:text-brand-400 hover:underline">
                            info@erx.vn
                        </a>
                    </p>
                </section>

                {/* 8 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">8. Trẻ em</h2>
                    <p>
                        Dịch vụ của chúng tôi không hướng đến trẻ em dưới 13 tuổi.
                        Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em. Nếu phát hiện, dữ liệu sẽ được xoá ngay lập tức.
                    </p>
                </section>

                {/* 9 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">9. Thay đổi chính sách</h2>
                    <p>
                        Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian.
                        Mọi thay đổi sẽ được đăng tải trên trang này cùng ngày cập nhật mới.
                    </p>
                </section>

                {/* 10 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">10. Liên hệ</h2>
                    <p>
                        Nếu có câu hỏi về chính sách bảo mật, vui lòng liên hệ:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Email: <a href="mailto:info@erx.vn" className="text-brand-600 dark:text-brand-400 hover:underline">info@erx.vn</a></li>
                        <li>Website: <a href="https://erx.vn" className="text-brand-600 dark:text-brand-400 hover:underline">erx.vn</a></li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
