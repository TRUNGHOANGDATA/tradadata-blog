'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Loader2, Trash2, Copy, Check, AlertCircle, Search, Film, Download, Play, ExternalLink } from 'lucide-react';

interface DriveVideo {
    id: string;
    name: string;
    url: string;
    thumbnailUrl: string;
    createdTime: string;
    size: string;
    mimeType: string;
}

export default function VideosPage() {
    const [videos, setVideos] = useState<DriveVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [previewVideo, setPreviewVideo] = useState<DriveVideo | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { loadVideos(); }, []);

    async function loadVideos() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/videos?limit=100');
            const data = await res.json();
            setVideos(data.files || []);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files?.length) return;

        setUploading(true);
        setError('');
        setSuccess('');
        let uploadedCount = 0;

        for (const file of Array.from(files)) {
            if (!file.type.startsWith('video/')) {
                setError(`${file.name} không phải video`);
                continue;
            }
            try {
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch('/api/admin/videos', { method: 'POST', body: formData });
                if (!res.ok) throw new Error(`Upload failed: ${file.name}`);
                uploadedCount++;
            } catch (err: any) {
                setError(err.message);
            }
        }

        if (uploadedCount > 0) {
            setSuccess(`Upload thành công ${uploadedCount} video!`);
            await loadVideos();
        }
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    async function handleDelete(videoId: string, videoName: string) {
        if (!confirm(`Xóa video "${videoName}"?`)) return;
        try {
            await fetch(`/api/admin/videos?id=${videoId}`, { method: 'DELETE' });
            setVideos(prev => prev.filter(v => v.id !== videoId));
            setSuccess('Đã xóa video');
        } catch (e: any) { setError(e.message); }
    }

    function copyUrl(url: string, id: string) {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    function formatSize(bytes: string) {
        const b = parseInt(bytes);
        if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
        if (b < 1024 * 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)} MB`;
        return `${(b / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }

    function formatDuration(name: string) {
        // Extract any duration from filename if present
        return '';
    }

    const filteredVideos = search
        ? videos.filter(v => v.name.toLowerCase().includes(search.toLowerCase()))
        : videos;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
                        Quản lý Video
                    </h1>
                    <p className="text-sm text-fg-subtle mt-1">
                        {filteredVideos.length} video
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-faint" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm video..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-[250px]"
                        />
                    </div>

                    <label className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl cursor-pointer hover:bg-primary-700 transition text-sm font-medium">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        Upload video
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={handleUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                    <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    {success}
                    <button onClick={() => setSuccess('')} className="ml-auto text-green-400 hover:text-green-600">✕</button>
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            ) : filteredVideos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-surface-50 dark:bg-surface-800/50 rounded-2xl">
                    <Film className="w-12 h-12 text-surface-300 dark:text-surface-600 mb-3" />
                    <h3 className="text-lg font-medium text-surface-600 dark:text-surface-400">
                        {search ? 'Không tìm thấy video' : 'Chưa có video nào'}
                    </h3>
                    <p className="text-sm text-surface-400 dark:text-surface-500 mt-1">
                        {search ? 'Thử từ khóa khác' : 'Upload video đầu tiên.'}
                    </p>
                </div>
            ) : (
                /* Video Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredVideos.map(video => (
                        <div
                            key={video.id}
                            className="group bg-surface-50 dark:bg-surface-800 rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 hover:border-primary-500/50 transition-all"
                        >
                            {/* Thumbnail / Preview */}
                            <div
                                className="relative aspect-video bg-surface-200 dark:bg-surface-700 cursor-pointer"
                                onClick={() => setPreviewVideo(video)}
                            >
                                {video.thumbnailUrl ? (
                                    <img
                                        src={video.thumbnailUrl}
                                        alt={video.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Film className="w-12 h-12 text-fg-faint" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Play className="w-12 h-12 text-white" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-3">
                                <h3 className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate" title={video.name}>
                                    {video.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-xs text-fg-faint">
                                    <span>{formatSize(video.size)}</span>
                                    <span>•</span>
                                    <span>{new Date(video.createdTime).toLocaleDateString('vi-VN')}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 mt-2">
                                    <button
                                        onClick={() => copyUrl(`https://drive.google.com/file/d/${video.id}/preview`, video.id)}
                                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-fg-subtle hover:bg-surface-200 dark:hover:bg-surface-700 transition"
                                        title="Copy embed URL"
                                    >
                                        {copiedId === video.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                        {copiedId === video.id ? 'Copied!' : 'Copy link'}
                                    </button>
                                    <a
                                        href={`https://drive.google.com/file/d/${video.id}/view`}
                                        target="_blank"
                                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-fg-subtle hover:bg-surface-200 dark:hover:bg-surface-700 transition"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Xem
                                    </a>
                                    <button
                                        onClick={() => handleDelete(video.id, video.name)}
                                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition ml-auto"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Video Preview Modal */}
            {previewVideo && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setPreviewVideo(null)}
                >
                    <div
                        className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <iframe
                            src={`https://drive.google.com/file/d/${previewVideo.id}/preview`}
                            className="w-full h-full"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                        <button
                            onClick={() => setPreviewVideo(null)}
                            className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
