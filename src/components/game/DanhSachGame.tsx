'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gamepad2, Search } from 'lucide-react';
// Chỉ import KIỂU từ lib/data — import giá trị là kéo supabase/server vào trình duyệt.
import type { GameTomTat } from '@/lib/data/game-viet-hoa';
import { THE_KINH, O_TOI, CHU_PHU, toiUuDuoc } from '@/components/game/kieu';

type TrangThai = 'tat-ca' | 'xong' | 'dang';

const boDau = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');

export function DanhSachGame({ games, children }: { games: GameTomTat[]; children: React.ReactNode }) {
    const [tim, setTim] = useState('');
    const [nenTang, setNenTang] = useState<string | null>(null);
    const [trangThai, setTrangThai] = useState<TrangThai>('tat-ca');

    const dsNenTang = useMemo(() => [...new Set(games.flatMap((g) => g.nen_tang))], [games]);
    const soXong = games.filter((g) => g.tien_do === 100).length;

    const ds = useMemo(() => {
        const q = boDau(tim.trim());
        return games.filter((g) =>
            (!q || boDau(g.ten).includes(q)) &&
            (!nenTang || g.nen_tang.includes(nenTang)) &&
            (trangThai === 'tat-ca' || (trangThai === 'xong') === (g.tien_do === 100))
        );
    }, [games, tim, nenTang, trangThai]);

    const chip = (on: boolean) =>
        `rounded-full border px-3.5 py-1.5 text-sm transition-colors ${on ? 'border-[#60a5fa] bg-[rgba(59,130,246,.25)] text-white' : `border-[rgba(110,140,255,.28)] ${CHU_PHU} hover:text-white`}`;

    return (
        <>
            <section className={`${THE_KINH} p-5 sm:p-7`}>
                {children}
                {games.length > 0 && (
                    <>
                        <div className="mt-5 flex flex-wrap items-center gap-2.5">
                            <label className={`flex h-10 min-w-[220px] flex-1 items-center gap-2 px-3.5 ${O_TOI}`}>
                                <Search className="h-4 w-4 shrink-0 text-[#7480b8]" aria-hidden="true" />
                                <input
                                    value={tim}
                                    onChange={(e) => setTim(e.target.value)}
                                    placeholder="Tìm tên game..."
                                    aria-label="Tìm tên game"
                                    className="w-full bg-transparent text-sm text-white placeholder:text-[#7480b8] focus:outline-none"
                                />
                            </label>
                            {dsNenTang.length > 1 && (
                                <>
                                    <button type="button" onClick={() => setNenTang(null)} aria-pressed={!nenTang} className={chip(!nenTang)}>Tất cả</button>
                                    {dsNenTang.map((n) => (
                                        <button key={n} type="button" onClick={() => setNenTang(n)} aria-pressed={nenTang === n} className={chip(nenTang === n)}>{n}</button>
                                    ))}
                                </>
                            )}
                            <select
                                value={trangThai}
                                onChange={(e) => setTrangThai(e.target.value as TrangThai)}
                                aria-label="Lọc theo trạng thái"
                                className={`h-10 px-3 text-sm text-white ${O_TOI}`}
                            >
                                <option value="tat-ca">Mọi trạng thái</option>
                                <option value="xong">Hoàn thành</option>
                                <option value="dang">Đang dịch</option>
                            </select>
                        </div>
                        <p className="mt-3 text-sm text-[#7480b8]">
                            {games.length} game · {soXong} hoàn thành · {games.length - soXong} đang dịch
                        </p>
                    </>
                )}
            </section>

            {games.length === 0 ? (
                <p className={`mt-6 py-16 text-center ${CHU_PHU}`}>Các bản Việt hoá đầu tiên đang được hoàn thiện. Quay lại sau nhé.</p>
            ) : ds.length === 0 ? (
                <p className={`mt-6 py-16 text-center ${CHU_PHU}`}>Không có game nào khớp bộ lọc.</p>
            ) : (
                <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {ds.map((g, i) => <TheGame key={g.slug} game={g} uuTien={i < 4} />)}
                </ul>
            )}
        </>
    );
}

function TheGame({ game: g, uuTien }: { game: GameTomTat; uuTien: boolean }) {
    const xong = g.tien_do === 100;
    return (
        <li>
            <Link
                href={`/game-viet-hoa/${g.slug}`}
                className={`${THE_KINH} block overflow-hidden transition hover:-translate-y-1 hover:border-[rgba(130,160,255,.55)] focus-visible:outline-2 focus-visible:outline-[#60a5fa]`}
            >
                <div className="relative aspect-video bg-[#111a44]">
                    {g.anh_bia ? (
                        <Image
                            src={g.anh_bia}
                            alt=""
                            fill
                            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                            unoptimized={!toiUuDuoc(g.anh_bia)}
                            priority={uuTien}
                        />
                    ) : (
                        <Gamepad2 className="absolute inset-0 m-auto h-10 w-10 text-[#3b4a8a]" aria-hidden="true" />
                    )}
                    <span
                        className={`absolute left-2.5 top-2.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur ${xong ? 'border-green-500/60 bg-[rgba(5,46,22,.85)] text-green-300' : 'border-amber-400/60 bg-[rgba(66,32,6,.85)] text-amber-300'}`}
                    >
                        {xong ? 'Hoàn thành' : 'Đang dịch'}
                    </span>
                </div>
                <div className="p-4">
                    <h2 className="truncate text-[17px] font-bold">{g.ten}</h2>
                    <div className="mb-3 mt-2 flex flex-wrap gap-1.5">
                        {[...g.the_loai, ...g.nen_tang].slice(0, 4).map((t) => (
                            <span key={t} className={`rounded-md border border-[rgba(110,140,255,.28)] px-2 py-0.5 text-xs ${CHU_PHU}`}>{t}</span>
                        ))}
                    </div>
                    <ThanhTienDo tienDo={g.tien_do} />
                </div>
            </Link>
        </li>
    );
}

export function ThanhTienDo({ tienDo }: { tienDo: number }) {
    const xong = tienDo === 100;
    return (
        <div className={`flex items-center gap-2.5 text-sm ${CHU_PHU}`}>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={tienDo} aria-valuemin={0} aria-valuemax={100} aria-label="Tiến độ dịch">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${xong ? 'from-green-600 to-green-400' : 'from-amber-600 to-amber-400'}`}
                    style={{ width: `${tienDo}%` }}
                />
            </div>
            {tienDo}%
        </div>
    );
}
