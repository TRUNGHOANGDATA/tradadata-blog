---
tieu_de: "PERCENTILE.INC, PERCENTILE.EXC: hai cách định nghĩa phân vị, khác nhau ở việc có tính luôn giá trị nhỏ nhất và lớn nhất hay không"
slug: "ham-percentile-inc-exc-hai-cach-dinh-nghia-phan-vi"
danh_muc: "Excel"
the: ["PERCENTILE.INC", "PERCENTILE.EXC", "hàm thống kê"]
mo_ta: "PERCENTILE.INC (bao gồm) cho phép tính phân vị 0 và 100 tức chính giá trị nhỏ nhất/lớn nhất, còn PERCENTILE.EXC (loại trừ) không cho phép và giới hạn phạm vi hợp lệ hẹp hơn, báo lỗi nếu vượt ra ngoài."
tu_khoa: "hàm PERCENTILE.INC Excel, ham PERCENTILE.EXC Excel, phan vi bao gom loai tru, PERCENTILE khac nhau"
anh_bia: "/images/bai-viet/ham-percentile-inc-exc/cover.png"
thu_muc_anh: "ham-percentile-inc-exc"
trang_thai: "draft"
---

Bài trước, [VAR.P, VAR.S](/blog/ham-var-p-var-s-tong-the-va-mau) khép lại phần khái niệm tổng thể/mẫu. `PERCENTILE.INC` và `PERCENTILE.EXC` là cặp hàm hiện đại tiếp theo — cùng tính phân vị (percentile) như [`PERCENTILE`](/blog/ham-thong-ke-trong-excel-average-median-mode-stdev-percentile) cũ, nhưng khác nhau ở một quy ước toán học tinh tế: có tính luôn giá trị nhỏ nhất và lớn nhất vào phạm vi phân vị hay không.

Công thức trong bài dùng dấu phẩy (`,`); đổi sang dấu chấm phẩy (`;`) nếu Excel của bạn cấu hình theo vùng miền khác. Vì hàm này có tham số `k` là số thập phân, các ví dụ dưới đây viết `k` bằng dấu chấm (`0.25`) thay vì dấu phẩy, để không bị nhầm với dấu phẩy đang dùng để phân cách đối số.

## Cú pháp

```excel
=PERCENTILE.INC(mang, k)
=PERCENTILE.EXC(mang, k)
```

{{anh:pi-01-cu-phap-co-ban}}

`k` là tỷ lệ phân vị cần tìm, từ `0` đến `1`. `PERCENTILE.INC` là tên mới của `PERCENTILE` cũ.

## Cùng dữ liệu, hai công thức cho hai kết quả khác nhau

Dãy số `1` đến `10`, tìm phân vị `25%`:

```excel
=PERCENTILE.INC({1,2,3,4,5,6,7,8,9,10},0.25)
=PERCENTILE.EXC({1,2,3,4,5,6,7,8,9,10},0.25)
```

{{anh:pi-02-vi-du-tinh-toan}}

`PERCENTILE.INC` cho `3,25`. `PERCENTILE.EXC` cho `2,75` — hai công thức nội suy khác nhau, `INC` (inclusive — bao gồm) coi giá trị nhỏ nhất là phân vị `0%` và lớn nhất là phân vị `100%`, còn `EXC` (exclusive — loại trừ) không công nhận hai đầu mút đó là phân vị hợp lệ, dẫn tới cách chia khoảng khác đi.

## Giới hạn quan trọng: PERCENTILE.EXC có phạm vi k hẹp hơn

```excel
=PERCENTILE.EXC({1,2,3,4,5,6,7,8,9,10},0.05)
```

{{anh:pi-03-gioi-han-pham-vi-k}}

Kết quả là lỗi `#NUM!`. Với `10` giá trị, `PERCENTILE.EXC` chỉ chấp nhận `k` từ `1/11` (`≈0,0909`) đến `10/11` (`≈0,9091`) — vì định nghĩa "loại trừ" đòi hỏi luôn phải còn ít nhất một giá trị thật ở cả hai phía của phân vị đang tính, không được phép "vượt ra ngoài" tới đúng vị trí giá trị nhỏ nhất hay lớn nhất. `PERCENTILE.INC` không có giới hạn này, nhận `k` từ `0` đến `1` trọn vẹn.

## Vì sao có tới hai định nghĩa phân vị

{{anh:pi-04-vi-sao-hai-dinh-nghia}}

Đây không phải một hàm "đúng" và một hàm "sai" — cả hai đều là các quy ước tính phân vị hợp lệ, được dùng trong các tài liệu thống kê khác nhau. `PERCENTILE.INC` phổ biến hơn trong công việc hàng ngày vì linh hoạt, chấp nhận cả `k=0` và `k=1`. `PERCENTILE.EXC` bám sát định nghĩa "loại trừ" nghiêm ngặt hơn, thường gặp trong một số phần mềm thống kê học thuật — cần biết trước hệ thống đối chiếu đang dùng định nghĩa nào để chọn đúng hàm tương ứng khi so sánh kết quả.

## Ứng dụng: xác định ngưỡng học bổng theo phân vị điểm số

```excel
=PERCENTILE.INC(DiemToanTruong,0.9)
```

{{anh:pi-05-ung-dung-nguong-hoc-bong}}

Tìm ngưỡng điểm của top `10%` học sinh cao nhất (phân vị `90%`) để xét học bổng — `PERCENTILE.INC` là lựa chọn phù hợp cho việc này vì không cần lo giới hạn phạm vi `k`, và kết quả dễ diễn giải trực tiếp cho mục đích thực tế.

## Tổng kết

`PERCENTILE.INC` bao gồm cả giá trị nhỏ nhất (phân vị `0%`) và lớn nhất (phân vị `100%`) trong phạm vi hợp lệ, còn `PERCENTILE.EXC` loại trừ hai đầu mút đó, giới hạn `k` hẹp hơn và báo lỗi `#NUM!` nếu vượt ra ngoài. Không có hàm nào "đúng hơn" — chọn theo đúng quy ước thống kê mà công việc đang yêu cầu.

Đọc tiếp trong cùng cụm bài: [QUARTILE.INC, QUARTILE.EXC — cùng khác biệt bao gồm/loại trừ đó, áp dụng cho tứ phân vị](/blog/ham-quartile-inc-exc-hai-cach-dinh-nghia-tu-phan-vi).
