CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS just in case, but keep it restricted to service_role (which bypasses RLS anyway)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
