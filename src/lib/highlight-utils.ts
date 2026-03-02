import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { common, createLowlight } from 'lowlight';
import r_lang from 'highlight.js/lib/languages/r';
import powershell from 'highlight.js/lib/languages/powershell';
import csharp from 'highlight.js/lib/languages/csharp';
import yaml_lang from 'highlight.js/lib/languages/yaml';
import vbnet from 'highlight.js/lib/languages/vbnet';
import { registerCustomLanguages, LANGUAGE_DISPLAY_NAMES } from '@/lib/highlight-languages';
import { generateHTML } from '@tiptap/html';

// ==============================
// Lowlight setup
// ==============================
const lowlight = createLowlight(common);
lowlight.register('r', r_lang);
lowlight.register('powershell', powershell);
lowlight.register('csharp', csharp);
lowlight.register('yaml', yaml_lang);
lowlight.register('vb', vbnet);
registerCustomLanguages(lowlight);

// ==============================
// Tiptap Extensions
// ==============================
const tiptapExtensions = [
    StarterKit.configure({ codeBlock: false }),
    ImageExtension.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto', loading: 'lazy', decoding: 'async' } }),
    LinkExtension.configure({ openOnClick: false, HTMLAttributes: { class: 'text-brand-600 dark:text-brand-400 underline hover:no-underline' } }),
    CodeBlockLowlight.configure({ lowlight }),
    Youtube.configure({ HTMLAttributes: { class: 'rounded-xl overflow-hidden mx-auto' }, width: 640, height: 360 }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Highlight.configure({ multicolor: false }),
    Underline,
    TextStyle,
    Table.configure({ resizable: false }),
    TableRow,
    TableCell,
    TableHeader,
    TaskList,
    TaskItem.configure({ nested: true }),
];

// ==============================
// Helper functions
// ==============================

/** Convert lowlight HAST nodes to HTML string */
function hastToHtml(nodes: any[]): string {
    return nodes.map((node: any) => {
        if (node.type === 'text') return node.value;
        if (node.type === 'element') {
            const cls = node.properties?.className?.join(' ');
            const tag = node.tagName || 'span';
            const inner = node.children ? hastToHtml(node.children) : '';
            return cls ? `<${tag} class="${cls}">${inner}</${tag}>` : `<${tag}>${inner}</${tag}>`;
        }
        return '';
    }).join('');
}

/** Decode HTML entities back to plain text for lowlight processing */
function decodeHtmlEntities(html: string): string {
    return html
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/');
}

/** Transform <pre><code> (and raw <pre>) into beautiful code blocks with macOS header + copy button */
function transformCodeBlocks(html: string): string {
    const result: string[] = [];
    let remaining = html;

    while (remaining.length > 0) {
        const preStart = remaining.indexOf('<pre');
        if (preStart === -1) {
            result.push(remaining);
            break;
        }

        result.push(remaining.substring(0, preStart));

        const preEnd = remaining.indexOf('</pre>', preStart);
        if (preEnd === -1) {
            result.push(remaining.substring(preStart));
            break;
        }

        const fullPreBlock = remaining.substring(preStart, preEnd + 6);
        remaining = remaining.substring(preEnd + 6);

        let language = 'code';
        const langMatch = fullPreBlock.match(/class="language-(\w+)"/);
        if (langMatch) {
            language = langMatch[1];
        }

        let codeContent = '';
        const codeTagMatch = fullPreBlock.match(/<code[^>]*>([\s\S]*?)<\/code>/);
        if (codeTagMatch) {
            codeContent = codeTagMatch[1];
        } else {
            const preTagEnd = fullPreBlock.indexOf('>');
            codeContent = fullPreBlock.substring(preTagEnd + 1, fullPreBlock.length - 6);
        }

        let highlightedCode = codeContent;
        try {
            const plainText = decodeHtmlEntities(codeContent.replace(/<[^>]*>/g, ''));
            const langAlias = language === 'vba' ? 'vb' : language;

            let highlighted;
            if (language !== 'code' && lowlight.registered(langAlias)) {
                highlighted = lowlight.highlight(langAlias, plainText);
            } else {
                highlighted = lowlight.highlightAuto(plainText);
            }

            if (highlighted?.children) {
                highlightedCode = hastToHtml(highlighted.children);
            }
        } catch (e) {
            console.error('Lowlight highlighting failed:', e);
        }

        const displayLang = LANGUAGE_DISPLAY_NAMES[language] || language.charAt(0).toUpperCase() + language.slice(1);

        result.push(
            `<div class="code-block-wrapper">` +
            `<div class="code-header">` +
            `<div class="dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span><span class="lang-label">${displayLang}</span></div>` +
            `<button data-copy-btn title="Copy code"><span class="copy-icon">📋 Copy</span><span class="check-icon hidden">✅ Copied!</span></button>` +
            `</div>` +
            `<pre><code class="language-${language}">${highlightedCode}</code></pre>` +
            `</div>`
        );
    }

    return result.join('');
}

// ==============================
// Vietnamese text slugify
// ==============================
function slugify(text: string): string {
    return text.toString().toLowerCase()
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
        .replace(/[èéẹẻẽêềếệểễ]/g, "e")
        .replace(/[ìíịỉĩ]/g, "i")
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
        .replace(/[ùúụủũưừứựửữ]/g, "u")
        .replace(/[ỳýỵỷỹ]/g, "y")
        .replace(/đ/g, "d")
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function getText(node: any): string {
    if (node.type === 'text') return node.text || '';
    if (node.content) return node.content.map(getText).join('');
    return '';
}

// ==============================
// Main export: render TipTap JSON → HTML + TOC
// ==============================
export interface RenderResult {
    html: string;
    toc: { id: string; text: string; level: number }[];
}

export function renderPostContent(content: any): RenderResult {
    try {
        const jsonContent = typeof content === 'string' ? JSON.parse(content) : content;
        const toc: { id: string; text: string; level: number }[] = [];

        // Extract TOC from JSON
        if (jsonContent?.content) {
            jsonContent.content.forEach((node: any) => {
                if (node.type === 'heading' && node.attrs?.level) {
                    const text = getText(node);
                    if (text.trim()) {
                        const id = slugify(text) || `heading-${toc.length}`;
                        toc.push({ id, text, level: node.attrs.level });
                    }
                }
            });
        }

        let rawHtml = transformCodeBlocks(generateHTML(jsonContent, tiptapExtensions));

        // Wrap <table> in responsive scroll wrapper
        rawHtml = rawHtml.replace(/<table([\s\S]*?)<\/table>/g, (match) => {
            return `<div class="table-wrapper">${match}</div>`;
        });

        // Inject IDs to HTML tags for TOC linking
        let tocIndex = 0;
        const html = rawHtml.replace(/<h([1-6])(.*?)>(.*?)<\/h\1>/g, (match, level, attrs, innerHtml) => {
            if (tocIndex < toc.length) {
                const id = toc[tocIndex].id;
                tocIndex++;
                const cleanAttrs = attrs.replace(/id="[^"]*"/g, '');
                return `<h${level}${cleanAttrs} id="${id}" class="scroll-mt-24 group relative">${innerHtml} <a href="#${id}" class="opacity-0 group-hover:opacity-100 absolute -left-6 top-1/2 -translate-y-1/2 text-surface-300 hover:text-brand-500 transition-opacity" aria-hidden="true">#</a></h${level}>`;
            }
            return match;
        });

        return { html, toc };
    } catch (e) {
        console.error('Error parsing post content:', e);
        return { html: '<p>Error loading content.</p>', toc: [] };
    }
}
