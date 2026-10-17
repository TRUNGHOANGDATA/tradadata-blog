-- =============================================================================
-- Tab "Game Việt hoá" (/game-viet-hoa) — CHẠY TAY trên Supabase SQL Editor
-- =============================================================================
-- Vì sao chạy tay: xem đầu file vi-du-ham.sql. Chạy lại nhiều lần được.
--
-- Bảng mới mặc định có thể bị cấp quyền cho `anon` khi tạo qua Dashboard, nên
-- file này tự bật RLS + thu hồi quyền ngay bên dưới. Chạy xong vẫn nên chạy lại
-- truy vấn nghiệm thu ở cuối siet-quyen-anon.sql (phải trả 0 dòng).
-- =============================================================================

create extension if not exists pgcrypto;

create table if not exists public.game_viet_hoa (
    id              uuid primary key default gen_random_uuid(),
    slug            text not null unique,
    ten             text not null,                      -- tên hiển thị
    ten_goc         text,                               -- tên gốc của game
    anh_bia         text,                               -- URL ảnh (Drive, qua /api/admin/upload)
    nen_tang        text[] not null default '{}',       -- {'PC','Switch',...}
    the_loai        text[] not null default '{}',       -- {'RPG','Thế giới mở'}
    phien_ban_game  text,
    phien_ban_patch text,
    nhom_dich       text,
    tien_do         int  not null default 0 check (tien_do between 0 and 100),
    mo_ta           text,                               -- giới thiệu ngắn, văn bản thường
    link_tai        jsonb not null default '[]',        -- [{ "nhan": "Google Drive", "url": "https://..." }]
    link_mua        text,                               -- link mua game chính hãng
    post_slug       text,                               -- bài blog hướng dẫn cài, null = không gắn
    is_published    boolean not null default false,
    thu_tu          int  not null default 0,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index if not exists game_viet_hoa_published_idx
    on public.game_viet_hoa (is_published, thu_tu, created_at desc);

-- Chỉ service role (app) được đụng vào bảng. Xem siet-quyen-anon.sql.
alter table public.game_viet_hoa enable row level security;
revoke all on public.game_viet_hoa from anon, authenticated;

-- Nghiệm thu: phải trả 0 dòng.
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'game_viet_hoa'
  and grantee in ('anon', 'authenticated');

-- -----------------------------------------------------------------------------
-- Bổ sung 17/10/2026: số tiền ủng hộ riêng cho từng game (VNĐ), điền sẵn vào mã
-- QR chuyển khoản trên trang chi tiết. null = QR không kèm số tiền.
-- PHẢI chạy TRƯỚC khi rollout bản code có cột này, nếu không trang chi tiết lỗi.
-- -----------------------------------------------------------------------------
alter table public.game_viet_hoa
    add column if not exists so_tien int check (so_tien is null or so_tien >= 0);
