import type { Metadata } from 'next';
import Image from 'next/image';
import {
    ShoppingCart, Warehouse, Wallet, Users, BarChart3,
    ShieldCheck, PackageCheck, Monitor, Database, Check, X,
    Files, EyeOff, CalendarClock, Boxes, Sparkles,
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { ContactButtons, LeadForm } from './ContactBlock';

// Ảnh đã được nén sẵn sang WebP và resize về 1200px, nên dùng `unoptimized`
// để BỎ QUA bộ tối ưu ảnh lúc chạy của Next.
// Vì sao: pod nhỏ và dùng chung với ke-truyen. Lần đầu mở trang, 13 ảnh PNG lớn
// được tối ưu cùng lúc làm nghẽn CPU — cả site chậm 17-20 giây, kể cả file tĩnh.
// Cache pod mất mỗi lần deploy nên sự cố lặp lại sau mỗi lần deploy.

const TITLE = 'Phần mềm quản lý bán hàng cho doanh nghiệp thương mại';
const DESCRIPTION =
    'Quản lý bán hàng, kho, công nợ, thu chi và KPI trên nền Excel quen thuộc, dữ liệu tập trung trên SQL Server. Nhiều máy dùng chung một cơ sở dữ liệu.';

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    keywords: [
        'phần mềm quản lý bán hàng', 'phần mềm bán hàng Excel', 'quản lý kho',
        'quản lý công nợ', 'phần mềm quản lý doanh nghiệp thương mại', 'SQL Server',
    ],
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: `${SITE_CONFIG.url}/phan-mem-ban-hang`,
        siteName: SITE_CONFIG.name,
        locale: 'vi_VN',
        type: 'website',
    },
    alternates: { canonical: `${SITE_CONFIG.url}/phan-mem-ban-hang` },
};

// ==============================
// Dữ liệu nội dung
// ==============================

const PAIN_POINTS = [
    {
        icon: Files,
        title: 'Mỗi người một file Excel',
        body: 'Kế toán một file, sales một file, thủ kho một file. Cuối tháng ngồi đối chiếu, số nào cũng lệch mà không biết số nào đúng.',
    },
    {
        icon: EyeOff,
        title: 'Không biết lãi thật là bao nhiêu',
        body: 'Doanh thu thì thấy, nhưng giá vốn từng đơn thì mù. Bán xong mới phát hiện đơn đó lỗ.',
    },
    {
        icon: CalendarClock,
        title: 'Công nợ theo trí nhớ',
        body: 'Ai nợ bao nhiêu, quá hạn mấy ngày, đã trả đơn nào — ghi sổ tay rồi quên đòi.',
    },
    {
        icon: Boxes,
        title: 'Nhiều kho, không biết tồn thật',
        body: 'Hàng nằm ở kho nào, còn bao nhiêu, ai điều chuyển lúc nào. Đến lúc khách hỏi mới chạy đi đếm.',
    },
];

