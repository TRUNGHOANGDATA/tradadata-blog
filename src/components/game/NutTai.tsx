'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Download, HeartHandshake, X } from 'lucide-react';
// Chỉ import KIỂU từ lib/data — import giá trị là kéo supabase/server vào trình duyệt.
import type { LinkTai } from '@/lib/data/game-viet-hoa';
import { O_TOI, CHU_PHU, boDuoiVietHoa } from '@/components/game/kieu';

/** Mỗi phiên trình duyệt chỉ nhắc ủng hộ MỘT lần — lần bấm sau tải thẳng, đỡ phiền. */
const KHOA_DA_NHAC = 'tdd-game-ung-ho-da-nhac';

type UngHo = {
    qr: string;
    soTien: number | null;
    bankId: string;
    accountNo: string;
    accountName: string;
};

/**
 * Các nút tải patch. Có cấu hình tài khoản (`ungHo`) thì lần bấm đầu mở hộp nhắc
 * ủng hộ kèm QR, bấm "Tiếp tục tải" mới mở link — KHÔNG bao giờ chặn tải.
 * Vẫn là thẻ <a href> thật nên tắt JS hay hộp lỗi thì link vẫn tải bình thường.
 */
export function NutTai({
    links,
    ungHo,
    tenGame,
    phienBanGame,
    postSlug,
}: {
    links: LinkTai[];
    ungHo: UngHo | null;
    tenGame: string;
    phienBanGame: string | null;
    postSlug: string | null;
}) {
    const hop = useRef<HTMLDialogElement>(null);
    const [dangChon, setDangChon] = useState<LinkTai | null>(null);
    const [linkChinh, ...linkPhu] = links;
    if (!linkChinh) return null;

    const bam = (e: React.MouseEvent, l: LinkTai) => {
        if (!ungHo || !hop.current) return;
        let daNhac = false;
        try {
            daNhac = sessionStorage.getItem(KHOA_DA_NHAC) === '1';
            sessionStorage.setItem(KHOA_DA_NHAC, '1');
        } catch {
            // Trình duyệt chặn storage: vẫn nhắc, chỉ là không nhớ được.
        }
        if (daNhac) return;
        e.preventDefault();
        setDangChon(l);
        hop.current.showModal();
    };

    const dong = () => hop.current?.close();

    return (
        <>
            <a
                href={linkChinh.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={(e) => bam(e, linkChinh)}
                className="flex h-12 items-center justify-center gap-2.5 rounded-xl border border-[#7aa8ff] bg-gradient-to-b from-[#4f8ff7] to-[#2563eb] font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,.45)] transition hover:brightness-110"
            >
                <Download className="h-5 w-5" aria-hidden="true" /> Tải patch Việt hoá{linkPhu.length ? ` (${linkChinh.nhan})` : ''}
            </a>
            {linkPhu.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {linkPhu.map((l) => (
                        <a
                            key={l.url}
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            onClick={(e) => bam(e, l)}
                            className={`inline-flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-sm hover:border-[rgba(130,160,255,.55)] ${O_TOI}`}
                        >
                            <Download className="h-4 w-4" aria-hidden="true" /> {l.nhan}
                        </a>
                    ))}
                </div>
            )}

            {ungHo && (
                <dialog
                    ref={hop}
                    aria-labelledby="ung-ho-tieu-de"
                    // Bấm ra vùng tối ngoài hộp thì đóng.
                    onClick={(e) => { if (e.target === e.currentTarget) dong(); }}
                    className="m-auto w-[min(92vw,460px)] rounded-2xl border border-[rgba(110,140,255,.4)] bg-[#0c1440] p-0 text-[#eef1ff] shadow-[0_20px_60px_rgba(0,0,0,.6)] backdrop:bg-[rgba(3,6,20,.75)] backdrop:backdrop-blur-sm"
                >
                    <div className="relative p-5 sm:p-6">
                        <button type="button" onClick={dong} aria-label="Đóng" className={`absolute right-3 top-3 rounded-lg p-1.5 hover:bg-white/10 ${CHU_PHU}`}>
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>

                        <h2 id="ung-ho-tieu-de" className="flex items-center gap-2.5 pr-8 text-lg font-bold">
                            <HeartHandshake className="h-5 w-5 shrink-0 text-[#60a5fa]" aria-hidden="true" /> Một chút trước khi tải
                        </h2>
                        <p className={`mt-2 text-sm leading-relaxed ${CHU_PHU}`}>
                            Bản Việt hoá <b className="text-white">{boDuoiVietHoa(tenGame)}</b> hoàn toàn miễn phí. Nhóm dịch bỏ ra nhiều buổi tối
                            để dịch, chơi thử và vá lỗi theo từng bản cập nhật của game. Nếu bản dịch giúp bạn chơi vui hơn,
                            một ly trà đá ủng hộ sẽ giúp nhóm có thêm động lực làm game tiếp theo.
                        </p>

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
                        <p className={`mt-3 text-center text-xs ${CHU_PHU}`}>
                            Mở app ngân hàng → Quét QR. Không ủng hộ vẫn tải bình thường nhé.
                        </p>

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
                            {dangChon && (
                                <a
                                    href={dangChon.url}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    onClick={dong}
                                    autoFocus
                                    className="inline-flex h-11 items-center sm:flex-1 justify-center gap-2 rounded-xl bg-gradient-to-b from-[#4f8ff7] to-[#2563eb] text-sm font-semibold text-white hover:brightness-110"
                                >
                                    <Download className="h-4 w-4" aria-hidden="true" /> Tiếp tục tải
                                </a>
                            )}
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
}
