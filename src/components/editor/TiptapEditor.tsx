'use client';

import 'highlight.js/styles/vs2015.css';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useEditor, EditorContent, ReactNodeViewRenderer, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExt from '@tiptap/extension-image';
import LinkExt from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { common, createLowlight } from 'lowlight';
import r from 'highlight.js/lib/languages/r';
import powershell from 'highlight.js/lib/languages/powershell';
import csharp from 'highlight.js/lib/languages/csharp';
import yaml from 'highlight.js/lib/languages/yaml';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import kotlin from 'highlight.js/lib/languages/kotlin';
import swift from 'highlight.js/lib/languages/swift';
import vbnet from 'highlight.js/lib/languages/vbnet';
import { registerCustomLanguages } from '@/lib/highlight-languages';
import {
    Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Minus, Undo, Redo, Link as LinkIcon,
    ImagePlus, Youtube as YoutubeIcon, Code2, Pilcrow,
    AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, UnderlineIcon,
    Table as TableIcon, ListChecks, Palette, Type, Info, Sparkles, Loader2, FileCode2,
    Download
} from 'lucide-react';
import CodeBlockComponent from './CodeBlockComponent';

const lowlight = createLowlight(common);
// Register extra built-in languages
lowlight.register('r', r);
lowlight.register('powershell', powershell);
lowlight.register('csharp', csharp);
lowlight.register('yaml', yaml);
lowlight.register('dockerfile', dockerfile);
lowlight.register('go', go);
lowlight.register('rust', rust);
lowlight.register('kotlin', kotlin);
lowlight.register('swift', swift);
lowlight.register('vb', vbnet);
// Register custom domain-specific languages
registerCustomLanguages(lowlight);

