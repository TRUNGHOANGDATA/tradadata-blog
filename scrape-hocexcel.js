// Script to extract all post URLs from hocexcel.online sitemaps
const https = require('https');
const http = require('http');

function fetch(url) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function extractUrls(sitemapUrl) {
    const xml = await fetch(sitemapUrl);
    const urls = [];
    const regex = /<loc>(https:\/\/blog\.hocexcel\.online\/[^<]+\.html)<\/loc>/g;
    let match;
    while ((match = regex.exec(xml)) !== null) {
        urls.push(match[1]);
    }
    return urls;
}

async function main() {
    console.log('Scraping hocexcel.online sitemaps...\n');

    const sitemaps = [
        'https://blog.hocexcel.online/post-sitemap.xml',
        'https://blog.hocexcel.online/post-sitemap2.xml',
        'https://blog.hocexcel.online/post-sitemap3.xml',
    ];

    let allUrls = [];
    for (const sm of sitemaps) {
        const urls = await extractUrls(sm);
        console.log(`${sm}: ${urls.length} posts`);
        allUrls = allUrls.concat(urls);
    }

    console.log(`\nTotal posts found: ${allUrls.length}\n`);

    // Extract topic from URL slug
    const topics = allUrls.map(url => {
        const slug = url.replace('https://blog.hocexcel.online/', '').replace('.html', '');
        // Clean up slug → readable topic
        return slug
            .replace(/^\d+-[%\w]*-/g, '') // remove numbered prefixes
            .replace(/-/g, ' ')
            .replace(/%[0-9a-f]{2}/gi, '') // remove URL encoded chars
            .trim();
    }).filter(t => t.length > 5); // filter out very short/empty

    // Group by category keywords
    const categories = {
        'Hàm Excel': [], 'VBA/Macro': [], 'Biểu đồ/Chart': [],
        'Pivot Table': [], 'Định dạng': [], 'Data Validation': [],
        'Power Query': [], 'Thủ thuật': [], 'Ứng dụng thực tế': [],
        'Khác': []
    };

    for (const url of allUrls) {
        const slug = url.replace('https://blog.hocexcel.online/', '').replace('.html', '');
        const lower = decodeURIComponent(slug).toLowerCase();

        if (lower.includes('ham-') || lower.includes('sumif') || lower.includes('vlookup') ||
            lower.includes('countif') || lower.includes('index-match') || lower.includes('if-')) {
            categories['Hàm Excel'].push(slug);
        } else if (lower.includes('vba') || lower.includes('macro') || lower.includes('userform')) {
            categories['VBA/Macro'].push(slug);
        } else if (lower.includes('bieu-do') || lower.includes('chart') || lower.includes('sparkline')) {
            categories['Biểu đồ/Chart'].push(slug);
        } else if (lower.includes('pivot')) {
            categories['Pivot Table'].push(slug);
        } else if (lower.includes('dinh-dang') || lower.includes('format') || lower.includes('conditional')) {
            categories['Định dạng'].push(slug);
        } else if (lower.includes('validation') || lower.includes('dropdown')) {
            categories['Data Validation'].push(slug);
        } else if (lower.includes('power-query') || lower.includes('power query')) {
            categories['Power Query'].push(slug);
        } else if (lower.includes('phim-tat') || lower.includes('meo') || lower.includes('thu-thuat') || lower.includes('tips')) {
            categories['Thủ thuật'].push(slug);
        } else if (lower.includes('bao-cao') || lower.includes('luong') || lower.includes('kho') ||
            lower.includes('ke-toan') || lower.includes('nhan-su') || lower.includes('quan-ly')) {
            categories['Ứng dụng thực tế'].push(slug);
        } else {
            categories['Khác'].push(slug);
        }
    }

    console.log('=== TOPICS BY CATEGORY ===\n');
    for (const [cat, slugs] of Object.entries(categories)) {
        console.log(`\n### ${cat} (${slugs.length} bài):`);
        slugs.slice(0, 15).forEach(s => console.log(`  - ${s}`));
        if (slugs.length > 15) console.log(`  ... và ${slugs.length - 15} bài nữa`);
    }

    console.log('\n=== SUMMARY ===');
    for (const [cat, slugs] of Object.entries(categories)) {
        console.log(`${cat}: ${slugs.length}`);
    }
}

main().catch(console.error);
