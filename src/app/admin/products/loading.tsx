'use client';
import AdminTableLoading from '@/components/admin/AdminTableLoading';
export default function ProductsLoading() {
    return <AdminTableLoading showStats statsCount={3} cols={5} rows={6} />;
}
