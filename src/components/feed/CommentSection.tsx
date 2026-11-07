import React, { useState, useEffect } from 'react';
import { Send, User as UserIcon } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Comment } from '../../types';

interface Props {
  postId: string;
  onCommentAdded?: () => void;
}

export const CommentSection: React.FC<Props> = ({ postId, onCommentAdded }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/posts/${postId}/comments`);
      if (res.data.success) {
        setComments(res.data.data);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    if (!user) {
      showToast('Please sign in to comment', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/posts/${postId}/comments`, { content: content.trim() });
      if (res.data.success) {
        setComments((prev) => [...prev, res.data.comment]);
        setContent('');
        if (onCommentAdded) onCommentAdded();
        showToast('Comment posted', 'success');
      }
    } catch {
      showToast('Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
      {/* Input box */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <div className="w-7 h-7 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
          {user?.fullName?.charAt(0) || <UserIcon className="w-3.5 h-3.5" />}
        </div>
        <input
          type="text"
          placeholder="Write a constructive peer comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
        >
          <Send className="w-3 h-3" />
          <span>Post</span>
        </button>
      </form>

      {/* List of comments */}
      {loading ? (
        <div className="text-xs text-slate-400 py-2 text-center">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-xs text-slate-400 italic py-1">No comments yet. Be the first to share feedback!</div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2.5 items-start text-xs bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                {c.author.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{c.author.fullName}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {c.author.headline && <div className="text-[10px] text-slate-500 mb-1">{c.author.headline}</div>}
                <p className="text-slate-700 text-xs leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
