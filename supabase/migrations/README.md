# Cảnh báo: thư mục này KHÔNG dựng lại được database

Sáu file migration ở đây là **lịch sử một phần** từ giai đoạn đầu dự án. Chúng chỉ
tạo `subscribers`, `comments`, `user_bookmarks` và vài cột lẻ.

Chúng **không** chứa 10 bảng mà app đang thật sự dùng (đếm ngày 07/09/2026):

| Bảng | Số file code đang dùng | Có trong migration? |
|---|---|---|
| `orders` | 18 | không |
| `user_subscriptions` | 8 | không |
| `products` | 8 | không |
| `user_coupons` | 7 | không |
| `coupons` | 6 | không |
| `site_settings` | 5 | không |
| `coupon_products` | 4 | không |
| `software_leads` | 2 | không |
| `course_sections` | 2 | không |
| `email_queue` | 2 | không |

Chạy toàn bộ migration ở đây lên một database rỗng sẽ ra một schema **thiếu sạch
phần bán hàng** — và trông như đã thành công.

`setup.sql` và `schema.json` ở gốc repo còn tệ hơn (chỉ có 4 bảng) nên đã xoá ở
commit thêm file này.

## Nguồn sự thật duy nhất là Supabase

Schema thật được sửa trực tiếp trên Supabase, không qua migration. Cần biết cột nào
có thật thì đọc code hoặc query DB.

Muốn có bản dump thật để đối chiếu:

```bash
# Supabase Studio -> Project Settings -> Database -> Connection string
pg_dump --schema-only --no-owner --no-privileges "$DATABASE_URL" > schema-that.sql
```

Nếu về sau muốn quay lại dùng migration đúng nghĩa thì bước đầu tiên là dump schema
hiện tại thành một migration khởi điểm, chứ không phải viết tiếp lên mấy file này.
