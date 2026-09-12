'use client';

import { useId, useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2, AlertTriangle, Upload } from 'lucide-react';
import { CHUAN_ANH, type LoaiAnhThuongHieu } from '@/lib/brand';

/**
 * Một ô ảnh thương hiệu trong tab "Thương hiệu" của trang cài đặt.
 *
 * Vài điểm cố ý, đừng "dọn" mất:
 *
 * - Khung xem trước KHOÁ TỈ LỆ sẵn, nên đổi ảnh không làm nhảy layout.
 * - Logo xem trên nền sáng VÀ nền tối cạnh nhau. Site có chế độ tối, mà logo
 *   nền trắng chỉ lộ ra khi đặt cạnh nền tối — xem trên một nền thì không bao
 *   giờ thấy.
 * - Lỗi và cảnh báo nằm NGAY DƯỚI ô kèm cách sửa, có `role="alert"`. Trang cài
 *   đặt cũ báo mọi thứ bằng `alert()` của trình duyệt: cách đó cướp tiêu điểm
 *   bàn phím và không nói được lỗi thuộc về ô nào.
 * - Kéo-thả chỉ là BỔ SUNG. Nút chọn file mới là đường chính, vì thao tác chỉ
 *   làm được bằng kéo-thả thì không dùng được bằng bàn phím (WCAG 2.2 AA).
 * - Kích thước ảnh kiểm TRƯỚC khi tải lên và chỉ CẢNH BÁO, không chặn: ảnh
 *   lệch chuẩn vẫn dùng được, chỉ kém sắc nét hơn.
 */

type Props = {
    loai: LoaiAnhThuongHieu;
    url: string;
    dangLuu: boolean;
    onChange: (url: string, ogUrl?: string | null) => void;
};

/** Ảnh lệch quá ngần này so với tỉ lệ chuẩn thì cảnh báo. */
const SAI_SO_TI_LE = 0.03;

