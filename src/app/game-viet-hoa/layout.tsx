/**
 * Nền tối riêng cho tab Game Việt hoá. Chỉ segment này dùng — phần còn lại của
 * site giữ nguyên. Header/Footer tối theo nhờ ROUTE_LUON_TOI (src/lib/constants.ts).
 *
 * Nền là background của khối bọc, KHÔNG dùng `position: fixed`: lớp fixed sẽ đè
 * lên Footer (nằm ngoài segment này, trong layout gốc).
 * ĐỪNG thêm loading.tsx cho segment này — xem CLAUDE.md, nó gây soft 404.
 */
export default function GameVietHoaLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="min-h-screen bg-[#070b24] bg-cover bg-center bg-no-repeat text-[#eef1ff] md:bg-fixed"
            style={{
                backgroundImage:
                    'radial-gradient(ellipse 60% 70% at 50% 45%, rgba(7,11,36,.55), transparent 75%), url(/images/game-viet-hoa/nen.webp)',
            }}
        >
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </div>
    );
}