// ============================================
// Toolbar Sub-components
// ============================================
function ToolbarButton({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded-lg transition-all duration-150 ${isActive
                ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 shadow-sm'
                : 'text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-surface-100'
                } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <div className="w-px h-6 bg-surface-200 dark:bg-surface-700 mx-1" />;
}

// Color picker popup
function ColorPicker({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const colors = [
        { name: 'Đỏ', value: '#ef4444' },
        { name: 'Cam', value: '#f97316' },
        { name: 'Vàng', value: '#eab308' },
        { name: 'Xanh lá', value: '#22c55e' },
        { name: 'Xanh dương', value: '#3b82f6' },
        { name: 'Tím', value: '#8b5cf6' },
        { name: 'Hồng', value: '#ec4899' },
        { name: 'Máº·c Ä‘á»‹nh', value: '' },
    ];

    return (
        <div className="relative">
            <ToolbarButton
                onClick={() => setOpen(!open)}
                title="Màu chữ"
                isActive={open}
            >
                <Palette className="h-4 w-4" />
            </ToolbarButton>
            {open && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-xl z-50 flex gap-1.5 flex-wrap w-[140px]">
                    {colors.map(c => (
                        <button
                            key={c.value || 'default'}
                            title={c.name}
                            onClick={() => {
                                if (c.value) {
                                    editor.chain().focus().setColor(c.value).run();
                                } else {
                                    editor.chain().focus().unsetColor().run();
                                }
                                setOpen(false);
                            }}
                            className="w-7 h-7 rounded-lg border-2 border-surface-200 dark:border-surface-600 hover:scale-110 transition-transform"
                            style={{ backgroundColor: c.value || '#94a3b8' }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Font size dropdown
function FontSizeDropdown({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false);
    const sizes = [
        { label: 'Nhỏ', value: '14px' },
        { label: 'Bình thường', value: '' },
        { label: 'Lớn', value: '20px' },
        { label: 'Rất lớn', value: '24px' },
    ];

    return (
        <div className="relative">
            <ToolbarButton
                onClick={() => setOpen(!open)}
                title="Cỡ chữ"
                isActive={open}
            >
                <Type className="h-4 w-4" />
            </ToolbarButton>
            {open && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-xl z-50 overflow-hidden min-w-[140px]">
                    {sizes.map(s => (
                        <button
                            key={s.label}
                            onClick={() => {
                                if (s.value) {
                                    editor.chain().focus().setMark('textStyle', { fontSize: s.value }).run();
                                } else {
                                    editor.chain().focus().unsetMark('textStyle').run();
                                }
                                setOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                            style={{ fontSize: s.value || undefined }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================
// Toolbar Component
// ============================================
function EditorToolbar({ editor, onToggleHtml, isHtmlMode }: { editor: Editor; onToggleHtml: () => void; isHtmlMode: boolean }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [aiImageOpen, setAiImageOpen] = useState(false);
    const [aiImageDesc, setAiImageDesc] = useState('');
    const [aiImageLoading, setAiImageLoading] = useState(false);
    const [fileDownloadOpen, setFileDownloadOpen] = useState(false);
    const [fdUrl, setFdUrl] = useState('');
    const [fdFilename, setFdFilename] = useState('');
    const [fdLabel, setFdLabel] = useState('');

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Nhập URL:', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Insert placeholder
        editor.chain().focus().setImage({ src: '/loading.gif', alt: 'Uploading...' }).run();
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok && data.url) {
                // Find and replace the placeholder image
                const { state } = editor.view;
                let placeholderPos: number | null = null;
                state.doc.descendants((node, pos) => {
                    if (node.type.name === 'image' && node.attrs.alt === 'Uploading...') {
                        placeholderPos = pos;
                        return false;
                    }
                });
                if (placeholderPos !== null) {
                    const tr = state.tr.setNodeMarkup(placeholderPos, undefined, {
                        src: data.url,
                        alt: file.name,
                    });
                    editor.view.dispatch(tr);
                } else {
                    editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
                }
            } else {
                alert(`Upload failed: ${data.error || 'Unknown error'}`);
                editor.commands.undo();
            }
        } catch {
            alert('Upload failed. Please try again.');
            editor.commands.undo();
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [editor]);

    const addYoutube = useCallback(() => {
        const url = window.prompt('Nhập YouTube URL:');
        if (!url) return;
        editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
    }, [editor]);

    const insertTable = useCallback(() => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }, [editor]);

    const insertCallout = useCallback(() => {
        editor.chain().focus().insertContent({
            type: 'blockquote',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        { type: 'text', marks: [{ type: 'bold' }], text: '💡 Tip: ' },
                        { type: 'text', text: 'Nhập nội dung callout ở đây...' },
                    ],
                },
            ],
        }).run();
    }, [editor]);

    const generateAiImage = useCallback(async () => {
        if (!aiImageDesc.trim()) return;
        const prompt = `Hãy tạo một hình ảnh minh hoạ chất lượng cao cho bài blog với mô tả sau:\n\n"${aiImageDesc.trim()}"\n\nYêu cầu:\n- Phong cách chuyên nghiệp, hiện đại\n- Màu sắc hài hoà, bắt mắt\n- Phù hợp để làm ảnh minh hoạ bài viết blog\n- Không có text/chữ trong ảnh\n- Tỷ lệ 16:9`;
        try {
            await navigator.clipboard.writeText(prompt);
            alert('✅ Đã copy prompt tạo ảnh! Paste vào Gemini Photo để tạo ảnh.');
            setAiImageDesc('');
            setAiImageOpen(false);
        } catch {
            // Fallback: select prompt text
            const textarea = document.createElement('textarea');
            textarea.value = prompt;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('✅ Đã copy prompt tạo ảnh! Paste vào Gemini Photo để tạo ảnh.');
            setAiImageDesc('');
            setAiImageOpen(false);
        }
    }, [aiImageDesc]);

    const insertFileDownload = useCallback(() => {
        if (!fdUrl.trim() || !fdFilename.trim()) return;
        // Insert an HTML block that will be hydrated on the blog page
        editor.chain().focus().insertContent({
            type: 'paragraph',
            content: [
                {
                    type: 'text',
                    text: `[FILE_DOWNLOAD url="${fdUrl.trim()}" filename="${fdFilename.trim()}"${fdLabel.trim() ? ` label="${fdLabel.trim()}"` : ''}]`,
                },
            ],
        }).run();
        setFdUrl('');
        setFdFilename('');
        setFdLabel('');
        setFileDownloadOpen(false);
    }, [editor, fdUrl, fdFilename, fdLabel]);

    return (
        <div className="sticky top-0 z-10 flex items-center gap-0.5 px-3 py-2 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 flex-wrap rounded-t-[calc(1rem-1px)]">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

            {/* Text formatting */}
            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold (Ctrl+B)">
                <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic (Ctrl+I)">
                <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Gạch chân (Ctrl+U)">
                <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Gạch ngang">
                <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Inline Code">
                <Code className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Tô sáng">
                <Highlighter className="h-4 w-4" />
            </ToolbarButton>
            <ColorPicker editor={editor} />
            <FontSizeDropdown editor={editor} />

            <ToolbarDivider />

            {/* Headings */}
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
                <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
                <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
                <Heading3 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive('paragraph')} title="Paragraph">
                <Pilcrow className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Alignment */}
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Căn trái">
                <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Căn giữa">
                <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Căn phải">
                <AlignRight className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Căn đều">
                <AlignJustify className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Lists & Blocks */}
            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Danh sách">
                <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Danh sách số">
                <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Task List (Checkbox)">
                <ListChecks className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Trích dẫn">
                <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={insertCallout} title="Trích dẫn">
                <Info className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
                <Code2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Đường kẻ ngang">
                <Minus className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Table */}
            <ToolbarButton onClick={insertTable} title="Chèn bảng">
                <TableIcon className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Insert */}
            <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Chèn Link">
                <LinkIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={addImage} title="Upload Ảnh">
                <ImagePlus className="h-4 w-4" />
            </ToolbarButton>
            <div className="relative">
                <ToolbarButton onClick={() => setAiImageOpen(!aiImageOpen)} title="Tạo Prompt Ảnh">
                    <Sparkles className="h-4 w-4" />
                </ToolbarButton>
                {aiImageOpen && (
                    <div className="absolute top-full right-0 mt-1 w-80 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-xl z-50 p-4">
                        <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">✨ Mô tả ảnh bạn muốn tạo <span className="text-xs text-surface-400 font-normal">(Esc để đóng)</span></p>
                        <input
                            type="text"
                            value={aiImageDesc}
                            onChange={(e) => setAiImageDesc(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') generateAiImage(); if (e.key === 'Escape') setAiImageOpen(false); }}
                            placeholder="VD: biểu đồ doanh số, phong cảnh mùa thu..."
                            className="w-full px-3 py-2 text-sm rounded-lg bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 mb-2"
                            autoFocus
                        />
                        <button
                            onClick={generateAiImage}
                            disabled={!aiImageDesc.trim()}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
                        >
                            <Sparkles className="w-4 h-4" /> Copy Prompt
                        </button>
                        <p className="text-xs text-fg-faint mt-2 text-center">Paste vào Gemini Photo để tạo ảnh</p>
                    </div>
                )}
            </div>
            <ToolbarButton onClick={addYoutube} title="YouTube Video">
                <YoutubeIcon className="h-4 w-4" />
            </ToolbarButton>
            <div className="relative">
                <ToolbarButton onClick={() => setFileDownloadOpen(!fileDownloadOpen)} title="Chèn File Download">
                    <Download className="h-4 w-4" />
                </ToolbarButton>
                {fileDownloadOpen && (
                    <div className="absolute top-full right-0 mt-1 w-80 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-xl z-50 p-4">
                        <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">📎 Chèn File Download <span className="text-xs text-surface-400 font-normal">(Esc để đóng)</span></p>
                        <input
                            type="text"
                            value={fdUrl}
                            onChange={(e) => setFdUrl(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Escape') setFileDownloadOpen(false); }}
                            placeholder="Google Drive share link..."
                            className="w-full px-3 py-2 text-sm rounded-lg bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 mb-2"
                            autoFocus
                        />
                        <input
                            type="text"
                            value={fdFilename}
                            onChange={(e) => setFdFilename(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') insertFileDownload(); if (e.key === 'Escape') setFileDownloadOpen(false); }}
                            placeholder="Tên file (VD: bao-cao-doanh-so.xlsx)"
                            className="w-full px-3 py-2 text-sm rounded-lg bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 mb-2"
                        />
                        <input
                            type="text"
                            value={fdLabel}
                            onChange={(e) => setFdLabel(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') insertFileDownload(); if (e.key === 'Escape') setFileDownloadOpen(false); }}
                            placeholder="Mô tả (tuỳ chọn)"
                            className="w-full px-3 py-2 text-sm rounded-lg bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 mb-2"
                        />
                        <button
                            onClick={insertFileDownload}
                            disabled={!fdUrl.trim() || !fdFilename.trim()}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            <Download className="w-4 h-4" /> Chèn
                        </button>
                    </div>
                )}
            </div>

            <ToolbarDivider />

            {/* HTML Source */}
            <ToolbarButton onClick={onToggleHtml} isActive={isHtmlMode} title="Chế độ HTML">
                <FileCode2 className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* History */}
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Hoàn tác (Ctrl+Z)">
                <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Làm lại (Ctrl+Y)">
                <Redo className="h-4 w-4" />
            </ToolbarButton>
        </div>
    );
}

// ============================================
// Custom CodeBlock Extension with NodeView
// ============================================
const CustomCodeBlock = CodeBlockLowlight.extend({
    addNodeView() {
        return ReactNodeViewRenderer(CodeBlockComponent);
    },
});

// Custom TextStyle with fontSize
const CustomTextStyle = TextStyle.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            fontSize: {
                default: null,
                parseHTML: (element: HTMLElement) => element.style.fontSize || null,
                renderHTML: (attributes: Record<string, any>) => {
                    if (!attributes.fontSize) return {};
                    return { style: `font-size: ${attributes.fontSize}` };
                },
            },
        };
    },
});

// ============================================
// Main TiptapEditor Component
// ============================================
interface TiptapEditorProps {
    content?: Record<string, unknown> | null;
    onChange?: (json: Record<string, unknown>) => void;
    placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder = 'Bắt đầu viết bài...' }: TiptapEditorProps) {
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [htmlSource, setHtmlSource] = useState('');
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            ImageExt.configure({
                HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto' },
            }),
            LinkExt.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-brand-600 dark:text-brand-400 underline hover:no-underline' },
            }),
            Placeholder.configure({ placeholder }),
            CustomCodeBlock.configure({
                lowlight,
                defaultLanguage: 'javascript',
            }),
            Youtube.configure({
                HTMLAttributes: { class: 'rounded-xl overflow-hidden mx-auto' },
                width: 640,
                height: 360,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
            }),
            Highlight.configure({
                multicolor: false,
            }),
            Underline,
            CustomTextStyle,
            Color,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableCell,
            TableHeader,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        content: content || undefined,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getJSON() as Record<string, unknown>);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert prose-brand max-w-none min-h-[400px] p-6 focus:outline-none',
            },
            handlePaste: (view, event) => {
                const text = event.clipboardData?.getData('text/plain') || '';

                // Check if plain text looks like markdown (code blocks, headings, lists, tables)
                const hasCodeBlock = /^```/m.test(text);
                const hasHeading = /^#{1,6}\s/m.test(text);
                const hasList = /^[-*+]\s+/m.test(text);
                const hasTable = /^\|.+\|/m.test(text);
                const hasOrderedList = /^\d+\.\s+/m.test(text);
                if (!hasCodeBlock && !hasHeading && !hasTable && !hasOrderedList && !(hasList && /\*\*/m.test(text))) return false;

                // Convert markdown to HTML
                const markdownToHtml = (md: string): string => {
                    // Normalize all line endings to \n
                    const lines = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
                    const htmlParts: string[] = [];
                    let i = 0;

                    while (i < lines.length) {
                        const trimmed = lines[i].trimEnd();

                        // Fenced code block: ``` or ```language
                        const codeMatch = trimmed.match(/^`{3,}(\w*)\s*$/);
                        if (codeMatch) {
                            const lang = codeMatch[1] || 'plaintext';
                            const codeLines: string[] = [];
                            i++;
                            while (i < lines.length && !lines[i].trimEnd().match(/^`{3,}\s*$/)) {
                                codeLines.push(lines[i].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
                                i++;
                            }
                            if (i < lines.length) i++; // skip closing ```
                            htmlParts.push(`<pre><code class="language-${lang}">${codeLines.join('\n')}</code></pre>`);
                            continue;
                        }

                        // Headings
                        const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)/);
                        if (headingMatch) {
                            const level = headingMatch[1].length;
                            const headingText = inlineFormat(headingMatch[2]);
                            htmlParts.push(`<h${level}>${headingText}</h${level}>`);
                            i++;
                            continue;
                        }

                        // Horizontal rule
                        if (trimmed.match(/^(-{3,}|\*{3,}|_{3,})\s*$/)) {
                            htmlParts.push('<hr>');
                            i++;
                            continue;
                        }

                        // Unordered list
                        if (trimmed.match(/^[-*+]\s+/)) {
                            const items: string[] = [];
                            while (i < lines.length && lines[i].trimEnd().match(/^[-*+]\s+/)) {
                                items.push(`<li><p>${inlineFormat(lines[i].trimEnd().replace(/^[-*+]\s+/, ''))}</p></li>`);
                                i++;
                            }
                            htmlParts.push(`<ul>${items.join('')}</ul>`);
                            continue;
                        }

                        // Ordered list
                        if (trimmed.match(/^\d+\.\s+/)) {
                            const items: string[] = [];
                            while (i < lines.length && lines[i].trimEnd().match(/^\d+\.\s+/)) {
                                items.push(`<li><p>${inlineFormat(lines[i].trimEnd().replace(/^\d+\.\s+/, ''))}</p></li>`);
                                i++;
                            }
                            htmlParts.push(`<ol>${items.join('')}</ol>`);
                            continue;
                        }

                        // Table (basic markdown table)
                        if (trimmed.includes('|') && i + 1 < lines.length && lines[i + 1]?.trimEnd().match(/^\|[\s\-:|]+\|/)) {
                            const headerCells = trimmed.split('|').filter(c => c.trim()).map(c => `<th>${inlineFormat(c.trim())}</th>`);
                            i += 2; // skip header and separator
                            const rows: string[] = [];
                            while (i < lines.length && lines[i].includes('|')) {
                                const cells = lines[i].split('|').filter(c => c.trim()).map(c => `<td>${inlineFormat(c.trim())}</td>`);
                                rows.push(`<tr>${cells.join('')}</tr>`);
                                i++;
                            }
                            htmlParts.push(`<table><thead><tr>${headerCells.join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>`);
                            continue;
                        }

                        // Empty line
                        if (!trimmed) { i++; continue; }

                        // Normal paragraph
                        htmlParts.push(`<p>${inlineFormat(trimmed)}</p>`);
                        i++;
                    }
                    return htmlParts.join('');
                };

                // Inline formatting: bold, italic, inline code, links
                const inlineFormat = (txt: string): string => {
                    return txt
                        .replace(/`([^`]+)`/g, '<code>$1</code>')
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.+?)\*/g, '<em>$1</em>')
                        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
                };

                const convertedHtml = markdownToHtml(text);

                // Insert the converted HTML into the editor
                event.preventDefault();

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = convertedHtml;

                // Use ProseMirror's DOMParser to parse the HTML into a document slice
                const { DOMParser: PMDOMParser } = require('@tiptap/pm/model');
                const slice = PMDOMParser.fromSchema(view.state.schema).parseSlice(tempDiv);
                const newTr = view.state.tr.replaceSelection(slice);
                view.dispatch(newTr);

                return true;
            },
        },
    });

    // Sync content prop into editor when it arrives after mount (only once)
    const hasSetInitialContent = useRef(false);
    useEffect(() => {
        if (editor && content && !editor.isDestroyed && !hasSetInitialContent.current) {
            // Always set content when editor becomes available with content
            // This handles the case where useEditor creates the editor asynchronously
            // and may not use the content option properly
            setTimeout(() => {
                if (editor && !editor.isDestroyed && !hasSetInitialContent.current) {
                    editor.commands.setContent(content);
                    hasSetInitialContent.current = true;
                }
            }, 50);
        }
    }, [editor, content]);

    const handleToggleHtml = useCallback(() => {
        if (!editor) return;
        if (!isHtmlMode) {
            // Switching TO HTML mode — get current HTML from editor
            setHtmlSource(editor.getHTML());
            setIsHtmlMode(true);
        } else {
            // Switching FROM HTML mode — parse HTML back into editor
            editor.commands.setContent(htmlSource, { emitUpdate: true });
            onChange?.(editor.getJSON() as Record<string, unknown>);
            setIsHtmlMode(false);
        }
    }, [isHtmlMode, editor, htmlSource, onChange]);

    const handleHtmlChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setHtmlSource(e.target.value);
    }, []);

    if (!editor) {
        return (
            <div className="bg-card rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                <div className="p-6 min-h-[400px] flex items-center justify-center">
                    <div className="animate-pulse text-fg-faint">Đang tải editor...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-2xl border border-surface-200 dark:border-surface-700 relative flex flex-col">
            <EditorToolbar editor={editor} onToggleHtml={handleToggleHtml} isHtmlMode={isHtmlMode} />
            {isHtmlMode ? (
                <div className="relative">
                    <div className="flex items-center justify-between px-4 py-2 bg-surface-100 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
                        <span className="text-xs font-mono text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                            <FileCode2 className="w-3.5 h-3.5" />
                            Chế độ HTML — Chỉnh sửa mã nguồn trực tiếp
                        </span>
                        <button
                            onClick={handleToggleHtml}
                            className="text-xs px-3 py-1 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                        >
                            Áp dụng & Quay lại
                        </button>
                    </div>
                    <textarea
                        value={htmlSource}
                        onChange={handleHtmlChange}
                        className="w-full min-h-[400px] p-4 font-mono text-sm bg-surface-950 dark:bg-surface-950 text-green-400 focus:outline-none resize-y leading-relaxed"
                        spellCheck={false}
                        placeholder="Dán HTML vào đây..."
                    />
                </div>
            ) : (
                <EditorContent editor={editor} />
            )}
        </div>
    );
}

// Utility stub
export function generateHTML(json: Record<string, unknown>): string {
    return '';
}
