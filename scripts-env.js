// Nạp biến môi trường từ .env.local và bắt buộc các key phải tồn tại.
// KHÔNG hardcode secret vào file này — repo là public.
require('dotenv').config({ path: '.env.local' });

function requireEnv(...keys) {
    const missing = keys.filter((k) => !process.env[k]);
    if (missing.length) {
        console.error(`Thiếu biến môi trường trong .env.local: ${missing.join(', ')}`);
        process.exit(1);
    }
    return keys.map((k) => process.env[k]);
}

module.exports = { requireEnv };
