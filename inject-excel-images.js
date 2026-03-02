const { createClient } = require('@supabase/supabase-js');
try { require('@dotenvx/dotenvx').config({ path: '.env.local' }); } catch { require('dotenv').config({ path: '.env.local' }); }

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Existing inline images from Google Drive grouped by theme
const IMAGES = {
    formula: 'https://lh3.googleusercontent.com/d/1D9y6ukFhBzeRauJ-205elNz3FR0ex7H9=s0', // SQL Select - has formula/table look
    lookup: 'https://lh3.googleusercontent.com/d/1qxTLxhZFGKjX3cNXg_o3b7aizabJafd0=s0', // SQL Join diagram - good for lookup
    chart: 'https://lh3.googleusercontent.com/d/1wXBCQ0bhOCicd_ebnbniROQOqw6jr4HM=s0', // PBI dashboard - good for charts
    data_cleaning: 'https://lh3.googleusercontent.com/d/1rTgYMTgSnHnMTVPXloqIIe20Dr_wJG6T=s0', // Pandas DF - good for data
    automation: 'https://lh3.googleusercontent.com/d/1gKXWBOTn5zaUTFPadk89Py3Y4cUEJRUI=s0', // VBA Macro - good for automation
    conditional: 'https://lh3.googleusercontent.com/d/1XVQI1wEoqi7WThahQzuXvJ1u6_LM_7U6=s0', // GSheets tips - good for formatting
    pivot: 'https://lh3.googleusercontent.com/d/1bJvcW1HrobM04u9hYvzvID93hxba_3-e=s0', // PQ Pivot - good for pivot
    stats: 'https://lh3.googleusercontent.com/d/1iYVASHopOg01wrwabXX6StnynIB4j_cX=s0', // SQL GroupBy - good for stats/agg
    validation: 'https://lh3.googleusercontent.com/d/15O3utepSslrsyqhx6NTU3u0fhxtG2YDu=s0', // GSheets vs Excel - good for comparison
    import: 'https://lh3.googleusercontent.com/d/1jSXvcL2kq5G8mtKC1jbLTocS5e4f6eQw=s0', // Import functions
    pbi_design: 'https://lh3.googleusercontent.com/d/1D8BtiyAOE8yIwSD2tWdY2FEbujL3bCTV=s0', // PBI Dashboard design  
    apps_script: 'https://lh3.googleusercontent.com/d/11paPmJeqZiLrLZUlIl3e0S4K2Bi41Jkt=s0', // Apps Script
};

