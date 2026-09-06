const { createClient } = require('@supabase/supabase-js');
const { requireEnv } = require('./scripts-env');

const [NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY] = requireEnv(
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
);

const supabase = createClient(
    NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
);

async function checkProfiles() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*');

    if (error) {
        console.error('Lỗi khi tải profiles:', error);
    } else {
        console.log('Danh sách tài khoản hiện tại:');
        console.table(data);
    }
}

checkProfiles();
