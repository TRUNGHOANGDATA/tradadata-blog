# k8s — lịch chạy nền cho blog

Site chạy trên cụm Kubernetes tự dựng (namespace `bizflow`, Deployment `tradadata`,
container `blog`), **không phải Vercel**. Phần `crons` trong `vercel.json` chỉ Vercel
mới đọc, nên trên cụm này nó chưa bao giờ chạy.

Hệ quả của việc thiếu lịch:
- Email báo bài mới nằm lại trong bảng `email_queue` với `status = 'pending'` mà không được gửi.
- Email nhắc gia hạn Premium không được gửi.

## Kiểm tra xem có đúng là chưa chạy không

Trên Supabase SQL Editor:

```sql
select status, count(*), min(scheduled_at), max(sent_at)
from email_queue
group by status;
```

Nếu `pending` chất đống và `sent_at` mới nhất dừng từ lúc chuyển khỏi Vercel thì đúng.

## Áp dụng

```bash
kubectl apply -f k8s/cronjobs.yaml
```

Trước khi apply, sửa `secretKeyRef.name` trong `cronjobs.yaml` cho khớp Secret thật
đang cấp `CRON_SECRET` cho container `blog`:

```bash
kubectl get secret -n bizflow
kubectl get deploy tradadata -n bizflow -o yaml | grep -A5 CRON_SECRET
```

## Nghiệm thu

```bash
# Thấy 2 CronJob và cột SCHEDULE đúng
kubectl get cronjob -n bizflow

# Chạy thử ngay, không cần chờ tới giờ
kubectl create job -n bizflow --from=cronjob/tradadata-blog-email-queue test-queue-1

# Xem kết quả — mong đợi {"success":true,...}
kubectl logs -n bizflow job/test-queue-1

# Dọn
kubectl delete job -n bizflow test-queue-1
```

Nếu log trả `401` thì `CRON_SECRET` trong Secret không khớp với env của container `blog`.

## Vì sao hàng đợi email chạy mỗi 10 phút

`/api/cron/process-email-queue` xử lý tối đa **90 email mỗi lần gọi**. Lịch cũ trên
Vercel là 1 lần/ngày vì gói Hobby giới hạn cron ở mức đó — nghĩa là trần 90 email/ngày.
Có 500 người đăng ký thì một bài mới mất gần 6 ngày mới gửi hết.

Cụm nhà không bị giới hạn ấy nên để mỗi 10 phút. Route chỉ lấy các bản ghi `pending`
và đánh dấu `sent` sau khi gửi, cộng `concurrencyPolicy: Forbid` chặn chạy chồng,
nên chạy dày không gây gửi trùng.

Ngược lại `/api/cron/check-subscriptions` giữ 1 lần/ngày: nó **không** đánh dấu "đã nhắc",
nên chạy dày sẽ gửi lặp email nhắc gia hạn cho cùng một khách.

## Múi giờ

Cả hai đặt `timeZone: "Etc/UTC"` để giữ đúng hành vi cũ của Vercel.
`0 1 * * *` UTC = **08:00 giờ Việt Nam**. Muốn nghĩ theo giờ VN thì đổi
`timeZone: "Asia/Ho_Chi_Minh"` rồi chỉnh lại giờ trong biểu thức cron.
