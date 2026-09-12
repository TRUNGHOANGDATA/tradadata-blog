'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, Download, FilePlus2, Maximize2, Minimize2 } from 'lucide-react';
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
// Ghi đè màu chủ đạo sang xanh Excel — import SAU để thắng CSS gốc của Univer.
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

    // --- Khởi tạo Univer một lần ---
    useEffect(() => {
        let daHuy = false;

        (async () => {
            const [
                { createUniver, LocaleType, merge },
                { UniverSheetsCorePreset },
                { UniverSheetsFilterPreset },
                { UniverSheetsSortPreset },
                { UniverSheetsConditionalFormattingPreset },
                { UniverSheetsDataValidationPreset },
                { UniverSheetsFindReplacePreset },
                { UniverSheetsTablePreset },
                { UniverSheetsNotePreset },
                enCore, viCore,
                enFilter, enSort, enCF, enDV, enFR, enTable, enNote,
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
                import('@univerjs/presets/preset-sheets-core/locales/en-US'),
                import('@univerjs/presets/preset-sheets-core/locales/vi-VN'),
                import('@univerjs/presets/preset-sheets-filter/locales/en-US'),
                import('@univerjs/presets/preset-sheets-sort/locales/en-US'),
                import('@univerjs/presets/preset-sheets-conditional-formatting/locales/en-US'),
                import('@univerjs/presets/preset-sheets-data-validation/locales/en-US'),
                import('@univerjs/presets/preset-sheets-find-replace/locales/en-US'),
                import('@univerjs/presets/preset-sheets-table/locales/en-US'),
                import('@univerjs/presets/preset-sheets-note/locales/en-US'),
            ]);

            if (daHuy || !containerRef.current) return;

            // Nền UI tiếng Anh: gộp locale en-US của lõi + mọi preset chức năng.
            const mergedEn = merge(
                {},
                enCore.default, enFilter.default, enSort.default, enCF.default,
                enDV.default, enFR.default, enTable.default, enNote.default,
            );
            // Toàn bộ UI tiếng Anh; CHỈ giải thích hàm là tiếng Việt (lấy từ core vi-VN).
            // Bọc merge({}, ...) để khớp kiểu ILanguagePack mà createUniver mong đợi.
            const ngonNgu = merge({}, ghepNgonNgu(mergedEn, viCore.default));

            const { univer, univerAPI } = createUniver({
                locale: LocaleType.EN_US,
                locales: { [LocaleType.EN_US]: ngonNgu },
                presets: [
                    UniverSheetsCorePreset({ container: containerRef.current }),
                    UniverSheetsFilterPreset(),
                    UniverSheetsSortPreset(),
                    UniverSheetsConditionalFormattingPreset(),
                    UniverSheetsDataValidationPreset(),
                    UniverSheetsFindReplacePreset(),
                    UniverSheetsTablePreset(),
                    UniverSheetsNotePreset(),
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

    // Esc để thoát toàn màn hình
    useEffect(() => {
        if (!toanManHinh) return;
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

    const nutClass =
        'inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50';

    return (
        <div
            className={
                toanManHinh
                    ? 'bang-tinh-excel fixed inset-0 z-[60] flex flex-col bg-white'
                    : 'bang-tinh-excel flex h-full w-full flex-col'
            }
        >
            {/* Thanh thao tác của trang (không phải của Univer) */}
            <div className="flex flex-wrap items-center gap-2 border-b bg-gray-50 px-3 py-2">
                <button type="button" onClick={() => inputFileRef.current?.click()} disabled={!sanSang || dangXuLy} className={nutClass}>
                    <Upload className="h-4 w-4" /> Mở file Excel
                </button>
                <button type="button" onClick={taiVe} disabled={!sanSang || dangXuLy} className={nutClass}>
                    <Download className="h-4 w-4" /> Tải về máy
                </button>
                <button type="button" onClick={phienMoi} disabled={!sanSang || dangXuLy} className={nutClass}>
                    <FilePlus2 className="h-4 w-4" /> Phiên mới
                </button>
                <button type="button" onClick={() => setToanManHinh((v) => !v)} disabled={!sanSang} className={`${nutClass} ml-auto`}>
                    {toanManHinh ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    {toanManHinh ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
                </button>

                {dangXuLy && <span className="text-sm text-gray-500">Đang xử lý…</span>}
                {loi && <span className="text-sm text-red-600">{loi}</span>}
                {thongBao && !loi && <span className="text-sm text-amber-700">{thongBao}</span>}

                <input ref={inputFileRef} type="file" accept=".xlsx,.xls" onChange={khiChonFile} className="hidden" />
            </div>

            <div ref={containerRef} className="min-h-0 flex-1" />
        </div>
    );
}
