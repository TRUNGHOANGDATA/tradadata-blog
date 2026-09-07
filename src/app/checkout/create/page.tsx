import { Suspense } from 'react';
import CheckoutForm from './CheckoutForm';
import { CheckoutSteps } from '@/components/cart/CheckoutSteps';

export const metadata = {
    title: 'Thanh toán',
};

export default function CheckoutCreatePage() {
    return (
        <div className="min-h-screen bg-page py-12 px-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
                <CheckoutSteps current={2} />
            </div>
            <div className="w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl shadow-xl shadow-brand-500/5 border border-brand-100 dark:border-surface-800 overflow-hidden">
                <div className="p-6 text-center bg-brand-50/50 dark:bg-surface-800/50 border-b border-brand-100 dark:border-surface-800">
                    <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                        Thông tin đăng ký
                    </h1>
                    <p className="text-sm text-fg-subtle mt-1">
                        Vui lòng điền thông tin để tiếp tục
                    </p>
                </div>
                <div className="p-6">
                    <Suspense fallback={<div className="text-center py-8 text-fg-subtle">Đang tải biểu mẫu...</div>}>
                        <CheckoutForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
