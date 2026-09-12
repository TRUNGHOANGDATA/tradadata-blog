/**
 * Ghép ngôn ngữ cho bảng tính:
 *   - TOÀN BỘ giao diện Univer để TIẾNG ANH chuẩn Microsoft (menu, chuột phải,
 *     thanh công cụ, tooltip, nhãn định dạng số...). Base = en-US.
 *   - CHỈ tiếng Việt ở phần GIẢI THÍCH HÀM: mô tả "làm gì" và diễn giải từng
 *     tham số. Tên tham số (`sum_range`...) GIỮ tiếng Anh như Excel Online.
 *
 * Vì sao tách được: mỗi hàm trong `sheets-formula.functionList` có 3 tầng riêng
 * (`description`/`abstract` = làm gì, `functionParameter.*.name` = tên tham số hiện
 * trong chữ ký, `functionParameter.*.detail` = diễn giải tham số). Ta lấy en-US làm
 * nền rồi chỉ ghi đè `description`, `abstract`, `.detail` bằng vi-VN.
 */

// Kiểu tối thiểu cho một hàm trong functionList — chỉ khai những gì ta đụng tới.
interface IThamSoHam {
    name?: string;
    detail?: string;
    [k: string]: unknown;
}
interface IMoTaHam {
    description?: string;
    abstract?: string;
    functionParameter?: Record<string, IThamSoHam>;
    [k: string]: unknown;
}
type TFunctionList = Record<string, IMoTaHam>;

// Cấu trúc locale ta cần đọc/ghi. Các nhánh khác giữ nguyên nên để lỏng.
interface ILocale {
    'sheets-formula'?: { functionList?: TFunctionList };
    [k: string]: unknown;
}

/**
 * Trả về một locale mới: nền tiếng Anh, phần giải thích hàm tiếng Việt.
 * Không làm biến đổi (mutate) hai locale đầu vào.
 */
export function ghepNgonNgu(enUS: ILocale, viVN: ILocale): ILocale {
    const enFns = enUS['sheets-formula']?.functionList ?? {};
    const viFns = viVN['sheets-formula']?.functionList ?? {};

    const functionListMoi: TFunctionList = {};

    for (const ten of Object.keys(enFns)) {
        const en = enFns[ten];
        const vi = viFns[ten];

        // Không có bản dịch -> giữ nguyên tiếng Anh
        if (!vi) {
            functionListMoi[ten] = en;
            continue;
        }

        // Ghi đè tham số: giữ TÊN tiếng Anh, chỉ đổi DIỄN GIẢI sang tiếng Việt
        const thamSoMoi: Record<string, IThamSoHam> = {};
        const enParams = en.functionParameter ?? {};
        const viParams = vi.functionParameter ?? {};
        for (const khoa of Object.keys(enParams)) {
            thamSoMoi[khoa] = {
                ...enParams[khoa],
                detail: viParams[khoa]?.detail ?? enParams[khoa].detail,
            };
        }

        functionListMoi[ten] = {
            ...en,
            description: vi.description ?? en.description,
            abstract: vi.abstract ?? en.abstract,
            functionParameter: thamSoMoi,
        };
    }

    return {
        ...enUS,
        'sheets-formula': {
            ...enUS['sheets-formula'],
            functionList: functionListMoi,
        },
    };
}
