const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
try { require('@dotenvx/dotenvx').config({ path: '.env.local' }); } catch { require('dotenv').config({ path: '.env.local' }); }
const { createClient } = require('@supabase/supabase-js');

const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_OAUTH_CLIENT_ID, process.env.GOOGLE_OAUTH_CLIENT_SECRET);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: oauth2Client });
const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ARTIFACT_DIR = 'C:\\Users\\trung\\.gemini\\antigravity\\brain\\aa338dd6-6f65-43e9-a9ca-04a0c070207c';

// CORRECTED slugs from database
const imagePostMap = [
    // VBA - corrected slugs
    { file: 'vba_macro_recorder_1772471180792.png', slug: 'macro-vba-cho-nguoi-moi-tu-dong-hoa-excel-chi-voi-record-macro', alt: 'Giao diện Record Macro trong Excel VBA' },
    { file: 'vba_userform_design_1772471192135.png', slug: 'vba-userform-tao-giao-dien-nhap-lieu-chuyen-nghiep', alt: 'Thiết kế VBA UserForm nhập liệu trong Excel' },
    { file: 'vba_loops_flowchart_1772471208452.png', slug: 'vong-lap-va-dieu-kien-trong-vba-for-do-while-if', alt: 'Sơ đồ vòng lặp và điều kiện trong VBA' },
    // SQL - corrected slugs
    { file: 'sql_select_query_1772471267123.png', slug: 'cau-lenh-select-trong-sql', alt: 'Câu lệnh SELECT truy vấn dữ liệu SQL' },
    { file: 'sql_join_diagram_1772471281936.png', slug: 'join-trong-sql-ket-hop-du-lieu', alt: 'Sơ đồ các loại JOIN trong SQL' },
    { file: 'sql_window_func_1772471323820.png', slug: 'window-functions-trong-sql', alt: 'Window Functions ROW_NUMBER RANK trong SQL' },
    { file: 'sql_subquery_cte_1772471340875.png', slug: 'subquery-va-cte-trong-sql', alt: 'Subquery và CTE trong SQL' },
    { file: 'sql_index_btree_1772471805549.png', slug: 'index-trong-sql-tang-toc-truy-van-va-sai-lam-can-tranh', alt: 'B-Tree Index trong SQL' },
    // Python - corrected slugs
    { file: 'python_hello_world_1772471389574.png', slug: 'python-cho-nguoi-moi-bat-dau', alt: 'Python cho người mới bắt đầu' },
    { file: 'python_pandas_df_1772471405818.png', slug: 'pandas-trong-python-xu-ly-phan-tich-du-lieu', alt: 'Pandas DataFrame xử lý dữ liệu Python' },
    { file: 'python_matplotlib_1772471467956.png', slug: 'truc-quan-hoa-du-lieu-bang-python-matplotlib-seaborn', alt: 'Trực quan hóa dữ liệu Matplotlib Seaborn' },
    { file: 'python_openpyxl_1772471484907.png', slug: 'tu-dong-hoa-bao-cao-excel-bang-python', alt: 'Tự động hóa báo cáo Excel bằng Python' },
    // Power BI - corrected slugs
    { file: 'powerbi_dashboard_1772471512715.png', slug: 'power-bi-cho-nguoi-moi-bat-dau', alt: 'Power BI Dashboard cho người mới' },
    { file: 'powerbi_dax_calc_1772471528487.png', slug: 'dax-trong-power-bi-co-ban-den-nang-cao', alt: 'DAX formulas trong Power BI' },
    { file: 'powerbi_datamodel_1772471558017.png', slug: 'data-modeling-trong-power-bi-star-schema', alt: 'Data Model Star Schema trong Power BI' },
    // Power Query - corrected slugs
    { file: 'powerquery_etl_1772471573207.png', slug: 'power-query-cho-nguoi-moi', alt: 'Power Query ETL pipeline' },
    { file: 'powerquery_merge_1772471588833.png', slug: 'merge-append-queries-trong-power-query', alt: 'Merge Queries trong Power Query' },
    { file: 'powerquery_mlang_1772471613200.png', slug: 'ngon-ngu-m-trong-power-query-viet-cong-thuc', alt: 'M Language trong Power Query' },
    { file: 'powerquery_datasrc_1772471628169.png', slug: 'power-query-ket-noi-du-lieu-tu-nhieu-nguon-csv-web-database', alt: 'Kết nối nhiều nguồn dữ liệu Power Query' },
    // Google Sheets - corrected slugs
    { file: 'gsheets_importfunc_1772471644963.png', slug: 'importrange-importdata-importhtml-ket-noi-du-lieu', alt: 'Google Sheets IMPORT functions' },
    { file: 'gsheets_query_func_1772471673940.png', slug: 'ham-query-trong-google-sheets', alt: 'Hàm QUERY trong Google Sheets' },
    { file: 'gsheets_vs_excel_1772471689129.png', slug: 'google-sheets-cho-nguoi-dung-excel', alt: 'Google Sheets vs Excel so sánh' },
    { file: 'gsheets_tips_inline_1772471705950.png', slug: 'google-sheets-20-phim-tat-va-meo-hay', alt: 'Phím tắt và mẹo Google Sheets' },
    // AI - corrected slugs
    { file: 'ai_chatgpt_data_1772471730399.png', slug: 'chatgpt-cho-dan-data-viet-sql-python', alt: 'ChatGPT cho Data Analyst' },
    { file: 'ai_copilot_excel_1772471745674.png', slug: 'copilot-trong-excel-ai-phan-tich-du-lieu', alt: 'Microsoft Copilot trong Excel' },
    { file: 'ai_gemini_gsheets_1772471760936.png', slug: 'gemini-ai-trong-google-sheets', alt: 'Gemini AI trong Google Sheets' },
    { file: 'ai_supplychain_ml_1772471789695.png', slug: 'ai-trong-supply-chain-du-bao-nhu-cau-toi-uu-ton-kho', alt: 'AI Machine Learning trong Supply Chain' },
    // Extra: posts already done (skip if already have image)
    { file: 'powerbi_service_cloud_1772471820654.png', slug: 'power-bi-service-publish-chia-se-dashboard-auto-refresh', alt: 'Power BI Service cloud publishing' },
    { file: 'python_webscrape_1772471434871.png', slug: 'web-scraping-bang-python-beautifulsoup-requests', alt: 'Web scraping với Python' },
];

