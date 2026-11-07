import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, Clock, BookOpen, ChevronRight, Award, Flame, Filter } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SemesterRoadmap } from '../types';
import { TopicItem } from '../components/roadmaps/TopicItem';

export const RoadmapsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState<number>(user?.currentSemester || 5);
  const [semesterData, setSemesterData] = useState<SemesterRoadmap | null>(null);
  const [progressSummary, setProgressSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const fetchSemesterData = async (sem: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/roadmaps/semester/${sem}`);
      if (res.data.success) {
        setSemesterData(res.data.data);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchOverallProgress = async () => {
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
    fetchSemesterData(selectedSemester);
    fetchOverallProgress();
  }, [selectedSemester, user]);

  const handleProgressChanged = () => {
    fetchSemesterData(selectedSemester);
    fetchOverallProgress();
  };

  // Group topics by category
  const filteredTopics = semesterData?.topics.filter((t) => {
    if (activeCategory === 'ALL') return true;
    return t.category === activeCategory;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-brand-900 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" /> BMSCE Semester-Wise Curriculum & Placement Blueprint
          </div>
          <h1 className="font-black text-2xl md:text-3xl tracking-tight leading-tight">
            Academic, Programming & Career Roadmaps
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-2 leading-relaxed">
            Follow structured milestones from Semester 1 through Semester 8. Complete coursework topics, master DSA patterns, build standout software projects, and track placement readiness in real time.
          </p>
        </div>

        {/* Overall Progress Widget */}
        {user && progressSummary && (
          <div className="mt-6 md:mt-0 md:absolute md:right-8 md:top-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-full md:w-64 text-center">
            <div className="text-xs uppercase tracking-wider text-slate-300 font-bold mb-1">
              Your BMSCE Progress
            </div>
            <div className="text-3xl font-black text-emerald-400">
              {progressSummary.overallPercentage}%
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              {progressSummary.completedTopics} of {progressSummary.totalTopics} curriculum topics completed
            </p>
            <div className="w-full h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressSummary.overallPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 8 Semester Selection Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">
            Select Semester (1 to 8)
          </h2>
          <span className="text-xs text-slate-500">Click any card to explore curriculum</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
            const isSelected = selectedSemester === sem;
            const isCurrentStudentSem = user?.currentSemester === sem;

            return (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-700 shadow-md scale-102 ring-2 ring-brand-400/50'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-brand-300 hover:shadow-xs'
                }`}
              >
                {isCurrentStudentSem && (
                  <span
                    className={`absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-brand-600 text-white'
                    }`}
                  >
                    Current
                  </span>
                )}
                <div className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-brand-200' : 'text-slate-400'}`}>
                  Year {Math.ceil(sem / 2)}
                </div>
                <div className="font-black text-base mt-0.5">Sem {sem}</div>
                <div className={`text-[10px] mt-1 line-clamp-1 font-medium ${isSelected ? 'text-brand-100' : 'text-slate-500'}`}>
                  {sem === 1
                    ? 'Foundations'
                    : sem === 2
                    ? 'OOP & Web'
                    : sem === 3
                    ? 'Core DSA'
                    : sem === 4
                    ? 'DBMS & Trees'
                    : sem === 5
                    ? 'OS & FullStack'
                    : sem === 6
                    ? 'System Design'
                    : sem === 7
                    ? 'Placements'
                    : 'Capstone'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Semester Roadmap View */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          Loading Semester {selectedSemester} roadmap topics...
        </div>
      ) : !semesterData ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          No roadmap records found for this semester.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Semester Focus Goal Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                Semester {semesterData.semesterNumber} Focus Milestone
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{semesterData.title}</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">{semesterData.description}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0 text-center min-w-[140px]">
              <span className="text-[10px] uppercase font-bold text-slate-400">Completion</span>
              <div className="text-xl font-black text-brand-700">
                {semesterData.progressSummary.progressPercentage}%
              </div>
              <div className="text-[10px] text-slate-500">
                {semesterData.progressSummary.completedTopics} / {semesterData.progressSummary.totalTopics} Completed
              </div>
            </div>
          </div>

          {/* Topic Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'All Subjects & Modules' },
              { id: 'ACADEMIC', label: 'Academic Coursework' },
              { id: 'PROGRAMMING', label: 'Programming & DSA' },
              { id: 'DEVELOPMENT', label: 'Development & Projects' },
              { id: 'CAREER_PREP', label: 'Placement & Career Prep' },
              { id: 'ADVANCED', label: 'Advanced Topics' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveCategory(f.id)}
                className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                  activeCategory === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Topics List */}
          <div className="space-y-3">
            {filteredTopics.map((topic) => (
              <TopicItem
                key={topic.id}
                topic={topic}
                onProgressChanged={handleProgressChanged}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
