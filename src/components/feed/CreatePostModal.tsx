import React, { useState } from 'react';
import { X, Send, AlertTriangle, Building, Briefcase, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Post, PostType } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: Post) => void;
}

export const CreatePostModal: React.FC<Props> = ({ isOpen, onClose, onPostCreated }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('GENERAL');
  const [companyName, setCompanyName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [recruitmentYear, setRecruitmentYear] = useState<number>(2025);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('Please enter both title and post content', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        title: title.trim(),
        content: content.trim(),
        postType,
      };

      if (postType === 'PLACEMENT_EXPERIENCE' || postType === 'INTERNSHIP_EXPERIENCE') {
        if (companyName) payload.companyName = companyName.trim();
        if (jobRole) payload.jobRole = jobRole.trim();
        if (recruitmentYear) payload.recruitmentYear = Number(recruitmentYear);
      }

      const res = await api.post('/posts', payload);
      if (res.data.success) {
        showToast('Post shared with BMSCE community!', 'success');
        onPostCreated(res.data.post);
        onClose();
        // Reset form
        setTitle('');
        setContent('');
        setPostType('GENERAL');
        setCompanyName('');
        setJobRole('');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to create post';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const isPlacementOrInternship = postType === 'PLACEMENT_EXPERIENCE' || postType === 'INTERNSHIP_EXPERIENCE';

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Share with BMSCE Community</h3>
              <p className="text-xs text-slate-500">
                Posting as <strong className="text-slate-700">{user?.fullName}</strong> ({user?.department})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { type: 'PLACEMENT_EXPERIENCE', label: 'Placement Experience' },
                { type: 'INTERNSHIP_EXPERIENCE', label: 'Internship Experience' },
                { type: 'PROJECT_SHOWCASE', label: 'Project Showcase' },
                { type: 'CODING_MILESTONE', label: 'Coding Milestone' },
                { type: 'ACADEMIC_NOTES', label: 'Academic Notes' },
                { type: 'CAREER_ADVICE', label: 'Career Advice' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setPostType(item.type as PostType)}
                  className={`text-xs px-2.5 py-2 rounded-lg font-medium border text-left transition-all ${
                    postType === item.type
                      ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Placement details banner notice */}
          {isPlacementOrInternship && (
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-3">
              <div className="flex items-start gap-2 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-tight">
                  <strong>Community Integrity Notice:</strong> Student placement posts are shared for junior guidance. By platform policy, peer posts are labelled as <em>Peer Shared (Unverified)</em> and are never mixed with official college placement statistics.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Building className="w-3 h-3 text-brand-600" /> Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BluePeak Systems"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-brand-600" /> Job Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SDE / Data Analyst"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-brand-600" /> Drive Year
                  </label>
                  <select
                    value={recruitmentYear}
                    onChange={(e) => setRecruitmentYear(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-brand-500 bg-white"
                  >
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Headline / Post Title</label>
            <input
              type="text"
              placeholder="e.g. Insights from my technical interview round at BluePeak Systems..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Content</label>
            <textarea
              rows={5}
              placeholder="Share round-by-round details, DSA topics asked, preparation tips, or project architecture..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none leading-relaxed"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Publishing...' : 'Publish Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
