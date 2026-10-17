'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Loader2, Plus, Save, Trash2, CheckCircle2, AlertCircle, ExternalLink, Gamepad2, Upload, X } from 'lucide-react';

/**
 * Soạn tab Game Việt hoá (/game-viet-hoa). Ảnh bìa đi qua /api/admin/upload
 * (nén + đẩy lên Drive). Hướng dẫn cài dài thì viết thành bài blog rồi gắn slug.
 */

interface LinkTai { nhan: string; url: string }

interface GameAdmin {
    id: string;
    slug: string;
    ten: string;
    ten_goc: string | null;
    anh_bia: string | null;
    nen_tang: string[];
    the_loai: string[];
    phien_ban_game: string | null;
    phien_ban_patch: string | null;
    nhom_dich: string | null;
    tien_do: number;
    mo_ta: string | null;
    link_tai: LinkTai[];
    link_mua: string | null;
    post_slug: string | null;
    is_published: boolean;
    thu_tu: number;
    so_tien: number | null;
}

type Form = Omit<GameAdmin, 'id' | 'so_tien'> & { id?: string; so_tien: string };

const NEN_TANG = ['PC', 'Switch', 'PlayStation', 'Xbox', 'Android', 'iOS'];

const FORM_TRONG: Form = {
    slug: '', ten: '', ten_goc: '', anh_bia: '', nen_tang: [], the_loai: [], phien_ban_game: '', phien_ban_patch: '',
    nhom_dich: 'Trà Đá Data', tien_do: 0, mo_ta: '', link_tai: [{ nhan: 'Google Drive', url: '' }], link_mua: '',
    post_slug: '', is_published: false, thu_tu: 0, so_tien: '',
};

const oInput =
    'w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-surface-700 dark:bg-surface-800';
const nhan = 'mb-1 block font-medium text-fg-muted';
const tieuDe = 'text-sm font-semibold text-fg';