// `rare: true` = nghiệp vụ mà phần mềm bán hàng phổ thông thường không có,
// rút từ tài liệu hướng dẫn 45 trang.
const FEATURE_GROUPS = [
    {
        icon: ShoppingCart,
        title: 'Bán hàng & báo giá',
        items: [
            { t: 'Phiếu bán hàng có phụ phí, chiết khấu, VAT theo từng dòng' },
            { t: 'Lập báo giá rồi import thẳng thành đơn, không nhập lại', rare: true },
            { t: 'Thu tiền ngay trên phiếu bán — tự sinh phiếu thu và trừ vào đơn', rare: true },
            { t: 'In báo giá khổ A4 và A5' },
            { t: 'Trả hàng khách và trả hàng nhà cung cấp, chặn trả quá số đã bán', rare: true },
        ],
    },
    {
        icon: Warehouse,
        title: 'Kho & hàng hoá',
        items: [
            { t: 'Nhiều kho, điều chuyển nội bộ giữa các kho' },
            { t: 'Đơn vị quy đổi nhiều cấp, mỗi cấp một giá riêng (1 hộp = 6 viên)', rare: true },
            { t: 'Đơn vị bắt buộc làm tròn — hàng không xé lẻ được như viên gạch', rare: true },
            { t: 'Tồn đầu kỳ và giá vốn đầu kỳ riêng cho từng kho' },
            { t: 'Kiểm kê, điều chỉnh chênh lệch và quản lý phiếu kiểm kê' },
            { t: 'Xuất huỷ, có tra cứu lại phiếu' },
        ],
    },
    {
        icon: PackageCheck,
        title: 'Hàng ký gửi',
        items: [
            { t: 'Xuất ký gửi chỉ giảm tồn, chưa ghi doanh thu và giá vốn', rare: true },
            { t: 'Phiếu bán ký gửi tự sinh phiếu bán hàng tương ứng', rare: true },
            { t: 'Xoá một phiếu là xoá cả cặp, không để lệch sổ', rare: true },
            { t: 'Tra cứu từng đại lý còn giữ bao nhiêu hàng chưa bán', rare: true },
        ],
    },
    {
        icon: Wallet,
        title: 'Công nợ',
        items: [
            { t: 'Báo cáo công nợ theo tuổi nợ, hạn nợ đặt riêng từng khách', rare: true },
            { t: 'Thu theo từng hoá đơn, trừ tự động theo FIFO khi thu dư', rare: true },
            { t: 'Đối trừ công nợ khi một đơn vị vừa là khách vừa là nhà cung cấp', rare: true },
            { t: 'Thu riêng phần công nợ đầu kỳ, không lẫn với phát sinh trong kỳ' },
        ],
    },
    {
        icon: Database,
        title: 'Tiền & sổ quỹ',
        items: [
            { t: 'Phiếu thu, phiếu chi theo hạng mục tự khai báo' },
            { t: 'Phân biệt chi phí thật và chi trả công nợ — bỏ trống hạng mục là chi công nợ', rare: true },
            { t: 'Sổ quỹ tiền mặt và từng tài khoản ngân hàng' },
            { t: 'Chuyển tiền nội bộ, chỉ ảnh hưởng quỹ chứ không đụng doanh thu chi phí', rare: true },
        ],
    },
    {
        icon: Users,
        title: 'Nhân viên & KPI',
        items: [
            { t: 'KPI dạng "thu đủ" — thu hết tiền hoá đơn mới được tính hoa hồng', rare: true },
            { t: 'KPI theo khoảng doanh thu, tự cấu hình từng bậc' },
            { t: 'Hoa hồng khai theo từng sản phẩm và theo khoảng thời gian', rare: true },
            { t: 'Mỗi khách có Sales phụ trách, lập đơn là gợi ý sẵn' },
        ],
    },
    {
        icon: BarChart3,
        title: 'Báo cáo',
        items: [
            { t: 'Dashboard doanh thu – chi phí – lợi nhuận, cơ cấu doanh thu theo sản phẩm' },
            { t: 'Lợi nhuận từng đơn hàng, kèm % lợi nhuận trên doanh thu', rare: true },
            { t: 'Nhập xuất tồn theo cả số lượng và giá trị, chi tiết tới từng kho' },
            { t: 'Lịch sử giá mua và giá bán phát sinh trong kỳ', rare: true },
            { t: 'Xếp hạng doanh thu, lợi nhuận theo nhân viên và theo nhóm hàng' },
            { t: 'Mọi báo cáo đều xuất được ra Excel' },
        ],
    },
    {
        icon: ShieldCheck,
        title: 'Kiểm soát & quản trị',
        items: [
            { t: 'Khoá sổ theo giờ trong ngày — sau giờ chốt muốn sửa phải xin duyệt', rare: true },
            { t: 'Thủ kho xác nhận xuất kho, xác nhận rồi thì Sales hết quyền sửa đơn', rare: true },
            { t: 'Truy vết đúng bút toán làm âm kho khiến giá vốn về 0', rare: true },
            { t: 'Công cụ tính lại giá vốn toàn hệ thống' },
            { t: 'Cảnh báo khách lâu không mua và hàng dưới tồn tối thiểu', rare: true },
            { t: 'Phân quyền 4 vai trò, tuỳ biến được từng quyền' },
            { t: 'Tự sao lưu database ra file .bak' },
        ],
    },
];

