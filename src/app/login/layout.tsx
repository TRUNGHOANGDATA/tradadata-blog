import type { Metadata } from 'next';

// `login/page.tsx` la Client Component nen KHONG khai duoc `metadata` trong no.
// Dat o layout cua route la cach chinh thong de van co tieu de rieng.
export const metadata: Metadata = {
    title: 'Đăng nhập',
    description: 'Đăng nhập bằng Google để lưu bài viết và mở nội dung Premium.',
    // Trang dang nhap khong co gia tri tim kiem
    robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return children;
}
