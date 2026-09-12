'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
    Upload, Download, FilePlus2, Maximize2, Minimize2, CircleHelp, Sheet,
    FunctionSquare, PanelRightClose, PanelRightOpen, ExternalLink, RotateCcw, Copy, Check, CloudCheck, CloudOff,
} from 'lucide-react';
import { doiNgayVietSangSerial } from '@/lib/excel/ngay-thang';
import { ghepNgonNgu } from '@/lib/excel/locale';
import { docPhien, luuPhien, xoaPhien } from '@/lib/excel/luu-phien';
import { docXlsxSangSnapshot, taiSnapshotXuongXlsx } from '@/lib/excel/xlsx';
import { gomTheoNhom, type ViDuHam } from '@/lib/data/vi-du-ham';
import type { FUniver } from '@univerjs/presets';
import type { IWorkbookData } from '@univerjs/core';

// CSS của Univer — nằm trong chunk lười vì file này chỉ được dynamic-import.
// Mọi class đều có tiền tố `univer-`, không đụng Tailwind 4 của site.
import '@univerjs/presets/lib/styles/preset-sheets-core.css';
import '@univerjs/presets/lib/styles/preset-sheets-filter.css';
import '@univerjs/presets/lib/styles/preset-sheets-sort.css';
import '@univerjs/presets/lib/styles/preset-sheets-conditional-formatting.css';
import '@univerjs/presets/lib/styles/preset-sheets-data-validation.css';
import '@univerjs/presets/lib/styles/preset-sheets-find-replace.css';
import '@univerjs/presets/lib/styles/preset-sheets-table.css';
import '@univerjs/presets/lib/styles/preset-sheets-note.css';
import '@univerjs/presets/lib/styles/preset-sheets-hyper-link.css';
import '@univerjs/presets/lib/styles/preset-sheets-thread-comment.css';
import '@univerjs/presets/lib/styles/preset-sheets-drawing.css';
// Ghi đè màu chủ đạo sang xanh Excel — import SAU để thắng CSS gốc của Univer.
// Vẫn cần dù đã dùng `greenTheme`: bậc 600 của theme đó là #057A55 (xanh ngọc),
// không phải #217346 của ribbon Excel.
import './excel-theme.css';

/** Định dạng ngày dùng thống nhất cả khi hiện lẫn khi nhận: ngày/tháng/năm. */
const DINH_DANG_NGAY = 'dd/mm/yyyy';
/** Định dạng Univer tự sinh khi nhận ngày kiểu Mỹ -> đổi sang dd/mm/yyyy. */
const DINH_DANG_NGAY_KIEU_MY = new Set(['mm/dd/yyyy', 'yyyy-mm-dd']);

const TEN_FILE_TAI_VE = 'thuc-hanh-tradadata.xlsx';

/** Khoá "bảng trắng" trong bai_lam_excel — không gắn hàm nào. */
const HAM_TU_DO = '_tu_do';

