'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Check, Copy, Download, HeartHandshake, RotateCw } from 'lucide-react';
import { O_TOI, CHU_PHU, boDuoiVietHoa } from '@/components/game/kieu';

type UngHo = {
    qr: string;
    soTien: number | null;
    bankId: string;
    accountNo: string;
    accountName: string;
    /** Nội dung CK — đúng chuỗi đã nhúng vào QR. */
    noiDung: string;
};

/** Trạng thái lấy vé ở /api/game-viet-hoa/[slug]/tai. */
type Ve = { trangThai: 'dang-lay' } | { trangThai: 'loi' } | { trangThai: 'co'; ve: string; conLai: number; tong: number };

/** Chép một giá trị — cho người xem trên máy tính, không quét QR được. */
function NutChep({ nhan, giaTri }: { nhan: string; giaTri: string }) {
    const [daChep, setDaChep] = useState(false);
    return (
        <button
            type="button"
            onClick={async () => {
                let ok = false;
                try {
                    await navigator.clipboard.writeText(giaTri);
                    ok = true;
                } catch {
                    // Trình duyệt nhúng (Zalo, Messenger...) hay chặn Clipboard API ⇒ thử cách cũ.
                    const o = document.createElement('textarea');
                    o.value = giaTri;
                    o.setAttribute('readonly', '');
                    o.style.cssText = 'position:fixed;opacity:0';
                    // Gắn vào <dialog> đang mở: ngoài dialog modal thì không chọn được chữ.
                    (document.querySelector('dialog[open]') ?? document.body).appendChild(o);
                    o.select();
                    ok = document.execCommand('copy');
                    o.remove();
                }
                // Vẫn hỏng thì thôi — giá trị hiện sẵn trên nút để tự gõ.
                if (ok) {
                    setDaChep(true);
                    setTimeout(() => setDaChep(false), 1500);
                }
            }}
            className={`flex min-w-0 flex-1 flex-col items-center px-3 py-2 hover:border-[rgba(130,160,255,.55)] ${O_TOI}`}
        >
            <span className={`text-xs ${CHU_PHU}`}>{daChep ? 'Đã chép' : nhan}</span>
            <span className="flex max-w-full items-center gap-1.5 text-sm font-semibold text-white">
                {/* Xuống dòng chứ không cắt "…": clipboard hỏng thì khách phải tự gõ đúng từng ký tự. */}
                <span className="break-all text-center">{giaTri}</span>
                {daChep ? <Check className="h-4 w-4 shrink-0 text-green-400" aria-hidden="true" /> : <Copy className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />}
            </span>
        </button>
    );
}

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
            setVe({ trangThai: 'co', ve: v, conLai: choGiay, tong: choGiay });
        } catch {
            setVe({ trangThai: 'loi' });
        }
    };

    const dong = () => {
        hop.current?.close();
        setDangChon(null);
    };

    const sanSang = ve.trangThai === 'co' && ve.conLai <= 0;
    // % viền đã chạy quanh QR. Viền chạy hết vòng = hết giờ chờ, nên muốn biết
    // còn bao lâu thì phải nhìn vào QR.
    const phanTram = ve.trangThai === 'co' ? Math.round(((ve.tong - ve.conLai) / ve.tong) * 100) : 0;
    const linkTai = dangChon !== null && ve.trangThai === 'co'
        ? `/api/game-viet-hoa/${encodeURIComponent(slug)}/tai?i=${dangChon}&ve=${encodeURIComponent(ve.ve)}`
        : null;
    const trangThaiChu = ve.trangThai === 'dang-lay'
        ? 'Đang chuẩn bị link…'
        : ve.trangThai === 'co' && ve.conLai > 0
            ? `Tải được sau ${ve.conLai} giây`
            : null;

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
                    {/* Cố ý ngắn: chữ dài thì khách lướt qua, QR thì không. Không khẳng định số liệu
                        chưa đo (vd "phần lớn người tải chưa ủng hộ"). */}
                    <p className={`mt-2 text-center text-sm leading-relaxed sm:text-base ${CHU_PHU}`}>
                        Bản Việt hoá <b className="text-white">{boDuoiVietHoa(tenGame)}</b> miễn phí — mỗi lượt ủng hộ giúp nhóm có thêm thời gian làm game tiếp theo.
                    </p>

                    <div className="mt-5 flex flex-col items-center">
                        {/* QR kiêm đồng hồ chờ: viền xanh chạy quanh QR, số giây ở góc QR. */}
                        <div
                            className="relative rounded-[22px] p-1.5 shadow-[0_0_48px_rgba(96,165,250,.45)]"
                            style={{ background: `conic-gradient(#60a5fa ${phanTram}%, rgba(255,255,255,.14) 0)` }}
                        >
                            {ungHo ? (
                                // eslint-disable-next-line @next/next/no-img-element -- ảnh QR từ img.vietqr.io, không cần qua optimizer
                                <img src={ungHo.qr} alt={`Mã QR ủng hộ bản Việt hoá ${boDuoiVietHoa(tenGame)}`} width={260} height={260} className="block h-auto w-[min(68vw,260px)] rounded-2xl bg-white p-2" />
                            ) : (
                                // Chưa cấu hình tài khoản: vẫn chờ đủ giờ, chỉ là không có QR.
                                <div className="grid aspect-square w-[min(50vw,180px)] place-items-center rounded-2xl bg-[#0c1440] text-5xl font-extrabold">
                                    {ve.trangThai === 'co' ? Math.max(ve.conLai, 0) : '…'}
                                </div>
                            )}
                            {ungHo && (
                                <span
                                    aria-hidden="true"
                                    className="absolute -right-3 -top-3 grid h-12 w-12 place-items-center rounded-full bg-[#2563eb] text-lg font-extrabold text-white ring-4 ring-[#0c1440]"
                                >
                                    {sanSang ? <Check className="h-6 w-6" /> : ve.trangThai === 'co' ? ve.conLai : '…'}
                                </span>
                            )}
                        </div>

                        {ungHo && (
                            <>
                                <p className="mt-3 text-3xl font-extrabold text-amber-300">
                                    {ungHo.soTien ? `${ungHo.soTien.toLocaleString('vi-VN')}đ` : 'Tuỳ tâm'}
                                </p>
                                <p className={`text-sm ${CHU_PHU}`}>
                                    Mở app ngân hàng → Quét QR · {ungHo.bankId}{ungHo.accountName ? ` · ${ungHo.accountName}` : ''}
                                </p>
                                {/* Điện thoại: xếp chồng — đứng cạnh nhau thì số tài khoản bị cắt "89686888…". */}
                                <div className="mt-3 flex w-full flex-col gap-2 sm:flex-row">
                                    <NutChep nhan="Số tài khoản" giaTri={ungHo.accountNo} />
                                    <NutChep nhan="Nội dung CK" giaTri={ungHo.noiDung} />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Nút tải CHỈ xuất hiện khi hết giờ, ngay dưới QR — trước đó không có gì để bấm. */}
                    <div className="mt-4">
                        {sanSang && linkTai ? (
                            <a
                                href={linkTai}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                onClick={() => setTimeout(dong, 0)}
                                autoFocus
                                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#4f8ff7] to-[#2563eb] font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,.45)] hover:brightness-110"
                            >
                                <Download className="h-5 w-5" aria-hidden="true" /> Tải patch Việt hoá
                            </a>
                        ) : ve.trangThai === 'loi' ? (
                            <button
                                type="button"
                                onClick={() => dangChon !== null && mo(dangChon)}
                                className={`flex h-12 w-full items-center justify-center gap-2 font-semibold hover:border-[rgba(130,160,255,.55)] ${O_TOI}`}
                            >
                                <RotateCw className="h-4 w-4" aria-hidden="true" /> Không lấy được link — thử lại
                            </button>
                        ) : (
                            <p aria-live="polite" className={`text-center text-sm ${CHU_PHU}`}>{trangThaiChu}</p>
                        )}
                    </div>

                    <div className="mt-4 space-y-1 rounded-xl border border-amber-400/40 bg-amber-400/[.08] px-3.5 py-2 text-xs leading-relaxed text-amber-200">
                        <p>
                            Patch chỉ là bản dịch — cần game bản quyền
                            {phienBanGame ? <> đúng phiên bản <b>{phienBanGame}</b></> : null} thì mới cài được.
                        </p>
                        <p>Sao lưu thư mục game trước khi chép đè file Việt hoá.</p>
                    </div>

                    <div className={`mt-3 flex items-center justify-center gap-4 text-sm ${CHU_PHU}`}>
                        {postSlug && (
                            <Link href={`/blog/${postSlug}`} onClick={dong} className="inline-flex items-center gap-1.5 underline-offset-2 hover:text-white hover:underline">
                                <BookOpen className="h-4 w-4" aria-hidden="true" /> Hướng dẫn cài
                            </Link>
                        )}
                        <button type="button" onClick={dong} className="underline-offset-2 hover:text-white hover:underline">
                            Để sau
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}