async function uploadAndInject(item) {
    const filePath = path.join(ARTIFACT_DIR, item.file);
    if (!fs.existsSync(filePath)) { console.log(`SKIP: ${item.file} not found`); return null; }

    try {
        // Check if post already has an inline image
        const { data: post, error: fetchErr } = await supabase
            .from('posts').select('id, content').eq('slug', item.slug).single();

        if (fetchErr || !post) { console.log(`DB FETCH ERROR: ${item.slug}`); return null; }

        const content = typeof post.content === 'string' ? JSON.parse(post.content) : post.content;
        // Skip if already has inline image
        if (content && content.content && content.content.some(n => n.type === 'image')) {
            console.log(`ALREADY HAS IMAGE: ${item.slug}`);
            return 'skip';
        }

        // 1. Upload to Google Drive
        const res = await drive.files.create({
            requestBody: { name: `inline_${item.file}`, parents: [folderId] },
            media: { mimeType: 'image/png', body: fs.createReadStream(filePath) },
            fields: 'id',
        });
        await drive.permissions.create({ fileId: res.data.id, requestBody: { role: 'reader', type: 'anyone' } });
        const imageUrl = `https://lh3.googleusercontent.com/d/${res.data.id}=s0`;

        // 2. Inject image node after first heading + its following paragraph
        if (content && content.content) {
            let insertIdx = 1;
            for (let i = 0; i < content.content.length; i++) {
                if (content.content[i].type === 'heading') {
                    insertIdx = i + 1;
                    if (insertIdx < content.content.length && content.content[insertIdx].type === 'paragraph') {
                        insertIdx++;
                    }
                    break;
                }
            }

            const imageNode = { type: 'image', attrs: { src: imageUrl, alt: item.alt, title: item.alt } };
            content.content.splice(insertIdx, 0, imageNode);

            const { error: updateErr } = await supabase
                .from('posts').update({ content: content }).eq('id', post.id);

            if (updateErr) { console.log(`DB UPDATE ERROR: ${item.slug} - ${updateErr.message}`); return null; }
            console.log(`OK: ${item.slug}`);
            return imageUrl;
        }
    } catch (err) {
        console.log(`ERROR: ${item.file} - ${err.message}`);
        return null;
    }
}

async function main() {
    console.log(`Processing ${imagePostMap.length} inline images...`);
    let success = 0, fail = 0, skip = 0;

    for (const item of imagePostMap) {
        const result = await uploadAndInject(item);
        if (result === 'skip') skip++;
        else if (result) success++;
        else fail++;
        await new Promise(r => setTimeout(r, 300));
    }

    console.log(`\nDone! Success: ${success}, Skipped: ${skip}, Failed: ${fail}`);
}

main();
