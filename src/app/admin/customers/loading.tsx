'use client';
import AdminTableLoading from '@/components/admin/AdminTableLoading';
export default function CustomersLoading() {
    return <AdminTableLoading showStats statsCount={3} cols={5} rows={8} />;
}
