---
tieu_de: "RACON: vì sao SUMIFS, COUNTIFS, AVERAGEIFS đặt tham số khác thứ tự với bản số ít"
slug: "ham-racon-sumifs-countifs-averageifs-cu-phap-dac-biet"
danh_muc: "Excel"
the: ["SUMIFS", "COUNTIFS", "AVERAGEIFS", "cú pháp"]
mo_ta: "SUMIF đặt vùng điều kiện lên đầu; SUMIFS lại đặt vùng tính tổng lên đầu. Cùng một cặp khái niệm nhưng hai hàm anh em đảo ngược thứ tự tham số — quy tắc chung của cả nhóm SUMIFS, COUNTIFS, AVERAGEIFS, MAXIFS, MINIFS mà bài này gọi tắt là RACON."
tu_khoa: "SUMIF SUMIFS khac nhau, thu tu tham so Excel, AVERAGEIF AVERAGEIFS cu phap, nhom ham dieu kien Excel, RACON Excel, cu phap SUMIFS COUNTIFS AVERAGEIFS"
anh_bia: "/images/bai-viet/racon/cover.png"
thu_muc_anh: "racon"
trang_thai: "draft"
---

Đây là lỗi im lặng phổ biến bậc nhất khi làm việc với các hàm điều kiện: công thức **chạy được**, không báo lỗi gì, nhưng ra **sai kết quả** — vì hai tham số bị đảo chỗ cho nhau. Nó xảy ra khi bạn quen tay gõ `SUMIFS` rồi chuyển sang `SUMIF` (hoặc ngược lại) mà quên rằng thứ tự tham số của chúng không giống nhau.

Bài này gọi nhóm hàm liên quan là **RACON** — không phải tên chính thức của Microsoft, chỉ là một cái tên ngắn để nhớ, gồm năm hàm: `SUMIFS`, `COUNTIFS`, `AVERAGEIFS`, [`MAXIFS`](/blog/ham-maxifs-tim-gia-tri-lon-nhat-co-dieu-kien) và [`MINIFS`](/blog/ham-minifs-tim-gia-tri-nho-nhat-co-dieu-kien). Điểm chung của cả năm: tất cả đều đặt **vùng tính toán** lên tham số đầu tiên.

## Quy tắc cốt lõi: số ít ưu tiên điều kiện, số nhiều ưu tiên phép tính

So sánh trực tiếp hai cặp hàm có cả bản số ít lẫn bản số nhiều:

{{anh:rc-01-so-sanh-thu-tu}}

```excel
=SUMIF(NhomSanPham,"Laptop",DoanhThu)
=SUMIFS(DoanhThu,NhomSanPham,"Laptop")

=AVERAGEIF(GioiTinh,"Nam",Diem)
=AVERAGEIFS(Diem,GioiTinh,"Nam")
```

Cùng kết quả, cùng dữ liệu, nhưng vị trí của `DoanhThu`/`Diem` (vùng tính toán) và `NhomSanPham`/`GioiTinh` (vùng điều kiện) bị **đảo hoàn toàn**:

- **Bản số ít** (`SUMIF`, [`AVERAGEIF`](/blog/ham-averageif-trung-binh-co-mot-dieu-kien)) — vùng **điều kiện** lên đầu, vùng tính toán để **cuối** (và có thể bỏ trống).
- **Bản số nhiều** (`SUMIFS`, [`AVERAGEIFS`](/blog/ham-averageifs-trung-binh-nhieu-dieu-kien)) — vùng **tính toán** lên đầu, **bắt buộc** phải khai, không được bỏ trống.

Lý do kỹ thuật đứng sau sự khác biệt này: bản số nhiều được thiết kế nhận **nhiều cặp** điều kiện lặp lại phía sau (`vùng_dk1, dk1, vùng_dk2, dk2, ...`), nên vùng tính toán phải đứng riêng ở đầu cho khỏi lẫn với danh sách cặp điều kiện kéo dài. Bản số ít chỉ có đúng một cặp điều kiện nên không cần tách như vậy.

