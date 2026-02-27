-- Enable uuid-ossp if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_bookmarks table
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    UNIQUE(user_id, post_id)
);

-- Note: Since the application relies on `supabaseAdmin` with the Service Role Key for backend logic,
-- we do not strictly need complex RLS policies for client-side queries.
-- However, we can enable RLS to be safe and allow the service role full access.
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Allow read access to anyone (or restrict if client side querying is needed)
CREATE POLICY "Enable read access for all users" ON public.user_bookmarks FOR SELECT USING (true);