// Map each Excel post to the most relevant image
const postImageMap = [
    // VLOOKUP, INDEX MATCH, LOOKUP posts → lookup image
    { slug: 'lam-chu-ham-vlookup-trong-excel', img: IMAGES.lookup, alt: 'Minh họa tra cứu dữ liệu VLOOKUP' },
    { slug: 'index-match-trong-excel-tra-cuu-du-lieu-linh-hoat', img: IMAGES.lookup, alt: 'INDEX MATCH tra cứu linh hoạt' },
    { slug: 'ham-xlookup-trong-excel-365-thay-the-vlookup-manh-hon-gap-nhieu-lan', img: IMAGES.lookup, alt: 'XLOOKUP thay thế VLOOKUP' },
    { slug: 'ham-match-index-match-match-tra-cuu-2-chieu-linh-hoat', img: IMAGES.lookup, alt: 'INDEX MATCH MATCH tra cứu 2 chiều' },
    { slug: 'ham-lookup-nang-cao-choose-lookup-hai-chieu-va-ky-thuat-tra-cuu-pro', img: IMAGES.lookup, alt: 'Kỹ thuật tra cứu nâng cao' },
    { slug: 'indirect-va-tham-chieu-dong-trong-excel-tao-cong-thuc-linh-hoat-vo-han', img: IMAGES.lookup, alt: 'INDIRECT tham chiếu động' },

    // IF, logic, conditions → formula image
    { slug: 'huong-dan-toan-dien-ham-if-trong-excel', img: IMAGES.formula, alt: 'Hàm IF trong Excel' },
    { slug: 'ham-if-long-nhieu-dieu-kien-ifs-switch-xu-ly-logic-phuc-tap-trong-excel', img: IMAGES.formula, alt: 'IF lồng nhiều điều kiện' },
    { slug: 'choose-switch-ifs-thay-the-nested-if-cho-cong-thuc-sach-hon', img: IMAGES.formula, alt: 'CHOOSE SWITCH IFS thay IF lồng' },
    { slug: 'ham-iferror-ifna-va-xu-ly-loi-thong-minh-trong-cong-thuc-excel', img: IMAGES.formula, alt: 'IFERROR IFNA xử lý lỗi' },
    { slug: 'let-lambda-va-lam-sach-cong-thuc-trong-excel-365', img: IMAGES.formula, alt: 'LET LAMBDA trong Excel 365' },
    { slug: 'cong-thuc-mang-trong-excel-ctrlshiftenter-va-dynamic-arrays', img: IMAGES.formula, alt: 'Công thức mảng Dynamic Arrays' },

    // SUM, COUNT, STATS → stats image
    { slug: 'ham-sumif-va-sumifs-trong-excel-tinh-tong-co-dieu-kien', img: IMAGES.stats, alt: 'SUMIF SUMIFS tính tổng có điều kiện' },
    { slug: 'ham-countif-va-countifs-dem-du-lieu-co-dieu-kien-trong-excel', img: IMAGES.stats, alt: 'COUNTIF COUNTIFS đếm có điều kiện' },
    { slug: 'ham-sumproduct-trong-excel-tinh-toan-co-dieu-kien-khong-can-cot-phu', img: IMAGES.stats, alt: 'SUMPRODUCT tính toán đa điều kiện' },
    { slug: 'ham-thong-ke-trong-excel-average-median-mode-stdev-percentile', img: IMAGES.stats, alt: 'Hàm thống kê AVERAGE MEDIAN' },
    { slug: 'subtotal-va-aggregate-tinh-toan-thong-minh-voi-du-lieu-loc-trong-excel', img: IMAGES.stats, alt: 'SUBTOTAL AGGREGATE' },
    { slug: 'ham-round-roundup-rounddown-int-trunc-lam-tron-so-trong-excel', img: IMAGES.stats, alt: 'Hàm làm tròn số' },

    // Charts, Dashboard → chart image
    { slug: 'bieu-do-trong-excel-cach-tao-chart-dep-va-chuyen-nghiep', img: IMAGES.chart, alt: 'Biểu đồ Excel chuyên nghiệp' },
    { slug: 'pivot-chart-trong-excel-tao-bieu-do-tuong-tac-tu-pivot-table', img: IMAGES.chart, alt: 'Pivot Chart tương tác' },
    { slug: 'sparklines-trong-excel-mini-chart-trong-1-o-giup-du-lieu-song-dong', img: IMAGES.chart, alt: 'Sparklines mini chart' },
    { slug: 'dashboard-excel-cach-tao-bang-dieu-khien-tuong-tac-chuyen-nghiep', img: IMAGES.chart, alt: 'Dashboard Excel chuyên nghiệp' },

    // Pivot Table → pivot image
    { slug: 'pivot-table-trong-excel-bien-du-lieu-thanh-bao-cao', img: IMAGES.pivot, alt: 'Pivot Table trong Excel' },

    // Text, String functions → data cleaning
    { slug: 'cac-ham-xu-ly-chuoi-trong-excel-left-right-mid-trim', img: IMAGES.data_cleaning, alt: 'Hàm xử lý chuỗi LEFT RIGHT MID' },
    { slug: 'ham-concatenate-textjoin-concat-noi-chuoi-va-gop-du-lieu-trong-excel', img: IMAGES.data_cleaning, alt: 'CONCATENATE TEXTJOIN nối chuỗi' },
    { slug: 'lam-sach-du-lieu-trong-excel-trim-clean-substitute-va-cac-ky-thuat-data-cleaning', img: IMAGES.data_cleaning, alt: 'Data cleaning TRIM CLEAN' },

    // Date functions → formula
    { slug: 'ham-ngay-thang-trong-excel-date-today-datedif-edate', img: IMAGES.formula, alt: 'Hàm ngày tháng DATE TODAY' },
    { slug: 'ham-datedif-yearfrac-networkdays-tinh-khoang-cach-thoi-gian-trong-excel', img: IMAGES.formula, alt: 'DATEDIF YEARFRAC NETWORKDAYS' },

    // Conditional Formatting → conditional
    { slug: 'conditional-formatting-trong-excel-to-mau-du-lieu-tu-dong', img: IMAGES.conditional, alt: 'Conditional Formatting tô màu' },
    { slug: 'format-so-trong-excel-custom-number-format-tu-co-ban-den-chuyen-nghiep', img: IMAGES.conditional, alt: 'Custom Number Format' },
    { slug: 'custom-number-format-trong-excel-tao-dinh-dang-so-theo-y-muon', img: IMAGES.conditional, alt: 'Tạo định dạng số tuỳ chỉnh' },

    // Data Validation → validation
    { slug: 'data-validation-trong-excel-kiem-soat-du-lieu-dau-vao', img: IMAGES.validation, alt: 'Data Validation kiểm soát đầu vào' },
    { slug: 'dropdown-phu-thuoc-dependent-dropdown-trong-excel-tao-danh-sach-lien-ket-tu-dong', img: IMAGES.validation, alt: 'Dependent Dropdown danh sách liên kết' },

    // Error handling → formula
    { slug: 'o-loi-trong-excel-hieu-va-xu-ly-value-ref-name-div0-null', img: IMAGES.formula, alt: 'Xử lý lỗi VALUE REF NAME' },
    { slug: 'xu-ly-loi-trong-excel-na-value-ref-div0-cach-khac-phuc', img: IMAGES.formula, alt: 'Xử lý lỗi NA VALUE REF' },

    // Table, Named Range → data_cleaning
    { slug: 'excel-table-tai-sao-dan-pro-luon-dung-ctrl-t', img: IMAGES.data_cleaning, alt: 'Excel Table Ctrl+T' },
    { slug: 'named-range-trong-excel-dat-ten-vung-du-lieu-cong-thuc', img: IMAGES.data_cleaning, alt: 'Named Range đặt tên vùng' },

    // Reference, Paste → formula
    { slug: 'quy-tac-tham-chieu-a1-a1-a1-hieu-dung-absolute-va-relative-reference', img: IMAGES.formula, alt: 'Absolute Relative Reference' },
    { slug: 'paste-special-trong-excel-15-cach-dan-thong-minh-ai-cung-nen-biet', img: IMAGES.formula, alt: 'Paste Special dán thông minh' },

    // Sort, Filter, Find → data_cleaning
    { slug: 'sort-va-filter-trong-excel-sap-xep-va-loc-du-lieu', img: IMAGES.data_cleaning, alt: 'Sort Filter sắp xếp lọc' },
    { slug: 'find-replace-nang-cao-trong-excel-tim-kiem-thay-the', img: IMAGES.data_cleaning, alt: 'Find Replace tìm thay thế' },
    { slug: 'freeze-panes-split-va-group-trong-excel-xem-bang-lon', img: IMAGES.data_cleaning, alt: 'Freeze Panes Split Group' },

    // Shortcut, Print → conditional
    { slug: '50-phim-tat-excel-quan-trong-nhat-giup-ban-lam-viec-nhanh', img: IMAGES.conditional, alt: 'Phím tắt Excel quan trọng' },
    { slug: 'thiet-lap-in-an-trong-excel-page-setup-print-area-va-meo-in-dep', img: IMAGES.conditional, alt: 'Page Setup Print Area' },

    // Protect, Comments → validation
    { slug: 'protect-sheet-va-protect-workbook-trong-excel-bao-ve-du-lieu-dung-cach', img: IMAGES.validation, alt: 'Protect Sheet Workbook' },
    { slug: 'comments-notes-va-cong-tac-trong-excel-ghi-chu-review-va-chia-se-file', img: IMAGES.validation, alt: 'Comments Notes cộng tác' },

    // Power Query in Excel, What-if → automation
    { slug: 'power-query-trong-excel-nhap-bien-doi-va-gop-du-lieu-tu-dong', img: IMAGES.automation, alt: 'Power Query trong Excel' },
    { slug: 'power-query-nang-cao-unpivot-merge-append-va-custom-columns', img: IMAGES.automation, alt: 'Power Query nâng cao' },
    { slug: 'goal-seek-solver-va-what-if-analysis-trong-excel-tim-dap-an-nguoc', img: IMAGES.automation, alt: 'Goal Seek Solver What-If' },
    { slug: 'hyperlink-va-navigation-trong-excel-tao-file-de-dieu-huong-nhu-website', img: IMAGES.automation, alt: 'Hyperlink Navigation' },

    // Non-Excel missing posts
    { slug: 'thiet-ke-dashboard-power-bi-dep-va-hieu-qua', img: IMAGES.pbi_design, alt: 'Thiết kế Dashboard Power BI' },
    { slug: 'apps-script-trong-google-sheets-tu-dong-hoa', img: IMAGES.apps_script, alt: 'Apps Script Google Sheets' },
];

