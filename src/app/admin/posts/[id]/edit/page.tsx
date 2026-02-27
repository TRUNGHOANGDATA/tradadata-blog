'use client';

import { useState, useEffect, useMemo } from 'react';
import { Save, ArrowLeft, ImagePlus, Lock, Loader2, Check, Trash2, Globe, FileText, Tag, X, Search, Sparkles, Copy, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const TiptapEditor = dynamic(
    () => import('@/components/editor/TiptapEditor').then((mod) => mod.TiptapEditor),
    {
        ssr: false,
        loading: () => (
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                <div className="p-6 min-h-[400px] flex items-center justify-center">
                    <div className="animate-pulse text-surface-400">Đang tải editor...</div>
                </div>
            </div>
        ),
    }
);

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState<Record<string, unknown> | null>(null);
    const [coverImage, setCoverImage] = useState('');
    const [status, setStatus] = useState('draft');
    const [categoryId, setCategoryId] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: string | null }>>([]);
    const [allTags, setAllTags] = useState<Array<{ id: string; name: string }>>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [tagSearch, setTagSearch] = useState('');
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const [creatingTag, setCreatingTag] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [coverKeyword, setCoverKeyword] = useState('');
    const [loadingKeyword, setLoadingKeyword] = useState(false);

    // AI Prompt Generator
    const [aiWriteOpen, setAiWriteOpen] = useState(false);
    const [aiIdeas, setAiIdeas] = useState('');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [promptCopied, setPromptCopied] = useState(false);

    // SEO fields
    const [customSlug, setCustomSlug] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [currentSlug, setCurrentSlug] = useState('');

    // Auto-generate slug preview from title
    const autoSlug = useMemo(() => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }, [title]);

    const displaySlug = customSlug || currentSlug || autoSlug;

    // Fetch post data
    useEffect(() => {
        async function loadPost() {
            try {
                const res = await fetch(`/api/admin/posts/${postId}`);
                const data = await res.json();

                if (data.post) {
                    setTitle(data.post.title || '');
                    setExcerpt(data.post.excerpt || '');
                    // Content is stored as text in DB — parse it to object for Tiptap
                    let parsedContent = data.post.content;
                    if (typeof parsedContent === 'string') {
                        try { parsedContent = JSON.parse(parsedContent); } catch { parsedContent = null; }
                    }
                    setContent(parsedContent || null);
                    setCoverImage(data.post.cover_image || '');
                    setStatus(data.post.status || 'draft');
                    setCategoryId(data.post.category_id || '');
                    setIsPremium(data.post.is_premium || false);
                    setCurrentSlug(data.post.slug || '');
                    setMetaDescription(data.post.meta_description || '');
                    setKeywords(data.post.keywords ? data.post.keywords.join(', ') : '');
                    // Load tags
                    if (data.post.tags && Array.isArray(data.post.tags)) {
                        setSelectedTagIds(data.post.tags.map((t: any) => t.id));
                    }
                }
            } catch (error) {
                console.error('Error loading post:', error);
                alert('Không tải được bài viết');
            } finally {
                setLoading(false);
            }
        }

        loadPost();
    }, [postId]);

    // Fetch categories & tags
    useEffect(() => {
        fetch('/api/admin/categories')
            .then(res => res.json())
            .then(data => {
                if (data.categories) setCategories(data.categories);
            })
            .catch(console.error);
        fetch('/api/admin/tags')
            .then(res => res.json())
            .then(data => {
                if (data.tags) setAllTags(data.tags);
            })
            .catch(console.error);
    }, []);

    // Debounced AI translation for cover image keywords
    useEffect(() => {
        if (!title.trim() || coverImage) { setCoverKeyword(''); return; }
        setLoadingKeyword(true);
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/admin/suggest-cover?title=${encodeURIComponent(title.trim())}`);
                const data = await res.json();
                setCoverKeyword(data.keyword || '');
            } catch { setCoverKeyword(''); }
            setLoadingKeyword(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [title, coverImage]);

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingCover(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await res.json();
            if (res.ok && data.url) {
                setCoverImage(data.url);
            } else {
                alert('Upload failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                alert('Upload timeout. Please try again with a smaller file or better connection.');
            } else {
                alert('Upload failed. Please try again.');
            }
        } finally {
            setUploadingCover(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleSave = async (publishStatus?: string) => {
        if (!title.trim()) {
            alert('Vui lòng nhập tiêu đề bài viết');
            return;
        }

        setSaving(true);
        try {
            const finalStatus = publishStatus || status;
            const res = await fetch(`/api/admin/posts/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    excerpt,
                    content,
                    cover_image: coverImage,
                    category_id: categoryId || null,
                    status: finalStatus,
                    is_premium: isPremium,
                    tags: selectedTagIds,
                    custom_slug: customSlug || null,
                    meta_description: metaDescription || null,
                    keywords: keywords ? keywords.split(',').map(k => k.trim()).filter(Boolean) : null,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Đã lưu thành công!');
            } else {
                alert('Lỗi: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bạn có chắc chắn muốn xoá bài viết này? Hành động này không thể hoàn tác.')) return;

        try {
            const res = await fetch(`/api/admin/posts/${postId}`, { method: 'DELETE' });
            if (res.ok) {
                alert('Đã xoá bài viết');
                router.push('/admin/posts');
            } else {
                const data = await res.json();
                alert('Lỗi: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            alert('Có lỗi xảy ra.');
        }
    };

    const generatePrompt = () => {
        if (!title.trim()) { alert('Vui lòng nhập tiêu đề trước'); return; }
        const prompt = `Bạn là một blogger chuyên nghiệp, viết bài bằng tiếng Việt.

Hãy viết một bài blog chi tiết với tiêu đề: "${title}"

${aiIdeas ? `Các ý tưởng/nội dung cần bao gồm:
${aiIdeas}` : ''}

YÊU CẦU QUAN TRỌNG VỀ ĐỌNH DẠNG:
- Xuất ra PLAIN TEXT Markdown — KHÔNG dùng HTML tags
- Dùng ## cho heading chính, ### cho heading phụ (KHÔNG dùng # vì tiêu đề đã có sẵn)
- Code block: dùng 3 dấu backtick, ngôn ngữ ngay sau dấu mở, đóng/mở trên dòng riêng
- In đậm: **text**, in nghiêng: *text*
- Danh sách: dùng dấu - hoặc 1. 2. 3.
- KHÔNG wrap toàn bộ bài trong code block

YÊU CẦU NỘI DUNG:
- Viết hoàn toàn bằng **tiếng Việt**, chuyên nghiệp và dễ hiểu
- Bài viết khoảng 800-1500 từ, có cấu trúc rõ ràng
- Bắt đầu bằng phần giới thiệu hấp dẫn, KHÔNG viết "Bài viết này..." hay mở đầu sáo rỗng
- Kết thúc bằng phần tổng kết/kết luận
- Thêm gợi ý về ảnh minh hoạ ở cuối mỗi phần chính, dạng: [Gợi ý ảnh: mô tả ngắn gọn]
- Nếu bài có code, đưa vào code block với ngôn ngữ phù hợp (vba, python, javascript, sql...)

LƯU Ý: Kết quả sẽ được paste trực tiếp vào Antigravity Editor (hỗ trợ Markdown). Hãy đảm bảo output là plain text markdown chuẩn, không có HTML.

Sau bài viết, thêm 3 dòng metadata (KHÔNG nằm trong code block):
EXCERPT: Viết 1-2 câu mô tả ngắn gọn, tối đa 160 ký tự
KEYWORDS: Từ khóa SEO 1, Từ khóa SEO 2, Từ khóa 3... (Phân cách bằng dấu phẩy)
COVER_IMAGE: Tạo một bức ảnh bìa blog có chất lượng cao, tỉ lệ 16:9, kích thước 1200x630px, với phong cách chuyên nghiệp và hiện đại, thể hiện chủ đề: "[Nhập ngắn gọn nội dung chính của bài]"`;
        setGeneratedPrompt(prompt);
        setPromptCopied(false);
    };
    const copyPrompt = () => {
        navigator.clipboard.writeText(generatedPrompt);
        setPromptCopied(true);
        setTimeout(() => setPromptCopied(false), 3000);
    };
    function pInline(text: string): any[] {
        const r: any[] = []; const rx = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g; let li = 0; let m;
        while ((m = rx.exec(text)) !== null) { if (m.index > li) r.push({ type: 'text', text: text.slice(li, m.index) }); if (m[2]) r.push({ type: 'text', marks: [{ type: 'bold' }], text: m[2] }); else if (m[3]) r.push({ type: 'text', marks: [{ type: 'italic' }], text: m[3] }); else if (m[4]) r.push({ type: 'text', marks: [{ type: 'code' }], text: m[4] }); li = rx.lastIndex; }
        if (li < text.length) r.push({ type: 'text', text: text.slice(li) }); return r.length > 0 ? r : [{ type: 'text', text }];
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <>
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/posts"
                        className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                        Chỉnh sửa bài viết
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAiWriteOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-600/25"
                    >
                        <Sparkles className="h-4 w-4" />
                        Tạo Prompt AI
                    </button>
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                        Xoá
                    </button>
                    <button
                        onClick={() => handleSave()}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Lưu
                    </button>
                    {status !== 'published' && (
                        <button
                            onClick={() => handleSave('published')}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25 disabled:opacity-50"
                        >
                            <Check className="h-4 w-4" />
                            Xuất bản
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Tiêu đề bài viết..."
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-xl font-bold text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                    />

                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Mô tả ngắn gọn bài viết..."
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm text-surface-700 dark:text-surface-300 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all resize-none"
                    />

                    <TiptapEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Nội dung bài viết..."
                    />

                    {/* Word count & Reading time */}
                    {content && (() => {
                        const extractText = (node: any): string => {
                            let t = '';
                            if (node.text) t += node.text + ' ';
                            if (node.content) node.content.forEach((n: any) => { t += extractText(n); });
                            return t;
                        };
                        const text = extractText(content);
                        const words = text.split(/\s+/).filter(Boolean).length;
                        const chars = text.replace(/\s/g, '').length;
                        const readingMin = Math.max(1, Math.ceil(words / 200));
                        return (
                            <div className="flex items-center gap-4 px-4 py-2.5 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-xs text-surface-500 dark:text-surface-400">
                                <span className="flex items-center gap-1.5">
                                    <FileText className="h-3.5 w-3.5" />
                                    {words.toLocaleString()} từ
                                </span>
                                <span>{chars.toLocaleString()} ký tự</span>
                                <span>≈ {readingMin} phút đọc</span>
                            </div>
                        );
                    })()}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-5">
                        <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-3">Trạng thái</h3>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                        >
                            <option value="draft">Nháp</option>
                            <option value="published">Xuất bản</option>
                        </select>
                    </div>

                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-5">
                        <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-3">Chủ đề</h3>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                        >
                            <option value="">Chọn chủ đề</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-5">
                        <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-3 flex items-center gap-2">
                            <Tag className="h-4 w-4 text-brand-500" /> Tags
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {selectedTagIds.map(tagId => {
                                const tag = allTags.find(t => t.id === tagId);
                                if (!tag) return null;
                                return (
                                    <span key={tagId} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-xs font-medium border border-brand-200 dark:border-brand-800">
                                        {tag.name}
                                        <button onClick={() => setSelectedTagIds(prev => prev.filter(id => id !== tagId))} className="hover:text-red-500">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                        <div className="relative">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 focus-within:ring-2 focus-within:ring-brand-500/30">
                                <Search className="h-3.5 w-3.5 text-surface-400 shrink-0" />
                                <input
                                    type="text"
                                    value={tagSearch}
                                    onChange={async (e) => {
                                        const val = e.target.value;
                                        if (val.includes(',')) {
                                            const newTagsText = val.split(',').map(t => t.trim()).filter(Boolean);
                                            if (newTagsText.length > 0) {
                                                setCreatingTag(true);
                                                try {
                                                    const newIds: string[] = [];
                                                    for (const text of newTagsText) {
                                                        const existing = allTags.find(t => t.name.toLowerCase() === text.toLowerCase());
                                                        if (existing) {
                                                            if (!selectedTagIds.includes(existing.id) && !newIds.includes(existing.id)) {
                                                                newIds.push(existing.id);
                                                            }
                                                        } else {
                                                            const res = await fetch('/api/admin/tags', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ name: text }),
                                                            });
                                                            const data = await res.json();
                                                            if (data.tag) {
                                                                setAllTags(prev => [...prev, data.tag]);
                                                                newIds.push(data.tag.id);
                                                            }
                                                        }
                                                    }
                                                    if (newIds.length > 0) {
                                                        setSelectedTagIds(prev => Array.from(new Set([...prev, ...newIds])));
                                                    }
                                                } catch (err) { console.error(err); }
                                                setCreatingTag(false);
                                            }
                                            setTagSearch('');
                                        } else {
                                            setTagSearch(val);
                                            setShowTagDropdown(true);
                                        }
                                    }}
                                    onFocus={() => setShowTagDropdown(true)}
                                    placeholder="Tìm, tạo hoặc dán tags (phân cách bằng ,)..."
                                    className="w-full bg-transparent text-sm focus:outline-none text-surface-900 dark:text-surface-100 placeholder:text-surface-400"
                                />
                            </div>
                            {showTagDropdown && (
                                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {allTags
                                        .filter(t => !selectedTagIds.includes(t.id) && t.name.toLowerCase().includes(tagSearch.toLowerCase()))
                                        .map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => {
                                                    setSelectedTagIds(prev => [...prev, t.id]);
                                                    setTagSearch('');
                                                    setShowTagDropdown(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-brand-50 dark:hover:bg-brand-900/20 text-surface-700 dark:text-surface-300 transition-colors"
                                            >
                                                {t.name}
                                            </button>
                                        ))}
                                    {tagSearch.trim() && !allTags.some(t => t.name.toLowerCase() === tagSearch.trim().toLowerCase()) && (
                                        <button
                                            onClick={async () => {
                                                if (creatingTag) return;
                                                setCreatingTag(true);
                                                try {
                                                    const res = await fetch('/api/admin/tags', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ name: tagSearch.trim() }),
                                                    });
                                                    const data = await res.json();
                                                    if (data.tag) {
                                                        setAllTags(prev => [...prev, data.tag]);
                                                        setSelectedTagIds(prev => [...prev, data.tag.id]);
                                                    }
                                                } catch (e) { console.error(e); }
                                                setCreatingTag(false);
                                                setTagSearch('');
                                                setShowTagDropdown(false);
                                            }}
                                            disabled={creatingTag}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-brand-50 dark:hover:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium transition-colors flex items-center gap-1.5"
                                        >
                                            {creatingTag ? <Loader2 className="h-3 w-3 animate-spin" /> : '+'} Tạo tag &quot;{tagSearch.trim()}&quot;
                                        </button>
                                    )}
                                    {!tagSearch.trim() && allTags.filter(t => !selectedTagIds.includes(t.id)).length === 0 && (
                                        <div className="px-3 py-2 text-xs text-surface-400">Không còn tag nào</div>
                                    )}
                                </div>
                            )}
                            {showTagDropdown && (
                                <div className="fixed inset-0 z-10" onClick={() => setShowTagDropdown(false)} />
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-surface-900 dark:text-surface-100">Ảnh bìa</h3>
                            <span className="text-[10px] text-surface-500 bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-full font-medium">1200x630px</span>
                        </div>
                        {coverImage ? (
                            <div className="relative">
                                <img src={coverImage} alt="Cover" className="w-full h-32 object-cover rounded-xl" />
                                <button
                                    onClick={() => setCoverImage('')}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="w-full h-32 rounded-xl border-2 border-dashed border-surface-300 dark:border-surface-600 hover:border-brand-400 dark:hover:border-brand-600 transition-colors flex flex-col items-center justify-center gap-2 text-surface-400 hover:text-brand-500 cursor-pointer">
                                    {uploadingCover ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <>
                                            <ImagePlus className="h-6 w-6" />
                                            <span className="text-xs">Nhấn để chọn ảnh</span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={uploadingCover} />
                                </label>
                            </div>
                        )}
                        {!coverImage && title.trim() && (
                            <div className="mt-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                                <p className="text-[11px] text-amber-700 dark:text-amber-400 mb-1.5">💡 Gợi ý tìm ảnh bìa:</p>
                                {loadingKeyword ? (
                                    <p className="text-[11px] text-amber-600/70 dark:text-amber-500/60 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Đang dịch từ khóa...</p>
                                ) : coverKeyword ? (
                                    <>
                                        <div className="flex flex-wrap gap-1.5">
                                            <a
                                                href={`https://gemini.google.com/app?q=${encodeURIComponent('Tạo một bức ảnh với chủ đề: ' + coverKeyword)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-surface-800 text-[11px] font-medium text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-brand-400 transition-colors"
                                            >
                                                ✨ Gemini AI
                                            </a>
                                            <a
                                                href={`https://www.bing.com/images/create?q=${encodeURIComponent(coverKeyword)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-surface-800 text-[11px] font-medium text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-brand-400 transition-colors"
                                            >
                                                ✨ Bing AI
                                            </a>
                                            <a
                                                href={`https://pixabay.com/images/search/${encodeURIComponent(coverKeyword)}/`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-surface-800 text-[11px] font-medium text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-brand-400 transition-colors"
                                            >
                                                🔍 Pixabay
                                            </a>
                                            <a
                                                href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(coverKeyword)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-surface-800 text-[11px] font-medium text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:border-brand-400 transition-colors"
                                            >
                                                🔍 Google Images
                                            </a>
                                        </div>
                                        <div className="mt-2 p-2 bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-md flex items-start gap-2 group">
                                            <p className="text-[11px] text-surface-600 dark:text-surface-400 font-mono flex-1 break-words select-all">
                                                Tạo một bức ảnh bìa blog có chất lượng cao, tỉ lệ 16:9, kích thước 1200x630px, với phong cách chuyên nghiệp và hiện đại, thể hiện chủ đề: &quot;{coverKeyword}&quot;
                                            </p>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigator.clipboard.writeText(`Tạo một bức ảnh bìa blog có chất lượng cao, tỉ lệ 16:9, kích thước 1200x630px, với phong cách chuyên nghiệp và hiện đại, thể hiện chủ đề: "${coverKeyword}"`);
                                                    const btn = e.currentTarget;
                                                    const originalHTML = btn.innerHTML;
                                                    btn.innerHTML = '✓';
                                                    btn.classList.add('text-green-500');
                                                    setTimeout(() => {
                                                        btn.innerHTML = originalHTML;
                                                        btn.classList.remove('text-green-500');
                                                    }, 2000);
                                                }}
                                                className="text-[10px] p-1 text-surface-400 hover:text-brand-500 bg-surface-100 dark:bg-surface-800 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                title="Copy prompt"
                                            >
                                                📋
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-amber-600/70 dark:text-amber-500/60 mt-1">Từ khóa gốc: &quot;{coverKeyword}&quot;</p>
                                    </>
                                ) : null}
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-amber-500" />
                                <h3 className="font-semibold text-surface-900 dark:text-surface-100">Premium</h3>
                            </div>
                            <button
                                onClick={() => setIsPremium(!isPremium)}
                                className={`relative w-11 h-6 rounded-full transition-colors ${isPremium ? 'bg-brand-600' : 'bg-surface-300 dark:bg-surface-600'}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isPremium ? 'translate-x-5' : ''}`} />
                            </button>
                        </div>
                        <p className="text-xs text-surface-500 mt-2">Yêu cầu đăng nhập để xem nội dung đầy đủ</p>
                    </div>

                    {/* SEO & Metadata */}
                    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Globe className="h-4 w-4 text-emerald-500" />
                            <h3 className="font-semibold text-surface-900 dark:text-surface-100">SEO & Metadata</h3>
                        </div>

                        {/* SEO Preview */}
                        <div className="mb-4 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                            <p className="text-xs text-surface-400 mb-1.5 font-medium">🔍 Preview trên Google</p>
                            <p className="text-sm text-blue-700 dark:text-blue-400 font-medium truncate">
                                {title || 'Tiêu đề bài viết'} | ERX Blog
                            </p>
                            <p className="text-xs text-emerald-700 dark:text-emerald-500 truncate">
                                erx.vn/blog/{displaySlug || 'duong-dan-bai-viet'}
                            </p>
                            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 line-clamp-2">
                                {metaDescription || excerpt || 'Mô tả bài viết sẽ hiển thị ở đây...'}
                            </p>
                        </div>

                        {/* Custom Slug */}
                        <div className="mb-3">
                            <label className="text-xs font-medium text-surface-600 dark:text-surface-400 mb-1 block">
                                Custom URL (slug)
                                <span className="text-surface-400 dark:text-surface-500 font-normal"> — tùy chọn</span>
                            </label>
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-surface-400 whitespace-nowrap">/blog/</span>
                                <input
                                    type="text"
                                    value={customSlug}
                                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-'))}
                                    placeholder={currentSlug || autoSlug || 'tu-dong-tu-tieu-de'}
                                    className="w-full px-2 py-1.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                                />
                            </div>
                            <p className="text-[10px] text-surface-400 mt-1">💡 Để trống = giữ slug hiện tại: {currentSlug}</p>
                        </div>

                        {/* Meta Description */}
                        <div className="mb-3">
                            <label className="text-xs font-medium text-surface-600 dark:text-surface-400 mb-1 block">
                                Meta Description
                                <span className="text-surface-400 dark:text-surface-500 font-normal"> — tùy chọn</span>
                            </label>
                            <textarea
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                placeholder="Để trống = dùng Mô tả ngắn ở trên"
                                rows={2}
                                maxLength={160}
                                className="w-full px-2 py-1.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
                            />
                            <p className="text-[10px] text-surface-400 mt-0.5">
                                💡 Tối ưu 150-160 ký tự · Hiện tại: {(metaDescription || excerpt).length}/160
                            </p>
                        </div>

                        {/* Keywords */}
                        <div>
                            <label className="text-xs font-medium text-surface-600 dark:text-surface-400 mb-1 block">
                                Từ khóa SEO
                                <span className="text-surface-400 dark:text-surface-500 font-normal"> — tùy chọn</span>
                            </label>
                            <input
                                type="text"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder="excel, power query, data analysis"
                                className="w-full px-2 py-1.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                            />
                            <p className="text-[10px] text-surface-400 mt-1">💡 Phân cách bằng dấu phẩy · Để trống = tự dùng tên chủ đề</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Prompt Generator Modal */}
            {aiWriteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-surface-900 rounded-3xl p-6 w-full max-w-2xl border border-surface-200 dark:border-surface-800 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-purple-500" />
                                Tạo Prompt viết bài bằng AI
                            </h2>
                            <button onClick={() => { setAiWriteOpen(false); setGeneratedPrompt(''); }} className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800">
                                <X className="w-5 h-5 text-surface-500" />
                            </button>
                        </div>
                        {!generatedPrompt ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">Tiêu đề</label>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề bài viết..." className="w-full px-4 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm" autoFocus />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">Ý tưởng / Ghi chú <span className="text-surface-400 font-normal"> — tùy chọn</span></label>
                                    <textarea value={aiIdeas} onChange={(e) => setAiIdeas(e.target.value)} rows={4} placeholder="Nhập các ý tưởng..." className="w-full px-4 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm resize-none" />
                                </div>
                                <button onClick={generatePrompt} disabled={!title.trim()} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all shadow-lg">
                                    <Sparkles className="w-5 h-5" /> Tạo Prompt
                                </button>
                                <p className="text-xs text-surface-400 text-center">💡 Không cần API Key — Copy prompt vào Gemini, ChatGPT, hoặc Antigravity để viết bài</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <textarea value={generatedPrompt} readOnly rows={14} className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm font-mono resize-none focus:outline-none" />
                                <div className="flex gap-3">
                                    <button onClick={copyPrompt} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
                                        {promptCopied ? <><ClipboardCheck className="w-5 h-5" /> Đã copy!</> : <><Copy className="w-5 h-5" /> Copy Prompt</>}
                                    </button>
                                    <button onClick={() => setGeneratedPrompt('')} className="px-4 py-3 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 font-medium hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">
                                        Sửa lại
                                    </button>
                                </div>
                                <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
                                    <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-2">🚀 Hướng dẫn</p>
                                    <ol className="text-xs text-surface-500 dark:text-surface-400 space-y-1 list-decimal list-inside">
                                        <li>Copy prompt ở trên</li>
                                        <li>Dán vào <strong>Gemini</strong>, <strong>ChatGPT</strong>, hoặc <strong>Antigravity Chat</strong></li>
                                        <li>Copy kết quả và dán trực tiếp vào Editor</li>
                                        <li>Dòng <code>EXCERPT:</code> → dán vào "Mô tả ngắn"</li>
                                        <li>Dòng <code>KEYWORDS:</code> → dán vào "Từ khóa SEO"</li>
                                        <li>Dòng <code>COVER_IMAGE:</code> → dùng mô tả để tạo ảnh bìa</li>
                                    </ol>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
