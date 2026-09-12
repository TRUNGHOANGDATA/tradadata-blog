'use client';

import { usePathname } from 'next/navigation';

/**
 * Vo boc client: AN con (Footer, FloatingActions) o mot so route.
 * Dung de render co dieu kien ma khong import truc tiep (chung co the la
 * server component).
 *
 * - /admin: trang quan tri, khong can footer/nut lien he.
 * - /thuc-hanh: bang tinh chiem tron chieu cao man hinh (h-[calc(100vh-4rem)]),
 *   footer nam duoi fold la thua; con hai nut noi Zalo/Messenger thi DE LEN o
 *   tinh o goc phai duoi — dung cho nguoi ta dang go cong thuc.
 */
const ROUTE_AN = ['/admin', '/thuc-hanh'];

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    if (ROUTE_AN.some((r) => pathname === r || pathname.startsWith(`${r}/`))) return null;

    return <>{children}</>;
}
