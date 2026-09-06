# Hướng dẫn deploy blog lên cụm k8s (làm tay)

Dành cho người có quyền vào cụm. Dùng khi CI trên GitHub Actions không chạy được
(hết hạn mức phút, hoặc chưa khai secrets).

Kết quả: code mới nhất trên `main` chạy trên https://www.tradadata.com

## Bối cảnh

- Namespace `bizflow`, Deployment `tradadata`, container tên **`blog`**
- Container `blog` nằm **chung pod** với `ke-truyen`, Deployment dùng `strategy: Recreate`
  ⇒ deploy blog thì truyen.tradadata.com cũng downtime ~1-2 phút. Báo trước cho ai cần biết.
- Control plane `192.168.1.250`, chỉ vào được qua gateway `125.212.235.148` (ProxyJump)
- Cụm đã pull được image private từ ghcr (đã cấu hình sẵn cho `ke-truyen`)

## Cách 1 — Build rồi đẩy qua ghcr (khuyến nghị)

Đây là đường `ke-truyen` đang dùng, nên hạ tầng đã sẵn sàng.

Cần: một máy bất kỳ có Docker + tài khoản GitHub có quyền vào repo.

```bash
# 1. Lấy code mới nhất
git clone https://github.com/TRUNGHOANGDATA/tradadata-blog.git
cd tradadata-blog
SHA=$(git rev-parse HEAD)
echo "sẽ deploy commit: $SHA"

# 2. Đăng nhập ghcr (PAT cần scope write:packages)
echo "<GITHUB_PAT>" | docker login ghcr.io -u TRUNGHOANGDATA --password-stdin

# 3. Chuẩn bị service role key để prerender lúc build
#    Lấy đúng giá trị đang chạy trên cụm:
#      kubectl get secret <ten-secret> -n bizflow -o jsonpath='{.data.SUPABASE_SERVICE_ROLE_KEY}' | base64 -d
printf '%s' '<SUPABASE_SERVICE_ROLE_KEY>' > .srk
chmod 600 .srk

# 4. Build
DOCKER_BUILDKIT=1 docker build \
  --build-arg NEXT_PUBLIC_APP_URL=https://www.tradadata.com \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://ujwdhjtzmmflhfewqtid.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY='<ANON_HOAC_PUBLISHABLE_KEY>' \
  --build-arg APP_VERSION=$SHA \
  --secret id=supabase_service_role_key,src=.srk \
  -t ghcr.io/trunghoangdata/tradadata-blog:$SHA .

rm -f .srk    # xoá ngay, đừng để lại

# 5. Đẩy lên ghcr
docker push ghcr.io/trunghoangdata/tradadata-blog:$SHA

# 6. Rollout trên cụm
ssh -J x@125.212.235.148 x@192.168.1.250 \
  "kubectl set image deployment/tradadata blog=ghcr.io/trunghoangdata/tradadata-blog:$SHA -n bizflow"

ssh -J x@125.212.235.148 x@192.168.1.250 \
  "kubectl rollout status deployment/tradadata -n bizflow --timeout=10m"
```

## Cách 2 — Build ngay trên node của cụm

Dùng khi không muốn qua registry. Chạy các bước 1-4 ở trên **trên chính node**, đặt tag
nội bộ (ví dụ `tradadata-blog:$SHA`), rồi:

- Nếu node chạy **k3s/containerd**: `docker save tradadata-blog:$SHA | sudo ctr -n k8s.io images import -`
- Sửa Deployment dùng tag đó và đặt `imagePullPolicy: IfNotPresent` (nếu chưa)
- `kubectl set image deployment/tradadata blog=tradadata-blog:$SHA -n bizflow`

## Nghiệm thu — bắt buộc làm

Rollout xong **không** có nghĩa là code mới đang phục vụ. Kiểm tra bằng:

```bash
curl -s https://www.tradadata.com/api/health
```

Phải trả về `version` **đúng bằng** `$SHA` ở bước 1. Đúng thì xong.

Hai dấu hiệu phụ cho biết code mới đã lên:

```bash
# phải là 401 (trước đây là 400)
curl -s -o /dev/null -w "%{http_code}\n" -X POST \
  https://www.tradadata.com/api/admin/index-url -H 'Content-Type: application/json' -d '{}'
```

## Nếu container không khởi động được

Nguyên nhân hay gặp nhất: Deployment đang ép `command`/`args` kiểu `npm start` hoặc
`next start`. Image này chạy Next.js standalone bằng `node server.js`, không có sẵn CLI
của Next nên sẽ chết ngay.

```bash
kubectl get deploy tradadata -n bizflow -o jsonpath='{range .spec.template.spec.containers[*]}{.name}{" cmd="}{.command}{" args="}{.args}{"\n"}{end}'
kubectl logs -n bizflow deploy/tradadata -c blog --tail=50
```

Có `command`/`args` thì gỡ bỏ.

## Quay lui khi hỏng

```bash
kubectl rollout undo deployment/tradadata -n bizflow
kubectl rollout status deployment/tradadata -n bizflow
```

## Sau khi deploy xong

1. Áp lịch chạy nền (email bài mới + nhắc gia hạn hiện đang KHÔNG chạy):
   sửa `secretKeyRef.name` trong `k8s/cronjobs.yaml` cho khớp Secret thật rồi
   `kubectl apply -f k8s/cronjobs.yaml`. Xem `k8s/README.md`.
