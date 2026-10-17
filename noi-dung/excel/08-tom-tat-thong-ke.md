---
tieu_de: "Tóm tắt một bộ dữ liệu lạ trong vài phút bằng nhóm hàm thống kê"
slug: "tom-tat-du-lieu-bang-ham-thong-ke-excel"
danh_muc: "Excel"
the: ["thống kê", "nền tảng Excel", "AVERAGE", "MEDIAN", "SUBTOTAL"]
mo_ta: "Nhận một bảng dữ liệu lạ, làm sao nắm được nó trong vài phút mà không cần biết thống kê nâng cao? Bài này là góc đọc số: AVERAGE so với MEDIAN để biết dữ liệu có bị đơn lớn kéo lệch, COUNT so với COUNTA để bắt ô lỗi, MIN/MAX soi số bất thường, và SUBTOTAL khi đang lọc."
tu_khoa: "hàm thống kê Excel, AVERAGE MEDIAN, COUNT COUNTA, SUBTOTAL, tóm tắt dữ liệu Excel, đọc số thống kê mô tả"
anh_bia: "/images/bai-viet/tom-tat-thong-ke/cover.png"
thu_muc_anh: "tom-tat-thong-ke"
trang_thai: "draft"
---

Ai đó gửi cho bạn một file Excel mấy trăm dòng và hỏi "thấy sao?". Bạn không cần biết thống kê nâng cao — chỉ cần một nhóm hàm cơ bản dùng đúng cách là nắm được hình dạng của dữ liệu trong vài phút, và quan trọng hơn, **phát hiện dữ liệu có sạch không** trước khi tin vào bất kỳ con số nào.

Bài này không đi sâu cú pháp từng hàm — mỗi hàm đều có bài riêng, sẽ dẫn link. Đây là góc **đọc số**: dùng hàm nào để trả lời câu hỏi nào. Các ví dụ dùng bảng bán hàng `BanHang` (xem [bài về Table](/blog/excel-table-va-tham-chieu-theo-ten-cot)).

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Bước 1: AVERAGE so với MEDIAN — dữ liệu có bị kéo lệch không

Đừng bao giờ báo cáo mỗi số trung bình. Tính cả trung bình lẫn trung vị rồi so:

```excel
=AVERAGE(BanHang[Doanh thu (VNĐ)])
=MEDIAN(BanHang[Doanh thu (VNĐ)])
```

{{anh:tk-01-average-median}}

Trong bảng mẫu, trung bình mỗi đơn là **71.862.500 đ** còn trung vị là **55.200.000 đ**. Trung bình cao hơn trung vị khá nhiều — dấu hiệu có vài đơn *rất lớn* kéo trung bình lên, trong khi phần lớn đơn thật ra nhỏ hơn. Nếu chỉ báo cáo trung bình, bạn vẽ ra một bức tranh lạc quan hơn thực tế. Nguyên tắc: **trung bình lệch nhiều so với trung vị nghĩa là có giá trị cực đoan** — nên nêu cả hai. (Xem [MEDIAN và nhóm hàm liên quan](/blog/ham-max-min-large-va-small-tim-gia-tri-lon-nhat-nho-nhat).)

## Bước 2: COUNT so với COUNTA — dữ liệu có sạch không

Đây là mẹo bắt lỗi quan trọng nhất. `COUNT` chỉ đếm ô là **số**; `COUNTA` đếm mọi ô **có nội dung**; `COUNTBLANK` đếm ô trống:

```excel
=COUNT(BanHang[Điểm hài lòng])
=COUNTA(BanHang[Điểm hài lòng])
=COUNTBLANK(BanHang[Điểm hài lòng])
```

{{anh:tk-02-count-counta}}

Trong bảng mẫu, cột Điểm hài lòng có **34** ô là số nhưng **35** ô có nội dung. Hai con số lệch nhau đúng một ô — nghĩa là còn **một ô lưu số dạng văn bản** đang trà trộn. Nếu bạn `AVERAGE` cột này mà không để ý, kết quả sẽ tính sai vì ô văn bản bị bỏ qua. Đây là bài [số bị lưu thành văn bản](/blog/so-bi-luu-thanh-van-ban-trong-excel) xuất hiện lại trong thực tế. (Chi tiết ba hàm đếm: [COUNT, COUNTA và COUNTBLANK](/blog/ham-count-counta-va-countblank-ba-ham-dem-de-nham).)

## Bước 3: MIN và MAX — soi khoảng và số bất thường

```excel
=MIN(BanHang[Doanh thu (VNĐ)])
=MAX(BanHang[Doanh thu (VNĐ)])
```

{{anh:tk-03-min-max}}

Đơn nhỏ nhất **1.300.000 đ**, đơn lớn nhất **222.000.000 đ** — chênh nhau khoảng 171 lần. Biết khoảng này *trước* khi tin vào trung bình. `MIN`/`MAX` còn để soi số nhập sai đơn vị: một `MAX` lớn bất thường thường là ô thừa/thiếu số 0, một `MIN` bằng 0 hay âm là dữ liệu lỗi.

## Bước 4: đếm và cộng có điều kiện — cắt theo nhóm

Khi đã tin dữ liệu sạch, cắt theo nhóm để thấy cấu trúc:

```excel
=COUNTIF(BanHang[Khu vực],"Miền Nam")
=SUMIF(BanHang[Nhóm sản phẩm],"Laptop",BanHang[Doanh thu (VNĐ)])
```

{{anh:tk-04-countif-sumif}}

`COUNTIF`/`SUMIF` cho biết mỗi khu vực có bao nhiêu đơn, mỗi nhóm sản phẩm đóng góp bao nhiêu doanh thu. Cần nhiều điều kiện cùng lúc thì dùng `COUNTIFS`/`SUMIFS`. (Xem [SUMIF và SUMIFS](/blog/ham-sumif-va-sumifs-trong-excel-tinh-tong-co-dieu-kien).)

## Bước 5: SUBTOTAL — con số biết nghe theo bộ lọc

Đây là hàm hay bị bỏ quên nhưng cực hữu ích khi khám phá dữ liệu:

```excel
=SUBTOTAL(109,BanHang[Doanh thu (VNĐ)])
```

{{anh:tk-05-subtotal}}

Khác với `SUM` (luôn cộng cả cột), `SUBTOTAL` với mã `109` **chỉ tính những dòng đang hiển thị** sau khi lọc. Bật Filter (`Ctrl + Shift + L`), lọc khu vực Miền Bắc — ô `SUBTOTAL` tự đổi thành tổng riêng Miền Bắc; bỏ lọc thì về tổng cả bảng. Nhờ đó bạn khám phá dữ liệu tương tác: cứ lọc và nhìn con số nhảy theo, không cần viết thêm công thức.

## Quy trình gói gọn

1. `AVERAGE` vs `MEDIAN` → dữ liệu có bị kéo lệch?
2. `COUNT` vs `COUNTA` vs `COUNTBLANK` → dữ liệu có sạch, có thiếu?
3. `MIN`/`MAX` → khoảng giá trị, số bất thường?
4. `COUNTIF`/`SUMIF` → cấu trúc theo nhóm.
5. `SUBTOTAL` + Filter → khám phá tương tác.

Năm bước này áp được cho *bất kỳ* bảng dữ liệu nào, không riêng bán hàng. Điểm mấu chốt không phải nhớ hàm, mà là thứ tự: **kiểm tra dữ liệu sạch trước, đọc con số sau** — vì một con số trung bình đẹp tính trên dữ liệu bẩn còn nguy hiểm hơn không có con số nào.
