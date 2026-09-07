'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { MessageCircle, Send, Reply, Trash2, LogIn, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface CommentUser {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string;
}

interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    parent_id: string | null;
    content: string;
    created_at: string;
    user?: CommentUser;
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'vừa xong';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} tháng trước`;
    return `${Math.floor(months / 12)} năm trước`;
}

function UserAvatar({ user }: { user?: CommentUser }) {
    const name = user?.full_name || user?.email || '?';
    const initials = name.charAt(0).toUpperCase();

    if (user?.avatar_url) {
        return (
            <img
                src={user.avatar_url}
                alt={name}
                className="w-9 h-9 rounded-full object-cover border-2 border-surface-200 dark:border-surface-700"
                referrerPolicy="no-referrer"
            />
        );
    }

    return (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-surface-200 dark:border-surface-700">
            {initials}
        </div>
    );
}

function CommentItem({
    comment,
    replies,
    currentUserId,
    isAdmin,
    onReply,
    onDelete,
}: {
    comment: Comment;
    replies: Comment[];
    currentUserId?: string;
    isAdmin: boolean;
    onReply: (parentId: string) => void;
    onDelete: (id: string) => void;
}) {
    const [showReplies, setShowReplies] = useState(true);
    const canDelete = currentUserId === comment.user_id || isAdmin;

    return (
        <div className="group">
            <div className="flex gap-3">
                <UserAvatar user={comment.user} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-surface-900 dark:text-surface-100">
                            {comment.user?.full_name || comment.user?.email?.split('@')[0] || 'Ẩn danh'}
                        </span>
                        <span className="text-xs text-fg-faint">
                            {timeAgo(comment.created_at)}
                        </span>
                    </div>
                    <p className="text-sm text-surface-700 dark:text-surface-300 mt-1 whitespace-pre-wrap break-words">
                        {comment.content}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                        <button
                            onClick={() => onReply(comment.id)}
                            className="inline-flex items-center gap-1 text-xs text-fg-faint hover:text-brand-500 transition-colors"
                        >
                            <Reply className="w-3.5 h-3.5" />
                            Trả lời
                        </button>
                        {canDelete && (
                            <button
                                onClick={() => onDelete(comment.id)}
                                className="inline-flex items-center gap-1 text-xs text-fg-faint hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Xoá
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Replies */}
            {replies.length > 0 && (
                <div className="ml-12 mt-3">
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 mb-2"
                    >
                        {showReplies ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {replies.length} phản hồi
                    </button>
                    {showReplies && (
                        <div className="space-y-4 border-l-2 border-surface-200 dark:border-surface-700 pl-4">
                            {replies.map((reply) => (
                                <div key={reply.id} className="group flex gap-3">
                                    <UserAvatar user={reply.user} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-sm text-surface-900 dark:text-surface-100">
                                                {reply.user?.full_name || reply.user?.email?.split('@')[0] || 'Ẩn danh'}
                                            </span>
                                            <span className="text-xs text-fg-faint">
                                                {timeAgo(reply.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-surface-700 dark:text-surface-300 mt-1 whitespace-pre-wrap break-words">
                                            {reply.content}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            {(currentUserId === reply.user_id || isAdmin) && (
                                                <button
                                                    onClick={() => onDelete(reply.id)}
                                                    className="inline-flex items-center gap-1 text-xs text-fg-faint hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Xoá
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export function CommentSection({ postId }: { postId: string }) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [content, setContent] = useState('');
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    const currentUserId = (session?.user as any)?.profileId;
    const isAdmin = (session?.user as any)?.role === 'admin';

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/comments?post_id=${postId}`);
            const data = await res.json();
            if (data.comments) {
                setComments(data.comments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || submitting) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId, content: content.trim() }),
            });

            if (res.ok) {
                setContent('');
                fetchComments();
            } else {
                const data = await res.json();
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (parentId: string) => {
        if (!replyContent.trim() || submitting) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    post_id: postId,
                    content: replyContent.trim(),
                    parent_id: parentId,
                }),
            });

            if (res.ok) {
                setReplyContent('');
                setReplyTo(null);
                fetchComments();
            } else {
                const data = await res.json();
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('Bạn có chắc muốn xoá bình luận này?')) return;

        try {
            const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchComments();
            } else {
                const data = await res.json();
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Có lỗi xảy ra.');
        }
    };

    // Separate root comments and replies
    const rootComments = comments.filter((c) => !c.parent_id);
    const repliesMap = new Map<string, Comment[]>();
    comments.forEach((c) => {
        if (c.parent_id) {
            const existing = repliesMap.get(c.parent_id) || [];
            existing.push(c);
            repliesMap.set(c.parent_id, existing);
        }
    });

    const totalCount = comments.length;

    return (
        <section className="mt-12 pt-8 border-t border-surface-200 dark:border-surface-800">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400">
                    <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                    Bình luận {totalCount > 0 && <span className="text-base font-normal text-fg-faint">({totalCount})</span>}
                </h3>
            </div>

            {/* Comment Form */}
            {session?.user ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex gap-3">
                        <UserAvatar user={{
                            id: currentUserId || '',
                            full_name: session.user.name || null,
                            avatar_url: session.user.image || null,
                            email: session.user.email || '',
                        }} />
                        <div className="flex-1">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Viết bình luận..."
                                rows={3}
                                maxLength={2000}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm text-surface-800 dark:text-surface-200 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all resize-none"
                            />
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-fg-faint">{content.length}/2000</span>
                                <button
                                    type="submit"
                                    disabled={!content.trim() || submitting}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Gửi
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-8 p-6 rounded-2xl bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-center">
                    <MessageCircle className="w-8 h-8 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-3">
                        Đăng nhập để tham gia bình luận
                    </p>
                    <Link
                        href={`/login?callbackUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/')}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm"
                    >
                        <LogIn className="w-4 h-4" />
                        Đăng nhập
                    </Link>
                </div>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
                </div>
            ) : rootComments.length === 0 ? (
                <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-surface-200 dark:text-surface-700 mx-auto mb-3" />
                    <p className="text-sm text-fg-faint">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {rootComments.map((comment) => (
                        <div key={comment.id}>
                            <CommentItem
                                comment={comment}
                                replies={repliesMap.get(comment.id) || []}
                                currentUserId={currentUserId}
                                isAdmin={isAdmin}
                                onReply={(id) => {
                                    setReplyTo(replyTo === id ? null : id);
                                    setReplyContent('');
                                }}
                                onDelete={handleDelete}
                            />

                            {/* Reply Form */}
                            {replyTo === comment.id && session?.user && (
                                <div className="ml-12 mt-3 flex gap-3">
                                    <UserAvatar user={{
                                        id: currentUserId || '',
                                        full_name: session.user.name || null,
                                        avatar_url: session.user.image || null,
                                        email: session.user.email || '',
                                    }} />
                                    <div className="flex-1">
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Viết phản hồi..."
                                            rows={2}
                                            maxLength={2000}
                                            autoFocus
                                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-sm text-surface-800 dark:text-surface-200 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all resize-none"
                                        />
                                        <div className="flex items-center gap-2 mt-2 justify-end">
                                            <button
                                                onClick={() => { setReplyTo(null); setReplyContent(''); }}
                                                className="px-3 py-1.5 rounded-lg text-xs text-fg-subtle hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                            >
                                                Huỷ
                                            </button>
                                            <button
                                                onClick={() => handleReply(comment.id)}
                                                disabled={!replyContent.trim() || submitting}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
                                            >
                                                {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                                Gửi
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
