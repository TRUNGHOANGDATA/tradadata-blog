'use client';

import { useEffect, useState } from 'react';
import { loiThanhChu } from '@/lib/errors';
import { Phone, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface SocialLinks {
    zalo?: string;
    facebook?: string;
    phone?: string;
    email?: string;
}

/**
 * Nút liên hệ — đọc động từ /api/settings giống FloatingActions, KHÔNG hardcode.
 * Đổi số/link trong trang admin là landing page tự đổi theo.
 */
export function ContactButtons({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
    const [links, setLinks] = useState<SocialLinks>({});

    useEffect(() => {
        fetch('/api/settings')
            .then((r) => r.json())
            .then((d) => setLinks(d?.settings?.social_links || {}))
            .catch(() => { });
    }, []);

    const base =
        'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors shadow-sm';
    const ghost =
        variant === 'dark'
            ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            : 'bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-100 border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700';

    return (
        <div className="flex flex-wrap gap-3">
            {links.phone && (
                <a href={`tel:${links.phone.replace(/[^0-9+]/g, '')}`} className={`${base} bg-brand-600 text-white hover:bg-brand-700`}>
                    <Phone className="h-5 w-5" />
                    Gọi {links.phone}
                </a>
            )}
            {links.zalo && (
                <a href={links.zalo} target="_blank" rel="noopener noreferrer" className={`${base} ${ghost}`}>
                    <img src="/zalo.svg" alt="" className="h-5 w-5" />
                    Nhắn Zalo
                </a>
            )}
            {links.facebook && (
                <a href={links.facebook} target="_blank" rel="noopener noreferrer" className={`${base} ${ghost}`}>
                    <img src="/messenger.svg" alt="" className="h-5 w-5" />
                    Nhắn Messenger
                </a>
            )}
        </div>
    );
}

type Status = 'idle' | 'sending' | 'ok' | 'error';

/**
 * Form để lại thông tin. Gửi về /api/leads — lưu DB và bắn mail báo admin.
 */
export function LeadForm() {
    const [status, setStatus] = useState<Status>('idle');
    const [message, setMessage] = useState('');

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (status === 'sending') return;

        const form = e.currentTarget;
        const data = new FormData(form);
        const payload = {
            full_name: String(data.get('full_name') || '').trim(),
            phone: String(data.get('phone') || '').trim(),
            company: String(data.get('company') || '').trim(),
            note: String(data.get('note') || '').trim(),
        };

        if (!payload.full_name || !payload.phone) {
            setStatus('error');
            setMessage('Vui lòng điền họ tên và số điện thoại.');
            return;
        }

        setStatus('sending');
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || 'Gửi không thành công');
            setStatus('ok');
            setMessage('Đã nhận thông tin. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.');
            form.reset();
        } catch (err) {
            setStatus('error');
            setMessage(loiThanhChu(err));
        }
    }

    if (status === 'ok') {
        return (
            <div className="rounded-2xl border border-brand-200 dark:border-brand-900/40 bg-brand-50 dark:bg-brand-900/10 p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-brand-600 dark:text-brand-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-fg mb-2">Đã gửi thành công</h3>
                <p className="text-surface-600 dark:text-surface-400">{message}</p>
            </div>
        );
    }

    const input =
        'w-full px-4 py-3 rounded-xl bg-card border border-surface-300 dark:border-surface-700 text-fg placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50';

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                        Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input id="full_name" name="full_name" required className={input} placeholder="Nguyễn Văn A" />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                        Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input id="phone" name="phone" required inputMode="tel" className={input} placeholder="09xx xxx xxx" />
                </div>
            </div>
            <div>
                <label htmlFor="company" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                    Tên công ty / cửa hàng
                </label>
                <input id="company" name="company" className={input} placeholder="Không bắt buộc" />
            </div>
            <div>
                <label htmlFor="note" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                    Bạn đang gặp khó khăn gì?
                </label>
                <textarea id="note" name="note" rows={3} className={input} placeholder="Ví dụ: đang dùng Excel rời, không kiểm soát được công nợ và tồn kho ở 2 chi nhánh." />
            </div>

            {status === 'error' && (
                <p className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-px" />
                    {message}
                </p>
            )}

            <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold transition-colors shadow-lg"
            >
                {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                {status === 'sending' ? 'Đang gửi...' : 'Gửi thông tin, nhận tư vấn'}
            </button>
            <p className="text-xs text-fg-subtle text-center">
                Thông tin chỉ dùng để liên hệ tư vấn, không chia sẻ cho bên thứ ba.
            </p>
        </form>
    );
}
