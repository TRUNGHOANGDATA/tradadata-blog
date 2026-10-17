// Ảnh minh hoạ cho bài AutoSave/Version History
const path = require('path');
const { sinhAnh } = require('../../tao-anh-bai-viet.js');

const GOC = path.join(__dirname, '..', '..', 'public', 'images', 'bai-viet');
const dauXanh = t => ({ v: t, dam: true, nen: 'xanh' });

const bai = [
    {
        ten: 'as-01-dieu-kien',
        tieuDe: 'AutoSave chỉ bật được khi file nằm trên OneDrive/SharePoint',
        cot: [{ rong: 150 }, { rong: 100 }],
        hang: [
            [dauXanh('Vị trí file'), dauXanh('AutoSave')],
            [{ v: 'OneDrive / SharePoint', nen: 'xanh' }, { v: 'Bật được', dam: true }],
            [{ v: 'Ổ C:, USB (cục bộ)', nen: 'do' }, { v: 'Mờ, tắt', mau: '#c0392b' }],
        ],
    },
    {
        ten: 'as-02-khong-con-luoi-an-toan',
        tieuDe: '"Đóng không lưu để huỷ sửa" — hết tác dụng khi AutoSave bật',
        cot: [{ rong: 190 }, { rong: 130 }],
        hang: [
            [dauXanh('Cách cũ'), dauXanh('Với AutoSave bật')],
            [{ v: 'Đóng file, chọn "Không lưu"', canLe: 'trai' }, { v: 'Đã lưu rồi, vô tác dụng', mau: '#c0392b', dam: true }],
        ],
    },
    {
        ten: 'as-03-version-history',
        tieuDe: 'File → Info → Version History để khôi phục mốc cũ',
        cot: [{ rong: 100 }, { rong: 130 }],
        hang: [
            [dauXanh('Thao tác'), dauXanh('Kết quả')],
            ['Restore', { v: 'Quay hẳn về mốc đó', nen: 'xanh', dam: true }],
            ['Download a copy', 'Lấy bản cũ, giữ bản hiện tại'],
        ],
    },
    {
        ten: 'as-04-autosave-vs-autorecover',
        tieuDe: 'AutoSave (đồng bộ liên tục) khác AutoRecover (phòng khi crash)',
        cot: [{ rong: 120 }, { rong: 130 }, { rong: 190 }],
        hang: [
            [dauXanh('Tính năng'), dauXanh('Chạy ở đâu'), dauXanh('Mục đích')],
            [{ v: 'AutoSave', nen: 'xanh' }, 'Chỉ file đám mây', 'Đồng bộ liên tục'],
            [{ v: 'AutoRecover', nen: 'vang' }, 'Mọi file', 'Phòng treo máy, mất điện'],
        ],
    },
];

const LO = [{ slug: 'autosave-version-history', anh: bai }];

async function chay() {
    let tong = 0;
    for (const b of LO) for (const spec of b.anh) {
        const r = await sinhAnh(spec, path.join(GOC, b.slug));
        tong += r.nang;
        console.log(`  ${b.slug}/${spec.ten}.png  ${r.rong}x${r.cao}  ${(r.nang / 1024).toFixed(0)} KB`);
    }
    console.log(`Tổng ${(tong / 1024).toFixed(0)} KB`);
}
if (require.main === module) chay().catch(e => { console.error(e); process.exit(1); });
module.exports = { LO };
