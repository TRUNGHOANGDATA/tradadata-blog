import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('[supabase/server] Missing SUPABASE_URL or SERVICE_ROLE_KEY env vars');
}

// Server client — used in server components, API routes, server actions
// Uses service role key to bypass RLS when needed (admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
