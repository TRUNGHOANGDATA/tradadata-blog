---
tieu_de: "RANK.EQ, RANK.AVG: hai cách xử lý khác nhau khi xếp hạng gặp điểm số bằng nhau"
slug: "ham-rank-eq-rank-avg-xu-ly-diem-bang-nhau"
danh_muc: "Excel"
the: ["RANK.EQ", "RANK.AVG", "hàm thống kê"]
mo_ta: "RANK.EQ và RANK.AVG đều xếp hạng một giá trị trong một danh sách, khác nhau đúng ở cách xử lý khi có nhiều giá trị bằng nhau — RANK.EQ cho các hạng trùng nhau và bỏ qua hạng kế tiếp, RANK.AVG chia đều hạng trung bình."
tu_khoa: "hàm RANK.EQ Excel, hàm RANK.AVG Excel, xep hang diem bang nhau, RANK khac RANK.EQ"
anh_bia: "/images/bai-viet/ham-rank-eq-avg/cover.png"
thu_muc_anh: "ham-rank-eq-avg"
trang_thai: "draft"
---

Bài [RANK](/blog/ham-rank-trong-excel-xep-hang-du-lieu) đã giới thiệu cách xếp hạng cơ bản trong Excel. `RANK.EQ` và `RANK.AVG` là hai phiên bản mới hơn, thay thế `RANK` cũ (vẫn còn dùng được để tương thích ngược) — khác nhau đúng một điểm: cách xử lý khi có nhiều giá trị bằng nhau.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác.

## Cú pháp

```excel
=RANK.EQ(so, ref, [thu_tu])
=RANK.AVG(so, ref, [thu_tu])
```

{{anh:ra-01-cu-phap-co-ban}}

Cả hai đều có cú pháp giống hệt `RANK` gốc: `so` là giá trị cần xếp hạng, `ref` là toàn bộ danh sách, `thu_tu` là `0` (giảm dần, mặc định) hoặc khác `0` (tăng dần).

## Không có giá trị trùng nhau: hai hàm cho kết quả giống hệt nhau

```excel
=RANK.EQ(95,B2:B5)
=RANK.AVG(95,B2:B5)
```

{{anh:ra-02-khong-trung-nhau}}

Với danh sách điểm không có giá trị nào trùng nhau, `RANK.EQ` và `RANK.AVG` luôn cho ra cùng một kết quả — sự khác biệt giữa hai hàm chỉ lộ ra khi có điểm số bằng nhau.

## Có giá trị trùng nhau: RANK.EQ cho hạng trùng, bỏ qua hạng kế tiếp

Danh sách điểm `90, 90, 80, 70` — hai học sinh cùng đạt `90` điểm:

```excel
=RANK.EQ(90,B2:B5)
```

{{anh:ra-03-rank-eq-trung-hang}}

Cả hai điểm `90` đều nhận hạng `1` — đúng kiểu xếp hạng thi đấu thể thao quen thuộc ("đồng hạng nhất"). Nhưng vì đã có hai hạng `1`, hạng `2` bị **bỏ qua hoàn toàn**: điểm `80` xếp thẳng xuống hạng `3`, không có ai giữ hạng `2`.

## RANK.AVG: chia đều hạng trung bình cho các giá trị bằng nhau

```excel
=RANK.AVG(90,B2:B5)
```

{{anh:ra-04-rank-avg-trung-binh}}

Cùng danh sách đó, `RANK.AVG` cho cả hai điểm `90` cùng nhận hạng `1,5` — trung bình cộng của hạng `1` và hạng `2` mà lẽ ra hai giá trị này sẽ chiếm nếu chúng nhích lệch nhau một chút. Điểm `80` vẫn xếp hạng `3` ở cả hai cách tính, vì phía trên nó chỉ có đúng hai giá trị lớn hơn.

{{anh:ra-05-so-sanh-hai-cach}}

## Chọn hàm nào cho đúng ngữ cảnh

- Xếp hạng thi đấu, giải thưởng, thứ hạng hiển thị cho người xem (nơi "đồng hạng nhất" là khái niệm quen thuộc, dễ hiểu) → `RANK.EQ` phù hợp hơn.
- Tính toán thống kê cần phản ánh đúng vị trí trung bình về mặt số học (ví dụ tính percentile dựa trên hạng) → `RANK.AVG` cho kết quả nhất quán hơn về mặt toán học, vì tổng các hạng luôn khớp đúng với tổng `1+2+...+n` bất kể có bao nhiêu giá trị trùng nhau.

## Tổng kết

`RANK.EQ` và `RANK.AVG` xếp hạng giống hệt nhau khi không có giá trị trùng lặp, chỉ khác nhau khi gặp điểm số bằng nhau: `RANK.EQ` gán cùng một hạng cao nhất có thể rồi bỏ qua hạng kế tiếp, còn `RANK.AVG` chia đều hạng trung bình cho các giá trị bằng nhau đó.

Đọc tiếp trong cùng cụm bài: [SORTBY — sắp xếp một danh sách theo tiêu chí nằm ở một cột khác](/blog/ham-sortby-sap-xep-theo-cot-khac).
