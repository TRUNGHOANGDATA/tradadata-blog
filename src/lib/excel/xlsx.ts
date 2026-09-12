/**
 * Đọc/ghi file .xlsx hoàn toàn ở TRÌNH DUYỆT, không gửi lên server.
 *
 * Vì sao không dùng import/export của Univer: bản OSS cần một server "exchange"
 * của Univer Pro. Ta không dựng server đó, nên tự parse bằng SheetJS (xlsx,
 * Apache-2.0) rồi map sang/từ snapshot `IWorkbookData` của Univer.
 *
 * `xlsx` được dynamic-import BÊN TRONG hàm để nó chỉ tải khi người dùng thật sự
 * bấm mở/tải file, không nằm trong chunk lúc mở bảng tính.
 *
 * ⚠️ Fidelity có giới hạn: mang được dữ liệu, công thức và định dạng số cơ bản.
 * PivotTable, biểu đồ, conditional formatting, macro sẽ không giữ được — đây là
 * giới hạn chung của mọi thư viện JS, không phải lỗi.
 */
import type { IWorkbookData, ICellData, IWorksheetData } from '@univerjs/core';

/** Đọc ArrayBuffer của file .xlsx thành snapshot để nạp vào Univer. */
export async function docXlsxSangSnapshot(duLieu: ArrayBuffer): Promise<Partial<IWorkbookData>> {
    const XLSX = await import('xlsx');

    // cellFormula: giữ công thức; cellNF: giữ chuỗi định dạng số; cellDates:false
    // để ngày ở dạng số serial (Univer lưu ngày bằng serial + pattern).
    const wb = XLSX.read(duLieu, { type: 'array', cellFormula: true, cellNF: true, cellDates: false });

    const sheets: Record<string, Partial<IWorksheetData>> = {};
    const sheetOrder: string[] = [];
    const styles: Record<string, { n: { pattern: string } }> = {};
    // Gộp các ô cùng một pattern định dạng vào chung một style id
    const patternToId = new Map<string, string>();

    const layStyleId = (pattern: string): string => {
        let id = patternToId.get(pattern);
        if (!id) {
            id = `nf${patternToId.size + 1}`;
            patternToId.set(pattern, id);
            styles[id] = { n: { pattern } };
        }
        return id;
    };

    wb.SheetNames.forEach((ten, i) => {
        const ws = wb.Sheets[ten];
        const sheetId = `sheet-${i + 1}`;
        sheetOrder.push(sheetId);

        const cellData: Record<number, Record<number, ICellData>> = {};
        let soHang = 0;
        let soCot = 0;

        const ref = ws['!ref'];
        if (ref) {
            const vung = XLSX.utils.decode_range(ref);
            soHang = vung.e.r + 1;
            soCot = vung.e.c + 1;

            for (let r = vung.s.r; r <= vung.e.r; r++) {
                for (let c = vung.s.c; c <= vung.e.c; c++) {
                    const diaChi = XLSX.utils.encode_cell({ r, c });
                    const oXlsx = ws[diaChi];
                    if (!oXlsx) continue;

                    const o: ICellData = {};
                    if (oXlsx.f) {
                        // SheetJS trả công thức KHÔNG có dấu "=" — Univer cần có
                        o.f = `=${oXlsx.f}`;
                    } else if (oXlsx.v !== undefined && oXlsx.v !== null) {
                        o.v = oXlsx.v as ICellData['v'];
                    } else {
                        continue;
                    }

                    // Định dạng số (kể cả ngày) -> style pattern của Univer
                    const pattern = oXlsx.z;
                    if (typeof pattern === 'string' && pattern && pattern !== 'General') {
                        o.s = layStyleId(pattern);
                    }

                    (cellData[r] ??= {})[c] = o;
                }
            }
        }

        sheets[sheetId] = {
            id: sheetId,
            name: ten.slice(0, 31) || `Sheet${i + 1}`,
            cellData,
            rowCount: Math.max(soHang + 20, 100),
            columnCount: Math.max(soCot + 6, 26),
        };
    });

    // Không có sheet nào -> trả về một sheet trắng để khỏi vỡ
    if (sheetOrder.length === 0) {
        const id = 'sheet-1';
        return { sheetOrder: [id], sheets: { [id]: { id, name: 'Sheet1', rowCount: 100, columnCount: 26 } }, styles };
    }

    return { sheetOrder, sheets, styles };
}

/**
 * Chuyển snapshot Univer thành bytes .xlsx (thuần, không đụng DOM) — tách riêng
 * để test được ở node. `taiSnapshotXuongXlsx` gọi hàm này rồi mới kích tải về.
 */
export async function snapshotSangXlsx(snapshot: IWorkbookData): Promise<ArrayBuffer> {
    const XLSX = await import('xlsx');

    const wb = XLSX.utils.book_new();
    const styles = snapshot.styles ?? {};

    for (const sheetId of snapshot.sheetOrder) {
        const sheet = snapshot.sheets[sheetId];
        if (!sheet) continue;

        const ws: Record<string, unknown> = {};
        let maxR = 0;
        let maxC = 0;

        const cellData = (sheet.cellData ?? {}) as Record<number, Record<number, ICellData>>;
        for (const rStr of Object.keys(cellData)) {
            const r = Number(rStr);
            const hang = cellData[r];
            for (const cStr of Object.keys(hang)) {
                const c = Number(cStr);
                const o = hang[c];
                if (!o) continue;

                const diaChi = XLSX.utils.encode_cell({ r, c });
                const oXlsx: Record<string, unknown> = {};

                if (o.f) {
                    oXlsx.f = o.f.startsWith('=') ? o.f.slice(1) : o.f; // SheetJS: không dấu "="
                    // Ghi kèm GIÁ TRỊ đã tính (cache). File Excel thật luôn có cache;
                    // thiếu nó SheetJS bỏ luôn ô công thức lúc ghi, và Excel mở ra
                    // thấy trống cho tới khi tính lại.
                    if (o.v !== undefined && o.v !== null) {
                        oXlsx.v = o.v;
                        oXlsx.t = typeof o.v === 'number' ? 'n' : typeof o.v === 'boolean' ? 'b' : 's';
                    } else {
                        oXlsx.t = 'n';
                    }
                } else if (o.v !== undefined && o.v !== null) {
                    oXlsx.v = o.v;
                    oXlsx.t = typeof o.v === 'number' ? 'n' : typeof o.v === 'boolean' ? 'b' : 's';
                } else {
                    continue;
                }

                // Định dạng số từ style
                const styleId = typeof o.s === 'string' ? o.s : undefined;
                const pattern = styleId ? styles[styleId]?.n?.pattern : undefined;
                if (pattern) oXlsx.z = pattern;

                ws[diaChi] = oXlsx;
                if (r > maxR) maxR = r;
                if (c > maxC) maxC = c;
            }
        }

        ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: maxR, c: maxC } });
        XLSX.utils.book_append_sheet(wb, ws, (sheet.name ?? 'Sheet1').slice(0, 31));
    }

    // type:'array' của SheetJS trả về ArrayBuffer (không phải Uint8Array).
    return XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
}

/** Ghi snapshot Univer thành file .xlsx rồi kích tải về máy. */
export async function taiSnapshotXuongXlsx(snapshot: IWorkbookData, tenFile: string): Promise<void> {
    const duLieu = await snapshotSangXlsx(snapshot);
    const blob = new Blob([duLieu], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = tenFile.endsWith('.xlsx') ? tenFile : `${tenFile}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
