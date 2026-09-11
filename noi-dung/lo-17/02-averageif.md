---
tieu_de: "AVERAGEIF: tính trung bình có điều kiện, và thứ tự tham số ngược với AVERAGEIFS"
slug: "ham-averageif-trung-binh-co-mot-dieu-kien"
danh_muc: "Excel"
the: ["AVERAGEIF", "hàm thống kê"]
mo_ta: "AVERAGEIF tính trung bình chỉ trên các dòng thoả một điều kiện — giống SUMIF nhưng trả về trung bình thay vì tổng. Cần nhớ thứ tự tham số của AVERAGEIF ngược hẳn với AVERAGEIFS, và kết quả báo lỗi #DIV/0! nếu không có dòng nào khớp."
tu_khoa: "hàm AVERAGEIF Excel, trung binh co dieu kien, AVERAGEIF khac AVERAGEIFS, loi DIV0 AVERAGEIF"
anh_bia: "/images/bai-viet/ham-averageif/cover.png"
thu_muc_anh: "ham-averageif"
trang_thai: "draft"
---

Bài trước, [SUM](/blog/ham-sum-cong-tong-va-nhung-dieu-de-bi-bo-qua) cộng tổng không điều kiện. `AVERAGEIF` mang đúng tinh thần của [`SUMIF`](/blog/ham-sumif-va-sumifs-trong-excel-tinh-tong-co-dieu-kien) nhưng đổi phép tính: tính **trung bình** thay vì tổng, chỉ trên các dòng thoả một điều kiện.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=AVERAGEIF(vung_dieu_kien, dieu_kien, [vung_tinh_trung_binh])
```

{{anh:av-01-cu-phap-co-ban}}

Nếu bỏ trống `vung_tinh_trung_binh`, Excel tự dùng luôn `vung_dieu_kien` để tính trung bình — giống hệt cách `SUMIF` xử lý khi thiếu tham số cuối.

## Ứng dụng: điểm trung bình theo một nhóm cụ thể

```excel
=AVERAGEIF(GioiTinh,"Nam",Diem)
```

{{anh:av-02-diem-trung-binh-nhom}}

Tính điểm trung bình chỉ trên các dòng có giới tính là `"Nam"`, bỏ qua hoàn toàn các dòng còn lại — không cần lọc dữ liệu trước rồi mới bôi đen tính `AVERAGE` bằng tay.

## Điểm dễ nhầm nhất: thứ tự tham số ngược với AVERAGEIFS

Đây chính là một trong `5` hàm mang cú pháp đặc biệt đã nói ở [bài RACON](/blog/ham-racon-sumifs-countifs-averageifs-cu-phap-dac-biet): `AVERAGEIF` (số ít) đặt **vùng điều kiện** lên đầu, còn `AVERAGEIFS` (số nhiều, bài sau) đặt **vùng tính trung bình** lên đầu:

```excel
=AVERAGEIF(GioiTinh,"Nam",Diem)
=AVERAGEIFS(Diem,GioiTinh,"Nam")
```

{{anh:av-03-thu-tu-nguoc-averageifs}}

Cùng một phép tính, nhưng thứ tự `Diem` và `GioiTinh` bị đảo ngược hoàn toàn giữa hai hàm. Quen tay dùng `AVERAGEIFS` rồi chuyển sang gõ `AVERAGEIF` (hoặc ngược lại) mà không để ý thứ tự là nguyên nhân phổ biến nhất gây sai kết quả mà không hề có dấu hiệu lỗi nào — công thức vẫn chạy, chỉ là tính sai vùng.

## Lỗi thường gặp: không có dòng nào khớp điều kiện

```excel
=AVERAGEIF(GioiTinh,"Khác",Diem)
```

{{anh:av-04-loi-div0}}

Nếu không có dòng nào khớp điều kiện, `AVERAGEIF` báo lỗi `#DIV/0!` — vì về bản chất trung bình là tổng chia cho số lượng, và số lượng dòng khớp ở đây bằng `0`. Đây là điểm khác biệt đáng chú ý so với [`MAXIFS`/`MINIFS`](/blog/ham-maxifs-tim-gia-tri-lon-nhat-co-dieu-kien) đã nói ở lô trước — hai hàm đó lặng lẽ trả về `0` khi không có dòng khớp, còn `AVERAGEIF` báo lỗi hẳn hoi, không thể nhầm lẫn thành một giá trị hợp lệ.

## Kết hợp IFERROR để xử lý gọn trường hợp không có dữ liệu

```excel
=IFERROR(AVERAGEIF(GioiTinh,"Khác",Diem),"Chưa có dữ liệu")
```

{{anh:av-05-ket-hop-iferror}}

Bọc `IFERROR` quanh ngoài để hiển thị một thông báo dễ hiểu thay vì để lộ `#DIV/0!` ra báo cáo, đặc biệt hữu ích khi công thức được áp dụng cho nhiều nhóm khác nhau và không phải nhóm nào cũng chắc chắn có dữ liệu.

## Tổng kết

`AVERAGEIF` tính trung bình chỉ trên các dòng thoả một điều kiện, giống tinh thần `SUMIF` nhưng đổi phép tính. Cần nhớ thứ tự tham số ngược hẳn với `AVERAGEIFS`, và kết quả báo lỗi `#DIV/0!` (không phải `0` như `MAXIFS`/`MINIFS`) khi không có dòng nào khớp điều kiện.

Đọc tiếp trong cùng cụm bài: [AVERAGEIFS — tính trung bình khi cần thoả nhiều điều kiện cùng lúc](/blog/ham-averageifs-trung-binh-nhieu-dieu-kien).
