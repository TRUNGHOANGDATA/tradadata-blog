import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, ExternalLink, Gamepad2, HeartHandshake, LayoutGrid, ShoppingCart, Tag, Users } from 'lucide-react';
import { getDanhSachGame, getGameBySlug } from '@/lib/data/game-viet-hoa';
import { getSetting } from '@/lib/data/settings';
import { ThanhTienDo } from '@/components/game/DanhSachGame';
import { NutTai } from '@/components/game/NutTai';
import { THE_KINH, O_TOI, CHU_PHU, toiUuDuoc, boDuoiVietHoa } from '@/components/game/kieu';

// Trang tĩnh sinh theo yêu cầu (ISR). generateStaticParams trả [] CỐ Ý: không
// prerender lúc `next build`, để build không đốt thêm truy vấn vào Supabase NANO.
// ĐỪNG thêm auth()/cookies()/headers()/searchParams vào file này — mất tính tĩnh.
export const revalidate = 3600;

export async function generateStaticParams() {
    return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const g = await getGameBySlug(slug);
    if (!g) return {};
    const moTa = g.mo_ta?.slice(0, 160) || `Tải patch Việt hoá ${g.ten}${g.nen_tang.length ? ` cho ${g.nen_tang.join(', ')}` : ''}.`;
    const tieuDe = `${boDuoiVietHoa(g.ten)} Việt hoá`;
    return {
        title: tieuDe,
        description: moTa,
        alternates: { canonical: `/game-viet-hoa/${g.slug}` },
        openGraph: { title: tieuDe, description: moTa, images: g.anh_bia ? [g.anh_bia] : undefined },
    };
}

