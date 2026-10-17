---
tieu_de: "LEFT, RIGHT, MID: cắt lấy một phần của chuỗi văn bản"
slug: "ham-left-right-mid-cat-chuoi-ky-tu"
danh_muc: "Excel"
the: ["LEFT", "RIGHT", "MID", "xử lý văn bản"]
mo_ta: "LEFT lấy ký tự từ đầu, RIGHT lấy từ cuối, MID lấy từ giữa. Ghép với FIND để cắt động theo dấu phân cách là tách được mã, họ tên, mã vùng — và nhớ rằng con số cắt ra vẫn là văn bản."
tu_khoa: "hàm LEFT RIGHT MID, cắt chuỗi trong Excel, tách ký tự, lấy ký tự đầu cuối, MID kết hợp FIND, tách mã trong Excel"
anh_bia: "/images/bai-viet/left-right-mid/cover.png"
thu_muc_anh: "left-right-mid"
trang_thai: "draft"
---

Rất nhiều dữ liệu thực tế bị "gói" chung trong một ô: mã đơn hàng chứa cả năm và số thứ tự, ô họ tên gộp cả họ lẫn tên, số điện thoại kèm mã vùng. Ba hàm `LEFT`, `RIGHT`, `MID` là bộ kéo cơ bản để cắt lấy đúng phần bạn cần.

## Ba hàm, ba hướng cắt

```excel
=LEFT(chuỗi, số_ký_tự)
=RIGHT(chuỗi, số_ký_tự)
=MID(chuỗi, vị_trí_bắt_đầu, số_ký_tự)
```

- **LEFT** đếm từ đầu chuỗi sang phải.
- **RIGHT** đếm từ cuối chuỗi ngược về.
- **MID** bắt đầu ở một vị trí bạn chỉ định rồi lấy tiếp một số ký tự.

{{anh:lrm-01-ba-huong}}

Với chuỗi `"DH-2025-018"`, `LEFT(A2,2)` cho `DH`, `RIGHT(A2,3)` cho `018`, còn `MID(A2,4,4)` bắt đầu ở ký tự thứ 4 lấy 4 ký tự, ra `2025`. Ký tự được đếm cả dấu gạch và khoảng trắng — đây là chỗ hay đếm lệch, nên đếm cẩn thận vị trí.

## Cắt động theo dấu phân cách với FIND

Đếm tay chỉ ổn khi độ dài cố định. Với dữ liệu dài ngắn khác nhau — ví dụ ô `"Hà Nội - 0912345678"` — bạn không thể gõ cứng số ký tự. Cách làm là để [FIND](/blog/ham-find-search-tim-vi-tri-ky-tu-trong-chuoi) tìm vị trí dấu phân cách, rồi đưa con số đó cho LEFT hoặc MID:

```excel
=LEFT(A2, FIND("-", A2) - 1)
```

{{anh:lrm-02-cat-dong}}

`FIND("-",A2)` trả về vị trí dấu gạch; trừ đi 1 để không lấy luôn dấu gạch và khoảng trắng. Nhờ vậy công thức tự thích ứng dù tên tỉnh dài ngắn khác nhau. Muốn lấy phần *sau* dấu phân cách thì dùng MID bắt đầu ngay sau vị trí đó.

## Số cắt ra là văn bản, không phải số

Đây là cái bẫy quan trọng nhất. `LEFT`, `RIGHT`, `MID` luôn trả về **văn bản**, kể cả khi phần cắt ra trông giống số. Cắt `"2025"` từ mã đơn ra không cộng trừ được ngay, vì với Excel đó là chuỗi ký tự.

{{anh:lrm-03-la-van-ban}}

Mẹo nhìn quen thuộc: kết quả cắt ra sẽ [căn trái](/blog/kieu-du-lieu-trong-excel) — dấu hiệu của văn bản. Nếu cần dùng nó để tính toán, bọc thêm `VALUE()` để [ép về số thật](/blog/so-bi-luu-thanh-van-ban-trong-excel):

```excel
=VALUE(MID(A2,4,4))
```

## Dọn chuỗi trước khi cắt

Nếu ô nguồn có khoảng trắng thừa ở đầu, vị trí ký tự sẽ lệch hết và LEFT/MID cắt sai. Nên [dọn khoảng trắng bằng TRIM](/blog/ham-trim-clean-don-khoang-trang) trước khi cắt. Và nếu việc bạn cần là *thay* một đoạn chứ không phải *lấy* nó ra, hãy xem [SUBSTITUTE](/blog/ham-substitute-thay-the-theo-noi-dung) — thay theo nội dung, tiện hơn nhiều so với cắt rồi ghép lại.

## Kiểm nhanh trên máy bạn

- Gõ một mã như `"DH-2025-018"` rồi thử `LEFT`, `RIGHT`, `MID` với các con số khác nhau để cảm được cách đếm vị trí.
- Cắt phần số ra, quan sát nó căn trái, rồi bọc `VALUE()` và thấy nó nhảy sang căn phải — thành số thật.
