import { SITE_CONFIG } from '@/lib/constants';

export const metadata = {
    title: 'Điều khoản sử dụng | Trà Đá Data',
    description: 'Điều khoản sử dụng dịch vụ của TRÀ ĐÁ DATA',
    robots: { index: false, follow: true },
};

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                Điều khoản Sử dụng
            </h1>
            <p className="text-fg-subtle mb-10">Cập nhật lần cuối: 27/02/2026</p>

            <div className="prose prose-surface dark:prose-invert max-w-none space-y-8">
                {/* 1 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">1. Giới thiệu</h2>
                    <p>
                        Chào mừng bạn đến với <strong>{SITE_CONFIG.name}</strong> — nền tảng chia sẻ kiến thức về Data, AI &amp; Supply Chain,
                        đồng thời cung cấp các khoá học trực tuyến do TRÀ ĐÁ DATA vận hành.
                    </p>
                    <p>
                        Bằng việc truy cập và sử dụng website, bạn đồng ý tuân thủ các điều khoản được nêu dưới đây.
                        Nếu không đồng ý, vui lòng ngưng sử dụng dịch vụ.
                    </p>
                </section>

                {/* 2 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">2. Dịch vụ cung cấp</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Blog miễn phí:</strong> Các bài viết về Excel, VBA, Power Query, Power BI, SQL, Python, AI và các chủ đề liên quan.</li>
                        <li><strong>Khoá học trả phí:</strong> Các chương trình học trực tuyến có thời hạn truy cập, yêu cầu thanh toán trước khi sử dụng.</li>
                        <li><strong>Newsletter:</strong> Bản tin gửi qua email khi có bài viết mới (đăng ký tự nguyện).</li>
                    </ul>
                </section>

                {/* 3 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">3. Tài khoản người dùng</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Bạn đăng nhập bằng tài khoản Google thông qua Google OAuth. Chúng tôi không lưu trữ mật khẩu của bạn.</li>
                        <li>Bạn chịu trách nhiệm bảo mật tài khoản Google của mình.</li>
                        <li>Mỗi tài khoản chỉ được sử dụng bởi một cá nhân. Việc chia sẻ tài khoản hoặc quyền truy cập khoá học cho người khác là vi phạm điều khoản.</li>
                    </ul>
                </section>

                {/* 4 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">4. Thanh toán &amp; Hoàn tiền</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Thanh toán khoá học được thực hiện qua chuyển khoản ngân hàng. Đơn hàng sẽ được xác nhận sau khi admin kiểm tra giao dịch.</li>
                        <li>Sau khi xác nhận thanh toán, quyền truy cập khoá học sẽ được kích hoạt theo thời hạn của sản phẩm.</li>
                        <li>Chúng tôi <strong>không hỗ trợ hoàn tiền</strong> sau khi quyền truy cập khoá học đã được kích hoạt, trừ trường hợp lỗi kỹ thuật từ phía hệ thống.</li>
                        <li>Mã giảm giá (nếu có) chỉ áp dụng một lần và không thể kết hợp.</li>
                    </ul>
                </section>

                {/* 5 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">5. Quyền sở hữu trí tuệ</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Toàn bộ nội dung trên website (bài viết, hình ảnh, video, tài liệu khoá học) thuộc quyền sở hữu của TRÀ ĐÁ DATA hoặc tác giả được uỷ quyền.</li>
                        <li>Bạn được phép đọc, học tập và chia sẻ link bài viết blog công khai.</li>
                        <li>Bạn <strong>không được phép</strong> sao chép, phân phối, bán lại hoặc tái xuất bản nội dung khoá học dưới bất kỳ hình thức nào.</li>
                        <li>Việc quay màn hình, tải về hoặc chia sẻ nội dung khoá học trả phí là vi phạm bản quyền.</li>
                    </ul>
                </section>

                {/* 6 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">6. Quy tắc sử dụng</h2>
                    <p>Khi sử dụng dịch vụ, bạn cam kết:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Không sử dụng website cho mục đích bất hợp pháp.</li>
                        <li>Không cố gắng truy cập trái phép vào hệ thống, tài khoản người khác, hoặc nội dung chưa được phép.</li>
                        <li>Không đăng bình luận có nội dung xúc phạm, quảng cáo spam, hoặc vi phạm pháp luật.</li>
                    </ul>
                </section>

                {/* 7 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">7. Giới hạn trách nhiệm</h2>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Nội dung blog được cung cấp với mục đích chia sẻ kiến thức, không phải tư vấn chuyên nghiệp.</li>
                        <li>TRÀ ĐÁ DATA không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc áp dụng kiến thức từ blog hoặc khoá học.</li>
                        <li>Chúng tôi nỗ lực đảm bảo website hoạt động ổn định nhưng không cam kết dịch vụ sẵn sàng 100% mọi lúc.</li>
                    </ul>
                </section>

                {/* 8 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">8. Thay đổi điều khoản</h2>
                    <p>
                        TRÀ ĐÁ DATA có quyền cập nhật hoặc thay đổi các điều khoản này bất cứ lúc nào.
                        Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên trang này. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi đồng nghĩa với việc bạn chấp nhận điều khoản mới.
                    </p>
                </section>

                {/* 9 */}
                <section>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">9. Liên hệ</h2>
                    <p>
                        Nếu có câu hỏi về các điều khoản này, vui lòng liên hệ qua email:{' '}
                        <a href="mailto:trunghoangdata101091@gmail.com" className="text-brand-600 dark:text-brand-400 hover:underline">
                            trunghoangdata101091@gmail.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