export default async function TrangGame({ params }: Props) {
    const { slug } = await params;
    const g = await getGameBySlug(slug);
    if (!g) notFound();

    const [dsGame, bank] = await Promise.all([
        getDanhSachGame(),
        // Cùng tài khoản nhận tiền với trang thanh toán (admin → Cài đặt). Có cache tag 'settings'.
        getSetting<Record<string, string>>('bank_info', {}),
    ]);
    const khac = dsGame.filter((x) => x.slug !== g.slug).slice(0, 3);
    // Chưa cấu hình tài khoản thì ẩn khối ủng hộ — KHÔNG rơi về số tài khoản mẫu như trang thanh toán.
    const qrUngHo = bank.bankId && bank.accountNo
        ? `https://img.vietqr.io/image/${encodeURIComponent(bank.bankId)}-${encodeURIComponent(bank.accountNo)}-compact.png?${new URLSearchParams({
            ...(g.so_tien ? { amount: String(g.so_tien) } : {}),
            addInfo: `UNG HO ${g.slug}`.slice(0, 40),
            accountName: bank.accountName ?? '',
        })}`
        : null;
    const xong = g.tien_do === 100;
    const ngay = new Date(g.updated_at).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    const thongTin: [typeof Gamepad2, string, string | null][] = [
        [Gamepad2, 'Nền tảng', g.nen_tang.join(', ') || null],
        [LayoutGrid, 'Thể loại', g.the_loai.join(', ') || null],
        [Tag, 'Bản game / patch', [g.phien_ban_game, g.phien_ban_patch].filter(Boolean).join(' / ') || null],
        [Users, 'Nhóm dịch', g.nhom_dich],
    ];

    return (
        <>
            <Link href="/game-viet-hoa" className="mb-4 inline-flex items-center gap-2 font-semibold hover:text-[#60a5fa]">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Game Việt hoá
            </Link>

            <section className={`${THE_KINH} grid items-start gap-7 p-4 sm:p-6 lg:grid-cols-[1.15fr_1fr]`}>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-[rgba(110,140,255,.28)] bg-[#111a44]">
                    {g.anh_bia ? (
                        <Image src={g.anh_bia} alt={`Ảnh bìa ${g.ten}`} fill priority sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" unoptimized={!toiUuDuoc(g.anh_bia)} />
                    ) : (
                        <Gamepad2 className="absolute inset-0 m-auto h-14 w-14 text-[#3b4a8a]" aria-hidden="true" />
                    )}
                </div>

                <div>
                    <p className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${O_TOI} ${CHU_PHU}`}>
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> Cập nhật {ngay}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{g.ten}</h1>
                    {g.ten_goc && <p className={`mt-1 ${CHU_PHU}`}>Tên gốc: {g.ten_goc}</p>}

                    <dl className="mt-4 space-y-1.5">
                        {thongTin.filter(([, , v]) => v).map(([Icon, nhan, v]) => (
                            <div key={nhan} className={`flex items-center justify-between gap-3 px-3.5 py-2.5 ${O_TOI}`}>
                                <dt className={`flex items-center gap-2.5 ${CHU_PHU}`}><Icon className="h-4 w-4" aria-hidden="true" /> {nhan}</dt>
                                <dd className="text-right font-medium">{v}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className={`mt-3 rounded-xl border px-3.5 py-2.5 ${xong ? 'border-green-500/45 bg-green-500/[.08]' : 'border-amber-400/45 bg-amber-400/[.08]'}`}>
                        <ThanhTienDo tienDo={g.tien_do} />
                        <p className={`mt-1 text-sm font-semibold ${xong ? 'text-green-300' : 'text-amber-300'}`}>{xong ? 'Hoàn thành' : 'Đang dịch'}</p>
                    </div>

                    {/* Mobile: nút bám đáy màn hình để luôn bấm được */}
                    <div className="sticky bottom-0 -mx-4 mt-3 space-y-2.5 bg-[rgba(7,11,36,.9)] px-4 py-3 sm:static sm:mx-0 sm:bg-transparent sm:p-0">
                        <NutTai
                            links={g.link_tai ?? []}
                            ungHo={qrUngHo ? { qr: qrUngHo, soTien: g.so_tien, bankId: bank.bankId, accountNo: bank.accountNo, accountName: bank.accountName ?? '' } : null}
                            tenGame={g.ten}
                            phienBanGame={g.phien_ban_game}
                            postSlug={g.post_slug}
                        />
                        {g.link_mua && (
                            <a
                                href={g.link_mua}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className={`flex h-12 items-center justify-center gap-2.5 font-semibold hover:border-[rgba(130,160,255,.55)] ${O_TOI}`}
                            >
                                <ShoppingCart className="h-5 w-5" aria-hidden="true" /> Mua game chính hãng <ExternalLink className="h-4 w-4" aria-hidden="true" />
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {(g.mo_ta || g.post_slug) && (
                <section className={`${THE_KINH} mt-5 p-5 sm:p-7`}>
                    <h2 className="flex items-center gap-2.5 text-xl font-bold">
                        <BookOpen className="h-5 w-5 text-[#60a5fa]" aria-hidden="true" /> Giới thiệu
                    </h2>
                    {g.mo_ta && <p className={`mt-3 whitespace-pre-line leading-relaxed ${CHU_PHU}`}>{g.mo_ta}</p>}
                    {g.post_slug && (
                        <Link
                            href={`/blog/${g.post_slug}`}
                            className="mt-4 flex items-center gap-2.5 rounded-xl border border-[rgba(130,160,255,.55)] bg-[rgba(59,130,246,.1)] px-4 py-3 hover:bg-[rgba(59,130,246,.18)]"
                        >
                            <BookOpen className="h-5 w-5 shrink-0" aria-hidden="true" />
                            <span><b>Hướng dẫn cài đặt chi tiết:</b> <span className="text-[#60a5fa]">đọc bài viết trên blog</span></span>
                            <ArrowRight className="ml-auto h-4 w-4 text-[#60a5fa]" aria-hidden="true" />
                        </Link>
                    )}
                </section>
            )}

            {qrUngHo && (
                <section className={`${THE_KINH} mt-5 grid items-center gap-6 p-5 sm:grid-cols-[200px_1fr] sm:p-7`}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- ảnh QR từ img.vietqr.io, không cần qua optimizer */}
                    <img src={qrUngHo} alt={`Mã QR ủng hộ bản Việt hoá ${boDuoiVietHoa(g.ten)}`} width={200} height={200} loading="lazy" className="mx-auto rounded-xl bg-white p-2" />
                    <div>
                        <h2 className="flex items-center gap-2.5 text-xl font-bold">
                            <HeartHandshake className="h-5 w-5 text-[#60a5fa]" aria-hidden="true" /> Ủng hộ nhóm dịch
                        </h2>
                        <p className={`mt-2 leading-relaxed ${CHU_PHU}`}>
                            Thấy bản dịch hữu ích? Quét mã bằng app ngân hàng để ủng hộ nhóm tiếp tục Việt hoá game mới.
                        </p>
                        <dl className="mt-4 space-y-1.5 text-sm">
                            {([
                                ['Ngân hàng', bank.bankId],
                                ['Số tài khoản', bank.accountNo],
                                ['Chủ tài khoản', bank.accountName],
                                ['Số tiền', g.so_tien ? `${g.so_tien.toLocaleString('vi-VN')}đ` : 'Tuỳ tâm'],
                            ] as const).filter(([, v]) => v).map(([nhan, v]) => (
                                <div key={nhan} className="flex justify-between gap-3">
                                    <dt className={CHU_PHU}>{nhan}</dt>
                                    <dd className="font-semibold">{v}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>
            )}

            {khac.length > 0 && (
                <section className="mt-7">
                    <div className="mb-3 flex items-baseline justify-between">
                        <h2 className="flex items-center gap-2.5 text-xl font-bold">
                            <Gamepad2 className="h-5 w-5 text-[#60a5fa]" aria-hidden="true" /> Game Việt hoá khác
                        </h2>
                        <Link href="/game-viet-hoa" className="inline-flex items-center gap-1 text-sm text-[#60a5fa] hover:underline">
                            Xem thêm <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>
                    <ul className="grid gap-4 md:grid-cols-3">
                        {khac.map((k) => (
                            <li key={k.slug}>
                                <Link href={`/game-viet-hoa/${k.slug}`} className={`${THE_KINH} flex gap-3.5 p-2.5 hover:border-[rgba(130,160,255,.55)]`}>
                                    <span className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg bg-[#111a44]">
                                        {k.anh_bia && <Image src={k.anh_bia} alt="" fill sizes="144px" className="object-cover" unoptimized={!toiUuDuoc(k.anh_bia)} />}
                                    </span>
                                    <span className="min-w-0 py-1">
                                        <span className="block truncate font-bold">{k.ten}</span>
                                        <span className="mt-1.5 flex flex-wrap gap-1.5">
                                            {[...k.the_loai, ...k.nen_tang].slice(0, 2).map((t) => (
                                                <span key={t} className={`rounded-md border border-[rgba(110,140,255,.28)] px-2 py-0.5 text-xs ${CHU_PHU}`}>{t}</span>
                                            ))}
                                        </span>
                                        <span className={`mt-1.5 block text-xs ${CHU_PHU}`}>{k.tien_do === 100 ? 'Hoàn thành' : `Đang dịch · ${k.tien_do}%`}</span>
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    );
}