const SCREENSHOTS = [
    { src: '/images/phan-mem/dashboard.webp', alt: 'Dashboard quản trị kinh doanh', caption: 'Dashboard: doanh thu, chi phí, lợi nhuận và cơ cấu doanh thu theo sản phẩm' },
    { src: '/images/phan-mem/ban-hang.webp', alt: 'Màn hình phiếu bán hàng', caption: 'Phiếu bán hàng — tra cứu báo giá cũ, tự tính công nợ còn phải thu' },
    { src: '/images/phan-mem/cong-no.webp', alt: 'Màn hình quản lý công nợ', caption: 'Quản lý công nợ khách hàng và nhà cung cấp' },
    { src: '/images/phan-mem/nhap-xuat-ton.webp', alt: 'Báo cáo nhập xuất tồn', caption: 'Nhập xuất tồn chi tiết tới từng kho' },
    { src: '/images/phan-mem/ket-qua-kinh-doanh.webp', alt: 'Báo cáo kết quả kinh doanh', caption: 'Báo cáo kết quả kinh doanh theo kỳ' },
    { src: '/images/phan-mem/loi-nhuan-don-hang.webp', alt: 'Báo cáo lợi nhuận theo đơn hàng', caption: 'Lợi nhuận từng đơn hàng — biết ngay đơn nào lỗ' },
    { src: '/images/phan-mem/kpi.webp', alt: 'Báo cáo KPI nhân viên', caption: 'KPI và hoa hồng nhân viên' },
    { src: '/images/phan-mem/so-quy.webp', alt: 'Sổ quỹ tiền mặt và ngân hàng', caption: 'Sổ quỹ tiền mặt / ngân hàng' },
    { src: '/images/phan-mem/canh-bao-thieu-hang.webp', alt: 'Cảnh báo thiếu hàng', caption: 'Cảnh báo thiếu hàng và khách lâu không mua' },
    { src: '/images/phan-mem/ky-gui.webp', alt: 'Tra cứu tình hình ký gửi', caption: 'Theo dõi hàng ký gửi tại từng đại lý' },
    { src: '/images/phan-mem/nhap-hang.webp', alt: 'Màn hình nhập hàng', caption: 'Phiếu nhập hàng từ nhà cung cấp' },
    { src: '/images/phan-mem/xep-hang-nhan-vien.webp', alt: 'Bảng xếp hạng nhân viên', caption: 'Xếp hạng doanh thu, lợi nhuận theo nhân viên' },
];

const FAQ = [
    {
        q: 'Dữ liệu lưu ở đâu?',
        a: 'Trên SQL Server đặt tại máy chủ của chính doanh nghiệp bạn — có thể là một máy tính trong văn phòng hoặc máy chủ thuê ngoài. Dữ liệu thuộc về bạn, không nằm trên hệ thống của bên thứ ba.',
    },
    {
        q: 'Nhiều máy dùng chung được không?',
        a: 'Được. Đó là điểm khác biệt so với file Excel rời: mọi máy kết nối vào cùng một cơ sở dữ liệu, ai nhập liệu xong là người khác thấy ngay. Số lượng máy tuỳ theo cấu hình máy chủ.',
    },
    {
        q: 'Nhân viên có xem được hết mọi thứ không?',
        a: 'Không. Phần mềm phân quyền theo bốn vai trò — Admin, Kế toán, Sales, Thủ kho. Sales chỉ thấy phần của mình, không xem được giá vốn hay lợi nhuận.',
    },
    {
        q: 'Đang dùng Excel rời, chuyển sang có mất dữ liệu cũ không?',
        a: 'Không. Có form mẫu để import danh mục hàng hoá, khách hàng, nhà cung cấp, nhân viên và tồn đầu kỳ. Phần khởi tạo này nằm trong quá trình triển khai.',
    },
    {
        q: 'Có được hướng dẫn sử dụng không?',
        a: 'Có tài liệu hướng dẫn 45 trang với 87 ảnh minh hoạ, đi qua từng nghiệp vụ một. Ngoài ra được hỗ trợ trực tiếp trong quá trình cài đặt và khởi tạo dữ liệu ban đầu.',
    },
    {
        q: 'Chạy được trên máy Mac không?',
        a: 'Không chạy trực tiếp. Phần mềm dùng công nghệ chỉ có trên Windows. Máy Mac cần cài máy ảo Windows (Parallels, VMware, UTM) mới dùng được.',
    },
];