/** Đọc `#ham=XLOOKUP` từ URL. Dùng hash chứ không dùng searchParams để trang giữ tĩnh. */
function docHamTuHash(): string | null {
    const m = /(?:^#|&)ham=([A-Za-z0-9._]+)/.exec(window.location.hash);
    return m ? m[1].toUpperCase() : null;
}

export default function BangTinh({
    danhMuc = [],
    laAdmin = false,
}: {
    danhMuc?: ViDuHam[];
    /** Admin thấy thêm nút "Sao chép snapshot" để soạn ví dụ trong /admin/vi-du-ham. */
    laAdmin?: boolean;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputFileRef = useRef<HTMLInputElement>(null);
    const apiRef = useRef<FUniver | null>(null);
    // Hàm dọn dẹp toàn bộ instance (StrictMode gọi effect 2 lần ở dev).
    const huyRef = useRef<(() => void) | null>(null);

    const [sanSang, setSanSang] = useState(false);
    const [dangXuLy, setDangXuLy] = useState(false);
    const [loi, setLoi] = useState<string | null>(null);
    const [thongBao, setThongBao] = useState<string | null>(null);
    const [toanManHinh, setToanManHinh] = useState(false);
    const [hienGiupDo, setHienGiupDo] = useState(false);
    // Khung ngoài cùng — phần tử được đưa lên toàn màn hình bằng Fullscreen API.
    const khungRef = useRef<HTMLDivElement>(null);

    // --- Sân chơi hàm 365 ---
    const [hienPanel, setHienPanel] = useState(true);
    /** Hàm đang chọn; null = bảng tự do. */
    const [hamDangChon, setHamDangChon] = useState<string | null>(null);
    const [viDuDangNap, setViDuDangNap] = useState<string | null>(null);
    const [daSaoChep, setDaSaoChep] = useState(false);
    /** Trạng thái lưu online: 'chua' | 'dang' | 'xong' | 'loi'. */
    const [luuOnline, setLuuOnline] = useState<'chua' | 'dang' | 'xong' | 'loi'>('chua');
    // Đọc trong callback lưu (debounce) mà không kéo state vào deps của effect.
    const hamDangChonRef = useRef<string | null>(null);
    hamDangChonRef.current = hamDangChon;

    const nhomHam = useMemo(() => gomTheoNhom(danhMuc), [danhMuc]);
    const viDuHienTai = useMemo(
        () => (hamDangChon ? danhMuc.find((h) => h.ten_ham === hamDangChon) ?? null : null),
        [danhMuc, hamDangChon]
    );

    // --- Khởi tạo Univer một lần ---
    useEffect(() => {
        let daHuy = false;

        (async () => {
            const [
                { createUniver, LocaleType, merge, greenTheme },
                { UniverSheetsCorePreset },
                { UniverSheetsFilterPreset },
                { UniverSheetsSortPreset },
                { UniverSheetsConditionalFormattingPreset },
                { UniverSheetsDataValidationPreset },
                { UniverSheetsFindReplacePreset },
                { UniverSheetsTablePreset },
                { UniverSheetsNotePreset },
                { UniverSheetsHyperLinkPreset },
                { UniverSheetsThreadCommentPreset },
                { UniverSheetsDrawingPreset },
                enCore, viCore,
                enFilter, enSort, enCF, enDV, enFR, enTable, enNote, enLink, enComment, enDrawing,
            ] = await Promise.all([
                import('@univerjs/presets'),
                import('@univerjs/presets/preset-sheets-core'),
                import('@univerjs/presets/preset-sheets-filter'),
                import('@univerjs/presets/preset-sheets-sort'),
                import('@univerjs/presets/preset-sheets-conditional-formatting'),
                import('@univerjs/presets/preset-sheets-data-validation'),
                import('@univerjs/presets/preset-sheets-find-replace'),
                import('@univerjs/presets/preset-sheets-table'),
                import('@univerjs/presets/preset-sheets-note'),
                // Ba preset MIỄN PHÍ đã có trong node_modules nhưng trước đây chưa bật:
                // siêu liên kết trong ô, ghi chú/thảo luận theo ô, chèn ảnh.
                import('@univerjs/presets/preset-sheets-hyper-link'),
                import('@univerjs/presets/preset-sheets-thread-comment'),
                import('@univerjs/presets/preset-sheets-drawing'),
                import('@univerjs/presets/preset-sheets-core/locales/en-US'),
                import('@univerjs/presets/preset-sheets-core/locales/vi-VN'),
                import('@univerjs/presets/preset-sheets-filter/locales/en-US'),
                import('@univerjs/presets/preset-sheets-sort/locales/en-US'),
                import('@univerjs/presets/preset-sheets-conditional-formatting/locales/en-US'),
                import('@univerjs/presets/preset-sheets-data-validation/locales/en-US'),
                import('@univerjs/presets/preset-sheets-find-replace/locales/en-US'),
                import('@univerjs/presets/preset-sheets-table/locales/en-US'),
                import('@univerjs/presets/preset-sheets-note/locales/en-US'),
                import('@univerjs/presets/preset-sheets-hyper-link/locales/en-US'),
                import('@univerjs/presets/preset-sheets-thread-comment/locales/en-US'),
                import('@univerjs/presets/preset-sheets-drawing/locales/en-US'),
            ]);

            if (daHuy || !containerRef.current) return;

            // Nền UI tiếng Anh: gộp locale en-US của lõi + mọi preset chức năng.
            const mergedEn = merge(
                {},
                enCore.default, enFilter.default, enSort.default, enCF.default,
                enDV.default, enFR.default, enTable.default, enNote.default,
                enLink.default, enComment.default, enDrawing.default,
            );
            // Toàn bộ UI tiếng Anh; CHỈ giải thích hàm là tiếng Việt (lấy từ core vi-VN).
            // Bọc merge({}, ...) để khớp kiểu ILanguagePack mà createUniver mong đợi.
            const ngonNgu = merge({}, ghepNgonNgu(mergedEn, viCore.default));

            const { univer, univerAPI } = createUniver({
                locale: LocaleType.EN_US,
                locales: { [LocaleType.EN_US]: ngonNgu },
                // Theme xanh chính chủ của Univer làm nền (màu phụ, viền, hover đồng bộ),
                // rồi excel-theme.css kéo bậc primary về đúng #217346.
                theme: greenTheme,
                // Khởi tạo theo đúng chế độ site đang ở, để không nháy trắng->tối.
                // Đồng bộ về sau do effect bên dưới lo (MutationObserver trên <html>).
                darkMode: document.documentElement.classList.contains('dark'),
                presets: [
                    UniverSheetsCorePreset({
                        container: containerRef.current,
                        // Khai TƯỚNG MINH để ai đọc cũng biết đang ở kiểu nào. Đọc source
                        // 0.25.1: 'simple' gộp mọi nhóm vào MỘT tab; 'classic' giữ hàng tab
                        // Start/Insert/Formulas/Data — và 'classic' đang là mặc định, nên
                        // dòng này không đổi giao diện, chỉ chốt hành vi khỏi lệ thuộc
                        // mặc định của Univer đổi ở bản sau.
                        ribbonType: 'classic',
                    }),
                    UniverSheetsFilterPreset(),
                    UniverSheetsSortPreset(),
                    UniverSheetsConditionalFormattingPreset(),
                    UniverSheetsDataValidationPreset(),
                    UniverSheetsFindReplacePreset(),
                    UniverSheetsTablePreset(),
                    UniverSheetsNotePreset(),
                    UniverSheetsHyperLinkPreset(),
                    UniverSheetsThreadCommentPreset(),
                    UniverSheetsDrawingPreset(),
                ],
            });

            apiRef.current = univerAPI;

            // Khôi phục phiên trong tab này nếu có, không thì mở bảng trắng.
            const phienCu = docPhien();
            univerAPI.createWorkbook(phienCu ?? {});
            univerAPI.getActiveWorkbook()?.setNumfmtLocal('en'); // số kiểu Mỹ: 1,234.57

            // --- Lưu phiên (debounce) ---
            // Hai tầng: sessionStorage (tức thì, chống mất khi refresh) và DB qua
            // /api/thuc-hanh/bai-lam (đổi máy vẫn còn; trang này đã bắt đăng nhập).
            // Lưu DB lỗi (mạng, DB nghẹn) thì chỉ đổi biểu tượng, KHÔNG làm phiền.
            let hen: ReturnType<typeof setTimeout> | null = null;
            const luuNgay = () => {
                const snap = univerAPI.getActiveWorkbook()?.save();
                if (!snap) return;
                luuPhien(snap);
                setLuuOnline('dang');
                fetch('/api/thuc-hanh/bai-lam', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ten_ham: hamDangChonRef.current ?? HAM_TU_DO, snapshot: snap }),
                })
                    .then((r) => setLuuOnline(r.ok ? 'xong' : 'loi'))
                    .catch(() => setLuuOnline('loi'));
            };
            const luuTre = () => {
                if (hen) clearTimeout(hen);
                hen = setTimeout(luuNgay, 800);
            };

            // --- Nhận ngày theo NGÀY/THÁNG/NĂM ---
            let ngayChoGhi: { hang: number; cot: number; serial: number } | null = null;

            const huyBefore = univerAPI.addEvent(univerAPI.Event.BeforeSheetEditEnd, (p) => {
                ngayChoGhi = null;
                if (!p.isConfirm) return;
                const serial = doiNgayVietSangSerial(p.value.toPlainText());
                if (serial !== null) ngayChoGhi = { hang: p.row, cot: p.column, serial };
            });

            const huyAfter = univerAPI.addEvent(univerAPI.Event.SheetEditEnded, (p) => {
                if (!p.isConfirm) return;
                const o = p.worksheet.getRange(p.row, p.column);
                if (ngayChoGhi && ngayChoGhi.hang === p.row && ngayChoGhi.cot === p.column) {
                    o.setValue(ngayChoGhi.serial).setNumberFormat(DINH_DANG_NGAY);
                    ngayChoGhi = null;
                } else if (DINH_DANG_NGAY_KIEU_MY.has(o.getNumberFormat())) {
                    o.setNumberFormat(DINH_DANG_NGAY);
                }
                luuTre();
            });

            const huyChange = univerAPI.addEvent(univerAPI.Event.SheetValueChanged, luuTre);

            huyRef.current = () => {
                if (hen) clearTimeout(hen);
                huyBefore.dispose();
                huyAfter.dispose();
                huyChange.dispose();
                univer.dispose();
                apiRef.current = null;
            };

            if (!daHuy) setSanSang(true);
        })();

        return () => {
            daHuy = true;
            huyRef.current?.();
            huyRef.current = null;
        };
    }, []);

    // Univer vẽ theo kích thước container; khi đổi vào/ra toàn màn hình phải báo
    // để nó vẽ lại cho vừa khung mới.
    useEffect(() => {
        if (!sanSang) return;
        const t = setTimeout(() => window.dispatchEvent(new Event('resize')), 60);
        return () => clearTimeout(t);
    }, [toanManHinh, sanSang]);

    // Bảng tính đi theo nút sáng/tối của site. ThemeToggle chỉ bật/tắt class
    // `dark` trên <html> (không phát sự kiện), nên theo dõi thẳng attribute đó.
    // Trước đây grid luôn trắng kể cả khi cả site đã tối — chói và lệch tông.
    useEffect(() => {
        if (!sanSang) return;
        const apDung = () => {
            const toi = document.documentElement.classList.contains('dark');
            apiRef.current?.toggleDarkMode(toi);
            // Đo 13/09/2026 trên 0.25.1: `toggleDarkMode(true)` gắn class
            // `univer-dark` lên <html>, nhưng `toggleDarkMode(false)` KHÔNG gỡ nó
            // ra — grid kẹt ở chế độ tối sau lần bật đầu tiên. Tự đồng bộ class
            // cho chắc; nếu Univer có gỡ thì dòng này vô hại.
            document.documentElement.classList.toggle('univer-dark', toi);
        };
        apDung();
        const quanSat = new MutationObserver(apDung);
        quanSat.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => quanSat.disconnect();
    }, [sanSang]);

    // Toàn màn hình bằng Fullscreen API THẬT (ẩn cả thanh tab trình duyệt) khi có;
    // trình duyệt không hỗ trợ thì rơi về khung `fixed inset-0` như trước.
    // Trạng thái đọc từ `fullscreenchange` để Esc / nút F11 của trình duyệt cũng
    // đồng bộ, không chỉ nút của mình.
    useEffect(() => {
        const dongBo = () => setToanManHinh(Boolean(document.fullscreenElement));
        document.addEventListener('fullscreenchange', dongBo);
        return () => document.removeEventListener('fullscreenchange', dongBo);
    }, []);

    const doiToanManHinh = useCallback(async () => {
        const khung = khungRef.current;
        if (!khung) return;
        if (!document.fullscreenEnabled) {
            setToanManHinh((v) => !v);
            return;
        }
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else await khung.requestFullscreen();
        } catch {
            setToanManHinh((v) => !v);
        }
    }, []);

    // Esc để thoát chế độ khung `fixed` (trường hợp không có Fullscreen API).
    useEffect(() => {
        if (!toanManHinh || document.fullscreenElement) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setToanManHinh(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [toanManHinh]);

    /** Thay workbook hiện tại bằng snapshot mới (dùng chung cho mở file / phiên mới). */
    const thayWorkbook = useCallback((snapshot: Partial<IWorkbookData>) => {
        const api = apiRef.current;
        if (!api) return;
        const idCu = api.getActiveWorkbook()?.getId();
        api.createWorkbook(snapshot);
        api.getActiveWorkbook()?.setNumfmtLocal('en');
        if (idCu) api.disposeUnit(idCu);
    }, []);

    // --- Mở file .xlsx của học viên ---
    const khiChonFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ''; // cho phép chọn lại cùng file
        if (!file) return;

        setLoi(null);
        setThongBao(null);
        setDangXuLy(true);
        try {
            const buffer = await file.arrayBuffer();
            const snapshot = await docXlsxSangSnapshot(buffer);
            thayWorkbook(snapshot);
            const snap = apiRef.current?.getActiveWorkbook()?.save();
            if (snap) luuPhien(snap);
            setThongBao('Đã mở file. Lưu ý: biểu đồ, PivotTable và định dạng phức tạp có thể không hiển thị — bản gốc trên máy bạn không bị đổi.');
        } catch {
            setLoi('Không đọc được file. Hãy chắc chắn đây là file .xlsx hợp lệ.');
        } finally {
            setDangXuLy(false);
        }
    }, [thayWorkbook]);

    // --- Tải bài đang làm về máy ---
    const taiVe = useCallback(async () => {
        const snap = apiRef.current?.getActiveWorkbook()?.save();
        if (!snap) return;
        setDangXuLy(true);
        try {
            await taiSnapshotXuongXlsx(snap, TEN_FILE_TAI_VE);
        } catch {
            setLoi('Không tạo được file tải về. Vui lòng thử lại.');
        } finally {
            setDangXuLy(false);
        }
    }, []);

    // --- Bắt đầu phiên mới (bảng trắng) ---
    const phienMoi = useCallback(() => {
        if (!window.confirm('Xoá hết và bắt đầu bảng tính trắng? Bài chưa tải về sẽ mất.')) return;
        setLoi(null);
        setThongBao(null);
        xoaPhien();
        setHamDangChon(null);
        if (window.location.hash) history.replaceState(null, '', window.location.pathname);
        thayWorkbook({});
    }, [thayWorkbook]);

    // --- Chọn một hàm: ưu tiên bài đã lưu của người này, không có thì nạp ví dụ mẫu ---
    const napHam = useCallback(async (tenHam: string, { epViDuGoc = false } = {}) => {
        const ten = tenHam.toUpperCase();
        setLoi(null);
        setThongBao(null);
        setViDuDangNap(ten);
        try {
            let snapshot: Partial<IWorkbookData> | null = null;
            let nguon: 'bai-lam' | 'vi-du' = 'vi-du';

            if (!epViDuGoc) {
                const rBai = await fetch(`/api/thuc-hanh/bai-lam?ten_ham=${encodeURIComponent(ten)}`);
                if (rBai.ok) {
                    snapshot = (await rBai.json()).snapshot as Partial<IWorkbookData>;
                    nguon = 'bai-lam';
                }
            }
            if (!snapshot) {
                const rViDu = await fetch(`/api/vi-du-ham?ten=${encodeURIComponent(ten)}`);
                if (!rViDu.ok) throw new Error('khong-co-vi-du');
                snapshot = (await rViDu.json()).item?.snapshot ?? null;
            }

            setHamDangChon(ten);
            history.replaceState(null, '', `${window.location.pathname}#ham=${ten}`);

            if (snapshot) {
                thayWorkbook(snapshot);
                if (nguon === 'bai-lam') setThongBao('Đã mở bài bạn làm lần trước. Muốn về ví dụ gốc thì bấm "Nạp lại ví dụ".');
            } else {
                // Hàm có trong danh mục nhưng admin chưa soạn ví dụ: mở bảng trắng
                // kèm công thức mẫu ở A1 để người dùng có chỗ bắt đầu.
                const vd = danhMuc.find((h) => h.ten_ham === ten);
                thayWorkbook({});
                if (vd?.cong_thuc_mau) {
                    apiRef.current?.getActiveWorkbook()?.getActiveSheet()?.getRange(0, 0).setValue(vd.cong_thuc_mau);
                }
                setThongBao('Hàm này chưa có ví dụ nạp sẵn — công thức mẫu đã đặt ở A1, bạn dựng dữ liệu rồi thử.');
            }
        } catch {
            setLoi('Không tải được ví dụ. Kiểm tra mạng rồi bấm lại hàm đó.');
        } finally {
            setViDuDangNap(null);
        }
    }, [danhMuc, thayWorkbook]);

    // Mở từ bài viết: /thuc-hanh#ham=XLOOKUP. Chờ bảng tính sẵn sàng rồi mới nạp.
    useEffect(() => {
        if (!sanSang) return;
        const ap = () => {
            const ten = docHamTuHash();
            if (ten && ten !== hamDangChonRef.current) napHam(ten);
        };
        ap();
        window.addEventListener('hashchange', ap);
        return () => window.removeEventListener('hashchange', ap);
    }, [sanSang, napHam]);

    // Admin: sao chép snapshot để dán vào /admin/vi-du-ham.
    const saoChepSnapshot = useCallback(async () => {
        const snap = apiRef.current?.getActiveWorkbook()?.save();
        if (!snap) return;
        try {
            await navigator.clipboard.writeText(JSON.stringify(snap));
            setDaSaoChep(true);
            setTimeout(() => setDaSaoChep(false), 1800);
        } catch {
            setLoi('Trình duyệt không cho sao chép tự động — mở console và dùng "Tải về" thay thế.');
        }
    }, []);

    // Nút "ma" (không viền, không nền) theo token của site. Đây là thao tác phụ
    // (mở/tải/phiên mới) nên không được nổi hơn ribbon của bảng tính bên dưới.
    // Bản cũ dùng `border-gray-300 bg-white` — xám lạc hệ, và không có bản tối.
    const nutClass =
        'inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-sunken hover:text-fg disabled:opacity-50 disabled:hover:bg-transparent';

    return (
        <div
            ref={khungRef}
            className={
                toanManHinh && !document.fullscreenElement
                    ? 'bang-tinh-excel fixed inset-0 z-[60] flex flex-col bg-card'
                    : 'bang-tinh-excel flex h-full w-full flex-col bg-card'
            }
        >
            {/* Thanh thao tác của trang (không phải của Univer). Một hàng, thấp,
                cùng màu nền với ribbon để hai thanh đọc như một khối. */}
            <div className="relative flex items-center gap-1 border-b border-line bg-card px-2 py-1">
                <span className="mr-2 inline-flex items-center gap-1.5 pl-1 text-sm font-semibold text-fg">
                    <Sheet className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    Thực hành Excel
                </span>

                <button type="button" onClick={() => inputFileRef.current?.click()} disabled={!sanSang || dangXuLy} className={nutClass}>
                    <Upload className="h-4 w-4" aria-hidden="true" /> Mở file
                </button>
                <button type="button" onClick={taiVe} disabled={!sanSang || dangXuLy} className={nutClass}>
                    <Download className="h-4 w-4" aria-hidden="true" /> Tải về
                </button>
                <button type="button" onClick={phienMoi} disabled={!sanSang || dangXuLy} className={nutClass}>
                    <FilePlus2 className="h-4 w-4" aria-hidden="true" /> Phiên mới
                </button>

                {/* Trạng thái: hiện tại chỗ, có aria-live để trình đọc màn hình đọc. */}
                <span aria-live="polite" className="ml-2 min-w-0 truncate text-sm">
                    {dangXuLy && <span className="text-fg-subtle">Đang xử lý…</span>}
                    {loi && <span className="text-red-600 dark:text-red-400">{loi}</span>}
                    {thongBao && !loi && <span className="text-amber-700 dark:text-amber-400">{thongBao}</span>}
                </span>

                <div className="ml-auto flex items-center gap-1">
                    {/* Trạng thái lưu online — chỉ biểu tượng, có tên cho trình đọc màn hình */}
                    <span
                        className="mr-1 inline-flex min-h-9 items-center text-fg-subtle"
                        title={luuOnline === 'loi' ? 'Chưa lưu được online — bài vẫn giữ trong tab này' : luuOnline === 'xong' ? 'Đã lưu online' : luuOnline === 'dang' ? 'Đang lưu…' : ''}
                        aria-live="polite"
                    >
                        {luuOnline === 'xong' && <CloudCheck className="h-4 w-4 text-brand-600" aria-label="Đã lưu online" />}
                        {luuOnline === 'loi' && <CloudOff className="h-4 w-4 text-amber-600" aria-label="Chưa lưu được online" />}
                        {luuOnline === 'dang' && <CloudCheck className="h-4 w-4 animate-pulse opacity-50" aria-label="Đang lưu" />}
                    </span>
                    {laAdmin && (
                        <button type="button" onClick={saoChepSnapshot} disabled={!sanSang} className={nutClass} title="Sao chép JSON snapshot để dán vào /admin/vi-du-ham">
                            {daSaoChep ? <Check className="h-4 w-4 text-brand-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                            <span className="hidden xl:inline">{daSaoChep ? 'Đã sao chép' : 'Sao chép snapshot'}</span>
                        </button>
                    )}
                    {danhMuc.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setHienPanel((v) => !v)}
                            aria-pressed={hienPanel}
                            className={nutClass}
                        >
                            {hienPanel ? <PanelRightClose className="h-4 w-4" aria-hidden="true" /> : <PanelRightOpen className="h-4 w-4" aria-hidden="true" />}
                            <span className="hidden xl:inline">Hàm 365</span>
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setHienGiupDo((v) => !v)}
                        aria-expanded={hienGiupDo}
                        aria-label="Lưu ý khi dùng bảng tính"
                        className={`${nutClass} min-w-9 justify-center px-0`}
                    >
                        <CircleHelp className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={doiToanManHinh} disabled={!sanSang} className={nutClass}>
                        {toanManHinh ? <Minimize2 className="h-4 w-4" aria-hidden="true" /> : <Maximize2 className="h-4 w-4" aria-hidden="true" />}
                        <span className="hidden xl:inline">{toanManHinh ? 'Thoát toàn màn hình' : 'Toàn màn hình'}</span>
                    </button>
                </div>

                {/* Ba lưu ý trước đây chiếm nguyên một thanh xám phía trên; giờ nằm
                    trong nút "?" — ai cần mới mở. */}
                {hienGiupDo && (
                    <div
                        role="dialog"
                        aria-label="Lưu ý khi dùng bảng tính"
                        className="absolute right-2 top-full z-20 mt-1 w-80 rounded-2xl border border-line bg-card p-4 text-sm leading-relaxed text-fg-muted shadow-e3"
                    >
                        <ul className="space-y-2">
                            <li>Bảng tính chạy ngay trong trình duyệt, không cần cài Excel hay tài khoản Microsoft.</li>
                            <li>Giao diện tiếng Anh như Excel; giải thích hàm khi gõ là tiếng Việt.</li>
                            <li>Hỗ trợ hầu hết hàm Excel 365 mới (XLOOKUP, FILTER, LET, LAMBDA, TEXTSPLIT…). Chưa có: GROUPBY, PIVOTBY, REGEXTEST, TRIMRANGE.</li>
                            <li>Mỗi người một phiên riêng — bấm <b className="text-fg">Tải về</b> để giữ bài dưới dạng .xlsx.</li>
                        </ul>
                    </div>
                )}

                <input ref={inputFileRef} type="file" accept=".xlsx,.xls" onChange={khiChonFile} className="hidden" />
            </div>

            {/* Grid + panel chọn hàm. Panel là aside thật (có tên), thu gọn được. */}
            <div className="flex min-h-0 flex-1">
                <div ref={containerRef} className="min-h-0 min-w-0 flex-1" />

                {danhMuc.length > 0 && hienPanel && (
                    <aside
                        aria-label="Danh mục hàm Excel 365"
                        className="flex w-72 shrink-0 flex-col border-l border-line bg-card"
                    >
                        {/* Hàm đang chọn: giải thích + công thức mẫu + link bài */}
                        {viDuHienTai ? (
                            <div className="border-b border-line p-3">
                                <div className="flex items-start justify-between gap-2">
                                    <h2 className="font-mono text-base font-bold text-fg">{viDuHienTai.ten_ham}</h2>
                                    <button
                                        type="button"
                                        onClick={() => napHam(viDuHienTai.ten_ham, { epViDuGoc: true })}
                                        disabled={viDuDangNap !== null}
                                        className="inline-flex min-h-8 items-center gap-1 rounded-md px-2 text-xs text-fg-muted hover:bg-sunken hover:text-fg disabled:opacity-50"
                                        title="Bỏ bài đang làm, nạp lại ví dụ gốc"
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Nạp lại ví dụ
                                    </button>
                                </div>
                                {viDuHienTai.mo_ta && <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{viDuHienTai.mo_ta}</p>}
                                {viDuHienTai.cong_thuc_mau && (
                                    <code className="mt-2 block overflow-x-auto rounded-md bg-sunken px-2 py-1.5 font-mono text-xs text-fg">{viDuHienTai.cong_thuc_mau}</code>
                                )}
                                {viDuHienTai.post_slug && (
                                    <Link href={`/blog/${viDuHienTai.post_slug}`} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
                                        Đọc bài viết về hàm này <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="border-b border-line p-3">
                                <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg">
                                    <FunctionSquare className="h-4 w-4 text-brand-600" aria-hidden="true" /> Thử hàm Excel 365
                                </h2>
                                <p className="mt-1 text-xs leading-relaxed text-fg-subtle">
                                    Bấm một hàm để nạp dữ liệu mẫu và công thức đã gõ sẵn. Sửa công thức, xem kết quả đổi ngay.
                                </p>
                            </div>
                        )}

                        {/* Danh mục theo nhóm */}
                        <nav className="min-h-0 flex-1 overflow-y-auto p-2" aria-label="Nhóm hàm">
                            {nhomHam.map(({ nhom, ham }) => (
                                <div key={nhom} className="mb-3">
                                    <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">{nhom}</p>
                                    <ul className="space-y-0.5">
                                        {ham.map((h) => {
                                            const dangChon = h.ten_ham === hamDangChon;
                                            const dangNap = h.ten_ham === viDuDangNap;
                                            return (
                                                <li key={h.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => h.ho_tro && napHam(h.ten_ham)}
                                                        disabled={!h.ho_tro || viDuDangNap !== null}
                                                        aria-current={dangChon ? 'true' : undefined}
                                                        title={h.ho_tro ? h.cong_thuc_mau ?? undefined : 'Engine hiện chưa có hàm này'}
                                                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left font-mono text-sm transition-colors ${dangChon
                                                            ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                                                            : h.ho_tro
                                                                ? 'text-fg hover:bg-sunken'
                                                                : 'cursor-not-allowed text-fg-faint'
                                                            }`}
                                                    >
                                                        <span className="truncate">{h.ten_ham}</span>
                                                        {dangNap && <span className="ml-auto text-[11px] text-fg-subtle">đang nạp…</span>}
                                                        {!h.ho_tro && <span className="ml-auto rounded bg-surface-200 px-1.5 py-0.5 font-sans text-[10px] font-medium text-fg-muted dark:bg-surface-700">chưa có</span>}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </aside>
                )}
            </div>
        </div>
    );
}
