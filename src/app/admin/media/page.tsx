'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ImagePlus, Loader2, Trash2, Copy, Check, AlertCircle, Search, LayoutGrid, List } from 'lucide-react';

interface MediaFile {
    id: string;
    name: string;
    url: string;
    thumbnailUrl: string;
    createdTime: string;
    size: string;
}

interface Pagination {
    page: number;
    limit: number;
    totalFiles: number;
    totalPages: number;
    hasMore: boolean;
}

// Skeleton component for grid items
function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
            <div className="aspect-square bg-surface-100 dark:bg-surface-800 animate-pulse" />
            <div className="p-3 border-t border-surface-100 dark:border-surface-800">
                <div className="h-3 w-3/4 bg-surface-200 dark:bg-surface-700 rounded animate-pulse" />
                <div className="flex items-center justify-between mt-2">
                    <div className="h-2.5 w-10 bg-surface-100 dark:bg-surface-800 rounded animate-pulse" />
                    <div className="h-2.5 w-16 bg-surface-100 dark:bg-surface-800 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
}

// Image component with fade-in on load
function FadeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="relative w-full h-full">
            {!loaded && (
                <div className="absolute inset-0 bg-surface-100 dark:bg-surface-800 animate-pulse" />
            )}
            <img
                src={src}
                alt={alt}
                className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
}

