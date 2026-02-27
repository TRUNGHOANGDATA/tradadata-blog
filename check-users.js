const { createClient } = require('@supabase/supabase-js');

const NEXT_PUBLIC_SUPABASE_URL = "https://gxqmqmjqigswmfttammi.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cW1xbWpxaWdzd21mdHRhbW1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk1MTk0MSwiZXhwIjoyMDg3NTI3OTQxfQ.sZfyV8kYH8jOfKEP1p_yP14f1XUFefLPC3e_OwGYnI4";

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
