
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSubscribers() {
    console.log('Checking subscribers table...');
    const { data, error } = await supabase.from('subscribers').select('*');
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Subscribers:', data);
    }
}

checkSubscribers();
