import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { CODE_LANGUAGES, LANGUAGE_DISPLAY_NAMES } from '@/lib/highlight-languages';

export default function CodeBlockComponent({ node, updateAttributes, extension }: any) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(node.textContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const langKey = node.attrs.language || 'code';
    const displayName = LANGUAGE_DISPLAY_NAMES[langKey] || langKey;

    return (
        <NodeViewWrapper className="code-block relative my-6 rounded-xl overflow-hidden bg-[#1e1e1e] font-mono shadow-lg border border-surface-200/10 dark:border-white/10">
            {/* Window-like header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] text-surface-400 text-xs select-none">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="font-medium bg-[#1e1e1e] px-2 py-0.5 rounded text-surface-300">
                        {displayName}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Copy button (always visible in header) */}
                    <button
                        onClick={handleCopy}
                        contentEditable={false}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1e1e1e] text-surface-400 hover:bg-surface-700 hover:text-white transition-all text-xs"
                        title="Copy code"
                    >
                        {copied ? (
                            <><Check className="w-3.5 h-3.5 text-green-400" /> <span className="text-green-400">Copied!</span></>
                        ) : (
                            <><Copy className="w-3.5 h-3.5" /> Copy</>
                        )}
                    </button>

                    {/* Language selector */}
                    <select
                        value={node.attrs.language || ''}
                        onChange={(event) => updateAttributes({ language: event.target.value })}
                        className="bg-[#1e1e1e] border border-surface-400/20 rounded text-surface-400 text-xs px-2 py-0.5 focus:ring-0 cursor-pointer hover:text-surface-200 transition-colors focus:outline-none"
                        contentEditable={false}
                    >
                        {CODE_LANGUAGES.map(({ value, label }) => (
                            <option key={value || '_auto'} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="relative p-4 pt-2">
                <pre className="m-0 overflow-x-auto text-sm leading-relaxed text-[#d4d4d4] scrollbar-thin scrollbar-thumb-surface-700 scrollbar-track-transparent">
                    {/* @ts-expect-error Tiptap type definitions for as prop might not include code */}
                    <NodeViewContent as="code" className={`language-${node.attrs.language || 'plaintext'}`} />
                </pre>
            </div>
        </NodeViewWrapper>
    );
}

