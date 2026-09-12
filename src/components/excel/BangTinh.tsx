'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, Download, FilePlus2, Maximize2, Minimize2, CircleHelp, Sheet } from 'lucide-react';
import { doiNgayVietSangSerial } from '@/lib/excel/ngay-thang';
import { ghepNgonNgu } from '@/lib/excel/locale';
import { docPhien, luuPhien, xoaPhien } from '@/lib/excel/luu-phien';
import { docXlsxSangSnapshot, taiSnapshotXuongXlsx } from '@/lib/excel/xlsx';
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

export default function BangTinh() {
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
            let hen: ReturnType<typeof setTimeout> | null = null;
            const luuNgay = () => {
                const snap = univerAPI.getActiveWorkbook()?.save();
                if (snap) luuPhien(snap);
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
        thayWorkbook({});
    }, [thayWorkbook]);

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

            <div ref={containerRef} className="min-h-0 flex-1" />
        </div>
    );
}
