'use client';

import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { SessionProvider } from 'next-auth/react';
import { InlineDownloadBlock } from './InlineDownloadBlock';

interface Props {
    htmlContent: string;
    className?: string;
}

// Parse [FILE_DOWNLOAD url="..." filename="..." label="..."] shortcodes
const FILE_DOWNLOAD_REGEX = /\[FILE_DOWNLOAD\s+url="([^"]+)"\s+filename="([^"]+)"(?:\s+label="([^"]*)")?\]/g;

export function ArticleContent({ htmlContent, className }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rootsRef = useRef<ReturnType<typeof createRoot>[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        // Find all text nodes containing [FILE_DOWNLOAD ...] and replace them
        const walker = document.createTreeWalker(
            containerRef.current,
            NodeFilter.SHOW_TEXT,
            null
        );

        const nodesToReplace: { node: Text; matches: RegExpMatchArray[] }[] = [];

        let textNode: Text | null;
        while ((textNode = walker.nextNode() as Text | null)) {
            const text = textNode.textContent || '';
            const matches = [...text.matchAll(new RegExp(FILE_DOWNLOAD_REGEX.source, 'g'))];
            if (matches.length > 0) {
                nodesToReplace.push({ node: textNode, matches });
            }
        }

        for (const { node, matches } of nodesToReplace) {
            const parent = node.parentNode;
            if (!parent) continue;

            const text = node.textContent || '';
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;

            for (const match of matches) {
                const matchIndex = match.index!;
                const [fullMatch, url, filename, label] = match;

                // Add text before the match
                if (matchIndex > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, matchIndex)));
                }

                // Create mount point for React component
                const mountPoint = document.createElement('div');
                mountPoint.setAttribute('data-inline-download', 'true');
                fragment.appendChild(mountPoint);

                // Mount React component
                const root = createRoot(mountPoint);
                root.render(
                    <SessionProvider>
                        <InlineDownloadBlock
                            driveUrl={url}
                            filename={filename}
                            label={label || undefined}
                        />
                    </SessionProvider>
                );
                rootsRef.current.push(root);

                lastIndex = matchIndex + fullMatch.length;
            }

            // Add remaining text after last match
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            }

            parent.replaceChild(fragment, node);
        }

        // Cleanup
        return () => {
            rootsRef.current.forEach((root) => {
                try { root.unmount(); } catch { }
            });
            rootsRef.current = [];
        };
    }, [htmlContent]);

    return (
        <div
            ref={containerRef}
            className={className}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}
