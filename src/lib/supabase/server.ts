// Rào cứng: file này KHÔNG được lọt vào bundle trình duyệt. Nó dùng
// SUPABASE_SERVICE_ROLE_KEY (không có tiền tố NEXT_PUBLIC_) nên ở trình duyệt
// khoá là rỗng và `createClient` ném `supabaseKey is required` ngay lúc nạp
// module -> cả trang trắng. Đúng lỗi đó đã làm /thuc-hanh sập với mọi người đã
// đăng nhập từ #49, chỉ vì một Client Component import một hàm thuần nằm nhờ
// trong `src/lib/data/vi-du-ham.ts`.
// `server-only` biến sai sót đó thành LỖI BUILD, thay vì lỗi lúc chạy trên
// production mà chỉ người dùng mới gặp.
import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('[supabase/server] Missing SUPABASE_URL or SERVICE_ROLE_KEY env vars');
}

// Server client — used in server components, API routes, server actions
// Uses service role key to bypass RLS when needed (admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
