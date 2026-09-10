---
tieu_de: "ROWS và COLUMNS: đếm kích thước một vùng dữ liệu, tự cập nhật khi vùng đổi"
slug: "ham-rows-columns-dem-kich-thuoc-vung"
danh_muc: "Excel"
the: ["ROWS", "COLUMNS", "kích thước vùng", "hàm cơ bản"]
mo_ta: "ROWS và COLUMNS đếm số hàng, số cột trong một vùng — khác hẳn ROW và COLUMN chỉ lấy vị trí của một ô. Dùng để dựng công thức tự thích ứng khi vùng dữ liệu thay đổi kích thước."
tu_khoa: "hàm ROWS Excel, hàm COLUMNS Excel, đếm số hàng số cột, kích thước vùng dữ liệu, ROWS khác ROW"
anh_bia: "/images/bai-viet/ham-rows-columns/cover.png"
thu_muc_anh: "ham-rows-columns"
trang_thai: "draft"
---

Tên gần giống hàm ở bài trước — [`ROW` và `COLUMN`](/blog/ham-row-column-danh-so-tu-dong) — nhưng `ROWS` và `COLUMNS` (thêm chữ `S`) làm một việc hoàn toàn khác: không lấy vị trí của một ô, mà **đếm** xem một vùng có bao nhiêu hàng, bao nhiêu cột. Tên gần giống là nguồn nhầm lẫn phổ biến nhất giữa bốn hàm này.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Phân biệt rõ: ROW lấy vị trí, ROWS đếm số lượng

```excel
=ROW(A2:A10)     ' Trả về 2 — vị trí hàng của Ô ĐẦU TIÊN trong vùng
=ROWS(A2:A10)    ' Trả về 9 — SỐ LƯỢNG hàng có trong vùng
```

{{anh:rc2-01-phan-biet-row-rows}}

Đây là điểm dễ nhầm nhất: `ROW` cho một vùng nhiều ô sẽ chỉ lấy vị trí hàng của ô **đầu tiên**, hoàn toàn không liên quan tới việc vùng đó rộng bao nhiêu. `ROWS` mới là hàm trả lời đúng câu hỏi "vùng này có bao nhiêu hàng".

## COLUMNS — đếm số cột, cùng logic

```excel
=COLUMNS(A2:D2)
```

{{anh:rc2-02-columns}}

Với vùng `A2:D2` trải từ cột `A` tới cột `D`, kết quả trả về **4** — đúng số lượng cột trong vùng, bất kể vùng đó nằm ở hàng nào.

## Ứng dụng: đếm số cột dữ liệu để duyệt qua bằng công thức

Một ứng dụng thực tế: cần biết bảng có bao nhiêu cột dữ liệu để những công thức khác tự thích ứng theo, ví dụ cột cuối cùng chứa "Tổng" luôn ở đúng vị trí, dù bảng thêm hay bớt cột ở giữa.

{{anh:rc2-03-du-lieu-bang}}

```excel
=COLUMNS(B2:F2)
```

{{anh:rc2-04-dem-cot}}

Kết quả trả về **5** — số cột dữ liệu hiện có. Thêm một cột mới vào giữa vùng `B2:F2`, con số này tự tăng lên `6` mà không cần sửa công thức tay, miễn công thức tham chiếu đúng theo vùng đã mở rộng.

## Ứng dụng: kiểm tra hai vùng có cùng kích thước không trước khi ghép

Đây là ứng dụng hữu ích nhất, đặc biệt liên quan tới lỗi đã nói ở bài [SUMIF và SUMIFS](/blog/ham-sumif-va-sumifs-trong-excel-tinh-tong-co-dieu-kien): các vùng trong `SUMIFS` phải cùng số hàng, nếu không sẽ báo lỗi `#VALUE!`. `ROWS` cho phép kiểm tra điều đó **trước khi** công thức chính chạy, thay vì để nó tự báo lỗi:

```excel
=IF(ROWS(A2:A9) = ROWS(B2:B10), "Cùng kích thước", "LỆCH — kiểm tra lại vùng")
```

{{anh:rc2-05-kiem-tra-kich-thuoc}}

Với `A2:A9` có `8` hàng và `B2:B10` có `9` hàng, công thức trả về **"LỆCH — kiểm tra lại vùng"** — phát hiện đúng sự lệch kích thước trước khi nó gây lỗi ở một công thức phức tạp hơn phía sau.

## Ứng dụng: đếm số dòng của một Table động

Kết hợp `ROWS` với tên vùng đã được định nghĩa qua Excel Table (`Ctrl + T`, đã nói ở bài về [SUMIF và SUMIFS](/blog/ham-sumif-va-sumifs-trong-excel-tinh-tong-co-dieu-kien) là cách tránh lỗi lệch vùng bền nhất) cho ra một con số luôn cập nhật đúng theo số dòng dữ liệu thật:

```excel
=ROWS(Bang1)
```

{{anh:rc2-06-dem-dong-table}}

Thêm dữ liệu mới vào Table, `ROWS(Bang1)` tự động tăng theo — không cần sửa vùng tham chiếu bằng tay như khi dùng địa chỉ ô cố định kiểu `A2:A100`.

## Tổng kết

`ROWS` và `COLUMNS` đếm số hàng, số cột trong một vùng — khác hẳn `ROW` và `COLUMN` chỉ lấy vị trí của ô đầu tiên trong vùng đó, dù tên gần giống nhau tới mức dễ gõ nhầm. Ứng dụng thực tế quan trọng nhất là kiểm tra kích thước vùng trước khi ghép các vùng lại với nhau trong công thức, tránh lỗi lệch kích thước gây ra `#VALUE!`.

Đọc tiếp trong cùng cụm bài: [ADDRESS — dựng địa chỉ ô dạng văn bản từ số hàng và cột](/blog/ham-address-dung-dia-chi-o-dang-van-ban).