export function BrandAssetField({ loai, url, dangLuu, onChange }: Props) {
    const chuan = CHUAN_ANH[loai];
    const laLogo = loai === 'logo' || loai === 'logo-toi';
    const idO = useId();
    const inputRef = useRef<HTMLInputElement>(null);

    const [dangTai, setDangTai] = useState(false);
    const [loi, setLoi] = useState<string | null>(null);
    const [canhBao, setCanhBao] = useState<string | null>(null);
    const [keo, setKeo] = useState(false);

    /** Đọc kích thước thật của ảnh ngay trên trình duyệt, trước khi gửi đi. */
    const doKichThuoc = (file: File) =>
        new Promise<{ rong: number; cao: number } | null>((resolve) => {
            const img = new window.Image();
            const blob = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(blob);
                resolve({ rong: img.naturalWidth, cao: img.naturalHeight });
            };
            img.onerror = () => {
                URL.revokeObjectURL(blob);
                resolve(null);
            };
            img.src = blob;
        });

    const soanCanhBao = (file: File, kt: { rong: number; cao: number } | null): string | null => {
        const y: string[] = [];
        if (kt) {
            const tiLeChuan = chuan.rong / chuan.cao;
            const tiLeThat = kt.rong / kt.cao;
            if (Math.abs(tiLeThat - tiLeChuan) / tiLeChuan > SAI_SO_TI_LE) {
                y.push(`ảnh ${kt.rong}×${kt.cao} lệch tỉ lệ chuẩn ${chuan.rong}×${chuan.cao} nên sẽ bị cắt bớt`);
            } else if (kt.rong < chuan.rong) {
                y.push(`ảnh ${kt.rong}×${kt.cao} nhỏ hơn ${chuan.rong}×${chuan.cao} nên sẽ hơi mờ trên màn hình nét cao`);
            }
        }
        const kb = file.size / 1024;
        if (kb > chuan.kbToiDa * 4) {
            y.push(`file ${(kb / 1024).toFixed(1)}MB khá nặng, hệ thống sẽ tự nén lại`);
        }
        return y.length
            ? `${y.join('; ')}. Vẫn tải lên được — muốn đẹp nhất thì xuất lại đúng ${chuan.rong}×${chuan.cao}.`
            : null;
    };

    const tai = async (file: File) => {
        setLoi(null);
        setCanhBao(null);
        setDangTai(true);
        try {
            setCanhBao(soanCanhBao(file, await doKichThuoc(file)));

            const form = new FormData();
            form.append('file', file);
            form.append('loai', loai);

            const dieuKhien = new AbortController();
            const hetGio = setTimeout(() => dieuKhien.abort(), 60000);
            const res = await fetch('/api/admin/brand/upload', {
                method: 'POST',
                body: form,
                signal: dieuKhien.signal,
            });
            clearTimeout(hetGio);

            const data = await res.json();
            if (!res.ok || !data.url) {
                setLoi(data.error || 'Tải ảnh lên thất bại. Thử lại hoặc chọn file khác.');
                return;
            }
            onChange(data.url, data.ogUrl);
        } catch (e) {
            setLoi(
                e instanceof DOMException && e.name === 'AbortError'
                    ? 'Tải quá 60 giây nên đã dừng. Kiểm tra mạng rồi thử lại.'
                    : 'Không gửi được file lên máy chủ. Kiểm tra mạng rồi thử lại.'
            );
        } finally {
            setDangTai(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const khoa = dangTai || dangLuu;

    return (
        <section className="rounded-2xl border border-line bg-card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-fg">
                    {chuan.nhan}
                    {chuan.tuyChon && (
                        <span className="ml-2 text-xs font-normal text-fg-subtle">(tuỳ chọn)</span>
                    )}
                </h3>
                <span className="text-xs font-medium tabular-nums text-fg-subtle">
                    {chuan.rong}×{chuan.cao} · {chuan.dinhDang} · tối đa {chuan.kbToiDa} KB
                </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-fg-subtle">{chuan.moTa}</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
                {laLogo ? (
                    <div className="flex gap-3">
                        {[
                            { nen: 'bg-white', vien: 'ring-surface-200', nhan: 'Nền sáng' },
                            { nen: 'bg-surface-900', vien: 'ring-surface-700', nhan: 'Nền tối' },
                        ].map((k) => (
                            <div key={k.nhan} className="text-center">
                                <div
                                    className={`flex h-20 w-20 items-center justify-center rounded-xl ${k.nen} ring-1 ${k.vien}`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={url}
                                        alt=""
                                        width={48}
                                        height={48}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                </div>
                                <span className="mt-1 block text-[11px] text-fg-subtle">{k.nhan}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        className="w-full overflow-hidden rounded-xl bg-sunken ring-1 ring-line sm:w-72"
                        style={{ aspectRatio: `${chuan.rong} / ${chuan.cao}` }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="h-full w-full object-cover" />
                    </div>
                )}

                <div>
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setKeo(true);
                        }}
                        onDragLeave={() => setKeo(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setKeo(false);
                            const f = e.dataTransfer.files?.[0];
                            if (f) tai(f);
                        }}
                        className={`rounded-xl border border-dashed p-4 transition-colors ${keo ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-line'
                            }`}
                    >
                        <div className="flex flex-wrap items-center gap-2">
                            <label
                                htmlFor={idO}
                                className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700 ${khoa ? 'pointer-events-none opacity-50' : ''
                                    }`}
                            >
                                {dangTai ? (
                                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                ) : (
                                    <Upload className="h-4 w-4" aria-hidden="true" />
                                )}
                                {dangTai ? 'Đang tải lên…' : 'Tải ảnh lên'}
                            </label>
                            <input
                                ref={inputRef}
                                id={idO}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                disabled={khoa}
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) tai(f);
                                }}
                                className="sr-only"
                            />
                            <span className="text-xs text-fg-subtle">hoặc kéo thả ảnh vào đây</span>
                            {url !== chuan.macDinh && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLoi(null);
                                        setCanhBao(null);
                                        onChange(chuan.macDinh);
                                    }}
                                    disabled={khoa}
                                    className="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm text-fg-muted transition-colors hover:bg-sunken hover:text-fg disabled:opacity-50"
                                >
                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                    Về mặc định
                                </button>
                            )}
                        </div>
                    </div>

                    <label htmlFor={`${idO}-url`} className="mt-3 block text-xs font-medium text-fg-muted">
                        Hoặc dán sẵn đường dẫn ảnh
                    </label>
                    <input
                        id={`${idO}-url`}
                        type="url"
                        value={url}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={khoa}
                        className="mt-1 w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 font-mono text-xs dark:border-surface-700 dark:bg-surface-800"
                    />

                    {canhBao && (
                        <p role="alert" className="mt-2 flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            <span>{canhBao}</span>
                        </p>
                    )}
                    {loi && (
                        <p role="alert" className="mt-2 flex items-start gap-1.5 text-xs text-red-600 dark:text-red-400">
                            <ImagePlus className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            <span>{loi}</span>
                        </p>
                    )}
                    {loai === 'banner' && (
                        <p className="mt-2 text-xs text-fg-subtle">
                            Tải banner lên sẽ tự tạo luôn ảnh chia sẻ mạng xã hội bằng cách cắt giữa về{' '}
                            {CHUAN_ANH.og.rong}×{CHUAN_ANH.og.cao}.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
