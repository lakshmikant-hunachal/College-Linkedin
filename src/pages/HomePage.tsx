import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PenSquare,
  Sparkles,
  Bookmark,
  Compass,
  Building,
  TrendingUp,
  Award,
  Users,
  Search,
  CheckCircle,
  Briefcase,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Post, PostType } from '../types';
import { PostCard } from '../components/feed/PostCard';
import { CreatePostModal } from '../components/feed/CreatePostModal';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [progressSummary, setProgressSummary] = useState<any>(null);

  const fetchPosts = async (filter = activeFilter) => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter === 'SAVED') {
        params.savedOnly = 'true';
      } else if (filter !== 'ALL') {
        params.postType = filter;
      }

      const res = await api.get('/posts', { params });
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    if (!user) return;
    try {
      const res = await api.get('/roadmaps/progress/summary');
      if (res.data.success) {
        setProgressSummary(res.data.data);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchPosts(activeFilter);
    fetchProgress();
  }, [activeFilter, user]);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: User Profile Summary & Quick Stats */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            {/* College Crest Gradient Banner */}
            <div className="h-20 bg-gradient-to-r from-navy-900 via-brand-800 to-navy-900 relative">
              <div className="absolute right-3 top-3 text-[10px] font-bold uppercase tracking-wider text-white/80 bg-black/20 px-2 py-0.5 rounded backdrop-blur-xs">
                BMSCE Campus
              </div>
            </div>

            <div className="p-4 pt-0 text-center relative">
              {/* Profile Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-extrabold text-2xl flex items-center justify-center mx-auto -mt-8 border-4 border-white shadow-md">
                {user?.fullName?.charAt(0) || 'U'}
              </div>

              <h2 className="font-extrabold text-slate-900 text-base mt-2">{user?.fullName || 'BMSCE Student'}</h2>
              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                {user?.headline || `${user?.department || 'Engineering'} • Sem ${user?.currentSemester || 6}`}
              </p>

              {user?.role === 'SENIOR_ALUMNI' && (
                <span className="inline-block mt-2 text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  Senior Alumni
                </span>
              )}
              {user?.role === 'ADMINISTRATOR' && (
                <span className="inline-block mt-2 text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                  Placement Cell Administrator
                </span>
              )}

              {/* Roadmap Progress Quick Bar */}
              {user && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-left">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-brand-600" /> Roadmap Milestone
                    </span>
                    <span className="font-extrabold text-brand-700">
                      {progressSummary ? `${progressSummary.overallPercentage}%` : '56%'}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all"
                      style={{ width: `${progressSummary ? progressSummary.overallPercentage : 56}%` }}
                    />
                  </div>
                  <Link
                    to="/roadmaps"
                    className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold block mt-1.5 text-right hover:underline"
                  >
                    View 8 Semesters →
                  </Link>
                </div>
              )}

              {/* Quick Links */}
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-left text-xs">
                <Link
                  to="/network"
                  className="flex items-center justify-between p-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" /> My BMSCE Network
                  </span>
                  <span className="text-slate-400 text-xs font-bold">Explore</span>
                </Link>

                <button
                  onClick={() => setActiveFilter('SAVED')}
                  className={`w-full flex items-center justify-between p-2 rounded-lg font-medium transition-colors text-left ${
                    activeFilter === 'SAVED'
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-slate-400" /> Bookmarked Posts
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* College Quick Info */}
          <div className="bg-navy-900 text-slate-200 p-4 rounded-2xl shadow-sm text-xs space-y-2 border border-navy-800">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Award className="w-4 h-4 text-amber-400" />
              BMSCE Placement Cell
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Serving BMS College of Engineering. Access verified placement statistics, semester curriculum roadmaps, and senior experiences.
            </p>
            <div className="pt-2 text-[10px] text-brand-300 font-semibold">
              Basavanagudi, Bengaluru - 560019
            </div>
          </div>
        </aside>

        {/* Center Column: Post Creation & Feed */}
        <main className="lg:col-span-6 space-y-4">
          {/* Start a Post Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center shrink-0">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="flex-1 text-left px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200/70 text-slate-500 text-xs font-medium transition-colors border border-slate-200/60"
              >
                Share placement interview, internship review, or project...
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-emerald-50 text-emerald-800 font-semibold transition-colors"
              >
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Placement Exp</span>
              </button>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-indigo-50 text-indigo-800 font-semibold transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Project Demo</span>
              </button>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-purple-50 text-purple-800 font-semibold transition-colors"
              >
                <PenSquare className="w-4 h-4 text-purple-600" />
                <span>Career Advice</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: 'ALL', label: 'All Updates' },
              { id: 'PLACEMENT_EXPERIENCE', label: 'Placement Reviews' },
              { id: 'INTERNSHIP_EXPERIENCE', label: 'Internships' },
              { id: 'PROJECT_SHOWCASE', label: 'Projects' },
              { id: 'CODING_MILESTONE', label: 'Milestones' },
              { id: 'CAREER_ADVICE', label: 'Career Guidance' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                  activeFilter === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              Loading community updates...
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <p className="text-slate-500 text-xs italic">
                {activeFilter === 'SAVED'
                  ? 'You have not saved any posts yet. Click the Save icon on any post to bookmark it!'
                  : 'No posts found in this category yet. Be the first to share an update!'}
              </p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-lg hover:bg-brand-500 shadow-sm"
              >
                Create a Post
              </button>
            </div>
          ) : (
            posts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                onPostDeleted={handlePostDeleted}
              />
            ))
          )}
        </main>

        {/* Right Column: BMSCE Placement News & Recommended Peers */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Institutional Drive Bulletin */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-brand-600" />
                Placement Bulletin
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                2025-26
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors">
                <div className="font-bold text-slate-800 text-[11px] leading-snug">
                  Day-1 Assessment Scheduling Announced
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Pre-final & final year students must complete eligibility profiles before upcoming OA rounds.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors">
                <div className="font-bold text-slate-800 text-[11px] leading-snug">
                  Department Mock Technical Drives
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  CSE & ISE alumni conducting low-level design mock sessions on Saturdays.
                </p>
              </div>
            </div>

            <Link
              to="/placements"
              className="text-brand-600 hover:text-brand-700 font-bold text-[11px] flex items-center justify-between pt-1 hover:underline"
            >
              <span>Explore All Placement Records</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recommended Preparation Tracks */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 text-xs space-y-3">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Trending Placement Tracks
            </span>

            <div className="space-y-1.5">
              {[
                { title: 'Software Development Engineer', tag: 'Core Coding', count: '15 Topics', path: '/companies' },
                { title: 'Full-Stack Developer', tag: 'React & Node', count: '12 Topics', path: '/companies' },
                { title: 'Machine Learning & AI', tag: 'LLMs & PyTorch', count: '10 Topics', path: '/companies' },
                { title: 'Cloud & DevOps Engineer', tag: 'Kubernetes', count: '8 Topics', path: '/companies' },
              ].map((t, idx) => (
                <Link
                  key={idx}
                  to={t.path}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-xs text-slate-800">{t.title}</div>
                    <div className="text-[10px] text-slate-400">{t.tag}</div>
                  </div>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                    {t.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};
