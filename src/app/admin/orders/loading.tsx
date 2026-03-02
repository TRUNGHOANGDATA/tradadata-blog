'use client';
import AdminTableLoading from '@/components/admin/AdminTableLoading';

export default function OrdersLoading() {
    return <AdminTableLoading cols={5} rows={6} showStats={true} statsCount={4} />;
}