export default function MediaPage() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMedia = useCallback(async (page = 1, append = false) => {
        try {
            if (page === 1) setLoading(true);
            else setLoadingMore(true);

            const res = await fetch(`/api/admin/media?page=${page}&limit=20`);
            const data = await res.json();

            if (data.files) {
                setFiles(prev => append ? [...prev, ...data.files] : data.files);
            }
            if (data.pagination) {
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    const loadMore = () => {
        if (pagination?.hasMore && !loadingMore) {
            fetchMedia(pagination.page + 1, true);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        setUploading(true);
        let successCount = 0;

        for (const file of Array.from(selectedFiles)) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (res.ok) {
                    successCount++;
                } else {
                    const data = await res.json();
                    alert(`Upload lỗi (${file.name}): ${data.error || 'Unknown'}`);
                }
            } catch {
                alert(`Upload lỗi: ${file.name}`);
            }
        }

        // Reset input & refresh list
        if (fileInputRef.current) fileInputRef.current.value = '';
        setUploading(false);

        if (successCount > 0) {
            fetchMedia(1, false);
        }
    };

    const handleDelete = async (fileId: string, fileName: string) => {
        if (!confirm(`Xoá ảnh "${fileName}"?`)) return;

        try {
            const res = await fetch(`/api/admin/media?id=${fileId}`, { method: 'DELETE' });
            if (res.ok) {
                setFiles(prev => prev.filter(f => f.id !== fileId));
            } else {
                alert('Xoá thất bại');
            }
        } catch {
            alert('Có lỗi xảy ra');
        }
    };

    const copyUrl = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatSize = (bytes: string) => {
        const num = parseInt(bytes);
        if (num < 1024) return `${num} B`;
        if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
        return `${(num / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Use optimized thumbnail URL (s200 for grid, s100 for list)
    const getOptimizedThumb = (file: MediaFile, size = 200) => {
        if (file.thumbnailUrl && file.thumbnailUrl.includes('googleusercontent.com')) {
            // Google Drive thumbnailLinks usually end with =s220 or similar
            return file.thumbnailUrl.replace(/=s\d+$/, `=s${size}`);
        }
        return file.thumbnailUrl || file.url;
    };

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Thư viện ảnh</h1>
                    {pagination && (
                        <p className="text-xs text-fg-subtle mt-1">{pagination.totalFiles} ảnh</p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-faint" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm ảnh..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 dark:text-white transition-all"
                        />
                    </div>

                    {/* View mode */}
                    <div className="flex items-center bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl p-1 hidden sm:flex">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-surface-100 dark:bg-surface-800 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'}`}
                            title="Grid view"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-surface-100 dark:bg-surface-800 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'}`}
                            title="List view"
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>

                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25 cursor-pointer disabled:opacity-50">
                        {uploading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Đang upload...</>
                        ) : (
                            <><ImagePlus className="h-4 w-4" /> Upload ảnh</>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            {/* Loading skeleton */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : files.length === 0 ? (
                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-12 text-center">
                    <AlertCircle className="h-12 w-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
                    <p className="text-surface-800 dark:text-surface-200 font-medium">Chưa có ảnh nào</p>
                    <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Upload ảnh đầu tiên hoặc thêm ảnh qua trình soạn thảo bài viết.</p>
                </div>
            ) : filteredFiles.length === 0 ? (
                <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-12 text-center">
                    <Search className="h-12 w-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
                    <p className="text-surface-800 dark:text-surface-200 font-medium">Không tìm thấy ảnh</p>
                    <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Thử lại với từ khoá khác xem sao.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredFiles.map((file) => (
                        <div key={file.id} className="group relative bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden hover:border-brand-500/50 transition-colors shadow-sm hover:shadow-md">
                            <div className="aspect-square relative flex items-center justify-center bg-surface-50 dark:bg-surface-950">
                                <FadeImage
                                    src={getOptimizedThumb(file, 200)}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Hover overlay */}
                                <div
                                    className="absolute inset-0 bg-surface-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm cursor-pointer"
                                    onClick={() => setPreviewFile(file)}
                                >
                                    <button
                                        onClick={(e) => { e.stopPropagation(); copyUrl(file.url, file.id); }}
                                        className="p-2.5 rounded-xl bg-card/10 hover:bg-white/20 text-white transition-colors"
                                        title="Copy URL"
                                    >
                                        {copiedId === file.id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(file.id, file.name); }}
                                        className="p-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                                        title="Xoá"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3 bg-white dark:bg-surface-900 border-t border-surface-100 dark:border-surface-800">
                                <p className="text-xs text-surface-700 dark:text-surface-300 font-medium truncate" title={file.name}>{file.name}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-[10px] text-fg-faint">{formatSize(file.size)}</p>
                                    <p className="text-[10px] text-fg-faint">{new Date(file.createdTime).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filteredFiles.map((file) => (
                        <div key={file.id} className="flex items-center gap-4 p-3 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 hover:border-brand-500/40 transition-colors shadow-sm hover:shadow-md group">
                            <div
                                className="h-16 w-16 rounded-xl overflow-hidden bg-surface-50 dark:bg-surface-950 shrink-0 border border-surface-100 dark:border-surface-800 cursor-pointer"
                                onClick={() => setPreviewFile(file)}
                            >
                                <FadeImage
                                    src={getOptimizedThumb(file, 100)}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-surface-900 dark:text-white truncate" title={file.name}>{file.name}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-surface-500 dark:text-surface-400">
                                    <span className="font-medium bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-md">{formatSize(file.size)}</span>
                                    <span>{new Date(file.createdTime).toLocaleString('vi-VN')}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => copyUrl(file.url, file.id)}
                                    className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/20 dark:hover:text-brand-400 text-surface-600 dark:text-surface-300 transition-colors"
                                    title="Copy URL"
                                >
                                    {copiedId === file.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </button>
                                <button
                                    onClick={() => handleDelete(file.id, file.name)}
                                    className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400 text-surface-600 dark:text-surface-300 transition-colors"
                                    title="Xoá"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Load More Button */}
            {pagination?.hasMore && !loading && !searchQuery && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm font-medium text-surface-700 dark:text-surface-300 hover:border-brand-500/50 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loadingMore ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Đang tải...</>
                        ) : (
                            <>Tải thêm ảnh ({pagination.totalFiles - files.length} còn lại)</>
                        )}
                    </button>
                </div>
            )}

            {/* Image Preview Modal */}
            {previewFile && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={() => setPreviewFile(null)}
                >
                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col bg-surface-900 rounded-2xl overflow-hidden shadow-2xl border border-surface-800"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-surface-800 bg-surface-950/50">
                            <h3 className="text-lg font-medium text-white truncate pr-4">{previewFile.name}</h3>
                            <button
                                onClick={() => setPreviewFile(null)}
                                className="p-2 bg-surface-800 hover:bg-surface-700 rounded-xl text-fg-faint hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                        {/* Image */}
                        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/50">
                            <img
                                src={previewFile.url}
                                alt={previewFile.name}
                                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-xl"
                            />
                        </div>
                        {/* Footer / Actions */}
                        <div className="flex items-center justify-between p-4 border-t border-surface-800 bg-surface-950/50">
                            <div className="text-sm text-fg-faint">
                                {formatSize(previewFile.size)} • {new Date(previewFile.createdTime).toLocaleString('vi-VN')}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => copyUrl(previewFile.url, previewFile.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-surface-800 hover:bg-surface-700 text-white rounded-xl transition-colors font-medium text-sm"
                                >
                                    {copiedId === previewFile.id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                                    Copy Link
                                </button>
                                <a
                                    href={previewFile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition-colors font-medium text-sm"
                                >
                                    Mở file gốc
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
