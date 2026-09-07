"use client";

import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ShareButtonsProps {
    title: string;
    url?: string;
    orientation?: "horizontal" | "vertical";
}

export function ShareButtons({ title, url, orientation = "horizontal" }: ShareButtonsProps) {
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        if (url) {
            setCurrentUrl(url);
        } else if (typeof window !== "undefined") {
            setCurrentUrl(window.location.href);
        }
    }, [url]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: title,
                    url: currentUrl,
                });
            } catch (error) {
                console.error("Error sharing", error);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(currentUrl);
            alert("Đã copy đường dẫn bài viết!");
        }
    };

    const handleFacebookShare = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, "_blank");
    };

    const handleLinkedInShare = () => {
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`, "_blank");
    };

    const containerClass = orientation === "vertical"
        ? "flex flex-col gap-3"
        : "flex flex-row items-center gap-4";

    const buttonClass = orientation === "vertical"
        ? "h-10 w-10"
        : "h-8 w-8";

    return (
        <div className={containerClass}>
            {orientation === "horizontal" && (
                <span className="text-sm font-semibold text-fg uppercase tracking-wider hidden sm:block">Chia sẻ:</span>
            )}

            <button
                onClick={handleFacebookShare}
                className={`${buttonClass} rounded-full bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20 flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] shadow-sm transition-all shadow-md group`}
                title="Chia sẻ lên Facebook"
            >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
            </button>
            <button
                onClick={handleLinkedInShare}
                className={`${buttonClass} rounded-full bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] shadow-sm transition-all shadow-md group`}
                title="Chia sẻ lên LinkedIn"
            >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path></svg>
            </button>
            <button
                onClick={handleShare}
                className={`${buttonClass} ${orientation === "horizontal" ? "ml-auto" : ""} rounded-full bg-card border border-line flex items-center justify-center text-surface-600 dark:text-surface-400 hover:text-brand-600 hover:border-brand-200 dark:hover:text-brand-400 dark:hover:border-brand-800 shadow-sm transition-all shadow-md group`}
                title="Copy đường dẫn"
            >
                <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </button>
        </div>
    );
}
