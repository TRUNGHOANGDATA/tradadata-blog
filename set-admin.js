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

async function setAdmin() {
    const email = process.argv[2] || 'trung.h@erx.vn';

    if (!email) {
        console.error('Vui lòng cung cấp email: node set-admin.js email@domain.com');
        return;
    }
    console.log(`Đang cấp quyền admin cho: ${email}`);

    // Check if it exists
    const { data: existing } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

    if (existing) {
        // Update the role to admin
        const { data, error } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('email', email)
            .select();

        if (error) {
            console.error('Lỗi khi nâng cấp tài khoản:', error);
        } else {
            console.log('Đã cập nhật tài khoản thành công:', data);
        }
    } else {
        // Create new admin profile
        const { data, error } = await supabase
            .from('profiles')
            .insert({
                email: email,
                full_name: 'Trung H',
                role: 'admin'
            })
            .select();

        if (error) {
            console.error('Lỗi khi tạo tài khoản mới:', error);
        } else {
            console.log('Đã tạo tài khoản admin mới:', data);
        }
    }
}

setAdmin();