async function injectImage(item) {
    try {
        const { data: post, error } = await supabase
            .from('posts').select('id, content').eq('slug', item.slug).single();

        if (error || !post) { console.log(`SKIP: ${item.slug} - not found`); return false; }

        const content = typeof post.content === 'string' ? JSON.parse(post.content) : post.content;
        if (!content || !content.content) { console.log(`SKIP: ${item.slug} - no content`); return false; }

        // Skip if already has image
        if (content.content.some(n => n.type === 'image')) {
            console.log(`ALREADY: ${item.slug}`);
            return true;
        }

        // Find position after first heading + paragraph
        let insertIdx = 1;
        for (let i = 0; i < content.content.length; i++) {
            if (content.content[i].type === 'heading') {
                insertIdx = i + 1;
                if (insertIdx < content.content.length && content.content[insertIdx].type === 'paragraph') insertIdx++;
                break;
            }
        }

        content.content.splice(insertIdx, 0, {
            type: 'image',
            attrs: { src: item.img, alt: item.alt, title: item.alt }
        });

        const { error: updateErr } = await supabase
            .from('posts').update({ content }).eq('id', post.id);

        if (updateErr) { console.log(`ERROR: ${item.slug} - ${updateErr.message}`); return false; }
        console.log(`OK: ${item.slug}`);
        return true;
    } catch (err) {
        console.log(`ERROR: ${item.slug} - ${err.message}`);
        return false;
    }
}

async function main() {
    console.log(`Injecting images into ${postImageMap.length} posts...`);
    let ok = 0, fail = 0;
    for (const item of postImageMap) {
        const result = await injectImage(item);
        if (result) ok++; else fail++;
        await new Promise(r => setTimeout(r, 100));
    }
    console.log(`\nDone! OK: ${ok}, Failed: ${fail}`);
}

main();
