'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Loader2, Trash2, Copy, Check, AlertCircle, Search, FileSpreadsheet, Download, FolderOpen } from 'lucide-react';

interface DriveFile {
    id: string;
    name: string;
    downloadUrl: string;
    webViewLink: string;
    createdTime: string;
    size: string;
    mimeType: string;
    folder: string;
}

export default function FilesPage() {
    const [files, setFiles] = useState<DriveFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFolder, setSelectedFolder] = useState<string>('all');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadFiles();
    }, []);

    async function loadFiles() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/files');
            const data = await res.json();
            setFiles(data.files || []);
        } catch (err) {
            setError('Không thể tải danh sách files');
        } finally {
            setLoading(false);
        }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0) return;

        setUploading(true);
        setUploadProgress({ current: 0, total: fileList.length });
        setError(null);

        let successCount = 0;
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            setUploadProgress({ current: i + 1, total: fileList.length });

            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('/api/admin/files', { method: 'POST', body: formData });
                if (res.ok) successCount++;
                else {
                    const data = await res.json();
                    console.error(`Failed to upload ${file.name}:`, data.error);
                }
            } catch (err) {
                console.error(`Error uploading ${file.name}:`, err);
            }
        }

        setUploading(false);
        setUploadProgress(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (successCount > 0) await loadFiles();
    }

    async function handleDelete(fileId: string, fileName: string) {
        if (!confirm(`Xóa file "${fileName}"?`)) return;
        try {
            await fetch(`/api/admin/files?id=${fileId}`, { method: 'DELETE' });
            setFiles(prev => prev.filter(f => f.id !== fileId));
        } catch (err) {
            setError('Không thể xóa file');
        }
    }

    function copyUrl(url: string, id: string) {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    function formatSize(bytes: string) {
        const num = parseInt(bytes);
        if (num < 1024) return `${num} B`;
        if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
        return `${(num / (1024 * 1024)).toFixed(1)} MB`;
    }

    function getFileIcon(mimeType: string) {
        if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
        if (mimeType.includes('csv')) return '📋';
        if (mimeType.includes('zip')) return '📦';
        if (mimeType.includes('pdf')) return '📄';
        return '📎';
    }

    // Get unique folders for filter
    const folders = [...new Set(files.map(f => f.folder).filter(Boolean))].sort();

    // Filter files
    const filteredFiles = files.filter(f => {
        const matchesSearch = !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFolder = selectedFolder === 'all' || f.folder === selectedFolder || (selectedFolder === '' && !f.folder);
        return matchesSearch && matchesFolder;
    });

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: 0 }}>Quản lý Files</h1>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>{files.length} files</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleUpload}
                        multiple
                        accept=".xlsx,.xls,.csv,.zip,.pdf,.json"
                        style={{ display: 'none' }}
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 20px', backgroundColor: '#10b981', color: '#fff',
                            borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer',
                            fontWeight: '600', fontSize: '14px', opacity: uploading ? 0.5 : 1,
                        }}
                    >
                        {uploading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={16} />}
                        {uploading && uploadProgress ? `Uploading ${uploadProgress.current}/${uploadProgress.total}` : 'Upload files'}
                    </label>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm file..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%', padding: '10px 10px 10px 36px',
                            backgroundColor: '#1e293b', border: '1px solid #334155',
                            borderRadius: '8px', color: '#e2e8f0', fontSize: '14px',
                        }}
                    />
                </div>
                <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    style={{
                        padding: '10px 16px', backgroundColor: '#1e293b', border: '1px solid #334155',
                        borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', minWidth: '180px',
                    }}
                >
                    <option value="all">Tất cả thư mục</option>
                    <option value="">Root</option>
                    {folders.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px',
                    backgroundColor: '#451a24', border: '1px solid #f87171', borderRadius: '8px',
                    color: '#fca5a5', marginBottom: '16px', fontSize: '14px',
                }}>
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', color: '#64748b' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
                </div>
            ) : filteredFiles.length === 0 ? (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px',
                    backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b',
                }}>
                    <FileSpreadsheet size={48} style={{ color: '#475569', marginBottom: '16px' }} />
                    <p style={{ color: '#94a3b8', fontWeight: '500' }}>Chưa có file nào</p>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Upload file thực hành cho các bài viết</p>
                </div>
            ) : (
                /* File Table */
                <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #1e293b' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>File</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Thư mục</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Kích thước</th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFiles.map((file) => (
                                <tr key={file.id} style={{ borderBottom: '1px solid #1e293b' }}>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '20px' }}>{getFileIcon(file.mimeType)}</span>
                                            <div>
                                                <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}>{file.name}</div>
                                                <div style={{ color: '#64748b', fontSize: '12px' }}>
                                                    {file.createdTime ? new Date(file.createdTime).toLocaleDateString('vi-VN') : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {file.folder ? (
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                padding: '2px 10px', backgroundColor: '#1e293b',
                                                borderRadius: '12px', color: '#94a3b8', fontSize: '12px',
                                            }}>
                                                <FolderOpen size={12} /> {file.folder}
                                            </span>
                                        ) : (
                                            <span style={{ color: '#475569', fontSize: '12px' }}>—</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#94a3b8', fontSize: '13px' }}>
                                        {formatSize(file.size)}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                            <a
                                                href={file.downloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Tải xuống"
                                                style={{
                                                    padding: '6px', borderRadius: '6px', backgroundColor: '#1e293b',
                                                    color: '#10b981', border: 'none', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', textDecoration: 'none',
                                                }}
                                            >
                                                <Download size={14} />
                                            </a>
                                            <button
                                                onClick={() => copyUrl(file.downloadUrl, file.id)}
                                                title="Copy link tải"
                                                style={{
                                                    padding: '6px', borderRadius: '6px', backgroundColor: '#1e293b',
                                                    color: copiedId === file.id ? '#10b981' : '#94a3b8',
                                                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                }}
                                            >
                                                {copiedId === file.id ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(file.id, file.name)}
                                                title="Xóa"
                                                style={{
                                                    padding: '6px', borderRadius: '6px', backgroundColor: '#1e293b',
                                                    color: '#f87171', border: 'none', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center',
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                table tr:hover { background-color: rgba(30, 41, 59, 0.5); }
                input:focus, select:focus { outline: none; border-color: #3b82f6; }
            `}</style>
        </div>
    );
}
