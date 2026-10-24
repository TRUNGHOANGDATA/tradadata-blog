'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Download, HeartHandshake, X } from 'lucide-react';
// Chỉ import KIỂU từ lib/data — import giá trị là kéo supabase/server vào trình duyệt.
import type { LinkTai } from '@/lib/data/game-viet-hoa';
import { O_TOI, CHU_PHU, boDuoiVietHoa } from '@/components/game/kieu';

/** Đã bấm "Mình đã ủng hộ" trong phiên này thì lần bấm sau tải thẳng. */
const KHOA_DA_UNG_HO = 'tdd-game-da-ung-ho';
/** Giây chờ trước khi nút "đã ủng hộ" mở — đủ để mở app ngân hàng quét QR. */
const CHO_DA_UNG_HO = 10;
/** Giây chờ trước khi được tải mà không ủng hộ. */
const CHO_KHONG_UNG_HO = 30;

type UngHo = {
    qr: string;
    soTien: number | null;
    bankId: string;
    accountNo: string;
    accountName: string;
};

/**
 * Các nút tải patch. Có cấu hình tài khoản (`ungHo`) thì MỌI lần bấm đều mở hộp
 * ủng hộ to kèm QR; link tải chỉ mở sau thời gian chờ. Khi đó nút trên trang là
 * <button> chứ không phải <a href>, để chuột giữa / "sao chép liên kết" không
 * vòng qua được hộp.
 * ponytail: không xác minh được khách có chuyển khoản thật hay không (không có
 * webhook ngân hàng), và URL vẫn nằm trong RSC payload — đây là rào thuyết phục,
 * không phải rào bảo mật. Muốn chặn thật thì cần SePay/Casso đối soát giao dịch.
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
    const [daCho, setDaCho] = useState(0);

    // Đếm giây khi hộp đang mở; đóng hộp (dangChon = null) là dừng. Về 0 ở `bam`.
    useEffect(() => {
        if (!dangChon) return;
        const t = setInterval(() => setDaCho((s) => s + 1), 1000);
        return () => clearInterval(t);
    }, [dangChon]);

    const [linkChinh, ...linkPhu] = links;
    if (!linkChinh) return null;

    const moTai = (l: LinkTai) => window.open(l.url, '_blank', 'noopener,noreferrer');

    const bam = (l: LinkTai) => {
        let daUngHo = false;
        try {
            daUngHo = sessionStorage.getItem(KHOA_DA_UNG_HO) === '1';
        } catch {
            // Trình duyệt chặn storage: coi như chưa ủng hộ.
        }
        if (daUngHo || !hop.current) return moTai(l);
        setDaCho(0);
        setDangChon(l);
        hop.current.showModal();
    };

    const dong = () => hop.current?.close();

    const tai = (daUngHo: boolean) => {
        if (daUngHo) {
            try {
                sessionStorage.setItem(KHOA_DA_UNG_HO, '1');
            } catch {
                // Không nhớ được thì lần sau hỏi lại, không sao.
            }
        }
        if (dangChon) moTai(dangChon);
        dong();
    };

    const conDaUngHo = Math.max(0, CHO_DA_UNG_HO - daCho);
    const conKhongUngHo = Math.max(0, CHO_KHONG_UNG_HO - daCho);
    const tenGon = boDuoiVietHoa(tenGame);

    const lopNutChinh = 'flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-[#7aa8ff] bg-gradient-to-b from-[#4f8ff7] to-[#2563eb] font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,.45)] transition hover:brightness-110';
    const lopNutPhu = `inline-flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-sm hover:border-[rgba(130,160,255,.55)] ${O_TOI}`;
    const nhanChinh = <><Download className="h-5 w-5" aria-hidden="true" /> Tải patch Việt hoá{linkPhu.length ? ` (${linkChinh.nhan})` : ''}</>;

    return (
        <>
            {ungHo ? (
                <button type="button" onClick={() => bam(linkChinh)} className={lopNutChinh}>{nhanChinh}</button>
            ) : (
                <a href={linkChinh.url} target="_blank" rel="noopener noreferrer nofollow" className={lopNutChinh}>{nhanChinh}</a>
            )}
            {linkPhu.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {linkPhu.map((l) => ungHo ? (
                        <button key={l.url} type="button" onClick={() => bam(l)} className={lopNutPhu}>
                            <Download className="h-4 w-4" aria-hidden="true" /> {l.nhan}
                        </button>
                    ) : (
                        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer nofollow" className={lopNutPhu}>
                            <Download className="h-4 w-4" aria-hidden="true" /> {l.nhan}
                        </a>
                    ))}
                </div>
            )}

            {ungHo && (
                <dialog
                    ref={hop}
                    aria-labelledby="ung-ho-tieu-de"
                    onClose={() => setDangChon(null)}
                    className="m-auto max-h-[94dvh] w-[min(94vw,600px)] overflow-y-auto rounded-3xl border-2 border-[#60a5fa] bg-[#0c1440] p-0 text-[#eef1ff] shadow-[0_0_80px_rgba(59,130,246,.45)] backdrop:bg-[rgba(3,6,20,.88)] backdrop:backdrop-blur-md"
                >
                    <div className="relative p-5 sm:p-7">
                        <button type="button" onClick={dong} aria-label="Đóng" className={`absolute right-3 top-3 rounded-lg p-1.5 hover:bg-white/10 ${CHU_PHU}`}>
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>

                        <h2 id="ung-ho-tieu-de" className="flex items-center justify-center gap-2.5 px-6 text-center text-2xl font-extrabold sm:text-3xl">
                            <HeartHandshake className="h-8 w-8 shrink-0 text-pink-400" aria-hidden="true" /> Ủng hộ nhóm dịch để tải
                        </h2>
                        <p className={`mt-3 text-center text-sm leading-relaxed sm:text-base ${CHU_PHU}`}>
                            Bản Việt hoá <b className="text-white">{tenGon}</b> tốn của nhóm dịch rất nhiều buổi tối để dịch,
                            chơi thử và vá lỗi theo từng bản cập nhật. Phần lớn người tải chưa ủng hộ — không có ai ủng hộ
                            thì nhóm không làm tiếp được game sau.
                        </p>

                        <div className="mt-5 flex flex-col items-center">
                            {/* eslint-disable-next-line @next/next/no-img-element -- ảnh QR từ img.vietqr.io, không cần qua optimizer */}
                            <img src={ungHo.qr} alt={`Mã QR ủng hộ bản Việt hoá ${tenGon}`} width={260} height={260} className="h-auto w-[min(70vw,260px)] rounded-2xl bg-white p-2 ring-4 ring-[#60a5fa]/60" />
                            <p className="mt-3 text-3xl font-extrabold text-amber-300">
                                {ungHo.soTien ? `${ungHo.soTien.toLocaleString('vi-VN')}đ` : 'Tuỳ tâm'}
                            </p>
                            <p className={`text-sm ${CHU_PHU}`}>Mở app ngân hàng → Quét mã QR</p>
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

                        <div className="mt-4 space-y-1.5 rounded-xl border border-amber-400/40 bg-amber-400/[.08] px-3.5 py-2.5 text-xs leading-relaxed text-amber-200">
                            <p>
                                Patch chỉ là bản dịch — cần game bản quyền
                                {phienBanGame ? <> đúng phiên bản <b>{phienBanGame}</b></> : null} thì mới cài được.
                            </p>
                            <p>Sao lưu thư mục game trước khi chép đè file Việt hoá.</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => tai(true)}
                            disabled={conDaUngHo > 0}
                            className="mt-5 flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-b from-pink-500 to-rose-600 text-base font-bold text-white shadow-[0_0_24px_rgba(236,72,153,.45)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                        >
                            <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                            {conDaUngHo > 0 ? `Quét QR rồi bấm vào đây (${conDaUngHo}s)` : 'Mình đã ủng hộ — Tải ngay'}
                        </button>

                        <div className="mt-3 flex flex-col-reverse items-center gap-2 sm:flex-row sm:justify-between">
                            {postSlug ? (
                                <Link href={`/blog/${postSlug}`} onClick={dong} className={`inline-flex items-center gap-1.5 text-xs hover:text-white ${CHU_PHU}`}>
                                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Hướng dẫn cài
                                </Link>
                            ) : <span />}
                            <button
                                type="button"
                                onClick={() => tai(false)}
                                disabled={conKhongUngHo > 0}
                                className="text-xs text-[#7c86b8] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:no-underline"
                            >
                                {conKhongUngHo > 0 ? `Tải không ủng hộ (chờ ${conKhongUngHo}s)` : 'Tải không ủng hộ'}
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
}