function taoSlug(s: string) {
    return s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

type Loc = 'tat-ca' | 'da-dang' | 'nhap';

export default function GameVietHoaAdminPage() {
    const [items, setItems] = useState<GameAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<Form>(FORM_TRONG);
    // Slug tự sinh theo tên cho tới khi người soạn tự sửa slug.
    const [slugTuSua, setSlugTuSua] = useState(false);
    const [theLoaiMoi, setTheLoaiMoi] = useState('');
    const [timKiem, setTimKiem] = useState('');
    const [loc, setLoc] = useState<Loc>('tat-ca');
    const [dangLuu, setDangLuu] = useState(false);
    const [dangTaiAnh, setDangTaiAnh] = useState(false);
    const [ketQua, setKetQua] = useState<{ ok: boolean; loi: string } | null>(null);
    const [loiTai, setLoiTai] = useState<string | null>(null);
    const oFile = useRef<HTMLInputElement>(null);

    const tai = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/game-viet-hoa');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Không tải được');
            setItems(data.items ?? []);
            setLoiTai(null);
        } catch (e) {
            setLoiTai(e instanceof Error ? e.message : 'Không tải được danh sách');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { tai(); }, [tai]);

    const dem = useMemo(() => ({
        'tat-ca': items.length,
        'da-dang': items.filter((g) => g.is_published).length,
        nhap: items.filter((g) => !g.is_published).length,
    }), [items]);

    const dsLoc = useMemo(() => {
        const q = taoSlug(timKiem);
        return items.filter((g) =>
            (loc === 'tat-ca' || (loc === 'da-dang') === g.is_published) &&
            (!q || g.slug.includes(q) || taoSlug(g.ten_goc ?? '').includes(q))
        );
    }, [items, timKiem, loc]);

    const sua = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));

    const chon = (g: GameAdmin) => {
        setKetQua(null);
        setSlugTuSua(true);
        setForm({
            ...g,
            ten_goc: g.ten_goc ?? '', anh_bia: g.anh_bia ?? '', phien_ban_game: g.phien_ban_game ?? '',
            phien_ban_patch: g.phien_ban_patch ?? '', nhom_dich: g.nhom_dich ?? '', mo_ta: g.mo_ta ?? '',
            link_mua: g.link_mua ?? '', post_slug: g.post_slug ?? '', so_tien: g.so_tien == null ? '' : String(g.so_tien),
            link_tai: g.link_tai?.length ? g.link_tai : [{ nhan: 'Google Drive', url: '' }],
        });
    };

    const moi = () => {
        setKetQua(null);
        setSlugTuSua(false);
        setForm(FORM_TRONG);
    };

    const doiTen = (ten: string) => sua(slugTuSua ? { ten } : { ten, slug: taoSlug(ten) });

    const batNenTang = (n: string) =>
        sua({ nen_tang: form.nen_tang.includes(n) ? form.nen_tang.filter((x) => x !== n) : [...form.nen_tang, n] });

    const themTheLoai = () => {
        const t = theLoaiMoi.trim();
        if (t && !form.the_loai.includes(t)) sua({ the_loai: [...form.the_loai, t] });
        setTheLoaiMoi('');
    };

    const suaLink = (i: number, patch: Partial<LinkTai>) =>
        sua({ link_tai: form.link_tai.map((l, j) => (j === i ? { ...l, ...patch } : l)) });

    const taiAnhLen = async (file: File) => {
        setDangTaiAnh(true);
        setKetQua(null);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.url) throw new Error(data.error || 'Tải ảnh lên không được');
            sua({ anh_bia: data.url });
        } catch (e) {
            setKetQua({ ok: false, loi: e instanceof Error ? e.message : 'Tải ảnh lên không được' });
        } finally {
            setDangTaiAnh(false);
        }
    };

    const luu = async () => {
        setDangLuu(true);
        setKetQua(null);
        try {
            const res = await fetch('/api/admin/game-viet-hoa', {
                method: form.id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, link_tai: form.link_tai.filter((l) => l.url.trim()) }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || 'Máy chủ từ chối lưu');
            setKetQua({ ok: true, loi: '' });
            await tai();
            if (!form.id && data.item?.id) {
                setSlugTuSua(true);
                sua({ id: data.item.id });
            }
        } catch (e) {
            setKetQua({ ok: false, loi: e instanceof Error ? e.message : 'Lỗi không rõ' });
        } finally {
            setDangLuu(false);
        }
    };

    const xoa = async () => {
        if (!form.id) return;
        if (!window.confirm(`Xoá game "${form.ten}"? Không hoàn tác được.`)) return;
        setDangLuu(true);
        try {
            const res = await fetch(`/api/admin/game-viet-hoa?id=${form.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Không xoá được');
            moi();
            await tai();
        } catch (e) {
            setKetQua({ ok: false, loi: e instanceof Error ? e.message : 'Lỗi không rõ' });
        } finally {
            setDangLuu(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-fg">Game Việt hoá</h1>
                    <p className="mt-1 text-sm text-fg-muted">
                        Hiện ở <Link href="/game-viet-hoa" className="text-brand-600 hover:underline">/game-viet-hoa</Link>. Bấm một game để sửa, hoặc thêm mới.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={moi}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                >
                    <Plus className="h-4 w-4" aria-hidden="true" /> Thêm game
                </button>
            </div>

            {loiTai && (
                <div role="alert" className="mb-6 flex items-start gap-2 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                        Không đọc được bảng <code>game_viet_hoa</code>: {loiTai}. Nếu bảng chưa tạo, chạy <code>supabase/manual/game-viet-hoa.sql</code> trên SQL Editor của Supabase.
                    </span>
                </div>
            )}

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
                {/* Danh sách */}
                <div className="rounded-2xl border border-line bg-card p-4">
                    <input value={timKiem} onChange={(e) => setTimKiem(e.target.value)} placeholder="Tìm game..." aria-label="Tìm game" className={`${oInput} mb-3`} />
                    <div className="mb-3 flex flex-wrap gap-1.5">
                        {([['tat-ca', 'Tất cả'], ['da-dang', 'Đã đăng'], ['nhap', 'Nháp']] as const).map(([k, t]) => (
                            <button
                                key={k}
                                type="button"
                                onClick={() => setLoc(k)}
                                aria-pressed={loc === k}
                                className={`rounded-full border px-3 py-1 text-xs transition-colors ${loc === k ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : 'border-line text-fg-muted hover:bg-sunken'}`}
                            >
                                {t} ({dem[k]})
                            </button>
                        ))}
                    </div>
                    {dsLoc.length === 0 ? (
                        <p className="py-8 text-center text-sm text-fg-faint">{items.length ? 'Không có game nào khớp.' : 'Chưa có game nào. Bấm "Thêm game".'}</p>
                    ) : (
                        <ul className="space-y-0.5">
                            {dsLoc.map((g) => (
                                <li key={g.id}>
                                    <button
                                        type="button"
                                        onClick={() => chon(g)}
                                        className={`flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm transition-colors hover:bg-sunken ${form.id === g.id ? 'bg-brand-50 dark:bg-brand-900/30' : ''}`}
                                    >
                                        <span className="h-9 w-16 shrink-0 overflow-hidden rounded-md bg-surface-200 dark:bg-surface-700">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            {g.anh_bia ? <img src={g.anh_bia} alt="" className="h-full w-full object-cover" /> : <Gamepad2 className="m-auto mt-2 h-5 w-5 text-fg-faint" aria-hidden="true" />}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block truncate font-medium text-fg">{g.ten}</span>
                                            <span className="block truncate text-xs text-fg-subtle">{g.nen_tang.join(', ') || '—'} · {g.tien_do}%</span>
                                        </span>
                                        <span className={`ml-auto shrink-0 rounded px-1.5 py-0.5 text-[11px] ${g.is_published ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' : 'bg-surface-200 text-fg-muted dark:bg-surface-700'}`}>
                                            {g.is_published ? 'Đã đăng' : 'Nháp'}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={(e) => { e.preventDefault(); luu(); }} className="rounded-2xl border border-line bg-card p-5">
                    <div className="space-y-4">
                        <h2 className={tieuDe}>Thông tin game</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block text-sm">
                                <span className={nhan}>Tên hiển thị *</span>
                                <input required value={form.ten} onChange={(e) => doiTen(e.target.value)} className={oInput} />
                            </label>
                            <label className="block text-sm">
                                <span className={nhan}>Tên gốc</span>
                                <input value={form.ten_goc ?? ''} onChange={(e) => sua({ ten_goc: e.target.value })} className={oInput} />
                            </label>
                        </div>
                        <label className="block text-sm">
                            <span className={nhan}>Đường dẫn <span className="font-normal text-fg-faint">(tự sinh từ tên, sửa được)</span></span>
                            <input required value={form.slug} onChange={(e) => { setSlugTuSua(true); sua({ slug: e.target.value }); }} className={`${oInput} font-mono`} />
                            <span className="mt-1 block text-xs text-fg-faint">/game-viet-hoa/{form.slug || '...'}</span>
                        </label>

                        <div className="text-sm">
                            <span className={nhan}>Ảnh bìa <span className="font-normal text-fg-faint">(16:9, ví dụ 1280×720)</span></span>
                            <div className="grid items-center gap-3 sm:grid-cols-[220px_1fr]">
                                <div className="relative aspect-video overflow-hidden rounded-lg border border-line bg-surface-100 dark:bg-surface-800">
                                    {form.anh_bia ? (
                                        <>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={form.anh_bia} alt="Ảnh bìa" className="h-full w-full object-cover" />
                                            <button type="button" onClick={() => sua({ anh_bia: '' })} aria-label="Bỏ ảnh bìa" className="absolute right-1.5 top-1.5 rounded-md bg-red-500 p-1 text-white hover:bg-red-600">
                                                <X className="h-3.5 w-3.5" aria-hidden="true" />
                                            </button>
                                        </>
                                    ) : <Gamepad2 className="absolute inset-0 m-auto h-8 w-8 text-fg-faint" aria-hidden="true" />}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => oFile.current?.click()}
                                    disabled={dangTaiAnh}
                                    className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-surface-300 p-4 text-fg-muted transition-colors hover:border-brand-500 hover:text-brand-600 disabled:opacity-50 dark:border-surface-600"
                                >
                                    {dangTaiAnh ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Upload className="h-5 w-5" aria-hidden="true" />}
                                    <span>{dangTaiAnh ? 'Đang tải lên...' : 'Chọn ảnh bìa'}</span>
                                    <span className="text-xs text-fg-faint">JPG, PNG, WebP · tối đa 10MB</span>
                                </button>
                                <input
                                    ref={oFile}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={(e) => { const f = e.target.files?.[0]; if (f) taiAnhLen(f); e.target.value = ''; }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 space-y-4 border-t border-line pt-5">
                        <h2 className={tieuDe}>Phân loại</h2>
                        <fieldset className="text-sm">
                            <legend className={nhan}>Nền tảng</legend>
                            <div className="flex flex-wrap gap-2">
                                {NEN_TANG.map((n) => (
                                    <label key={n} className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 ${form.nen_tang.includes(n) ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : 'border-line text-fg'}`}>
                                        <input type="checkbox" checked={form.nen_tang.includes(n)} onChange={() => batNenTang(n)} className="h-4 w-4 accent-brand-600" />
                                        {n}
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                        <div className="text-sm">
                            <label htmlFor="the-loai-moi" className={nhan}>Thể loại <span className="font-normal text-fg-faint">(Enter để thêm)</span></label>
                            {form.the_loai.length > 0 && (
                                <div className="mb-2 flex flex-wrap gap-1.5">
                                    {form.the_loai.map((t) => (
                                        <span key={t} className="inline-flex items-center gap-1 rounded-md bg-surface-100 px-2 py-1 text-fg dark:bg-surface-800">
                                            {t}
                                            <button type="button" onClick={() => sua({ the_loai: form.the_loai.filter((x) => x !== t) })} aria-label={`Bỏ thể loại ${t}`} className="text-fg-faint hover:text-red-600">
                                                <X className="h-3.5 w-3.5" aria-hidden="true" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            <input
                                id="the-loai-moi"
                                value={theLoaiMoi}
                                onChange={(e) => setTheLoaiMoi(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); themTheLoai(); } }}
                                onBlur={themTheLoai}
                                placeholder="RPG, Phiêu lưu..."
                                className={oInput}
                            />
                        </div>
                    </div>

                    <div className="mt-5 space-y-4 border-t border-line pt-5">
                        <h2 className={tieuDe}>Bản dịch</h2>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <label className="block text-sm">
                                <span className={nhan}>Bản game</span>
                                <input value={form.phien_ban_game ?? ''} onChange={(e) => sua({ phien_ban_game: e.target.value })} placeholder="1.2.3" className={oInput} />
                            </label>
                            <label className="block text-sm">
                                <span className={nhan}>Bản patch</span>
                                <input value={form.phien_ban_patch ?? ''} onChange={(e) => sua({ phien_ban_patch: e.target.value })} placeholder="v1" className={oInput} />
                            </label>
                            <label className="block text-sm">
                                <span className={nhan}>Nhóm dịch</span>
                                <input value={form.nhom_dich ?? ''} onChange={(e) => sua({ nhom_dich: e.target.value })} className={oInput} />
                            </label>
                        </div>
                        <label className="block text-sm">
                            <span className={nhan}>Tiến độ dịch</span>
                            <span className="flex items-center gap-3">
                                <input type="range" min={0} max={100} step={1} value={form.tien_do} onChange={(e) => sua({ tien_do: Number(e.target.value) })} className="flex-1 accent-brand-600" />
                                <b className="w-12 text-right text-fg">{form.tien_do}%</b>
                            </span>
                            <span className="mt-1 block text-xs text-fg-faint">
                                {form.tien_do === 100 ? 'Ngoài trang hiện nhãn "Hoàn thành".' : 'Dưới 100% ⇒ ngoài trang hiện nhãn "Đang dịch".'}
                            </span>
                        </label>
                    </div>

                    <div className="mt-5 space-y-4 border-t border-line pt-5">
                        <h2 className={tieuDe}>Tải về</h2>
                        <div className="text-sm">
                            <span className={nhan}>Link tải patch</span>
                            <div className="space-y-2">
                                {form.link_tai.map((l, i) => (
                                    <div key={i} className="grid gap-2 sm:grid-cols-[160px_1fr_auto]">
                                        <input value={l.nhan} onChange={(e) => suaLink(i, { nhan: e.target.value })} placeholder="Google Drive" aria-label={`Tên link ${i + 1}`} className={oInput} />
                                        <input type="url" value={l.url} onChange={(e) => suaLink(i, { url: e.target.value })} placeholder="https://..." aria-label={`URL link ${i + 1}`} className={oInput} />
                                        <button type="button" onClick={() => sua({ link_tai: form.link_tai.filter((_, j) => j !== i) })} aria-label={`Bỏ link ${i + 1}`} className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-fg-muted hover:bg-sunken hover:text-red-600">
                                            <X className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={() => sua({ link_tai: [...form.link_tai, { nhan: '', url: '' }] })} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
                                <Plus className="h-4 w-4" aria-hidden="true" /> Thêm link
                            </button>
                        </div>
                        <label className="block text-sm">
                            <span className={nhan}>Link mua game chính hãng</span>
                            <input type="url" value={form.link_mua ?? ''} onChange={(e) => sua({ link_mua: e.target.value })} placeholder="https://store.steampowered.com/app/..." className={oInput} />
                        </label>
                        <label className="block text-sm">
                            <span className={nhan}>Số tiền ủng hộ (đ) <span className="font-normal text-fg-faint">(điền sẵn vào mã QR trên trang game; để trống = người ủng hộ tự nhập)</span></span>
                            <input
                                type="number"
                                min={0}
                                step={1000}
                                inputMode="numeric"
                                value={form.so_tien}
                                onChange={(e) => sua({ so_tien: e.target.value })}
                                placeholder="50000"
                                className={oInput}
                            />
                            {form.so_tien && Number(form.so_tien) > 0 && (
                                <span className="mt-1 block text-xs text-fg-faint">{Number(form.so_tien).toLocaleString('vi-VN')}đ</span>
                            )}
                        </label>
                        <p className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                            Chỉ đăng file patch Việt hoá, không đăng file game đầy đủ.
                        </p>
                    </div>

                    <div className="mt-5 space-y-4 border-t border-line pt-5">
                        <h2 className={tieuDe}>Nội dung</h2>
                        <label className="block text-sm">
                            <span className={nhan}>Giới thiệu ngắn</span>
                            <textarea rows={4} value={form.mo_ta ?? ''} onChange={(e) => sua({ mo_ta: e.target.value })} className={oInput} />
                        </label>
                        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                            <label className="block text-sm">
                                <span className={nhan}>Slug bài hướng dẫn cài đặt</span>
                                <span className="flex gap-2">
                                    <input value={form.post_slug ?? ''} onChange={(e) => sua({ post_slug: e.target.value })} placeholder="huong-dan-cai-viet-hoa-..." className={oInput} />
                                    {form.post_slug ? (
                                        <a href={`/blog/${form.post_slug}`} target="_blank" rel="noreferrer" className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-fg-muted hover:bg-sunken hover:text-fg" aria-label="Mở bài viết">
                                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                        </a>
                                    ) : null}
                                </span>
                            </label>
                            <label className="block text-sm">
                                <span className={nhan}>Thứ tự</span>
                                <input type="number" value={form.thu_tu} onChange={(e) => sua({ thu_tu: Number(e.target.value) || 0 })} className={oInput} />
                            </label>
                        </div>
                    </div>

                    <div className="sticky bottom-0 -mx-5 -mb-5 mt-5 flex flex-wrap items-center gap-3 rounded-b-2xl border-t border-line bg-card px-5 py-3">
                        <select
                            value={form.is_published ? '1' : '0'}
                            onChange={(e) => sua({ is_published: e.target.value === '1' })}
                            aria-label="Trạng thái"
                            className={`${oInput} w-auto`}
                        >
                            <option value="0">Nháp</option>
                            <option value="1">Đã đăng</option>
                        </select>
                        {form.id && form.is_published && (
                            <a href={`/game-viet-hoa/${form.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
                                Xem trang <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                        )}
                        <div aria-live="polite" className="min-h-5 flex-1 text-sm">
                            {ketQua?.ok && <span className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Đã lưu.</span>}
                            {ketQua && !ketQua.ok && <span role="alert" className="text-red-600 dark:text-red-400">{ketQua.loi}</span>}
                        </div>
                        {form.id && (
                            <button type="button" onClick={xoa} disabled={dangLuu} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20">
                                <Trash2 className="h-4 w-4" aria-hidden="true" /> Xoá
                            </button>
                        )}
                        <button type="submit" disabled={dangLuu || dangTaiAnh} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50">
                            {dangLuu ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
                            {form.id ? 'Lưu thay đổi' : 'Thêm game'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
