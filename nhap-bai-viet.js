// Nhập bài viết từ file Markdown trong noi-dung/ vào bảng `posts` của Supabase.
//
// Markdown được chuyển THẲNG sang TipTap JSON, không đi qua HTML — vì `generateJSON`
// của @tiptap/html cần một DOM (happy-dom) mà script chạy tay không có sẵn.
// Dựng JSON trực tiếp nên kết quả xác định và kiểm được bằng --thu.
//
// Chạy thử (không ghi DB, không cần .env.local):
//   node nhap-bai-viet.js noi-dung/lo-1
// Ghi thật (cần NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY trong .env.local):
//   node nhap-bai-viet.js noi-dung/lo-1 --ghi
// Chọn tác giả (mặc định lấy admin đầu tiên trong `profiles`):
//   node nhap-bai-viet.js noi-dung/lo-1 --ghi --tac-gia email@domain.com

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────
// Frontmatter
// ─────────────────────────────────────────────────────────────

function docFrontmatter(noiDung) {
    const dong = noiDung.replace(/\r\n/g, '\n').split('\n');
    if (dong[0].trim() !== '---') return { meta: {}, than: noiDung };
    const ketThuc = dong.indexOf('---', 1);
    if (ketThuc === -1) return { meta: {}, than: noiDung };

    const meta = {};
    for (const l of dong.slice(1, ketThuc)) {
        const m = /^([a-z_]+):\s*(.*)$/.exec(l.trim());
        if (!m) continue;
        const khoa = m[1];
        let gt = m[2].trim();
        if (gt.startsWith('[') && gt.endsWith(']')) {
            // Mảng: ["a", "b"]
            meta[khoa] = gt.slice(1, -1).split(',')
                .map(s => s.trim().replace(/^["']|["']$/g, ''))
                .filter(Boolean);
        } else {
            meta[khoa] = gt.replace(/^["']|["']$/g, '');
        }
    }
    return { meta, than: dong.slice(ketThuc + 1).join('\n').trim() };
}

// ─────────────────────────────────────────────────────────────
// Markdown -> TipTap JSON
// ─────────────────────────────────────────────────────────────

const chu = (text, marks) => (marks && marks.length ? { type: 'text', text, marks } : { type: 'text', text });

// Tách định dạng trong dòng. Đệ quy để **chữ đậm có `code` bên trong** vẫn đúng.
function phanTichInline(chuoi, marksNgoai) {
    const ngoai = marksNgoai || [];
    const ra = [];
    let con = String(chuoi);

    while (con.length) {
        const ungVien = [];
        const day = (re, xuLy) => {
            const m = re.exec(con);
            if (m) ungVien.push({ vt: m.index, dai: m[0].length, ...xuLy(m) });
        };

        // `code` xử lý trước, và KHÔNG đệ quy vào trong — nội dung code là nguyên văn
        day(/`([^`]+)`/, m => ({ text: m[1], la: 'code' }));
        day(/\*\*([^*]+?)\*\*/, m => ({ text: m[1], la: 'dam' }));
        day(/\[([^\]]+)\]\(([^)]+)\)/, m => ({ text: m[1], la: 'lien', href: m[2] }));
        day(/(^|[^*])\*([^*]+?)\*(?!\*)/, m => ({
            vtBu: m[1] ? m[1].length : 0, text: m[2], la: 'nghieng',
        }));

        if (!ungVien.length) { ra.push(chu(con, ngoai)); break; }

        // Chọn khớp sớm nhất; cùng vị trí thì lấy khớp dài hơn (** trước *)
        ungVien.sort((a, b) => (a.vt + (a.vtBu || 0)) - (b.vt + (b.vtBu || 0)) || b.dai - a.dai);
        const t = ungVien[0];
        const vtThat = t.vt + (t.vtBu || 0);
        const daiThat = t.dai - (t.vtBu || 0);

        if (vtThat > 0) ra.push(chu(con.slice(0, vtThat), ngoai));

        if (t.la === 'code') {
            ra.push(chu(t.text, [...ngoai, { type: 'code' }]));
        } else if (t.la === 'dam') {
            ra.push(...phanTichInline(t.text, [...ngoai, { type: 'bold' }]));
        } else if (t.la === 'nghieng') {
            ra.push(...phanTichInline(t.text, [...ngoai, { type: 'italic' }]));
        } else if (t.la === 'lien') {
            const mark = {
                type: 'link',
                attrs: { href: t.href, target: t.href.startsWith('/') ? null : '_blank', rel: 'noopener noreferrer', class: null },
            };
            ra.push(...phanTichInline(t.text, [...ngoai, mark]));
        }

        con = con.slice(vtThat + daiThat);
    }

    return ra.filter(n => n.text !== '');
}

const doanVan = noiDung => (noiDung && noiDung.length ? { type: 'paragraph', content: noiDung } : { type: 'paragraph' });

function oBang(noiDung, laDau) {
    return {
        type: laDau ? 'tableHeader' : 'tableCell',
        attrs: { colspan: 1, rowspan: 1, colwidth: null },
        content: [doanVan(noiDung)],
    };
}

// `anhTheoTen` map tên ảnh -> { src, alt } để thay mốc {{anh:...}}
function markdownSangTiptap(than, anhTheoTen) {
    const dong = than.replace(/\r\n/g, '\n').split('\n');
    const noiDung = [];
    const thieuAnh = [];
    let i = 0;

    while (i < dong.length) {
        const l = dong[i].trimEnd();

        // Mốc chèn ảnh: {{anh:ten-anh}}
        const mAnh = /^\{\{anh:([\w-]+)\}\}$/.exec(l.trim());
        if (mAnh) {
            const anh = anhTheoTen[mAnh[1]];
            if (anh) {
                noiDung.push({ type: 'image', attrs: { src: anh.src, alt: anh.alt, title: null } });
            } else {
                thieuAnh.push(mAnh[1]);
            }
            i++;
            continue;
        }

        // Khối code ```lang
        const mCode = /^`{3,}(\w*)\s*$/.exec(l);
        if (mCode) {
            const dongCode = [];
            i++;
            while (i < dong.length && !/^`{3,}\s*$/.test(dong[i].trimEnd())) {
                dongCode.push(dong[i]);
                i++;
            }
            if (i < dong.length) i++; // bỏ ``` đóng
            noiDung.push({
                type: 'codeBlock',
                attrs: { language: mCode[1] || null },
                content: dongCode.length ? [chu(dongCode.join('\n'))] : [],
            });
            continue;
        }

        // Tiêu đề mục
        const mTd = /^(#{1,6})\s+(.+)$/.exec(l);
        if (mTd) {
            noiDung.push({
                type: 'heading',
                attrs: { level: mTd[1].length },
                content: phanTichInline(mTd[2]),
            });
            i++;
            continue;
        }

        // Đường kẻ ngang
        if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(l)) {
            noiDung.push({ type: 'horizontalRule' });
            i++;
            continue;
        }

        // Bảng — dòng sau phải là dòng phân cách |---|---|
        if (l.trim().startsWith('|') && i + 1 < dong.length
            && /^\|[\s\-:|]+\|\s*$/.test(dong[i + 1].trim())) {
            const tachO = s => s.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
            const hang = [{
                type: 'tableRow',
                content: tachO(l).map(c => oBang(phanTichInline(c), true)),
            }];
            i += 2;
            while (i < dong.length && dong[i].trim().startsWith('|')) {
                hang.push({
                    type: 'tableRow',
                    content: tachO(dong[i]).map(c => oBang(phanTichInline(c), false)),
                });
                i++;
            }
            noiDung.push({ type: 'table', content: hang });
            continue;
        }

        // Danh sách không thứ tự
        if (/^[-*+]\s+/.test(l)) {
            const muc = [];
            while (i < dong.length && /^[-*+]\s+/.test(dong[i].trimEnd())) {
                muc.push({
                    type: 'listItem',
                    content: [doanVan(phanTichInline(dong[i].trimEnd().replace(/^[-*+]\s+/, '')))],
                });
                i++;
            }
            noiDung.push({ type: 'bulletList', content: muc });
            continue;
        }

        // Danh sách có thứ tự
        if (/^\d+\.\s+/.test(l)) {
            const muc = [];
            const batDau = parseInt(/^(\d+)\./.exec(l)[1], 10);
            while (i < dong.length && /^\d+\.\s+/.test(dong[i].trimEnd())) {
                muc.push({
                    type: 'listItem',
                    content: [doanVan(phanTichInline(dong[i].trimEnd().replace(/^\d+\.\s+/, '')))],
                });
                i++;
            }
            noiDung.push({ type: 'orderedList', attrs: { start: batDau }, content: muc });
            continue;
        }

        // Dòng trống
        if (!l.trim()) { i++; continue; }

        // Còn lại là đoạn văn
        noiDung.push(doanVan(phanTichInline(l.trim())));
        i++;
    }

    return { doc: { type: 'doc', content: noiDung }, thieuAnh };
}

// ─────────────────────────────────────────────────────────────
// Phụ trợ
// ─────────────────────────────────────────────────────────────

function layChuTho(node) {
    let t = '';
    (function di(n) {
        if (n.text) t += n.text + ' ';
        if (n.content) n.content.forEach(di);
    })(node);
    return t;
}

function thoiGianDoc(doc) {
    const soTu = layChuTho(doc).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(soTu / 200));
}

function taoSlug(s) {
    return String(s).toLowerCase().normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Đọc các file khai ảnh (anh*.js) để lấy `tieuDe` của từng ảnh làm alt
function napAltAnh(thuMucLo) {
    const map = {};
    const tep = fs.existsSync(thuMucLo)
        ? fs.readdirSync(thuMucLo).filter(f => /^anh.*\.js$/.test(f))
        : [];
    for (const f of tep) {
        let mod;
        try {
            mod = require(path.resolve(thuMucLo, f));
        } catch (e) {
            console.warn(`  ! không nạp được ${f}: ${e.message}`);
            continue;
        }
        for (const bai of mod.LO || []) {
            for (const spec of bai.anh || []) {
                map[spec.ten] = {
                    src: `/images/bai-viet/${bai.slug}/${spec.ten}.png`,
                    alt: spec.tieuDe || spec.ten,
                };
            }
        }
    }
    return map;
}

// ─────────────────────────────────────────────────────────────
// Chạy
// ─────────────────────────────────────────────────────────────

function docThamSo(argv) {
    const ts = { duong: [], ghi: false, tacGia: null, thu: false };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--ghi') ts.ghi = true;
        else if (a === '--thu') ts.thu = true;
        else if (a === '--tac-gia') ts.tacGia = argv[++i];
        else ts.duong.push(a);
    }
    return ts;
}

function gomFileMd(duongDan) {
    const ra = [];
    for (const d of duongDan) {
        const st = fs.statSync(d);
        if (st.isDirectory()) {
            ra.push(...fs.readdirSync(d).filter(f => f.endsWith('.md')).sort().map(f => path.join(d, f)));
        } else if (d.endsWith('.md')) {
            ra.push(d);
        }
    }
    return ra;
}

async function chay() {
    const ts = docThamSo(process.argv.slice(2));
    if (!ts.duong.length) {
        console.error('Cách dùng: node nhap-bai-viet.js <file.md | thư mục> [--ghi] [--tac-gia email]');
        process.exit(1);
    }

    const tepMd = gomFileMd(ts.duong);
    if (!tepMd.length) {
        console.error('Không tìm thấy file .md nào.');
        process.exit(1);
    }

    // Alt của ảnh lấy từ file khai ảnh nằm cùng thư mục
    const altAnh = napAltAnh(path.dirname(tepMd[0]));

    const chuanBi = [];
    let coLoi = false;

    for (const tep of tepMd) {
        const { meta, than } = docFrontmatter(fs.readFileSync(tep, 'utf8'));
        if (!meta.tieu_de) {
            console.error(`✗ ${path.basename(tep)}: thiếu tieu_de trong frontmatter`);
            coLoi = true;
            continue;
        }

        const { doc, thieuAnh } = markdownSangTiptap(than, altAnh);
        if (thieuAnh.length) {
            console.error(`✗ ${path.basename(tep)}: không có ảnh cho mốc ${thieuAnh.join(', ')}`);
            coLoi = true;
        }

        const soAnh = doc.content.filter(n => n.type === 'image').length;
        const soBang = doc.content.filter(n => n.type === 'table').length;
        const soCode = doc.content.filter(n => n.type === 'codeBlock').length;
        const soMuc = doc.content.filter(n => n.type === 'heading').length;

        chuanBi.push({ tep, meta, doc, soAnh, soBang, soCode, soMuc });

        console.log(`✓ ${path.basename(tep)}`);
        console.log(`    ${meta.tieu_de}`);
        console.log(`    slug: ${meta.slug || taoSlug(meta.tieu_de)}`);
        console.log(`    ${doc.content.length} khối · ${soMuc} mục · ${soAnh} ảnh · ${soBang} bảng · ${soCode} code · ${thoiGianDoc(doc)} phút đọc`);
    }

    if (coLoi) {
        console.error('\nCó lỗi ở trên, dừng lại. Không ghi gì vào DB.');
        process.exit(1);
    }

    if (ts.thu) {
        const raJson = path.join(path.dirname(tepMd[0]), '_tiptap');
        fs.mkdirSync(raJson, { recursive: true });
        for (const b of chuanBi) {
            const f = path.join(raJson, path.basename(b.tep).replace(/\.md$/, '.json'));
            fs.writeFileSync(f, JSON.stringify(b.doc, null, 2), 'utf8');
        }
        console.log(`\nĐã ghi TipTap JSON để xem thử vào ${raJson}`);
    }

    if (!ts.ghi) {
        console.log(`\n${chuanBi.length} bài chuyển đổi OK. Chưa ghi gì vào DB — thêm --ghi để tạo bản nháp thật.`);
        return;
    }

    // ── Từ đây mới cần env và mạng ──
    const { createClient } = require('@supabase/supabase-js');
    const { requireEnv } = require('./scripts-env');
    const [URL, KEY] = requireEnv('NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY');
    const db = createClient(URL, KEY);

    // Ảnh phải nằm ở URL tuyệt đối thì trình soạn thảo và trang blog mới hiện được
    // (đường dẫn /images/... chỉ tồn tại sau khi deploy, và vỡ trong editor).
    // Upload mọi ảnh /images/... referenced lên Supabase Storage rồi trả URL công khai.
    // Cùng bucket `blog-images` mà các bài cũ đang dùng.
    const BUCKET_ANH = 'blog-images';
    const cacheUpload = {}; // '/images/..' -> URL, tránh upload lại trong 1 lần chạy
    async function uploadAnh(webPath) {
        if (!webPath || !webPath.startsWith('/images/')) return webPath; // đã là URL tuyệt đối thì giữ nguyên
        if (cacheUpload[webPath]) return cacheUpload[webPath];
        const tepCucBo = path.join(__dirname, 'public', webPath.replace(/^\//, ''));
        if (!fs.existsSync(tepCucBo)) {
            console.warn(`  ! không thấy file ảnh ${tepCucBo}, giữ nguyên đường dẫn`);
            return webPath;
        }
        // /images/bai-viet/<...>.png -> posts/bai-viet/<...>.png trong bucket
        const duongStorage = 'posts' + webPath.replace('/images', '');
        const buf = fs.readFileSync(tepCucBo);
        const { error } = await db.storage.from(BUCKET_ANH).upload(duongStorage, buf, {
            contentType: 'image/png', upsert: true,
        });
        if (error) { console.warn(`  ! upload ảnh lỗi (${duongStorage}): ${error.message}`); return webPath; }
        const { data } = db.storage.from(BUCKET_ANH).getPublicUrl(duongStorage);
        cacheUpload[webPath] = data.publicUrl;
        return data.publicUrl;
    }
    // Duyệt cây TipTap, upload & đổi src mọi node ảnh
    async function upAnhTrongDoc(node) {
        if (!node || typeof node !== 'object') return;
        if (node.type === 'image' && node.attrs && node.attrs.src) {
            node.attrs.src = await uploadAnh(node.attrs.src);
        }
        if (Array.isArray(node.content)) {
            for (const con of node.content) await upAnhTrongDoc(con);
        }
    }

    // Tác giả
    let tacGiaId = null;
    if (ts.tacGia) {
        const { data } = await db.from('profiles').select('id, email').eq('email', ts.tacGia).maybeSingle();
        if (!data) {
            console.error(`✗ Không tìm thấy profile với email ${ts.tacGia}`);
            process.exit(1);
        }
        tacGiaId = data.id;
    } else {
        const { data } = await db.from('profiles').select('id, email').eq('role', 'admin').limit(1);
        if (!data || !data.length) {
            console.error('✗ Không tìm thấy profile nào có role admin. Dùng --tac-gia email để chỉ rõ.');
            process.exit(1);
        }
        tacGiaId = data[0].id;
        console.log(`\nTác giả: ${data[0].email}`);
    }

    for (const b of chuanBi) {
        const { meta, doc } = b;
        const ten = path.basename(b.tep);

        // Danh mục theo tên
        let danhMucId = null;
        if (meta.danh_muc) {
            const { data } = await db.from('categories').select('id, name').eq('name', meta.danh_muc).maybeSingle();
            if (data) danhMucId = data.id;
            else console.warn(`  ! ${ten}: không có danh mục "${meta.danh_muc}", để trống`);
        }

        // Slug: nếu đã tồn tại thì thêm hậu tố cho khỏi đè bài cũ
        let slug = meta.slug || taoSlug(meta.tieu_de);
        const { data: daCo } = await db.from('posts').select('slug').eq('slug', slug).maybeSingle();
        if (daCo) {
            slug = `${slug}-${Date.now().toString(36)}`;
            console.warn(`  ! ${ten}: slug đã tồn tại, dùng "${slug}"`);
        }

        // Upload ảnh lên Storage, đổi src trong bài + ảnh bìa sang URL công khai
        await upAnhTrongDoc(doc);
        const anhBia = await uploadAnh(meta.anh_bia);

        const banGhi = {
            title: meta.tieu_de,
            slug,
            excerpt: meta.mo_ta || null,
            content: JSON.stringify(doc),
            cover_image: anhBia || null,
            category_id: danhMucId,
            status: meta.trang_thai || 'draft',
            is_premium: meta.premium === 'true',
            author_id: tacGiaId,
            published_at: null,
            meta_description: meta.mo_ta || null,
            keywords: meta.tu_khoa ? meta.tu_khoa.split(',').map(k => k.trim()).filter(Boolean) : null,
            reading_time: thoiGianDoc(doc),
        };

        const { data: bai, error } = await db.from('posts').insert(banGhi).select().single();
        if (error) {
            console.error(`✗ ${ten}: ${error.message}`);
            continue;
        }

        // Bảng nối danh mục (app cho phép 1 bài nhiều chủ đề). DB có trigger tự
        // sinh dòng này từ posts.category_id, nên dùng upsert bỏ qua trùng để
        // không cảnh báo "duplicate key" khi trigger đã tạo sẵn.
        if (danhMucId) {
            const { error: eDm } = await db.from('post_categories')
                .upsert({ post_id: bai.id, category_id: danhMucId }, { onConflict: 'post_id,category_id', ignoreDuplicates: true });
            if (eDm) console.warn(`  ! ${ten}: không ghi được post_categories — ${eDm.message}`);
        }

        // Thẻ: có thì dùng, chưa có thì tạo. Tìm theo SLUG chứ không phải theo
        // tên — cột `name` không có ràng buộc unique, chỉ `slug` mới có, và
        // nhiều tag cũ trong DB được đặt tên viết thường (vd. "vlookup") khác
        // hẳn cách viết in hoa/có dấu ở đây. So theo tên chính xác từng chữ sẽ
        // không thấy tag cũ, cố tạo mới thì đụng unique constraint trên slug.
        const theIds = [];
        for (const tenThe of meta.the || []) {
            const slugThe = taoSlug(tenThe);
            const { data: co } = await db.from('tags').select('id').eq('slug', slugThe).maybeSingle();
            if (co) { theIds.push(co.id); continue; }
            const { data: moi, error: eThe } = await db.from('tags')
                .insert({ name: tenThe, slug: slugThe }).select('id').single();
            if (eThe) console.warn(`  ! ${ten}: không tạo được thẻ "${tenThe}" — ${eThe.message}`);
            else theIds.push(moi.id);
        }
        if (theIds.length) {
            const { error: ePt } = await db.from('post_tags')
                .insert(theIds.map(id => ({ post_id: bai.id, tag_id: id })));
            if (ePt) console.warn(`  ! ${ten}: không ghi được post_tags — ${ePt.message}`);
        }

        console.log(`✓ ${ten} -> /blog/${bai.slug}  (nháp, ${theIds.length} thẻ)`);
    }

    console.log('\nXong. Vào /admin/posts để đọc lại rồi bấm đăng.');
    console.log('Ảnh đã upload lên Supabase Storage (bucket blog-images) nên hiện ngay, không cần deploy.');
}

chay().catch(e => { console.error(e); process.exit(1); });
