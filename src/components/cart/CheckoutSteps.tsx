import { Check } from 'lucide-react';

/**
 * Thanh chỉ bước của luồng mua hàng.
 *
 * Website bán hàng KHÔNG có cổng thanh toán — khách chuyển khoản tay rồi admin
 * duyệt. Khách không biết điều đó là bỏ giỏ ngay ở bước điền thông tin, nên
 * bốn bước phải hiện rõ từ đầu, kể cả bước cuối là "chờ admin duyệt".
 *
 * Dùng ở /cart, /checkout/create và /checkout/[order_code].
 */

const STEPS = [
    { id: 1, label: 'Giỏ hàng' },
    { id: 2, label: 'Thông tin' },
    { id: 3, label: 'Chuyển khoản' },
    { id: 4, label: 'Mở khoá' },
] as const;

export function CheckoutSteps({ current }: { current: 1 | 2 | 3 | 4 }) {
    return (
        <nav aria-label="Tiến trình đặt hàng" className="mb-8">
            <ol className="flex items-center gap-2 sm:gap-3">
                {STEPS.map((step, idx) => {
                    const done = step.id < current;
                    const active = step.id === current;
                    return (
                        <li key={step.id} className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <span
                                aria-current={active ? 'step' : undefined}
                                className={`flex items-center gap-2 shrink-0 ${active ? 'text-fg' : done ? 'text-brand-600 dark:text-brand-400' : 'text-fg-subtle'
                                    }`}
                            >
                                <span
                                    className={`grid place-items-center h-7 w-7 shrink-0 rounded-full text-xs font-bold ${done
                                        ? 'bg-brand-600 text-white'
                                        : active
                                            ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500'
                                            : 'bg-sunken text-fg-subtle'
                                        }`}
                                >
                                    {done ? <Check className="h-4 w-4" aria-hidden="true" /> : step.id}
                                </span>
                                {/* Màn hẹp chỉ hiện nhãn của bước đang làm, tránh vỡ hàng */}
                                <span className={`text-sm font-medium whitespace-nowrap ${active ? 'inline' : 'hidden sm:inline'}`}>
                                    {step.label}
                                </span>
                            </span>
                            {idx < STEPS.length - 1 && (
                                <span
                                    aria-hidden="true"
                                    className={`h-px w-4 sm:w-8 shrink-0 ${done ? 'bg-brand-500' : 'bg-line'}`}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
