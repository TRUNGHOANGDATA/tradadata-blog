import type { Metadata } from 'next';

// `profile/page.tsx` la Client Component nen KHONG khai duoc `metadata` trong no.
export const metadata: Metadata = {
    title: 'Tài khoản của tôi',
    description: 'Quản lý tài khoản, gói Premium và bài viết đã lưu.',
    // Trang ca nhan: khong index
    robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return children;
}
