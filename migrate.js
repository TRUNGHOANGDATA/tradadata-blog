

require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function executeSql() {
    const sql = `
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_note TEXT;
  `;

    try {
        const res = await fetch(url + 'rpc/pg_execute_sql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + key,
                'apikey': key
            },
            body: JSON.stringify({ query: sql })
        });

        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Response:', text);
    } catch (err) {
        console.error(err);
    }
}

executeSql();
