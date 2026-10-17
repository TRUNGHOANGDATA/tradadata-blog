---
tieu_de: "XLOOKUP: bản kế nhiệm VLOOKUP — dò hai chiều, khỏi đếm cột"
slug: "ham-xlookup-ban-ke-nhiem-vlookup"
danh_muc: "Excel"
the: ["XLOOKUP", "tra cứu", "hàm dò tìm"]
mo_ta: "XLOOKUP là hàm tra cứu hiện đại của Excel 365: dò được sang trái, chỉ cột trả về bằng vùng thay vì số đếm nên không gãy khi chèn cột, và có sẵn giá trị thay thế khi không tìm thấy. Hiểu sáu tham số và ba lợi thế so với VLOOKUP."
tu_khoa: "hàm XLOOKUP, XLOOKUP trong Excel, XLOOKUP so với VLOOKUP, dò trái trong Excel, if_not_found, XLOOKUP Excel 365"
anh_bia: "/images/bai-viet/xlookup/cover.png"
thu_muc_anh: "xlookup"
trang_thai: "draft"
---

Nếu bạn đã quen [VLOOKUP](/blog/ham-vlookup-do-tim-theo-cot-doc), `XLOOKUP` sẽ giống như bản nâng cấp gỡ đúng những chỗ khó chịu nhất: nó dò được sang trái, không cần đếm số cột, và tự xử lý trường hợp không tìm thấy. Đây là hàm tra cứu Microsoft khuyến nghị dùng từ Excel 365 và Excel 2021 trở đi.

## Cú pháp: hai vùng riêng thay vì một bảng

```excel
=XLOOKUP(giá_trị_tìm, vùng_dò, vùng_trả, [nếu_không_thấy], [chế_độ_khớp], [chế_độ_tìm])
```

Điểm khác căn bản so với VLOOKUP nằm ngay ở đầu: bạn đưa **vùng dò** và **vùng trả** thành **hai vùng tách biệt**, thay vì một bảng chung rồi đếm cột.

{{anh:xl-01-hai-vung}}

`=XLOOKUP("SP03",A2:A5,B2:B5)` dò `"SP03"` trong vùng `A2:A5`, tìm thấy ở hàng thứ ba, rồi trả về ô tương ứng trong vùng `B2:B5`. Hai vùng chỉ cần *cùng chiều dài* — chúng không nhất thiết phải nằm cạnh nhau, và vùng trả có thể ở **bên trái** vùng dò. Đó là điều VLOOKUP không bao giờ làm được.

Ba tham số cuối là tuỳ chọn và đây là mặc định hợp lý: XLOOKUP **mặc định khớp chính xác** (khác VLOOKUP mặc định gần đúng), tìm **từ trên xuống**.

## Ba lợi thế đáng để đổi

{{anh:xl-02-so-vlookup}}

- **Không đếm cột, không gãy khi chèn.** VLOOKUP chỉ cột trả về bằng một *con số*; chèn thêm một cột vào giữa bảng là số đó trỏ sai chỗ. XLOOKUP trỏ thẳng vào *vùng trả*, nên chèn hay xoá cột bao nhiêu cũng không lệch.
- **Dò được sang trái.** Cần lấy mã từ tên, mà cột tên lại nằm bên phải cột mã? VLOOKUP chịu. XLOOKUP thì vùng dò và vùng trả đặt đâu cũng được.
- **Có sẵn "nếu không thấy".** Tham số thứ tư cho bạn ghi thẳng câu thay thế khi không tìm ra — khỏi phải bọc thêm một lớp hàm.

## Bắt lỗi không tìm thấy ngay trong hàm

Với VLOOKUP, muốn thay `#N/A` bằng câu dễ đọc bạn phải bọc ngoài bằng [IFERROR](/blog/ham-iferror-thay-loi-bang-gia-tri-khac). XLOOKUP gộp luôn việc đó vào tham số thứ tư:

```excel
=XLOOKUP(A2,MaSP,TenSP,"Chưa có mã này")
```

{{anh:xl-03-neu-khong-thay}}

Khi không tìm thấy, ô sẽ hiện `Chưa có mã này` thay vì `#N/A`. Cách này còn "sạch" hơn IFERROR ở một điểm: nó chỉ bắt đúng trường hợp *không tìm thấy*, chứ không vô tình che một [lỗi thật](/blog/cac-ma-loi-thuong-gap-trong-excel) nào khác trong công thức.

## Vẫn là chuyện kiểu dữ liệu

XLOOKUP hiện đại hơn nhưng không miễn nhiễm với cái bẫy kinh điển: nếu giá trị tìm là *số* mà vùng dò lại chứa *văn bản* (hay ngược lại), nó vẫn coi là không khớp và trả về nhánh "không thấy". Khi kết quả sai bất thường, việc đầu tiên nên kiểm là [Excel đang hiểu ô đó là gì](/blog/kieu-du-lieu-trong-excel) — số căn phải, văn bản căn trái.

## Khi nào vẫn nên biết VLOOKUP

XLOOKUP chỉ có từ Excel 365 và 2021. File mở trên bản Excel cũ hơn (2016, 2019) sẽ báo `#NAME?`. Vì vậy nếu bạn chia sẻ file cho người dùng bản cũ, hoặc mở file của người khác, [VLOOKUP](/blog/ham-vlookup-do-tim-theo-cot-doc) và cặp [INDEX/MATCH](/blog/ham-index-match-tra-cuu-linh-hoat) vẫn là kỹ năng cần có. Cần dò **theo hàng ngang**, XLOOKUP vẫn làm được (đổi vùng thành một hàng), nhưng nếu bám bản cũ thì đó là việc của [HLOOKUP](/blog/ham-hlookup-tra-cuu-theo-hang-ngang).

## Kiểm nhanh trên máy bạn

- Dựng bảng mã–tên, đặt cột tên **bên trái** cột mã, rồi dùng XLOOKUP dò tên ra mã — thấy nó không kén thứ tự cột như VLOOKUP.
- Thêm tham số thứ tư `"Không có"` rồi gõ một mã không tồn tại, xem ô hiện chữ thay vì `#N/A`.