## COUNTIFS là ngoại lệ — hàm "hiền" nhất trong nhóm

`COUNTIFS` cũng thuộc RACON, nhưng nó không gây nhầm lẫn thứ tự như hai cặp trên. Lý do: [`COUNTIF`/`COUNTIFS`](/blog/ham-countif-va-countifs-dem-o-co-dieu-kien) vốn dĩ **không có** một "vùng tính toán" riêng — cả hai chỉ nhận các cặp `vùng`/`điều_kiện` lặp lại, không có gì để mà đảo chỗ:

{{anh:rc-02-countif-khong-doi}}

```excel
=COUNTIF(KhuVuc,"Miền Bắc")
=COUNTIFS(KhuVuc,"Miền Bắc",NhomSanPham,"Laptop")
```

Cấu trúc `COUNTIFS` chỉ đơn giản là nối thêm cặp `vùng`/`điều_kiện` thứ hai vào sau `COUNTIF`, không có tham số nào bị dời chỗ. Nhiều người dùng chính `COUNTIF`/`COUNTIFS` làm mốc neo trí nhớ: "hàm nào không có vùng tính riêng thì không lo bị đảo".

## MAXIFS và MINIFS: cùng quy tắc, nhưng không có bản số ít để so

`MAXIFS`/`MINIFS` cũng đặt vùng tính toán lên đầu, giống `SUMIFS`/`AVERAGEIFS`:

```excel
=MAXIFS(DoanhSo,NhanVien,"An")
```

Nhưng Excel **không có** hàm `MAXIF`/`MINIF` (số ít) để đối chiếu — nên hai hàm này không gây ra kiểu lỗi đảo thứ tự như `SUMIF`↔`SUMIFS`. Chúng chỉ cần nhớ đúng một cú pháp duy nhất.

## Mẹo nhớ nhanh khi không chắc

{{anh:rc-03-meo-nho}}

Nhìn vào **tên hàm**: có chữ `S` ở cuối (số nhiều — nhận nhiều điều kiện) thì vùng tính toán luôn đứng **đầu tiên**. Không có chữ `S` (số ít — chỉ một điều kiện) thì vùng điều kiện đứng đầu, vùng tính toán đứng cuối cùng và có thể bỏ trống. Quy tắc này áp dụng nhất quán cho toàn bộ họ `SUM`/`AVERAGE`, chỉ riêng `COUNT` là không cần lo vì không có vùng tính toán để đảo.

## Vì sao lỗi này nguy hiểm hơn một lỗi thường

Đặt sai thứ tự tham số **không** cho ra `#VALUE!` hay bất kỳ mã lỗi rõ ràng nào — công thức vẫn chạy, chỉ là chạy sai. Nếu vô tình viết `=SUMIFS(NhomSanPham,DoanhThu,"Laptop")` (đảo ngược hai vùng), Excel hiểu nhầm `NhomSanPham` là thứ cần cộng và `DoanhThu` là vùng điều kiện — kết quả một con số hoàn toàn vô nghĩa nhưng trông vẫn như một con số bình thường. Đây chính là lúc [IFERROR không giúp được gì](/blog/ham-iferror-thay-loi-bang-gia-tri-khac) — vì có lỗi thật đâu mà bắt. Cách phòng tránh chắc nhất là luôn kiểm tra lại bằng mắt: hàm có chữ `S` thì "phép tính trước, điều kiện sau".

## Kiểm nhanh trên máy bạn

- Viết `SUMIF` với một điều kiện, ghi lại kết quả. Chuyển sang `SUMIFS` với cùng dữ liệu và cố tình đặt sai thứ tự — quan sát công thức vẫn chạy nhưng ra một con số khác hẳn.
- Làm tương tự với `AVERAGEIF`/`AVERAGEIFS`, rồi thử `COUNTIF`/`COUNTIFS` để thấy vì sao cặp này không gặp vấn đề tương tự.
