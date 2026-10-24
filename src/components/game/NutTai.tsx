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
                className="m-auto max-h-[94dvh] w-[min(94vw,600px)] overflow-y-auto rounded-3xl border-2 border-[#60a5fa] bg-[#0c1440] p-0 text-[#eef1ff] shadow-[0_0_80px_rgba(59,130,246,.45)] backdrop:bg-[rgba(3,6,20,.88)] backdrop:backdrop-blur-md"
            >
                <div className="p-5 sm:p-7">
                    <h2 id="ung-ho-tieu-de" className="flex items-center justify-center gap-2.5 text-center text-2xl font-extrabold sm:text-3xl">
                        <HeartHandshake className="h-8 w-8 shrink-0 text-pink-400" aria-hidden="true" /> Ủng hộ nhóm dịch
                    </h2>
                    <p className={`mt-3 text-center text-sm leading-relaxed sm:text-base ${CHU_PHU}`}>
                        Bản Việt hoá <b className="text-white">{boDuoiVietHoa(tenGame)}</b> tốn của nhóm dịch rất nhiều buổi tối để dịch,
                        chơi thử và vá lỗi theo từng bản cập nhật. Phần lớn người tải chưa ủng hộ — không có ai ủng hộ
                        thì nhóm không làm tiếp được game sau.
                    </p>

                    {ungHo && (
                        <>
                            <div className="mt-5 flex flex-col items-center">
                                {/* eslint-disable-next-line @next/next/no-img-element -- ảnh QR từ img.vietqr.io, không cần qua optimizer */}
                                <img src={ungHo.qr} alt={`Mã QR ủng hộ bản Việt hoá ${boDuoiVietHoa(tenGame)}`} width={260} height={260} className="h-auto w-[min(70vw,260px)] rounded-2xl bg-white p-2 ring-4 ring-[#60a5fa]/60" />
                                <p className="mt-3 text-3xl font-extrabold text-amber-300">
                                    {ungHo.soTien ? `${ungHo.soTien.toLocaleString('vi-VN')}đ` : 'Tuỳ tâm'}
                                </p>
                                <p className={`text-sm ${CHU_PHU}`}>Mở app ngân hàng → Quét mã QR trong lúc chờ</p>
                            </div>
                            <dl className={`mt-4 space-y-1 px-4 py-3 text-sm ${O_TOI}`}>
                                {([
                                    ['Ngân hàng', ungHo.bankId],
                                    ['Số tài khoản', ungHo.accountNo],
                                    ['Chủ tài khoản', ungHo.accountName],
                                ] as const).filter(([, v]) => v).map(([nhan, v]) => (
                                    <div key={nhan} className="flex justify-between gap-3">
                                        <dt className={CHU_PHU}>{nhan}</dt>
                                        <dd className="text-right font-semibold">{v}</dd>
                                    </div>
                                ))}
                            </dl>
                        </>
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
