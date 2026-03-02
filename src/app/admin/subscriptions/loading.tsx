'use client';
import AdminTableLoading from '@/components/admin/AdminTableLoading';
export default function SubscriptionsLoading() {
    return <AdminTableLoading showStats statsCount={3} cols={4} rows={8} />;
}
