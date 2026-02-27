const { createClient } = require('@supabase/supabase-js');

const NEXT_PUBLIC_SUPABASE_URL = "https://gxqmqmjqigswmfttammi.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cW1xbWpxaWdzd21mdHRhbW1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk1MTk0MSwiZXhwIjoyMDg3NTI3OTQxfQ.sZfyV8kYH8jOfKEP1p_yP14f1XUFefLPC3e_OwGYnI4";

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
