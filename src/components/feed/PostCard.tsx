import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Share2,
  AlertCircle,
  Building,
  Briefcase,
  Calendar,
  Trash2,
  Flag,
  CheckCircle,
} from 'lucide-react';
import { Post } from '../../types';
import { CommentSection } from './CommentSection';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface Props {
  post: Post;
  onPostDeleted?: (postId: string) => void;
}

export const PostCard: React.FC<Props> = ({ post, onPostDeleted }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [liked, setLiked] = useState(post.isLikedByMe);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [saved, setSaved] = useState(post.isSavedByMe);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Misleading or inaccurate placement announcement');

  const handleLike = async () => {
    if (!user) {
      showToast('Please sign in to like posts', 'error');
      return;
    }

    try {
      const res = await api.post(`/posts/${post.id}/likes`);
      if (res.data.success) {
        setLiked(res.data.liked);
        setLikesCount(res.data.likesCount);
      }
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const handleSave = async () => {
    if (!user) {
      showToast('Please sign in to bookmark posts', 'error');
      return;
    }

    try {
      const res = await api.post(`/posts/${post.id}/save`);
      if (res.data.success) {
        setSaved(res.data.saved);
        showToast(res.data.message, 'success');
      }
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await api.delete(`/posts/${post.id}`);
      if (res.data.success) {
        showToast('Post deleted', 'info');
        if (onPostDeleted) onPostDeleted(post.id);
      }
    } catch {
      showToast('Failed to delete post', 'error');
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`/posts/${post.id}/report`, { reason: reportReason });
      if (res.data.success) {
        showToast(res.data.message, 'success');
        setReportModalOpen(false);
      }
    } catch {
      showToast('Failed to submit report', 'error');
    }
  };

  const getPostTypeLabel = () => {
    switch (post.postType) {
      case 'PLACEMENT_EXPERIENCE':
        return { text: 'Placement Experience', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'INTERNSHIP_EXPERIENCE':
        return { text: 'Internship Experience', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'PROJECT_SHOWCASE':
        return { text: 'Project Showcase', color: 'bg-sky-50 text-sky-800 border-sky-200' };
      case 'CODING_MILESTONE':
        return { text: 'Coding Milestone', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'ACADEMIC_NOTES':
        return { text: 'Academic Notes', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'CAREER_ADVICE':
        return { text: 'Career Advice', color: 'bg-teal-50 text-teal-800 border-teal-200' };
      default:
        return { text: 'Discussion', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const postTypeInfo = getPostTypeLabel();
  const canDelete = user && (user.id === post.author.id || user.role === 'ADMINISTRATOR');

  return (
    <article className="bg-white rounded-xl shadow-sm border border-slate-200/90 overflow-hidden hover:border-slate-300 transition-all">
      <div className="p-4 sm:p-5">
        {/* Author Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-700 to-brand-500 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
              {post.author.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-slate-900 hover:text-brand-600 transition-colors">
                  {post.author.fullName}
                </span>
                {post.author.role === 'SENIOR_ALUMNI' && (
                  <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full border border-indigo-200">
                    BMSCE Senior / Alum
                  </span>
                )}
                {post.author.role === 'ADMINISTRATOR' && (
                  <span className="text-[10px] font-semibold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-full border border-rose-200">
                    Placement Cell Admin
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{post.author.headline}</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>
                  {post.author.department ? `${post.author.department} Dept` : 'BMSCE'}
                  {post.author.graduationYear ? ` • Batch ${post.author.graduationYear}` : ''}
                </span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${postTypeInfo.color}`}>
              {postTypeInfo.text}
            </span>
            {canDelete && (
              <button
                onClick={handleDelete}
                title="Delete Post"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Placement Experience Metadata Bar */}
        {(post.companyName || post.jobRole || post.recruitmentYear) && (
          <div className="mb-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-wrap items-center gap-3 text-xs">
            {post.companyName && (
              <div className="flex items-center gap-1 font-semibold text-slate-800">
                <Building className="w-3.5 h-3.5 text-brand-600" />
                <span>{post.companyName}</span>
              </div>
            )}
            {post.jobRole && (
              <div className="flex items-center gap-1 text-slate-600">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.jobRole}</span>
              </div>
            )}
            {post.recruitmentYear && (
              <div className="flex items-center gap-1 text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.recruitmentYear} Drive</span>
              </div>
            )}
            {/* Prompt Requirement: Never automatically label as officially verified */}
            <div className="ml-auto flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              {post.isVerifiedPlacementPost ? (
                <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> Officially Verified Post
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  <AlertCircle className="w-3 h-3 text-slate-400" /> Peer Shared (Unverified)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Post Title & Content */}
        <h3 className="font-bold text-slate-900 text-base mb-2 leading-snug">{post.title}</h3>
        <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">{post.content}</p>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                liked ? 'text-brand-600 bg-brand-50' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-brand-600 text-brand-600' : ''}`} />
              <span>{likesCount > 0 ? likesCount : 'Like'}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span>{commentsCount > 0 ? `${commentsCount} Comments` : 'Comment'}</span>
            </button>

            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                saved ? 'text-brand-600 bg-brand-50' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-brand-600 text-brand-600' : ''}`} />
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          <button
            onClick={() => setReportModalOpen(true)}
            title="Report inappropriate or misleading content"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Report</span>
          </button>
        </div>

        {/* Comment Section Drawer */}
        {showComments && (
          <CommentSection
            postId={post.id}
            onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
          />
        )}
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-scale-up">
            <h4 className="font-bold text-slate-900 text-base mb-2">Report Content</h4>
            <p className="text-xs text-slate-500 mb-4">
              Help maintain community academic and placement integrity. Reports are reviewed by BMSCE moderators.
            </p>
            <form onSubmit={handleReport} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Misleading or inaccurate placement announcement">Misleading or inaccurate placement announcement</option>
                  <option value="Impersonation or false student identity">Impersonation or false student identity</option>
                  <option value="Inappropriate language or harassment">Inappropriate language or harassment</option>
                  <option value="Spam or promotional advertising">Spam or promotional advertising</option>
                  <option value="Copyright or unauthorized material">Copyright or unauthorized material</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </article>
  );
};