// ==============================
// Trang
// ==============================

export default function PhanMemBanHangPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Phần mềm Quản Lý Bán Hàng Trà Đá Data',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Windows',
        description: DESCRIPTION,
        url: `${SITE_CONFIG.url}/phan-mem-ban-hang`,
        publisher: { '@type': 'Organization', name: SITE_CONFIG.name, url: SITE_CONFIG.url },
    };

    return (
        <div className="bg-surface-50 dark:bg-surface-950">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* ===== HERO ===== */}
            <section className="relative overflow-hidden bg-gradient-to-br from-surface-900 via-surface-900 to-brand-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-brand-300 text-sm font-medium mb-6">
                            <PackageCheck className="h-4 w-4" />
                            Dành cho doanh nghiệp thương mại vừa và nhỏ
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold! text-white leading-tight mb-6">
                            Quản lý bán hàng, kho và công nợ{' '}
                            <span className="text-brand-400">trên một cơ sở dữ liệu duy nhất</span>
                        </h1>
                        <p className="text-lg text-surface-300 mb-8 leading-relaxed">
                            Giao diện Excel quen thuộc, dữ liệu tập trung trên SQL Server. Cả công ty
                            cùng nhập liệu vào một chỗ — hết cảnh mỗi người một file, cuối tháng ngồi
                            đối chiếu số lệch.
                        </p>
                        <div className="flex justify-center">
                            <ContactButtons variant="dark" />
                        </div>
                        <p className="text-sm text-fg-faint mt-6">
                            Tư vấn miễn phí · Khảo sát nghiệp vụ trước khi báo giá
                        </p>
                    </div>

                    {/* Ảnh dashboard tỉ lệ 2.66:1 — đặt full width bên dưới thì hợp
                        khổ ảnh, kẹp cạnh khối chữ sẽ bị dẹt như sợi chỉ. */}
                    <div className="mt-14 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                        <Image
                            src="/images/phan-mem/dashboard.webp"
                            alt="Dashboard quản trị kinh doanh của phần mềm"
                            width={1200}
                            height={451}
                            className="w-full h-auto"
                            priority
                            unoptimized
                        />
                    </div>
                </div>
            </section>

            {/* ===== VẤN ĐỀ ===== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-2xl md:text-4xl font-extrabold! text-fg mb-4">
                        Bạn có đang gặp những chuyện này?
                    </h2>
                    <p className="text-lg text-surface-600 dark:text-surface-400">
                        Bốn vấn đề gặp đi gặp lại ở các doanh nghiệp thương mại còn quản lý bằng Excel rời.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PAIN_POINTS.map((p) => (
                        <div key={p.title} className="p-6 rounded-2xl bg-card border border-line">
                            <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mb-4 mx-auto">
                                <p.icon className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-fg mb-2 text-center">{p.title}</h3>
                            <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed text-center">{p.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== TÍNH NĂNG ===== */}
            <section className="bg-card border-y border-line">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-2xl md:text-4xl font-extrabold! text-fg mb-4">
                            Đủ nghiệp vụ để chạy cả công ty
                        </h2>
                        <p className="text-lg text-surface-600 dark:text-surface-400 mb-6">
                            40 nghiệp vụ, bao trọn từ lúc nhập hàng tới lúc chốt lãi lỗ.
                        </p>
                        <p className="inline-flex items-center gap-2 text-sm text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-full px-4 py-1.5">
                            <Sparkles className="h-4 w-4" />
                            Mục có dấu này là nghiệp vụ phần mềm phổ thông thường không có
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURE_GROUPS.map((g) => (
                            <div key={g.title} className="p-6 rounded-2xl bg-surface-50 dark:bg-surface-950 border border-line">
                                <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                                    <g.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold text-fg mb-3">{g.title}</h3>
                                <ul className="space-y-2.5">
                                    {g.items.map((it) => (
                                        <li key={it.t} className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-400 leading-snug">
                                            {it.rare ? (
                                                <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" aria-label="Nghiệp vụ ít phần mềm có" />
                                            ) : (
                                                <Check className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                                            )}
                                            <span>{it.t}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ===== ẢNH MÀN HÌNH ===== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-2xl md:text-4xl font-extrabold! text-fg mb-4">
                        Giao diện thực tế
                    </h2>
                    <p className="text-lg text-surface-600 dark:text-surface-400">
                        Ảnh chụp từ tài liệu hướng dẫn sử dụng. Số liệu trong ảnh là dữ liệu mẫu.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    {SCREENSHOTS.map((s) => (
                        <figure key={s.src} className="group">
                            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-line bg-card shadow-sm">
                                <Image
                                    src={s.src}
                                    alt={s.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-contain"
                                    loading="lazy"
                                    unoptimized
                                />
                            </div>
                            <figcaption className="mt-3 text-sm text-surface-600 dark:text-surface-400 text-center">{s.caption}</figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            {/* ===== YÊU CẦU HỆ THỐNG ===== */}
            <section className="bg-card border-y border-line">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-2xl md:text-4xl font-extrabold! text-fg mb-4">
                            Yêu cầu hệ thống
                        </h2>
                        <p className="text-lg text-surface-600 dark:text-surface-400">
                            Nói trước cho rõ để bạn khỏi mất thời gian nếu không phù hợp.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl border border-line">
                            <Monitor className="h-6 w-6 text-brand-600 dark:text-brand-400 mb-3" />
                            <h3 className="font-bold text-fg mb-2">Máy nhân viên</h3>
                            <p className="text-sm text-surface-600 dark:text-surface-400">Windows, Microsoft Excel 2016 trở lên.</p>
                        </div>
                        <div className="p-6 rounded-2xl border border-line">
                            <Database className="h-6 w-6 text-brand-600 dark:text-brand-400 mb-3" />
                            <h3 className="font-bold text-fg mb-2">Máy chủ dữ liệu</h3>
                            <p className="text-sm text-surface-600 dark:text-surface-400">SQL Server 2014 trở lên, dùng được cả bản Express miễn phí.</p>
                        </div>
                        <div className="p-6 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-900/10">
                            <X className="h-6 w-6 text-amber-600 dark:text-amber-500 mb-3" />
                            <h3 className="font-bold text-fg mb-2">Không chạy trên macOS / Linux</h3>
                            <p className="text-sm text-surface-600 dark:text-surface-400">Máy Mac cần cài máy ảo Windows mới dùng được.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <h2 className="text-2xl md:text-4xl font-extrabold! text-fg mb-10 text-center">
                    Câu hỏi thường gặp
                </h2>
                <div className="space-y-4">
                    {FAQ.map((f) => (
                        <details key={f.q} className="group rounded-2xl bg-card border border-line p-6">
                            <summary className="font-semibold text-fg cursor-pointer list-none flex items-center justify-between gap-4">
                                {f.q}
                                <span className="text-brand-600 dark:text-brand-400 shrink-0 transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                            </summary>
                            <p className="mt-4 text-surface-600 dark:text-surface-400 leading-relaxed">{f.a}</p>
                        </details>
                    ))}
                </div>
            </section>

            {/* ===== CTA CUỐI ===== */}
            <section id="lien-he" className="bg-card border-t border-line">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold! text-fg mb-4">
                                Để lại thông tin, mình gọi lại tư vấn
                            </h2>
                            <p className="text-surface-600 dark:text-surface-400 mb-6 leading-relaxed">
                                Mỗi doanh nghiệp một cách làm khác nhau, nên trước khi báo giá mình muốn nghe
                                bạn đang vận hành thế nào và vướng ở đâu. Không ràng buộc gì cả.
                            </p>
                            <p className="text-surface-600 dark:text-surface-400 mb-8">Hoặc liên hệ trực tiếp:</p>
                            <ContactButtons />
                        </div>
                        <div className="p-6 md:p-8 rounded-2xl bg-surface-50 dark:bg-surface-950 border border-line">
                            <LeadForm />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
