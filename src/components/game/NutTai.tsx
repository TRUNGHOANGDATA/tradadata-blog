'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Download, HeartHandshake, Hourglass } from 'lucide-react';
import { O_TOI, CHU_PHU, boDuoiVietHoa } from '@/components/game/kieu';

type UngHo = {
    qr: string;
    soTien: number | null;
    bankId: string;
    accountNo: string;
    accountName: string;
};

/** Trạng thái lấy vé ở /api/game-viet-hoa/[slug]/tai. */
type Ve = { trangThai: 'dang-lay' } | { trangThai: 'loi' } | { trangThai: 'co'; ve: string; conLai: number };

/**
 * Các nút tải patch. MỖI lần bấm đều mở hộp nhắc ủng hộ kèm QR, và nút "Tiếp tục
 * tải" chỉ mở sau thời gian chờ do server quy định. Link thật KHÔNG có ở client
 * (chỉ có nhãn) — server chỉ redirect tới link khi vé đã đủ tuổi, nên sửa trang
 * hay tắt JS cũng không bỏ qua được bước chờ. Tải vẫn miễn phí sau khi chờ.
 */
export function NutTai({
    slug,
    links,
    ungHo,
    tenGame,
    phienBanGame,
    postSlug,
}: {
    slug: string;
    /** Chỉ nhãn — cố ý không nhận URL. */
    links: { nhan: string }[];
    ungHo: UngHo | null;
    tenGame: string;
    phienBanGame: string | null;
    postSlug: string | null;
}) {
    const hop = useRef<HTMLDialogElement>(null);
    const [dangChon, setDangChon] = useState<number | null>(null);
    const [ve, setVe] = useState<Ve>({ trangThai: 'dang-lay' });
    const [linkChinh, ...linkPhu] = links;

    // Đếm ngược mỗi giây khi đã có vé.
    const conLai = ve.trangThai === 'co' ? ve.conLai : null;
    useEffect(() => {
        if (conLai === null || conLai <= 0) return;
        const id = setTimeout(() => setVe((v) => (v.trangThai === 'co' ? { ...v, conLai: v.conLai - 1 } : v)), 1000);
        return () => clearTimeout(id);
    }, [conLai]);

    if (!linkChinh) return null;

    const mo = async (i: number) => {
        setDangChon(i);
        setVe({ trangThai: 'dang-lay' });
        hop.current?.showModal();
        try {
            const r = await fetch(`/api/game-viet-hoa/${encodeURIComponent(slug)}/tai?i=${i}`, { method: 'POST' });
            if (!r.ok) throw new Error(String(r.status));
            const { ve: v, choGiay } = (await r.json()) as { ve: string; choGiay: number };
            setVe({ trangThai: 'co', ve: v, conLai: choGiay });
        } catch {
            setVe({ trangThai: 'loi' });
        }
    };

    const dong = () => {
        hop.current?.close();
        setDangChon(null);
    };

    const sanSang = ve.trangThai === 'co' && ve.conLai <= 0;

    return (
        <>
            <button
                type="button"
                onClick={() => mo(0)}
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-[#7aa8ff] bg-gradient-to-b from-[#4f8ff7] to-[#2563eb] font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,.45)] transition hover:brightness-110"
            >
                <Download className="h-5 w-5" aria-hidden="true" /> Tải patch Việt hoá{linkPhu.length ? ` (${linkChinh.nhan})` : ''}
            </button>
            {linkPhu.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {linkPhu.map((l, k) => (
                        <button
                            key={`${l.nhan}-${k}`}
                            type="button"
                            onClick={() => mo(k + 1)}
                            className={`inline-flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-sm hover:border-[rgba(130,160,255,.55)] ${O_TOI}`}
                        >
                            <Download className="h-4 w-4" aria-hidden="true" /> {l.nhan}
                        </button>
                    ))}
                </div>
            )}

            <dialog
                ref={hop}
                aria-labelledby="ung-ho-tieu-de"
                // Esc / đóng hộp chỉ là KHÔNG tải — không bỏ qua được bước chờ.
                onClose={() => setDangChon(null)}
                className="m-auto w-[min(92vw,460px)] rounded-2xl border border-[rgba(110,140,255,.4)] bg-[#0c1440] p-0 text-[#eef1ff] shadow-[0_20px_60px_rgba(0,0,0,.6)] backdrop:bg-[rgba(3,6,20,.75)] backdrop:backdrop-blur-sm"
            >
                <div className="p-5 sm:p-6">
                    <h2 id="ung-ho-tieu-de" className="flex items-center gap-2.5 text-lg font-bold">
                        <HeartHandshake className="h-5 w-5 shrink-0 text-[#60a5fa]" aria-hidden="true" /> Một chút trước khi tải
                    </h2>
                    <p className={`mt-2 text-sm leading-relaxed ${CHU_PHU}`}>
                        Bản Việt hoá <b className="text-white">{boDuoiVietHoa(tenGame)}</b> hoàn toàn miễn phí. Nhóm dịch bỏ ra nhiều buổi tối
                        để dịch, chơi thử và vá lỗi theo từng bản cập nhật của game. Nếu bản dịch giúp bạn chơi vui hơn,
                        một ly trà đá ủng hộ sẽ giúp nhóm có thêm động lực làm game tiếp theo.
                    </p>

                    {ungHo && (
                        <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                            {/* eslint-disable-next-line @next/next/no-img-element -- ảnh QR từ img.vietqr.io, không cần qua optimizer */}
                            <img src={ungHo.qr} alt={`Mã QR ủng hộ bản Việt hoá ${boDuoiVietHoa(tenGame)}`} width={160} height={160} className="shrink-0 rounded-xl bg-white p-1.5" />
                            <dl className="w-full space-y-1 text-sm">
                                {([
                                    ['Ngân hàng', ungHo.bankId],
                                    ['Số tài khoản', ungHo.accountNo],
                                    ['Chủ tài khoản', ungHo.accountName],
                                    ['Mức ủng hộ', ungHo.soTien ? `${ungHo.soTien.toLocaleString('vi-VN')}đ` : 'Tuỳ tâm'],
                                ] as const).filter(([, v]) => v).map(([nhan, v]) => (
                                    <div key={nhan} className="flex justify-between gap-3">
                                        <dt className={CHU_PHU}>{nhan}</dt>
                                        <dd className="text-right font-semibold">{v}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    <div className={`mt-4 space-y-1.5 rounded-xl border border-amber-400/40 bg-amber-400/[.08] px-3.5 py-2.5 text-xs leading-relaxed text-amber-200`}>
                        <p>
                            Patch chỉ là bản dịch — cần game bản quyền
                            {phienBanGame ? <> đúng phiên bản <b>{phienBanGame}</b></> : null} thì mới cài được.
                        </p>
                        <p>Sao lưu thư mục game trước khi chép đè file Việt hoá.</p>
                    </div>

                    <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row">
                        {postSlug && (
                            <Link href={`/blog/${postSlug}`} onClick={dong} className={`inline-flex h-11 items-center sm:flex-1 justify-center gap-2 text-sm font-semibold hover:border-[rgba(130,160,255,.55)] ${O_TOI}`}>
                                <BookOpen className="h-4 w-4" aria-hidden="true" /> Hướng dẫn cài
                            </Link>
                        )}
                        {dangChon !== null && sanSang && ve.trangThai === 'co' ? (
                            <a
                                href={`/api/game-viet-hoa/${encodeURIComponent(slug)}/tai?i=${dangChon}&ve=${encodeURIComponent(ve.ve)}`}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                onClick={() => setTimeout(dong, 0)}
                                autoFocus
                                className="inline-flex h-11 items-center sm:flex-1 justify-center gap-2 rounded-xl bg-gradient-to-b from-[#4f8ff7] to-[#2563eb] text-sm font-semibold text-white hover:brightness-110"
                            >
                                <Download className="h-4 w-4" aria-hidden="true" /> Tiếp tục tải
                            </a>
                        ) : (
                            <button
                                type="button"
                                disabled={ve.trangThai !== 'loi'}
                                onClick={() => dangChon !== null && mo(dangChon)}
                                aria-live="polite"
                                className="inline-flex h-11 items-center sm:flex-1 justify-center gap-2 rounded-xl border border-[rgba(110,140,255,.35)] bg-white/5 text-sm font-semibold text-[#c7d0f5] enabled:hover:bg-white/10 disabled:cursor-wait"
                            >
                                <Hourglass className="h-4 w-4" aria-hidden="true" />
                                {ve.trangThai === 'loi'
                                    ? 'Không lấy được link — thử lại'
                                    : ve.trangThai === 'dang-lay'
                                        ? 'Đang chuẩn bị link…'
                                        : `Tải được sau ${ve.conLai} giây`}
                            </button>
                        )}
                    </div>
                    <button type="button" onClick={dong} className={`mt-3 w-full text-center text-xs underline-offset-2 hover:underline ${CHU_PHU}`}>
                        Để sau
                    </button>
                </div>
            </dialog>
        </>
    );
}
